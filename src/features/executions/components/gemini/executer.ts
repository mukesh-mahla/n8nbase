import type { NodeExecuter } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText } from "ai";
import Handlebars from "handlebars";

import { GeminiChannel } from "@/inngest/channels/gemini";
import prisma from "@/lib/db";

Handlebars.registerHelper("json", (context) => {
  const jsonstringfy = JSON.stringify(context, null, 2);
  const safeString = new Handlebars.SafeString(jsonstringfy);
  return safeString;
});

type GeminiData = {
  variableName: string;
  credentialId?: string;
  model?: string;
  systemPrompt?: string;
  userPrompt?: string;
};



export const GeminiExecuter: NodeExecuter<GeminiData> = async ({
  data,
  context,
  step,
  nodeId,
  publish,
}) => {

  await publish(GeminiChannel().status({ nodeId, status: "loading" }));

  if (!data.variableName) {
    await publish(GeminiChannel().status({ nodeId, status: "error" }));
    throw new NonRetriableError("Gemini Node variable name not configured ");
  }
  if (!data.credentialId) {
    await publish(GeminiChannel().status({ nodeId, status: "error" }));
    throw new NonRetriableError("Gemini Node credential not configured ");
  }

    if (!data.userPrompt) {
    await publish(GeminiChannel().status({ nodeId, status: "error" }));
    throw new NonRetriableError("Gemini Node userPrompt not configured ");
  }


  const systemPrompt = data.systemPrompt
    ? Handlebars.compile(data.systemPrompt)(context)
    : "you are a helpful assistant";

  const userPrompt = Handlebars.compile(data.userPrompt)(context);

  const credential = await step.run("get-credential",()=>{
    return prisma.credential.findUnique({
      where:{
        id:data.credentialId
      }
    })
  })

  if(!credential){
    await publish(GeminiChannel().status({ nodeId, status: "error" }));
    throw new NonRetriableError("Gemini Node credential not found ")

  }

  const google = createGoogleGenerativeAI({
  apiKey: credential.value,
});

  try {
    const { steps } = await step.ai.wrap("gemini-generate-text", generateText, {
      model: google( data.model ?? "gemini-2.5-flash"),
      system: systemPrompt,
      prompt: userPrompt,
      experimental_telemetry: {
        isEnabled: true,
        recordInputs: true,
        recordOutputs: true,
      },
    });

    const text = steps[0].content[0].type === "text" ? steps[0].content[0].text : "";

   await publish(GeminiChannel().status({ nodeId, status: "success" }));

    return { ...context, [data.variableName]: text };
  } catch (e) {
    await publish(GeminiChannel().status({ nodeId, status: "error" }));
    throw e;
  }
};
