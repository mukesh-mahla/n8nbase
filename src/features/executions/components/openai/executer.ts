import type { NodeExecuter } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import { generateText } from "ai";
import Handlebars from "handlebars";
import { openai } from '@ai-sdk/openai';
import { createOpenAI } from '@ai-sdk/openai';
import {OpenAiChannel  } from "@/inngest/channels/openai";
import prisma from "@/lib/db";
import { decrypt } from "@/lib/encryption";


Handlebars.registerHelper("json", (context) => {
  const jsonstringfy = JSON.stringify(context, null, 2);
  const safeString = new Handlebars.SafeString(jsonstringfy);
  return safeString;
});

type OpenAiData = {
  variableName: string;
  credentialId:string
  model?: string;
  systemPrompt?: string;
  userPrompt?: string;
};




export const OpenaAiExecuter: NodeExecuter<OpenAiData> = async ({
  data,
  userId,
  context,
  step,
  nodeId,
  publish,
}) => {

  await publish(OpenAiChannel().status({ nodeId, status: "loading" }));

  if (!data.variableName) {
    await publish(OpenAiChannel().status({ nodeId, status: "error" }));
    throw new NonRetriableError("OPENAI Node variable name not configured ");
  }
  if(!data.credentialId){
    await publish(OpenAiChannel().status({ nodeId, status: "error" }));
    throw new NonRetriableError("OPENAI Node Credential not configured ");
  }

    if (!data.userPrompt) {
    await publish(OpenAiChannel().status({ nodeId, status: "error" }));
    throw new NonRetriableError("OPENAI Node userPrompt not configured ");
  }


  const systemPrompt = data.systemPrompt
    ? Handlebars.compile(data.systemPrompt)(context)
    : "you are a helpful assistant";

  const userPrompt = Handlebars.compile(data.userPrompt)(context);
  
  const credential =await step.run("get-credential",()=>{
    return prisma.credential.findUnique({
      where:{
        id:data.credentialId,
        userId:userId
      }
    })
  })

  if(!credential){
     await publish(OpenAiChannel().status({ nodeId, status: "error" }));
     throw new NonRetriableError("OPENAI Node credential not found ")
  }

  const OpenAi = createOpenAI({
 
  apiKey: decrypt(credential.value)
});

  try {
    const { steps } = await step.ai.wrap("openai-generate-text", generateText, {
      model: OpenAi( data.model ?? "gpt-4o"),
      system: systemPrompt,
      prompt: userPrompt,
      experimental_telemetry: {
        isEnabled: true,
        recordInputs: true,
        recordOutputs: true,
      },
    });

    const text = steps[0].content[0].type === "text" ? steps[0].content[0].text : "";

   await publish(OpenAiChannel().status({ nodeId, status: "success" }));

    return { ...context, [data.variableName]: text };
  } catch (e) {
    await publish(OpenAiChannel().status({ nodeId, status: "error" }));
    throw e;
  }
};
