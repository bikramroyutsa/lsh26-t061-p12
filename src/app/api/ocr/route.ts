/**
 * POST /api/ocr
 *
 * Accepts a multipart/form-data request with an "image" file field.
 * Tries each Gemini API key in sequence; moves on if one fails.
 * Returns a JSON object with the extracted receipt fields.
 */

import { NextRequest, NextResponse } from "next/server";

// Parse the comma-separated keys from the environment variable.
// Keys are trimmed so extra whitespace in .env.local is safe.
function getApiKeys(): string[] {
  const raw = process.env.GEMINI_API_KEYS ?? "";
  return raw
    .split(",")
    .map((k) => k.trim())
    .filter(Boolean);
}

const MODEL = "gemini-3.1-flash-lite";

const PROMPT = `You are an OCR assistant for a personal expense ledger app used in Bangladesh.
Analyse this receipt / bill / memo image and extract the following fields in JSON:

{
  "amount": "<total amount as a numeric string, e.g. \"1250.00\", or \"\" if not clearly visible>",
  "date": "<date in YYYY-MM-DD format, or \"\" if not clearly visible>",
  "shop": "<merchant or shop name, or \"\" if not clearly visible>",
  "category": "<one of: Groceries, Food, Rent, Utilities, Transport, Education, Health, Mobile, Shopping, Entertainment, Other>",
  "amountUncertain": <true if amount was unclear or missing, false otherwise>,
  "dateUncertain": <true if date was unclear or estimated, false otherwise>,
  "shopUncertain": <true if shop name was unclear or missing, false otherwise>,
  "warnings": ["<any uncertainty warning messages>"]
}

Rules:
- Amount is in BDT (Bangladeshi Taka). Strip currency symbols, keep the number.
- If the total amount cannot be read with high confidence, set amount to "" and amountUncertain to true.
- Respond ONLY with the raw JSON object, no markdown fences.`;

interface GeminiOCRResponse {
  amount: string;
  date: string;
  shop: string;
  category: string;
  amountUncertain: boolean;
  dateUncertain: boolean;
  shopUncertain: boolean;
  warnings: string[];
}

async function callGemini(
  apiKey: string,
  base64Image: string,
  mimeType: string
): Promise<GeminiOCRResponse> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${apiKey}`;

  const body = {
    contents: [
      {
        parts: [
          {
            inline_data: {
              mime_type: mimeType,
              data: base64Image,
            },
          },
          { text: PROMPT },
        ],
      },
    ],
    generationConfig: {
      temperature: 0.1,
      maxOutputTokens: 512,
    },
  };

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Gemini API error ${res.status}: ${errText}`);
  }

  const json = await res.json();
  const text: string =
    json?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

  // Strip any accidental markdown fences
  const clean = text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```\s*$/, "").trim();
  const parsed = JSON.parse(clean) as GeminiOCRResponse;
  return parsed;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const formData = await request.formData();
    const imageFile = formData.get("image");

    if (!imageFile || !(imageFile instanceof Blob)) {
      return NextResponse.json(
        { error: "No image file provided" },
        { status: 400 }
      );
    }

    const mimeType = imageFile.type || "image/jpeg";
    const arrayBuffer = await imageFile.arrayBuffer();
    const base64Image = Buffer.from(arrayBuffer).toString("base64");

    const apiKeys = getApiKeys();
    if (apiKeys.length === 0) {
      return NextResponse.json(
        { error: "No Gemini API keys configured" },
        { status: 500 }
      );
    }

    let lastError: Error | null = null;

    // Try each key in order; fall through to next on failure
    for (let i = 0; i < apiKeys.length; i++) {
      try {
        const result = await callGemini(apiKeys[i], base64Image, mimeType);
        return NextResponse.json({ ok: true, keyIndex: i, ...result });
      } catch (err) {
        lastError = err instanceof Error ? err : new Error(String(err));
        console.warn(`OCR key[${i}] failed: ${lastError.message}`);
        // Continue to next key
      }
    }

    // All keys exhausted
    return NextResponse.json(
      {
        error: "All Gemini API keys failed",
        detail: lastError?.message ?? "Unknown error",
      },
      { status: 502 }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unexpected error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
