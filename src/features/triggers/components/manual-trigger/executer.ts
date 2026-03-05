import type { NodeExecuter } from "@/features/executions/types";

type manualTriggerData = Record<string,unknown>
export const manualTriggerExecuter:NodeExecuter<manualTriggerData> = async ({context,step,nodeId})=>{
    // for manual trigger we just return the context as is, since there is no processing needed
     const result = await step.run(`manual-trigger-${nodeId}`,async ()=>{
        return context
     })

     return result
}