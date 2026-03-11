import {channel,topic} from "@inngest/realtime"
export const OpenAiChannel = channel("openai-execution")
.addTopic(topic("status").type<{
    nodeId:string,
    status:"loading" | "success" | "error"
}>(),
)