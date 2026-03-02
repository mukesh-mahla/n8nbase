import { NodeProps } from "@xyflow/react";
import { BaseTriggerNode } from "../base-trigger-node";
import { MousePointerIcon } from "lucide-react";
import { memo } from "react";
export const ManualTriggerNode = memo(
    (props:NodeProps)=>{
   return <>
       <BaseTriggerNode 
       {...props}
       icon={MousePointerIcon}
        name="when clicking 'execute workflow'"
    //   status = {nodestatus}
    // onSetting={handelOpenSettings}
    // onDoubleClick = {handelclcik}
  >
       </BaseTriggerNode>
   </>
    }
)