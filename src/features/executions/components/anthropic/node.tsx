"use client"

import { useReactFlow, type Node,type NodeProps } from "@xyflow/react"

import {memo, useState} from "react"
import { BaseExecutionNode } from "../base-execution-node"
import { AnthropicDialog,AnthropicFormValues } from "./dialog"
import { useNodeStatus } from "../../hooks/use-node-status"
import { fetchAnthropicRealtimeToken } from "./actions"
type AnthropicNodeData = {
     variableName?:string
    model?:any
    systemPrompt?:string,
    userPrompt?:string
}

type AnthropicNodeType = Node<AnthropicNodeData>

export const  AnthropicNode = memo((props:NodeProps<AnthropicNodeType>)=>{

    const [dialogOpen,SetDialogOpen] = useState(false)

    const {setNodes} = useReactFlow()

    const nodeData = props.data 
    const description = nodeData?.userPrompt
    ? `${nodeData.model || "claude-3-haiku-20240307"} : ${nodeData.userPrompt.slice(0,50)}...`
    : "Not Configured"

    const NodeStatus = useNodeStatus({
        nodeId:props.id,
        channel:"anthropic-execution",
        topic:"status",
        refreshToken:fetchAnthropicRealtimeToken
    })

    const handelOpenSettings = ()=>SetDialogOpen(true)

    const handelSubmit = (values:AnthropicFormValues)=>{
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
        <AnthropicDialog
         open={dialogOpen}
         onOpenChange={SetDialogOpen}
         onSubmit={handelSubmit}
         defaultValues={nodeData}
         />
        <BaseExecutionNode
         {...props}
        id={props.id}
        icon={"/anthropic.svg"}
        status={NodeStatus}
        name="Anthropic"
        description={description}
        onSetting={handelOpenSettings}
        onDoubelClick={handelOpenSettings}
        >
        </BaseExecutionNode>
        </>
    )
})

AnthropicNode.displayName = "GeminiNode"