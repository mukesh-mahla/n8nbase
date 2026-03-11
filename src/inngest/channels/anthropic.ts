import {channel,topic} from "@inngest/realtime"
export const AnthropicChannel = channel("anthropic-execution")
.addTopic(topic("status").type<{
    nodeId:string,
    status:"loading" | "success" | "error"
}>(),
)