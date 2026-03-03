import { NodeProps } from "@xyflow/react";
import { BaseTriggerNode } from "../base-trigger-node";
import { MousePointerIcon } from "lucide-react";
import { memo, useState } from "react";
import { ManualTriggerDialog } from "./dialog";
export const ManualTriggerNode = memo(
    (props:NodeProps)=>{
        const [dialogOpen,setDialogOpen] = useState(false)
        const nodestatus = "initial"
        const handelOpenSettings = ()=>setDialogOpen(true)

   return <>
       <ManualTriggerDialog open={dialogOpen} onOpenChange={setDialogOpen}/>
       <BaseTriggerNode 
       {...props}
       icon={MousePointerIcon}
        name="when clicking 'execute workflow'"
      status = {nodestatus}
    onSetting={handelOpenSettings}
    onDoubelClick = {handelOpenSettings}
  >
       </BaseTriggerNode>
   </>
    }
)