"use client"
import { type NodeProps,Position } from "@xyflow/react"
import { LucideIcon } from "lucide-react"
import Image from "next/image"
import {memo } from "react"
import {BaseNode,BaseNodeContent} from "@/components/react-flow/base-node"
import { BaseHandle } from "../../../components/react-flow/base-handle"
import { WorkflowNode } from "../../../components/workflow-node"
interface BaseExecutionNodeProps extends NodeProps {
    icon:LucideIcon | string,
    name:string,
    description?:string
    children?:string
    // status?:NodeStatus
    onSetting?:()=>void
    onDoubelClick?:()=>void
}

export const BaseExecutionNode = memo(
    ({id,icon:Icon,name,description,children,onDoubelClick,onSetting}:BaseExecutionNodeProps)=>{

        const handelDelete = ()=>{}
                 return (
                    <WorkflowNode name={name} description={description} onDelete={handelDelete} onSettings={onSetting}>
                        <BaseNode onDoubleClick={onDoubelClick}>
                           <BaseNodeContent>
                           {typeof Icon === "string" ? (
                            <Image src={Icon} alt={name} width={16} height={16}/>
                        )
                            : (
                                <Icon className="size-4 text-muted-foreground" />
                            )
                           }
                           {children}

                           <BaseHandle
                            id="target-1"
                           type="target"
                           position={Position.Left}
                           />

                          <BaseHandle
                            id="source-1"
                           type="source"
                           position={Position.Right}
                           />
                           </BaseNodeContent>
                        </BaseNode>
                    </WorkflowNode>
                 )
    }
)

BaseExecutionNode.displayName = "BaseExecutionNode"