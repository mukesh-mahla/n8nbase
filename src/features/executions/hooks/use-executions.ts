

import { useTRPC } from "@/trpc/client"
import {  useSuspenseQuery } from "@tanstack/react-query"


import { useExecutionsParams } from "./use-executions-params"



// hook to fetch all executions using suspanse

export const useSuspanseExecutions=()=>{
    const trpc = useTRPC()
    const [params] = useExecutionsParams()
    return useSuspenseQuery(trpc.executions.getMany.queryOptions(params))
}




// to fetch one execution using suspanse

export const useSuspanseExecution = (id:string)=>{
    const trpc = useTRPC()
    return useSuspenseQuery(trpc.executions.getOne.queryOptions({id}))
}




