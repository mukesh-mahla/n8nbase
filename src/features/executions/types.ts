import type { Realtime } from "@inngest/realtime";
import type { GetStepTools,Inngest } from "inngest";

export type workFlowContext = Record<string,unknown>

export type StepTools = GetStepTools<Inngest.Any>

export interface NodeExexuterParams<TData = Record<string,unknown>>{
    data:TData,
    context:workFlowContext,
    step:StepTools,
    nodeId:string
    publish:Realtime.PublishFn
}

export type NodeExecuter<TData = Record<string,unknown>> = (params:NodeExexuterParams<TData>)=>Promise<workFlowContext>