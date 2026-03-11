import { NodeType } from "@prisma/client";
import { NodeExecuter } from "../types";
import { manualTriggerExecuter } from "@/features/triggers/components/manual-trigger/executer";
import { httpRequestExecuter } from "../components/http-request/executer";
import { googleFormTriggerExecuter } from "@/features/triggers/components/google-form-trigger/executer";
import { GeminiExecuter } from "../components/gemini/executer";


export const execuerRegistry: Record<NodeType,NodeExecuter<any>> = {
[NodeType.MANUAL_TRIGGER]:manualTriggerExecuter,
[NodeType.INITIAL]:manualTriggerExecuter,
[NodeType.HTTP_REQUEST]:httpRequestExecuter,
[NodeType.GOOGLE_FORM_TRIGGER]:googleFormTriggerExecuter ,
[NodeType.STRIPE_TRIGGER]:googleFormTriggerExecuter,// to be changed when we have stripe trigger executer
[NodeType.GEMINI]:GeminiExecuter ,
[NodeType.ANTHROPIC]:GeminiExecuter,
[NodeType.OPENAI]:GeminiExecuter
}

export const getExecuter = (type: NodeType):NodeExecuter =>{
   
const executer = execuerRegistry[type]
if(!executer){
    throw new Error(`No executer found for node type ${type}`)
   }
   return executer

} 

