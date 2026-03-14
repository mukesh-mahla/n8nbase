import type { inferInput } from "@trpc/tanstack-react-query";
import {prefetch,trpc} from "@/trpc/server";

type Input = inferInput<typeof trpc.executions.getMany>

// prefetch credential

export const prefetchExecutions=(params:Input)=>{
    
  return  prefetch(trpc.executions.getMany.queryOptions(params))
}

// prefecth a singel executions

export const prefetchExecution=(id:string)=>{
    
  return  prefetch(trpc.executions.getOne.queryOptions({id}))
}