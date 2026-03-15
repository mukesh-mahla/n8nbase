

import { useTRPC } from "@/trpc/client"
import { useMutation,  useQuery, useQueryClient, useSuspenseQuery } from "@tanstack/react-query"

import { toast } from "sonner"
import { useCredentialParams } from "./use-credential-params"
import { CredentialType } from "@/../generated/prisma"


// hook to fetch all credentials using suspanse

export const useSuspanseCredentials=()=>{
    const trpc = useTRPC()
    const [params] = useCredentialParams()
    return useSuspenseQuery(trpc.credential.getMany.queryOptions(params))
}

// hook to create workflow

export const useCreateCredential = ()=>{
   
    const QueryClient = useQueryClient()
    const trpc = useTRPC()

    return useMutation(trpc.credential.create.mutationOptions({
        onSuccess:(data)=>{
            toast.success(`credential ${data.name} created`)
           
            QueryClient.invalidateQueries(
                trpc.credential.getMany.queryOptions({})
            )
        },
        onError:(error)=>{
            toast.error(`Failed to create credential  ${error.message}`)
        }
    }))

}

// hook to remove a credential

export const useRemoveCredential = ()=>{
    const trpc = useTRPC()
    const queryClient = useQueryClient()

    return useMutation(trpc.credential.remove.mutationOptions({
        onSuccess:(data)=>{
            toast.success(`credential "${data.name}" removed`)
              queryClient.invalidateQueries(trpc.credential.getMany.queryOptions({}))
              queryClient.invalidateQueries(trpc.credential.getOne.queryFilter({id:data.id}))
        }
        
    }))
}

// to fetch one credential using suspanse

export const useSuspanseCredential = (id:string)=>{
    const trpc = useTRPC()
    return useSuspenseQuery(trpc.credential.getOne.queryOptions({id}))
}




//  a hook to update a credential

export const useUpdateCredential = ()=>{
   
    const QueryClient = useQueryClient()
    const trpc = useTRPC()

    return useMutation(trpc.credential.update.mutationOptions({
        onSuccess:(data)=>{
            toast.success(`credential ${data.name} saved`)
           
            QueryClient.invalidateQueries(
                trpc.credential.getMany.queryOptions({})
            )
            QueryClient.invalidateQueries(trpc.credential.getOne.queryOptions({id:data.id}))
        },
        onError:(error)=>{
            toast.error(`Failed to save credential:  ${error.message}`)
        }
    }))

}

// hook to fetch credential by typr

export  const useCredentialByType = (type:CredentialType)=>{
    const trpc = useTRPC()
    return useQuery(trpc.credential.getByType.queryOptions({type}))
}


