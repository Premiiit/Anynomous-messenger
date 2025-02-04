import { GoogleGenerativeAI } from "@google/generative-ai";
import { streamText } from "ai";

// Allow streaming responses up to 30 seconds
export const maxDuration: number = 30;
export const runtime = 'edge';

const apiKey: string = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function POST(req: Request): Promise<Response> {
  try {
    const prompt = "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interactions. For example, your output should be structured like this: 'What's a hobby you've recently started?||If you could have a dinner with any historical figure, who would it be?||What's a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity and contribute to a positive and welcoming conversational environment.";

    const result = await model.generateContentStream({
      contents: [{ role: "user", parts: [{ text: prompt }] }]
    });

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of result.stream) {
            // ✅ Call the chunk.text function to get the string value
            const text = chunk.text(); 
            if (text) {
              controller.enqueue(encoder.encode(text));
            }
          }
          controller.close();
        } catch (err) {
          controller.error(err);
        }
      },
    });

    return new Response(stream, {
      headers: { "Content-Type": "text/plain" }
    });

  } catch (error) {
    console.error("Error generating response:", error);
    return new Response(JSON.stringify({ error: "Failed to generate response" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}