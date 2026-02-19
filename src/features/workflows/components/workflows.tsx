"use client"
import { EntityContainer, EntityHeader, EntityPagination, EntitySearch } from "@/components/entity-components"
import { useCreateWorkflow, useSuspanseWorkflows } from "../hooks/use-workflows"
import { useUpgradeModal } from "@/hooks/use-upgrade-modal"
import { useRouter } from "next/navigation"
import { useWorkflowsParams } from "../hooks/use-workflows-params"
import { UseEntitySearch } from "../hooks/use-entity-search"

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
        <p>
            {JSON.stringify(workflows.data,null,2)}
        </p>
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