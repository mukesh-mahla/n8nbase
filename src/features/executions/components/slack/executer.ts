import type { NodeExecuter } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import {decode} from "html-entities"

import Handlebars from "handlebars";




import ky from "ky";
import { SlackChannel } from "@/inngest/channels/slack";

Handlebars.registerHelper("json", (context) => {
  const jsonstringfy = JSON.stringify(context, null, 2);
  const safeString = new Handlebars.SafeString(jsonstringfy);
  return safeString;
});

type SlackData = {
  variableName: string;
   webhookUrl?:string
     content?:string

};



export const SlackExecuter: NodeExecuter<SlackData> = async ({
  data,
  context,
  step,
  nodeId,
  publish,
}) => {

  await publish(SlackChannel().status({ nodeId, status: "loading" }));

  if (!data.variableName) {
    await publish(SlackChannel().status({ nodeId, status: "error" }));
    throw new NonRetriableError("Slack Node variable name not configured ");
  }
  if (!data.content) {
    await publish(SlackChannel().status({ nodeId, status: "error" }));
    throw new NonRetriableError("Slack Node content not configured ");
  }

    if (!data.webhookUrl) {
    await publish(SlackChannel().status({ nodeId, status: "error" }));
    throw new NonRetriableError("Slack Node webhook url not configured ");
  }


const rawContent = Handlebars.compile(data.content)(context)
const content = decode(rawContent)


  try {
    const result = await step.run("slack-webhook",async()=>{
      await ky.post(data.webhookUrl!,{
        json:{
          content:content,
          
        }
      })
      return {...context,[data.variableName]:{messageContent:content.slice(0,2000)}}
    })

   await publish(SlackChannel().status({ nodeId, status: "success" }));

   return result
  } catch (e) {
    await publish(SlackChannel().status({ nodeId, status: "error" }));
    throw e;
  }
};
