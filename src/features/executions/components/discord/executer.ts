import type { NodeExecuter } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import {decode} from "html-entities"

import Handlebars from "handlebars";



import { DiscordChannel } from "@/inngest/channels/Discord";
import ky from "ky";

Handlebars.registerHelper("json", (context) => {
  const jsonstringfy = JSON.stringify(context, null, 2);
  const safeString = new Handlebars.SafeString(jsonstringfy);
  return safeString;
});

type DiscordData = {
  variableName: string;
   webhookUrl?:string
     content?:string
     username?:string
};



export const DiscordExecuter: NodeExecuter<DiscordData> = async ({
  data,
  context,
  step,
  nodeId,
  publish,
}) => {

  await publish(DiscordChannel().status({ nodeId, status: "loading" }));

  if (!data.variableName) {
    await publish(DiscordChannel().status({ nodeId, status: "error" }));
    throw new NonRetriableError("Discord Node variable name not configured ");
  }
  if (!data.content) {
    await publish(DiscordChannel().status({ nodeId, status: "error" }));
    throw new NonRetriableError("Discord Node content not configured ");
  }

    if (!data.webhookUrl) {
    await publish(DiscordChannel().status({ nodeId, status: "error" }));
    throw new NonRetriableError("Discord Node webhook url not configured ");
  }


const rawContent = Handlebars.compile(data.content)(context)
const content = decode(rawContent)
const username = data.username ? decode(Handlebars.compile(data.username)(context)) : undefined

  try {
    const result = await step.run("discord-webhook",async()=>{
      await ky.post(data.webhookUrl!,{
        json:{
          content:content.slice(0,2000),
          username
        }
      })
      return {...context,[data.variableName]:{messageContent:content.slice(0,2000)}}
    })

   await publish(DiscordChannel().status({ nodeId, status: "success" }));

   return result
  } catch (e) {
    await publish(DiscordChannel().status({ nodeId, status: "error" }));
    throw e;
  }
};
