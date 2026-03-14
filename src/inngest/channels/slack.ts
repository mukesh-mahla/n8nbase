import {channel,topic} from "@inngest/realtime"
export const SlackChannel = channel("slack-execution")
.addTopic(topic("status").type<{
    nodeId:string,
    status:"loading" | "success" | "error"
}>(),
)