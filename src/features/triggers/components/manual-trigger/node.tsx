import { NodeProps } from "@xyflow/react";
import { BaseTriggerNode } from "../base-trigger-node";
import { MousePointerIcon } from "lucide-react";
import { memo, useState } from "react";
import { ManualTriggerDialog } from "./dialog";
import { useNodeStatus } from "@/features/executions/hooks/use-node-status";
import { fetchManualTriggerRealtimeToken } from "./actions";
export const ManualTriggerNode = memo(
    (props:NodeProps)=>{
        const [dialogOpen,setDialogOpen] = useState(false)

        const NodeStatus = useNodeStatus({
                nodeId:props.id,
                channel:"Manual-Trigger-Execution",
                topic:"status",
                refreshToken:fetchManualTriggerRealtimeToken
            })

        const handelOpenSettings = ()=>setDialogOpen(true)

   return <>
       <ManualTriggerDialog open={dialogOpen} onOpenChange={setDialogOpen}/>
       <BaseTriggerNode 
       {...props}
       icon={MousePointerIcon}
        name="when clicking 'execute workflow'"
      status = {NodeStatus}
    onSetting={handelOpenSettings}
    onDoubelClick = {handelOpenSettings}
  >
       </BaseTriggerNode>
   </>
    }
)