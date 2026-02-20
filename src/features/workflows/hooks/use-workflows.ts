

import { useTRPC } from "@/trpc/client"
import { useMutation, useQueries, useQueryClient, useSuspenseQuery } from "@tanstack/react-query"

import { toast } from "sonner"
import { useWorkflowsParams } from "./use-workflows-params"


// hook to fetch all workflow using suspanse

export const useSuspanseWorkflows=()=>{
    const trpc = useTRPC()
    const [params] = useWorkflowsParams()
    return useSuspenseQuery(trpc.workflows.getMany.queryOptions(params))
}

// hook to create workflow

export const useCreateWorkflow = ()=>{
   
    const QueryClient = useQueryClient()
    const trpc = useTRPC()

    return useMutation(trpc.workflows.create.mutationOptions({
        onSuccess:(data)=>{
            toast.success(`workflow ${data.name} created`)
           
            QueryClient.invalidateQueries(
                trpc.workflows.getMany.queryOptions({})
            )
        },
        onError:(error)=>{
            toast.error(`Failed to create workflow:  ${error.message}`)
        }
    }))

}

// hook to remove a workflow

export const useRemoveWorkflow = ()=>{
    const trpc = useTRPC()
    const queryClient = useQueryClient()

    return useMutation(trpc.workflows.remove.mutationOptions({
        onSuccess:(data)=>{
            toast.success(`workflow "${data.name}" removed`)
              queryClient.invalidateQueries(trpc.workflows.getMany.queryOptions({}))
              queryClient.invalidateQueries(trpc.workflows.getOne.queryFilter({id:data.id}))
        }
        
    }))
}

// to fetch one workflow using suspanse

export const useSuspanseWorkflow = (id:string)=>{
    const trpc = useTRPC()
    return useSuspenseQuery(trpc.workflows.getOne.queryOptions({id}))
}

// hook to update a workflow name 

export const useUpdateWorkflowName = ()=>{
   
    const QueryClient = useQueryClient()
    const trpc = useTRPC()

    return useMutation(trpc.workflows.updateName.mutationOptions({
        onSuccess:(data)=>{
            toast.success(`workflow ${data.name} updated`)
           
            QueryClient.invalidateQueries(
                trpc.workflows.getMany.queryOptions({})
            )
            QueryClient.invalidateQueries(trpc.workflows.getOne.queryOptions({id:data.id}))
        },
        onError:(error)=>{
            toast.error(`Failed to update workflow:  ${error.message}`)
        }
    }))

}