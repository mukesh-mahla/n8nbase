import {channel,topic} from "@inngest/realtime"

export const manualTriggerChannel = channel("Manual-Trigger-Execution")
.addTopic(topic("status").type<{
    nodeId:string,
    status:"loading" | "success" | "error"
}>(),
)