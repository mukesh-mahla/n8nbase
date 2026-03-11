"use client"

import { useReactFlow, type Node,type NodeProps } from "@xyflow/react"

import {memo, useState} from "react"
import { BaseExecutionNode } from "../base-execution-node"
import { OpenAiDialog,OpenAiFormValues } from "./dialog"
import { useNodeStatus } from "../../hooks/use-node-status"
import { fetchOpenAiRealtimeToken } from "./actions"
type OpenAiNodeData = {
     variableName?:string
    model?:any
    systemPrompt?:string,
    userPrompt?:string
}

type OpenAiNodeType = Node<OpenAiNodeData>

export const  OpenAiNode = memo((props:NodeProps<OpenAiNodeType>)=>{

    const [dialogOpen,SetDialogOpen] = useState(false)

    const {setNodes} = useReactFlow()

    const nodeData = props.data 
    const description = nodeData?.userPrompt
    ? `${nodeData.model || "gpt-5.2"} : ${nodeData.userPrompt.slice(0,50)}...`
    : "Not Configured"

    const NodeStatus = useNodeStatus({
        nodeId:props.id,
        channel:"anthropic-execution",
        topic:"status",
        refreshToken:fetchOpenAiRealtimeToken
    })

    const handelOpenSettings = ()=>SetDialogOpen(true)

    const handelSubmit = (values:OpenAiFormValues)=>{
    setNodes((nodes)=>nodes.map((node)=>{
        if(node.id === props.id){
            return {
                ...node,
                data:{
                    ...node.data,
                    ...values
                }
            }
        }
        return node
    }))
    }

    return (
        <>
        <OpenAiDialog
         open={dialogOpen}
         onOpenChange={SetDialogOpen}
         onSubmit={handelSubmit}
         defaultValues={nodeData}
         />
        <BaseExecutionNode
         {...props}
        id={props.id}
        icon={"/openai.svg"}
        status={NodeStatus}
        name="OpenAi"
        description={description}
        onSetting={handelOpenSettings}
        onDoubelClick={handelOpenSettings}
        >
        </BaseExecutionNode>
        </>
    )
})

OpenAiNode.displayName = "OpenAiNode"