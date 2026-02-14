import prisma from "@/lib/db";
import { inngest } from "./client";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export const executeAi = inngest.createFunction(
  { id: "execute-ai" },
  { event: "execute/ai" },
  async ({ event,step }) => {
         await step.sleep("pretend","5s")
    const airesponse = await step.run("groq-generate-text", async () => {
      return await groq.chat.completions.create({
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

    console.log(text);

    return text;
  }
);

