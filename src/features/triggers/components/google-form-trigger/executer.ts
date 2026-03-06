import type { NodeExecuter } from "@/features/executions/types";
import { googleFormTriggerChannel } from "@/inngest/channels/google-form-trigger";


type googleFormTriggerData = Record<string, unknown>;
export const googleFormTriggerExecuter: NodeExecuter<googleFormTriggerData> = async ({
  context,
  step,
  nodeId,
  publish,
}) => {

   await publish(googleFormTriggerChannel().status({ nodeId, status: "loading" }));

  const result = await step.run(`google-form-trigger`, async () => {
    return context;
  });
  await publish(googleFormTriggerChannel().status({ nodeId, status: "success" }));

  return result;
};
