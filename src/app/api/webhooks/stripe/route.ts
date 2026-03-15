import { sendExecutions } from "@/inngest/utils";

import { type NextRequest, NextResponse } from "next/server";



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

     const stripeData = {
      eventId: body.id,
      eventType: body.type,
      timestamp: body.created,
      livemode: body.livemode,
      raw:body.data?.object
     }

     await sendExecutions({
        workflowId,
       initialData:{
        stripe: stripeData
       }
     })

      return NextResponse.json({success:true,workflowId:workflowId},{status:200})



  } catch (err) {
    console.error("Stripe webhook error", err);

    return NextResponse.json({
      error: "An error occurred while processing the stripe webhook",
      success: false
    },
{
        status: 500,
});

  }
}
