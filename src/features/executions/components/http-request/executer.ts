import type { NodeExecuter } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import ky,{type Options as kyOptions} from "ky"
import Handlebars from "handlebars"

 Handlebars.registerHelper("json",(context)=>{
   const jsonstringfy = JSON.stringify(context,null,2)
   const safeString = new Handlebars.SafeString(jsonstringfy)
   return safeString
})

type httpRequestData = {
   variableName:string
   endpoint:string,
   method:"GET" | "POST" | "PUT" | "DELETE" | "PATCH",
   body?:string
}
export const httpRequestExecuter:NodeExecuter<httpRequestData> = async ({data,context,step,nodeId})=>{
    
   if(!data.endpoint){
      throw new NonRetriableError("endpoint is missing for http request node")
   }

   if(!data.variableName){
      throw new NonRetriableError("variable name not configured ")
   }
   
   if(!data.variableName){
      throw new NonRetriableError("method not configured not configured ")
   }

  const result =  await step.run("http-request",async ()=>{
   const endpoint = Handlebars.compile(data.endpoint)(context)
   const method = data.method 

   const options:kyOptions = {method}

   if(["POST","PUT","PATCH"].includes(method) && data.body){
      const resolved = Handlebars.compile(data.body || "{}")(context)
      JSON.parse(resolved)
     
         options.body = resolved
         options.headers = {"Content-Type":"application/json"
         
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
      [data.variableName]:responsePayload
}
  })
    
   

     return result
}