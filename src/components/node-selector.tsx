"use client"

import { createId } from '@paralleldrive/cuid2'
import { useReactFlow } from '@xyflow/react'
import { Divide, GlobeIcon, MousePointerIcon } from 'lucide-react'
import { useCallback } from 'react'
import { toast } from 'sonner'
import {
    Sheet,
    SheetContent,
    SheetTrigger,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet'

import { NodeType } from '@prisma/client'
import { Separator } from './ui/separator'

export type NodeTypeOption = {
    type: NodeType
    label: string
    description: string
    icon: React.ComponentType<{ className?: string }> | string
}

const triggerNodes: NodeTypeOption[] = [
    {
        type: NodeType.MANUAL_TRIGGER,
        label: "Manual Trigger",
        description: "Trigger the workflow manually",
        icon: MousePointerIcon
    },
    {
        type: NodeType.GOOGLE_FORM_TRIGGER,
        label: "Google Form",
        description: "Runs the flow when the form is submitted",
        icon: "/google-forms.svg"
    },
    {
        type: NodeType.STRIPE_TRIGGER,
        label: "stripe trigger",
        description: "Runs the flow when the stripe event happen",
        icon: "/stripe.svg"
    }
]

const executionNodes: NodeTypeOption[] = [
    {
        type: NodeType.HTTP_REQUEST,
        label: "HTTP Request",
        description: "Make an HTTP request to an API",
        icon: GlobeIcon
    },
    {
        type: NodeType.GEMINI,
        label: "Gemini",
        description: "Make an api call to Gemini",
        icon: "/gemini.svg"
    },
    {
        type: NodeType.ANTHROPIC,
        label: "Anthropic",
        description: "Make an api call to Anthropic",
        icon: "/anthropic.svg"
    },
    {
        type: NodeType.OPENAI,
        label: "OpenAi",
        description: "Make an api call to Anthropic",
        icon: "/openai.svg"
    }
]

interface NodeSelectorProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    children: React.ReactNode
}

export function NodeSelector({ open, onOpenChange, children }: NodeSelectorProps) {
    const { setNodes, getNodes, screenToFlowPosition } = useReactFlow()

    const handelNodeSelect = useCallback((selection: NodeTypeOption) => {
        if (selection.type === NodeType.MANUAL_TRIGGER) {
            const nodes = getNodes()
            const hasManualTrigger = nodes.some(
                (node) => node.type === NodeType.MANUAL_TRIGGER
            )
            if (hasManualTrigger) {
                toast.error("only one manual trigger is allowed per workflow")
                return
            }

        }
        setNodes((nodes) => {
            const hasInitialTrigger = nodes.some(
                (node) => node.type === NodeType.INITIAL
            )

            const centerX = window.innerWidth / 2
            const centerY = window.innerHeight / 2

            const flowPosition = screenToFlowPosition({
                x: centerX + Math.random() - 0.5 * 200,
                y: centerY + Math.random() - 0.5 * 200
            })

            const newNode = {
                id: createId(),
                data: {},
                position: flowPosition,
                type: selection.type

            }

            if (hasInitialTrigger) {
                return [newNode]
            }

            return [...nodes, newNode]

        })
        onOpenChange(false)
    }, [setNodes, getNodes, onOpenChange, screenToFlowPosition])

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetTrigger asChild>
                {children}
            </SheetTrigger>
            <SheetContent side='right' className='w-full sm:max-w-md overflow-y-auto'>

                <SheetHeader>
                    <SheetTitle>
                        What triggers this workflow?
                    </SheetTitle>
                    <SheetDescription>
                        A trigger is an event that starts your workflow.
                    </SheetDescription>
                </SheetHeader>
                <div>
                    {triggerNodes.map((nodeType) => {
                        const Icon = nodeType.icon
                        return <div key={nodeType.type} onClick={() => { handelNodeSelect(nodeType) }}
                            className='w-full justify-start h-auto py-5 px-4 rounded-none cursor-pointer 
                         border-l-2 border-transparent hover:border-l-primary '>

                            <div className='flex items-center gap-6 w-full overflow-hidden'>
                                {typeof Icon === "string" ? (<img src={Icon} alt={nodeType.label}
                                    className='size-5 object-contain rounded-sm' />) : (<Icon className='size-5' />)}

                                <div className='flex flex-col items-start text-left'>
                                    <span className='font-medium text-sm'>{nodeType.label}</span>
                                    <span className='text-xs text-muted-foreground'>{nodeType.description}</span>
                                </div>
                            </div>
                        </div>
                    })}
                </div>
                <Separator />
                <div>
                    {executionNodes.map((nodeType) => {
                        const Icon = nodeType.icon
                        return <div key={nodeType.type} onClick={() => { handelNodeSelect(nodeType) }} className='w-full justify-start h-auto py-5 px-4 rounded-none cursor-pointer border-l-2 border-transparent hover:border-l-primary '>
                            <div className='flex items-center gap-6 w-full overflow-hidden'>
                                {typeof Icon === "string" ? (<img src={Icon} alt={nodeType.label} className='size-5 object-contain rounded-sm' />) : (<Icon className='size-5' />)}
                                <div className='flex flex-col items-start text-left'>
                                    <span className='font-medium text-sm'>{nodeType.label}</span>
                                    <span className='text-xs text-muted-foreground'>{nodeType.description}</span>
                                </div>
                            </div>
                        </div>
                    })}
                </div>
            </SheetContent>

        </Sheet>


    )

}