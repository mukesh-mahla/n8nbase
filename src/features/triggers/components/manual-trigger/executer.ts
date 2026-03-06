import type { NodeExecuter } from "@/features/executions/types";
import { manualTriggerChannel } from "@/inngest/channels/manual-trigger";

type manualTriggerData = Record<string, unknown>;
export const manualTriggerExecuter: NodeExecuter<manualTriggerData> = async ({
  context,
  step,
  nodeId,
  publish,
}) => {

   await publish(manualTriggerChannel().status({ nodeId, status: "loading" }));

  const result = await step.run(`manual-trigger-${nodeId}`, async () => {
    return context;
  });
  await publish(manualTriggerChannel().status({ nodeId, status: "success" }));

  return result;
};
