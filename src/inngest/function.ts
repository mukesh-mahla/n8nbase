import prisma from "@/lib/db";
import { inngest } from "./client";
import Groq from "groq-sdk";
import * as Sentry from "@sentry/nextjs"
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});
 const client = Sentry.instrumentGoogleGenAIClient(groq, {
  recordInputs: true,
  recordOutputs: true,
});

export const executeAi = inngest.createFunction(
  { id: "execute-ai" },
  { event: "execute/ai" },

 
  async ({ event,step }) => {
         await step.sleep("pretend","5s")
    const airesponse = await step.run("groq-generate-text", async () => {
      return await client.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "user",
            content: "What is n8n?",
          },
            
        ],
      
      });
    });

    const text = airesponse.choices[0].message.content;

    return text;
  }
);

