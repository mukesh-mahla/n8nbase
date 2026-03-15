
import { inngest } from "./client";
import { NonRetriableError } from "inngest";

import prisma from "@/lib/db";
import { topologicalSort } from "./utils";
import { ExecutionStatus, NodeType } from "@prisma/client";
import { getExecuter } from "@/features/executions/lib/executer-registry";
import { httpRequestChannel } from "./channels/http-request";
import { manualTriggerChannel } from "./channels/manual-trigger";
import { googleFormTriggerChannel } from "./channels/google-form-trigger";
import { StripeTriggerChannel } from "./channels/Stripe-trigger";
import { GeminiChannel } from "./channels/gemini";
import { AnthropicChannel } from "./channels/anthropic";
import { OpenAiChannel } from "./channels/openai";
import { DiscordChannel } from "./channels/Discord";
import { SlackChannel } from "./channels/slack";


 
export const executeWorkflow = inngest.createFunction(
  { 
    id: "execute-workflow",
    retries:process.env.NODE_ENV === "development" ? 0 : 3,
    onFailure:async({event,step})=>{
         return prisma.execution.update({
          where:{
            inggestEventId:event.data.event.id
          },
          data:{
            status:ExecutionStatus.FAILED,
            error:event.data.error.message,
            errorStack:event.data.error.stack
          }
         })
    } 
  },
  { event: "workflow/execute.workflow"
    ,channel:[
      httpRequestChannel(),manualTriggerChannel(),
      googleFormTriggerChannel(),StripeTriggerChannel(),
      GeminiChannel(),AnthropicChannel(),
      OpenAiChannel(),DiscordChannel(),SlackChannel()
    ]
   },

 
  async ({ event,step,publish }) => {

    const inggestEventId = event.id
    const workflowId = event.data.workflowId;

    if(!inggestEventId || !workflowId) {
      throw new NonRetriableError( "Event ID or Workflow ID is missing");
    }
     
    await step.run("create-execution",()=>{
      return prisma.execution.create({
        data:{
          workflowId,
          inggestEventId
        }
      })
    })


    const sortedNodes = await step.run("prepare-workflow",async ()=>{
      const workflow = await prisma.workflow.findUniqueOrThrow({
        where:{
            id:workflowId
          },
          include:{
            nodes:true,
            connections:true
          }
        })

        return topologicalSort(workflow.nodes,workflow.connections)
    })

    const userId = await step.run("get-userId",async()=>{
      const workflow = await prisma.workflow.findUniqueOrThrow({
        where:{
            id:workflowId
          },
          select:{
            userId:true
          }
        })

        return workflow.userId
    })


    let context = event.data.initialData || {}
     
    for(const node of sortedNodes){
      const executer = getExecuter(node.type as NodeType)
      context  = await executer({
        data:node.data as Record<string,unknown>,
        userId,
        context,
        step,
        nodeId:node.id,
        publish
      })
    }

    await step.run("update-execution",()=>{
      return prisma.execution.update({
        where:{
          inggestEventId,workflowId
        },
        data:{
          status:ExecutionStatus.SUCCESS,
          completedAt:new Date(),
          output:context
        }
      })
    })
     return {workflowId,result:context}
  }
);

