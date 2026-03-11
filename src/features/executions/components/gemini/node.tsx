"use client"

import { useReactFlow, type Node,type NodeProps } from "@xyflow/react"

import {memo, useState} from "react"
import { BaseExecutionNode } from "../base-execution-node"
import { GeminiFormValues,  GeminiDialog } from "./dialog"
import { useNodeStatus } from "../../hooks/use-node-status"
import { fetchGeminiRealtimeToken } from "./actions"
type GeminiNodeData = {
     variableName?:string
    model?:any
    systemPrompt?:string,
    userPrompt?:string
}

type GeminiNodeType = Node<GeminiNodeData>

export const  GeminiNode = memo((props:NodeProps<GeminiNodeType>)=>{

    const [dialogOpen,SetDialogOpen] = useState(false)

    const {setNodes} = useReactFlow()

    const nodeData = props.data 
    const description = nodeData?.userPrompt
    ? `${nodeData.model || "gemini-2.0-flash"} : ${nodeData.userPrompt.slice(0,50)}...`
    : "Not Configured"

    const NodeStatus = useNodeStatus({
        nodeId:props.id,
        channel:"gemini-execution",
        topic:"status",
        refreshToken:fetchGeminiRealtimeToken
    })

    const handelOpenSettings = ()=>SetDialogOpen(true)

    const handelSubmit = (values:GeminiFormValues)=>{
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
        <GeminiDialog
         open={dialogOpen}
         onOpenChange={SetDialogOpen}
         onSubmit={handelSubmit}
         defaultValues={nodeData}
         />
        <BaseExecutionNode
         {...props}
        id={props.id}
        icon={"/gemini.svg"}
        status={NodeStatus}
        name="Gemini"
        description={description}
        onSetting={handelOpenSettings}
        onDoubelClick={handelOpenSettings}
        >
        
        </BaseExecutionNode>
        </>
    )
})

GeminiNode.displayName = "GeminiNode"