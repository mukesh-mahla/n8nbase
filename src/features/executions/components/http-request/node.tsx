"use client"

import { useReactFlow, type Node,type NodeProps } from "@xyflow/react"
import { GlobeIcon } from "lucide-react"
import {memo, useState} from "react"
import { BaseExecutionNode } from "../base-execution-node"
import { HttpRequestFormValues, HttpRequestDialog } from "./dialog"
import { useNodeStatus } from "../../hooks/use-node-status"
import { fetchHttpRequestRealtimeToken } from "./actions"
type HttpRequestNodeData = {
    variableName?:string
    endpoint?:string
    method?:"GET" | "POST" | "PUT" | "PATCH" | "DELETE"
    body?:string
}

type HttpRequestNodeType = Node<HttpRequestNodeData>

export const  HttpRequestNode = memo((props:NodeProps<HttpRequestNodeType>)=>{

    const [dialogOpen,SetDialogOpen] = useState(false)

    const {setNodes} = useReactFlow()

    const nodeData = props.data 
    const description = nodeData?.endpoint
    ? `${nodeData.method || "GET"} : ${nodeData.endpoint}`
    : "Not Configured"

    const NodeStatus = useNodeStatus({
        nodeId:props.id,
        channel:"http-request-execution",
        topic:"status",
        refreshToken:fetchHttpRequestRealtimeToken
    })

    const handelOpenSettings = ()=>SetDialogOpen(true)

    const handelSubmit = (values:HttpRequestFormValues)=>{
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
        <HttpRequestDialog 
         open={dialogOpen}
         onOpenChange={SetDialogOpen}
         onSubmit={handelSubmit}
         defaultValues={nodeData}
         />
        <BaseExecutionNode
         {...props}
        id={props.id}
        icon={GlobeIcon}
        status={NodeStatus}
        name="http request"
        description={description}
        onSetting={handelOpenSettings}
        onDoubelClick={handelOpenSettings}
        >
        
        </BaseExecutionNode>
        </>
    )
})

HttpRequestNode.displayName = "HttpRequestNode"