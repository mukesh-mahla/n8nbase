
import { inngest } from "./client";
import { NonRetriableError } from "inngest";

import prisma from "@/lib/db";
import { topologicalSort } from "./utils";
import { NodeType } from "@prisma/client";
import { getExecuter } from "@/features/executions/lib/executer-registry";
import { httpRequestChannel } from "./channels/http-request";
import { manualTriggerChannel } from "./channels/manual-trigger";
import { googleFormTriggerChannel } from "./channels/google-form-trigger";
import { StripeTriggerChannel } from "./channels/Stripe-trigger";
import { GeminiChannel } from "./channels/gemini";


 
export const executeWorkflow = inngest.createFunction(
  { id: "execute-workflow",
    retries:0 // change in produnction
   },
  { event: "workflow/execute.workflow"
    ,channel:[httpRequestChannel(),manualTriggerChannel(),googleFormTriggerChannel(),StripeTriggerChannel(),GeminiChannel()]
   },

 
  async ({ event,step,publish }) => {
    const workflowId = event.data.workflowId;
    if(!workflowId) {
      throw new NonRetriableError( "Workflow ID is missing");
    }
      
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

    // initialize the context with any initial data from the trigger


    let context = event.data.initialData || {}
     
    for(const node of sortedNodes){
      const executer = getExecuter(node.type as NodeType)
      context  = await executer({
        data:node.data as Record<string,unknown>,
        context,
        step,
        nodeId:node.id,
        publish
      })
    }

     return {workflowId,result:context}
  }
);

