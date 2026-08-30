import { createGoogle } from "@ai-sdk/google";
import { streamText } from "ai";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { messages, contextData } = await req.json();

    // Use the first key from GEMINI_API_KEYS (or GEMINI_API_KEY if they set it)
    const apiKey = (process.env.GEMINI_API_KEYS || process.env.GEMINI_API_KEY || "").split(",")[0].trim();
    
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "Missing Gemini API Key" }), { status: 500 });
    }

    const systemPrompt = `You are Ledgy, an expert, empathetic, and highly analytical financial advisor for a personal ledger app in Bangladesh.
The user is asking you questions about their finances.
Always respond in a friendly, conversational tone. Do not use markdown tables unless explicitly asked.

Here is the user's current live financial state:
${JSON.stringify(contextData, null, 2)}

Base your advice STRICTLY on this data. Do not hallucinate numbers. If the data is empty, say you don't have enough data yet.
All amounts are in BDT (Bangladeshi Taka).`;

    const result = streamText({
      model: createGoogle({ apiKey })("gemini-3.1-flash-lite"),
      system: systemPrompt,
      messages,
      temperature: 0.5,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error("Chat API error:", error);
    return new Response(JSON.stringify({ error: "Failed to generate response" }), { status: 500 });
  }
}
