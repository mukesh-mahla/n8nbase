"use client"
import { type NodeProps, Position, useReactFlow } from "@xyflow/react"
import { LucideIcon } from "lucide-react"
import Image from "next/image"
import { memo } from "react"
import { BaseNode, BaseNodeContent } from "@/components/react-flow/base-node"
import { BaseHandle } from "../../../components/react-flow/base-handle"
import { WorkflowNode } from "../../../components/workflow-node"
import {type NodeStatus, NodeStatusIndicator } from "@/components/react-flow/node-status-indicator"
interface BaseTriggerNodeProps extends NodeProps {
    icon: LucideIcon | string,
    name: string,
    description?: string
    children?: string
    status?:NodeStatus
    onSetting?: () => void
    onDoubelClick?: () => void
}

export const BaseTriggerNode = memo(
    ({ id, icon: Icon, name, description,status="initial", children, onDoubelClick, onSetting }: BaseTriggerNodeProps) => {

        const {setNodes,setEdges}  = useReactFlow()

        const handelDelete = () => {
            setNodes((currentNode)=>{
                const updatedNode = currentNode.filter((node)=>node.id !== id)
                return updatedNode
            })

            setEdges((currentEdges)=>{
                const updatedEdges = currentEdges.filter((edge)=>
                    edge.source !== id && edge.target !== id
                )
                return updatedEdges
            })
         }


        return (
            <WorkflowNode name={name} description={description} onDelete={handelDelete} onSettings={onSetting}>
                <NodeStatusIndicator
                 status={status}
                 variant="border"
                 className="rounded-l-2xl"
                
                >
                <BaseNode status={status} onDoubleClick={onDoubelClick} className="rounded-l-2xl relative group">
                    <BaseNodeContent>
                        {typeof Icon === "string" ? (
                            <Image src={Icon} alt={name} width={16} height={16} />
                        )
                            : (
                                <Icon className="size-4 text-muted-foreground" />
                            )
                        }
                        {children}



                        <BaseHandle
                            id="source-1"
                            type="source"
                            position={Position.Right}
                        />
                    </BaseNodeContent>
                </BaseNode>
                </NodeStatusIndicator>
            </WorkflowNode>
        )
    }
)

BaseTriggerNode.displayName = "BaseTriggerNode"