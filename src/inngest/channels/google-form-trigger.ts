import {channel,topic} from "@inngest/realtime"

export const googleFormTriggerChannel = channel("Google-Form-Trigger-Execution")
.addTopic(topic("status").type<{
    nodeId:string,
    status:"loading" | "success" | "error"
}>(),
)