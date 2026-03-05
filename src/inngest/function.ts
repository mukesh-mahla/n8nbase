
import { th } from "date-fns/locale";
import { inngest } from "./client";
import { NonRetriableError } from "inngest";
import { Workflow } from "lucide-react";
import prisma from "@/lib/db";
import { topologicalSort } from "./utils";
import { NodeType } from "@prisma/client";
import { getExecuter } from "@/features/executions/lib/executer-registry";


 
export const executeWorkflow = inngest.createFunction(
  { id: "execute-workflow" },
  { event: "workflow/execute.workflow" },

 
  async ({ event,step }) => {
    const workflowId = event.data.id;
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
        nodeId:node.id
      })
    }

     return {workflowId,result:context}
  }
);

