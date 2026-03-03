"use client"

import { useReactFlow, type Node,type NodeProps } from "@xyflow/react"
import { GlobeIcon } from "lucide-react"
import {memo, useState} from "react"
import { BaseExecutionNode } from "../base-execution-node"
import { FormType, HttpRequestDialog } from "./dialog"
type HttpRequestNodeData = {
    endpoint?:string
    method?:"GET" | "POST" | "PUT" | "PATCH" | "DELETE"
    body?:string
    [key:string]:unknown
}

type HttpRequestNodeType = Node<HttpRequestNodeData>

export const  HttpRequestNode = memo((props:NodeProps<HttpRequestNodeType>)=>{

    const [dialogOpen,SetDialogOpen] = useState(false)

    const {setNodes} = useReactFlow()

    const nodeData = props.data 
    const description = nodeData?.endpoint
    ? `${nodeData.method || "GET"} : ${nodeData.endpoint}`
    : "Not Configured"

    const NodeStatus = "initial"

    const handelOpenSettings = ()=>SetDialogOpen(true)

    const handelSubmit = (values:FormType)=>{
    setNodes((nodes)=>nodes.map((node)=>{
        if(node.id === props.id){
            return {
                ...node,
                data:{
                    ...node.data,
                    endpoint:values.endpoint,
                    method:values.method,
                    body:values.body ?? node.data.body
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
         defaultEndpoint={nodeData.endpoint}
         defaultBody={nodeData.body}
         defaultMethod={nodeData.method}
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