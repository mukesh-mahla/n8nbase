"use client"

import { ErrorView, LoadingView } from "@/components/entity-components"
import { useSuspanseWorkflow } from "@/features/workflows/hooks/use-workflows"

export const Editor = ({workflowId}:{workflowId:string})=>{
    const {data:workflow} = useSuspanseWorkflow(workflowId)

    return <p>
        {JSON.stringify(workflow,null,2)}
    </p>
}

export const EditorLoading = ()=>{
    return <LoadingView message="Loading Editor"/>
}

export const EditorError = ()=>{
    return <ErrorView message="Error Loading Editor"/>
}