import {channel,topic} from "@inngest/realtime"
export const GeminiChannel = channel("gemini-execution")
.addTopic(topic("status").type<{
    nodeId:string,
    status:"loading" | "success" | "error"
}>(),
)