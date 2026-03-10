import { NodeProps } from "@xyflow/react";
import {BaseTriggerNode} from "../base-trigger-node"

import { memo, useState } from "react";
import { StripeTriggerDialog } from "./dialog";
import { useNodeStatus } from "@/features/executions/hooks/use-node-status";
import { fetchStripeTriggerRealtimeToken } from "./actions";


export const StripeTrigger = memo(
    (props: NodeProps) => {
        const [dialogOpen, setDialogOpen] = useState(false)

        const NodeStatus = useNodeStatus({
                    nodeId: props.id,
                    channel: "Stripe-Trigger-Execution",
                    topic: "status",
                    refreshToken: fetchStripeTriggerRealtimeToken
                })

        const handelOpenSettings = () => setDialogOpen(true)

        return <>
            <StripeTriggerDialog open={dialogOpen} onOpenChange={setDialogOpen} />
           <BaseTriggerNode
                {...props}
                icon={"/stripe.svg"}
                name="stripe trigger"
                description="when stripe event happen"
                status={NodeStatus}
                onSetting={handelOpenSettings}
                onDoubelClick={handelOpenSettings}
            >
           </BaseTriggerNode>
        </>
    }
)