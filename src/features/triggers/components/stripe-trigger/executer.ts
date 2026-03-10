import type { NodeExecuter } from "@/features/executions/types";

import { StripeTriggerChannel } from "@/inngest/channels/Stripe-trigger";


type StripeTriggerData = Record<string, unknown>;
export const StripeTriggerExecuter: NodeExecuter<StripeTriggerData> = async ({
  context,
  step,
  nodeId,
  publish,
}) => {

   await publish(StripeTriggerChannel().status({ nodeId, status: "loading" }));

  const result = await step.run(`Stripe-trigger`, async () => {
    return context;
  });
  await publish(StripeTriggerChannel().status({ nodeId, status: "success" }));

  return result;
};
