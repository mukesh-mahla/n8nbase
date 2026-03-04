import {Button } from "@/components/ui/button"
import { useExexuteWorkflow } from "@/features/workflows/hooks/use-workflows"

import { FlaskConicalIcon } from "lucide-react"

export const ExecuteWorkflowButton = ({workflowId}:{workflowId:string})=>{

    const ExecuteWorkflow = useExexuteWorkflow()

    const hnadelExecute = ()=>{ ExecuteWorkflow.mutate({
        id:workflowId
    })}
    return (
        <Button size={"lg"} onClick={hnadelExecute} disabled={ExecuteWorkflow.isPending}>
            <FlaskConicalIcon className="size-4"/>
            Execute Workflow
        </Button>
    )
}