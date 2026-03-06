import { NodeProps } from "@xyflow/react";
import { BaseTriggerNode } from "../base-trigger-node";

import { memo, useState } from "react";
import { GoogleFormTriggerDialog } from "./dialog";
import { useNodeStatus } from "@/features/executions/hooks/use-node-status";
import { fetchGoogleFormTriggerRealtimeToken } from "./actions";


export const GoogleFormTrigger = memo(
    (props: NodeProps) => {
        const [dialogOpen, setDialogOpen] = useState(false)

        const NodeStatus = useNodeStatus({
                    nodeId: props.id,
                    channel: "Google-Form-Trigger-Execution",
                    topic: "status",
                    refreshToken: fetchGoogleFormTriggerRealtimeToken
                })

        const handelOpenSettings = () => setDialogOpen(true)

        return <>
            <GoogleFormTriggerDialog open={dialogOpen} onOpenChange={setDialogOpen} />
            <BaseTriggerNode
                {...props}
                icon="/google-forms.svg"
                name="Google Form"
                description="when submitted"
                status={NodeStatus}
                onSetting={handelOpenSettings}
                onDoubelClick={handelOpenSettings}
            >
            </BaseTriggerNode>
        </>
    }
)