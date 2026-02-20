"use client"
import {formatDistanceToNow } from "date-fns"
import { EmptyView, EntityContainer, EntityHeader, EntityItems, EntityList, EntityPagination, EntitySearch, ErrorView, LoadingView } from "@/components/entity-components"
import { useCreateWorkflow, useRemoveWorkflow, useSuspanseWorkflows } from "../hooks/use-workflows"
import { useUpgradeModal } from "@/hooks/use-upgrade-modal"
import { useRouter } from "next/navigation"
import { useWorkflowsParams } from "../hooks/use-workflows-params"
import { UseEntitySearch } from "../hooks/use-entity-search"
import type { Workflow } from "@prisma/client"
import { WorkflowIcon } from "lucide-react"

export const WorkflowsSearch = ()=>{
    const [params,setParams] = useWorkflowsParams()
    const {searchValue,onSearchChange} = UseEntitySearch({
        params,setParams
    })

    return ( <EntitySearch value={searchValue} onChange={onSearchChange} placeholder="search workflows"/>)
}

export const WorkflowsList = ()=>{
   
    const workflows = useSuspanseWorkflows()

    return (
        <EntityList items={workflows.data.items} 
        getKey={(workflow)=>workflow.id}
        renderItem={(workflow)=><WorkflowItem data={workflow}/>}
        emptyView={<WorkflowsEmpty/>}
        />
    )
}

export const Workflowsheaders = ({disabled}:{disabled?:boolean})=>{
     const router = useRouter()
    const createWorkflow = useCreateWorkflow()
    const {handelError,modal} = useUpgradeModal()
    const handelCreate = ()=>{
        createWorkflow.mutate(undefined,{
            onSuccess:(data)=>{
                router.push(`/workflows/${data.id}`)
            },
            onError:(error)=>{handelError(error)}
        })
    }
    return <>
          {modal}
        <EntityHeader title="workflows"
        description="create and manage your workflows"
        onNew={handelCreate}
        newButtonLabel="New WorkFlow"
        disabled={disabled}
        isCreating={createWorkflow.isPending}
        />
    </>
}

export const WorkflowsPagination = ()=>{
    const workflows = useSuspanseWorkflows()
    const [params,setParams] = useWorkflowsParams()

    return <EntityPagination  diabled={workflows.isFetching} 
    totalPages={workflows.data.totalPages}
    page={workflows.data.page}
    onPageChange={(page)=>{setParams({...params,page})}}/>
}

export const WorkflowsContainer = ({children}:{children:React.ReactNode})=>{
 return (
    <EntityContainer
        header={<Workflowsheaders/>}
        search={<WorkflowsSearch/>}
        pagination={<WorkflowsPagination/>}
        >
        {children}
    </EntityContainer>
 )
}

export const WorkflowsLoading = ()=>{

    return <LoadingView message="Loading Workflows..."/>
}

export const WorkflowsError = ()=>{

    return <ErrorView message="Error Loading Workflows..."/>
}

export const WorkflowsEmpty = ()=>{
    const createWorkflow = useCreateWorkflow()
    const router = useRouter()
    const {handelError,modal} = useUpgradeModal()

    const HandelCreate = ()=>{
        createWorkflow.mutate(undefined,{
            onError:(error)=>{
                handelError(error)
            },
            onSuccess:(data)=>{
                router.push(`/workflows/${data.id}`)
            }
        })
    }
    return <>
    {modal}
    <EmptyView onNew={HandelCreate} message="you haven't created a workflows yet. Get started by creating your first workflow"/>
    </>
}

export const WorkflowItem = ({data}:{data:Workflow})=>{
        const removeWorkflow = useRemoveWorkflow()
        const handelRemove = ()=>{
            removeWorkflow.mutate({id:data.id})
        }
    return (
        <EntityItems href={`/workflows/${data.id}`}
        title={data.name}
        subtitle={<>
        Update {formatDistanceToNow(data.updatedAt,{addSuffix:true})}{" "}
        &bull; Created{" "}
        {formatDistanceToNow(data.createdAt,{addSuffix:true})}
        </>}
        image={ 
            <div className="size-8 flex items-center justify-center">
                <WorkflowIcon className="size-5 text-muted-foreground"/>
            </div>
        }
        onRemove={handelRemove}
        isRemoving={removeWorkflow.isPending}
        ></EntityItems>
    )
}