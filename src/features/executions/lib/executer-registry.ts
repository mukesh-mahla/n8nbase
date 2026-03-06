import { NodeType } from "@prisma/client";
import { NodeExecuter } from "../types";
import { manualTriggerExecuter } from "@/features/triggers/components/manual-trigger/executer";
import { httpRequestExecuter } from "../components/http-request/executer";


export const execuerRegistry: Record<NodeType,NodeExecuter<any>> = {
[NodeType.MANUAL_TRIGGER]:manualTriggerExecuter,
[NodeType.INITIAL]:manualTriggerExecuter,
[NodeType.HTTP_REQUEST]:httpRequestExecuter 

}

export const getExecuter = (type: NodeType):NodeExecuter =>{
   
const executer = execuerRegistry[type]
if(!executer){
    throw new Error(`No executer found for node type ${type}`)
   }
   return executer

} 

