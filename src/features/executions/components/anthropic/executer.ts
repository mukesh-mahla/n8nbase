import type { NodeExecuter } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import { generateText } from "ai";
import Handlebars from "handlebars";
import { anthropic } from '@ai-sdk/anthropic';
import { createAnthropic } from '@ai-sdk/anthropic';
import { AnthropicChannel } from "@/inngest/channels/anthropic";


Handlebars.registerHelper("json", (context) => {
  const jsonstringfy = JSON.stringify(context, null, 2);
  const safeString = new Handlebars.SafeString(jsonstringfy);
  return safeString;
});

type AnthropicData = {
  variableName: string;
  model?: string;
  systemPrompt?: string;
  userPrompt?: string;
};

const Anthropic = createAnthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "",
});

export const AnthropicExecuter: NodeExecuter<AnthropicData> = async ({
  data,
  context,
  step,
  nodeId,
  publish,
}) => {

  await publish(AnthropicChannel().status({ nodeId, status: "loading" }));

  if (!data.variableName) {
    await publish(AnthropicChannel().status({ nodeId, status: "error" }));
    throw new NonRetriableError("Gemini Node variable name not configured ");
  }

    if (!data.userPrompt) {
    await publish(AnthropicChannel().status({ nodeId, status: "error" }));
    throw new NonRetriableError("Gemini Node userPrompt not configured ");
  }


  const systemPrompt = data.systemPrompt
    ? Handlebars.compile(data.systemPrompt)(context)
    : "you are a helpful assistant";

  const userPrompt = Handlebars.compile(data.userPrompt)(context);
  

  try {
    const { steps } = await step.ai.wrap("anthropic-generate-text", generateText, {
      model: anthropic( data.model ?? "claude-3-haiku-20240307"),
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
