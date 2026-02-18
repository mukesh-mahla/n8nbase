

import { useTRPC } from "@/trpc/client"
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

// hook to fetch all workflow using suspanse

export const useSuspanseWorkflows=()=>{
    const trpc = useTRPC()
    return useSuspenseQuery(trpc.workflows.getMany.queryOptions())
}

// hook to create workflow

export const useCreateWorkflow = ()=>{
   
    const QueryClient = useQueryClient()
    const trpc = useTRPC()

    return useMutation(trpc.workflows.create.mutationOptions({
        onSuccess:(data)=>{
            toast.success(`workflow ${data.name} created`)
           
            QueryClient.invalidateQueries(
                trpc.workflows.getMany.queryOptions()
            )
        },
        onError:(error)=>{
            toast.error(`Failed to create workflow:  ${error.message}`)
        }
    }))

}