"use client"

import { LogoutButton } from "./client"
import { Button } from "@/components/ui/button"
import {  useTRPC } from "@/trpc/client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"


const Page = () =>{
  const queryClient = useQueryClient()
 
const trpc = useTRPC()
const {data} = useQuery(trpc.getWorkflow.queryOptions())
const create = useMutation(trpc.createWorkflow.mutationOptions({
  onSuccess:()=>{
    toast.success("job queued")
  }
}))

const testai = useMutation(trpc.testAi.mutationOptions({
  onSuccess:()=>{
    toast.success( "Ai job queued")
  }
  
}))
 
  return <div className="justify-center items-center flex h-screen w-screen text-center">
    
    <div className="flex flex-col gap-6">
      {JSON.stringify(data,null,2)}
   protected server component

   
   </div><Button disabled={create.isPending} onClick={()=>{create.mutate()}}>
    create workflow
   </Button>
   <LogoutButton/>
    <Button disabled={testai.isPending} onClick={()=>{testai.mutate()}}>Test AI</Button>
  </div>

}
export default Page