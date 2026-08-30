import { createGoogle } from "@ai-sdk/google";
import { generateText } from "ai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { contextData } = await req.json();

    const apiKey = (process.env.GEMINI_API_KEYS || process.env.GEMINI_API_KEY || "").split(",")[0].trim();
    
    if (!apiKey) {
      return NextResponse.json({ error: "Missing Gemini API Key" }, { status: 500 });
    }

    const prompt = `You are Ledgy, an expert financial advisor for a personal ledger app in Bangladesh.
Analyze the following financial state and provide exactly 3 deep, non-obvious insights and 1 short paragraph of overall encouragement.
Do not just repeat the numbers back. Find trends, warn about fast burn rates, or celebrate good saving habits.
Format your response in plain text with clear headings or bullet points. Avoid markdown tables.

User's Financial Data:
${JSON.stringify(contextData, null, 2)}`;

    const { text } = await generateText({
      model: createGoogle({ apiKey })("gemini-3.1-flash-lite"),
      prompt,
      temperature: 0.7,
    });

    return NextResponse.json({ insight: text });
  } catch (error) {
    console.error("Advisor API error:", error);
    return NextResponse.json({ error: "Failed to generate insights" }, { status: 500 });
  }
}
