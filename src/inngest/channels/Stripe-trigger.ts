import {channel,topic} from "@inngest/realtime"

export const StripeTriggerChannel = channel("Stripe-Trigger-Execution")
.addTopic(topic("status").type<{
    nodeId:string,
    status:"loading" | "success" | "error"
}>(),
)