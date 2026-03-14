import type { NodeExecuter } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import { generateText } from "ai";
import Handlebars from "handlebars";
import { anthropic } from '@ai-sdk/anthropic';
import { createAnthropic } from '@ai-sdk/anthropic';
import { AnthropicChannel } from "@/inngest/channels/anthropic";
import prisma from "@/lib/db";
import { decrypt } from "@/lib/encryption";


Handlebars.registerHelper("json", (context) => {
  const jsonstringfy = JSON.stringify(context, null, 2);
  const safeString = new Handlebars.SafeString(jsonstringfy);
  return safeString;
});

type AnthropicData = {
  variableName: string;
  credentialId?: string;
  model?: string;
  systemPrompt?: string;
  userPrompt?: string;
};



export const AnthropicExecuter: NodeExecuter<AnthropicData> = async ({
  data,
  userId,
  context,
  step,
  nodeId,
  publish,
}) => {

  await publish(AnthropicChannel().status({ nodeId, status: "loading" }));

  if (!data.variableName) {
    await publish(AnthropicChannel().status({ nodeId, status: "error" }));
    throw new NonRetriableError("Anthropic Node variable name not configured ");
  }
  if (!data.credentialId) {
    await publish(AnthropicChannel().status({ nodeId, status: "error" }));
    throw new NonRetriableError("Anthropic Node Credential not configured ");
  }

    if (!data.userPrompt) {
    await publish(AnthropicChannel().status({ nodeId, status: "error" }));
    throw new NonRetriableError("Anthropic Node userPrompt not configured ");
  }


  const systemPrompt = data.systemPrompt
    ? Handlebars.compile(data.systemPrompt)(context)
    : "you are a helpful assistant";

  const userPrompt = Handlebars.compile(data.userPrompt)(context);

  const credential = await step.run("get-credential",()=>{
    return prisma.credential.findUnique({
      where:{
        id:data.credentialId,
        userId:userId
      }
    })})

  if(!credential){
    await publish(AnthropicChannel().status({ nodeId, status: "error" }));
    throw new NonRetriableError("Anthropic Node credential not found ")
  }

  const Anthropic = createAnthropic({
  apiKey: decrypt(credential.value),
});
  

  try {
    const { steps } = await step.ai.wrap("anthropic-generate-text", generateText, {
      model: Anthropic( data.model ?? "claude-3-haiku-20240307"),
      system: systemPrompt,
      prompt: userPrompt,
      experimental_telemetry: {
        isEnabled: true,
        recordInputs: true,
        recordOutputs: true,
      },
    });

    const text = steps[0].content[0].type === "text" ? steps[0].content[0].text : "";

   await publish(AnthropicChannel().status({ nodeId, status: "success" }));

    return { ...context, [data.variableName]: text };
  } catch (e) {
    await publish(AnthropicChannel().status({ nodeId, status: "error" }));
    throw e;
  }
};
