"use client"

import { useReactFlow, type Node,type NodeProps } from "@xyflow/react"

import {memo, useState} from "react"
import { BaseExecutionNode } from "../base-execution-node"
import { SlackDialog, SlackFormValues } from "./dialog"
import { useNodeStatus } from "../../hooks/use-node-status"
import { fetchSlackRealtimeToken } from "./actions"
type SlackNodeData = {
     webhookUrl?:string
     content?:string
     username?:string
}

type SlackNodeType = Node<SlackNodeData>

export const  SlackNode = memo((props:NodeProps<SlackNodeType>)=>{

    const [dialogOpen,SetDialogOpen] = useState(false)

    const {setNodes} = useReactFlow()

    const nodeData = props.data 
    const description = nodeData?.content
    ? `Send:  ${nodeData.content.slice(0,50)}...`
    : "Not Configured"

    const NodeStatus = useNodeStatus({
        nodeId:props.id,
        channel:"slack-execution",
        topic:"status",
        refreshToken:fetchSlackRealtimeToken
    })

    const handelOpenSettings = ()=>SetDialogOpen(true)

    const handelSubmit = (values:SlackFormValues)=>{
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
        <SlackDialog
         open={dialogOpen}
         onOpenChange={SetDialogOpen}
         onSubmit={handelSubmit}
         defaultValues={nodeData}
         />
        <BaseExecutionNode
         {...props}
        id={props.id}
        icon={"/slack.svg"}
        status={NodeStatus}
        name="Slack"
        description={description}
        onSetting={handelOpenSettings}
        onDoubelClick={handelOpenSettings}
        >
        
        </BaseExecutionNode>
        </>
    )
})

SlackNode.displayName = "SlackNode"