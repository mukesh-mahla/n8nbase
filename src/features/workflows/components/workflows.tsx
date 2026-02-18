"use client"
import { EntityContainer, EntityHeader } from "@/components/entity-components"
import { useCreateWorkflow, useSuspanseWorkflows } from "../hooks/use-workflows"
import { useUpgradeModal } from "@/hooks/use-upgrade-modal"
import { useRouter } from "next/navigation"

export const WorkflowsList = ()=>{
    const router = useRouter()
    const workflows = useSuspanseWorkflows()
    return (
        <p>
            {JSON.stringify(workflows.data,null,2)}
        </p>
    )
}

export const Workflowsheaders = ({disabled}:{disabled?:boolean})=>{
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

export const WorkflowsContainer = ({children}:{children:React.ReactNode})=>{
 return (
    <EntityContainer
        header={<Workflowsheaders/>}
        search={<></>}
        pagination={<></>}
        >
        {children}
    </EntityContainer>
 )
}