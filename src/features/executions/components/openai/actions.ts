"use server"

import { getSubscriptionToken,type Realtime } from "@inngest/realtime"

import { inngest } from "@/inngest/client"
import {OpenAiChannel } from "@/inngest/channels/openai"

export type OpenAiToken = Realtime.Token<
typeof OpenAiChannel,["status"]>

export async function fetchOpenAiRealtimeToken(): Promise<OpenAiToken> {
    const token = await getSubscriptionToken(inngest,{channel:OpenAiChannel(),topics: ["status"]})

    return token
}