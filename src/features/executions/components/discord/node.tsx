"use client"

import { useReactFlow, type Node,type NodeProps } from "@xyflow/react"

import {memo, useState} from "react"
import { BaseExecutionNode } from "../base-execution-node"
import { DiscordFormValues, DiscordDialog } from "./dialog"
import { useNodeStatus } from "../../hooks/use-node-status"
import { fetchDiscordRealtimeToken } from "./actions"
type DiscordNodeData = {
     webhookUrl?:string
     content?:string
     username?:string
}

type DiscordNodeType = Node<DiscordNodeData>

export const  DiscordNode = memo((props:NodeProps<DiscordNodeType>)=>{

    const [dialogOpen,SetDialogOpen] = useState(false)

    const {setNodes} = useReactFlow()

    const nodeData = props.data 
    const description = nodeData?.content
    ? `Send:  ${nodeData.content.slice(0,50)}...`
    : "Not Configured"

    const NodeStatus = useNodeStatus({
        nodeId:props.id,
        channel:"discord-execution",
        topic:"status",
        refreshToken:fetchDiscordRealtimeToken
    })

    const handelOpenSettings = ()=>SetDialogOpen(true)

    const handelSubmit = (values:DiscordFormValues)=>{
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
        <DiscordDialog
         open={dialogOpen}
         onOpenChange={SetDialogOpen}
         onSubmit={handelSubmit}
         defaultValues={nodeData}
         />
        <BaseExecutionNode
         {...props}
        id={props.id}
        icon={"/discord.svg"}
        status={NodeStatus}
        name="Discord"
        description={description}
        onSetting={handelOpenSettings}
        onDoubelClick={handelOpenSettings}
        >
        
        </BaseExecutionNode>
        </>
    )
})

DiscordNode.displayName = "DiscordNode"