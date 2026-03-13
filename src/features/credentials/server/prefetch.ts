import type { inferInput } from "@trpc/tanstack-react-query";
import {prefetch,trpc} from "@/trpc/server";

type Input = inferInput<typeof trpc.credential.getMany>

// prefetch credential

export const prefetchCredentials=(params:Input)=>{
    
  return  prefetch(trpc.credential.getMany.queryOptions(params))
}

// prefecth a singel credential

export const prefetchCredential=(id:string)=>{
    
  return  prefetch(trpc.credential.getOne.queryOptions({id}))
}