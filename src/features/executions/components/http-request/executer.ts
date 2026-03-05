import type { NodeExecuter } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import ky,{type Options as kyOptions} from "ky"

type httpRequestData = {
   variableName?:string
   endpoint?:string,
   method?:"GET" | "POST" | "PUT" | "DELETE" | "PATCH",
   body?:string
}
export const httpRequestExecuter:NodeExecuter<httpRequestData> = async ({data,context,step,nodeId})=>{
    
   if(!data.endpoint){
      throw new NonRetriableError("endpoint is missing for http request node")
   }

   if(!data.variableName){
      throw new NonRetriableError("variable name not configured ")
   }

  const result =  await step.run("http-request",async ()=>{
   const endpoint = data.endpoint! 
   const method = data.method || "GET"

   const options:kyOptions = {method}

   if(["POST","PUT","PATCH"].includes(method) && data.body){
      if(data.body){
         options.body = data.body
         options.headers = {"Content-Type":"application/json"
         }
      }
   }

   const response = await ky(endpoint,options)
   const contentType = response.headers.get("content-type")
   const responseData = contentType?.includes("application/json") ? await response.json() : await response.text()

   const responsePayload = {
      httpResponse:{
      status:response.status,
      statusText:response.statusText,
      data:responseData
   }
   }

   return {
      ...context,
      [data.variableName!]:responsePayload
}
  })
    
   

     return result
}