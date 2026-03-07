import { sendExecutions } from "@/inngest/utils";
import { time } from "console";
import { type NextRequest, NextResponse } from "next/server";
import { send } from "process";
import { success } from "zod";


export async function POST(request: NextRequest) {
  try {
     const url = new URL(request.url);
     const workflowId = url.searchParams.get("workflowId");
     

     if (!workflowId) {
      return NextResponse.json({
        error: "Missing workflowId parameter",
        success: false
      },{
        status: 400,
      });
     }

     const body = await request.json();

     const formData = {
        formId: body.formId,
        formTitle: body.formTitle,
        responseId: body.responseId,
        timestamp: body.timestamp,
        respondentEmail: body.respondentEmail,
        responses: body.responses,
        raw: body
     }

     await sendExecutions({
        workflowId,
       initialData:{
        googleForm: formData
       }
     })

      return NextResponse.json({success:true,workflowId:workflowId},{status:200})



  } catch (err) {
    console.error("Google Form webhook error", err);

    return NextResponse.json({
      error: "An error occurred while processing the Google Form webhook",
      success: false
    },
{
        status: 500,
});

  }
}
