import { OCRExtractionResult } from "@/types/ocr";

// Known merchants and their typical categories
const LOCAL_SHOPS: Record<string, string> = {
  "meena bazar": "Groceries",
  "agora": "Groceries",
  "shwapno": "Groceries",
  "unimart": "Groceries",
  "aarong": "Shopping",
  "desco": "Utilities",
  "dpdc": "Utilities",
  "wasa": "Utilities",
  "titas gas": "Utilities",
  "landlord": "Rent",
  "lazz pharma": "Health",
  "popular diagnostic": "Health",
  "square hospital": "Health",
  "gp recharge": "Mobile",
  "robi recharge": "Mobile",
  "banglalink recharge": "Mobile",
  "airtel recharge": "Mobile",
  "uber": "Transport",
  "pathao": "Transport",
  "cng meter": "Transport",
  "madchef": "Food",
  "panda garden": "Food",
  "takeout": "Food",
  "kfc": "Food",
  "sultan's dine": "Food",
  "kacchi bhai": "Food",
  "udemy": "Education",
  "coursera": "Education",
  "bookworm": "Education",
  "star cineplex": "Entertainment",
};

/**
 * Intelligent parser for simulated or extracted receipt text from bills and memos.
 * Adheres strictly to the constraint:
 * "If the receipt reading is unsure about a field, show that clearly and let the user fix it. Never fill in an amount the app is not sure about."
 */
export function parseReceiptText(rawText: string): OCRExtractionResult {
  const warnings: string[] = [];
  const textLower = rawText.toLowerCase();

  // 1. EXTRACT SHOP / MERCHANT
  let detectedShop = "";
  let shopConfidence = 0.5;

  for (const [shopName, _cat] of Object.entries(LOCAL_SHOPS)) {
    if (textLower.includes(shopName)) {
      // Capitalize proper name
      detectedShop = shopName
        .split(" ")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
      shopConfidence = 0.95;
      break;
    }
  }

  // Fallback: look for common shop label prefixes
  if (!detectedShop) {
    const shopMatch = rawText.match(/(?:merchant|shop|store|vendor|billed to|pay to|company):\s*([^\n\r]+)/i);
    if (shopMatch && shopMatch[1].trim()) {
      detectedShop = shopMatch[1].trim();
      shopConfidence = 0.75;
    } else {
      detectedShop = "";
      shopConfidence = 0.3;
      warnings.push("Shop name could not be reliably detected.");
    }
  }

  // 2. EXTRACT DATE
  let detectedDate = "";
  let dateConfidence = 0.5;

  // Patterns for YYYY-MM-DD or DD-MM-YYYY or DD/MM/YYYY
  const isoDateMatch = rawText.match(/\b(202[0-9]-[01][0-9]-[0-3][0-9])\b/);
  const slashDateMatch = rawText.match(/\b([0-3]?[0-9])[/-]([0-1]?[0-9])[/-](202[0-9])\b/);

  if (isoDateMatch) {
    detectedDate = isoDateMatch[1];
    dateConfidence = 0.95;
  } else if (slashDateMatch) {
    const d = slashDateMatch[1].padStart(2, "0");
    const m = slashDateMatch[2].padStart(2, "0");
    const y = slashDateMatch[3];
    detectedDate = `${y}-${m}-${d}`;
    dateConfidence = 0.85;
  } else {
    // Default to today if unreadable, but flag as uncertain
    const now = new Date();
    detectedDate = now.toISOString().split("T")[0];
    dateConfidence = 0.4;
    warnings.push("Date format was ambiguous; please verify the date.");
  }

  // 3. EXTRACT AMOUNT
  let detectedAmount = "";
  let amountConfidence = 0.5;

  // Search for explicit total amount patterns (e.g. "Total: 1,500.00", "BDT 2475", "৳ 856.50", "Amount: 1477")
  const explicitAmountMatch = rawText.match(
    /(?:total|amount|grand total|net amount|bdt|tk|৳)\s*[:=]?\s*([0-9]+(?:,[0-9]{3})*(?:\.[0-9]{1,2})?)/i
  );

  const numericCandidates = rawText.match(/\b[0-9]+(?:\.[0-9]{1,2})?\b/g);

  if (explicitAmountMatch) {
    detectedAmount = explicitAmountMatch[1].replace(/,/g, "");
    amountConfidence = 0.92;
  } else if (numericCandidates && numericCandidates.length === 1) {
    // Only one standalone number found
    detectedAmount = numericCandidates[0];
    amountConfidence = 0.7;
  } else {
    // Ambiguous multiple numbers or no clear total
    // CRITICAL CONSTRAINT: Never fill in an amount the app is not sure about!
    detectedAmount = "";
    amountConfidence = 0.3;
    warnings.push("Amount could not be verified with high confidence. Please enter manually.");
  }

  // 4. INFER CATEGORY
  let detectedCategory = "Other";
  let catConfidence = 0.6;

  if (detectedShop) {
    const shopLower = detectedShop.toLowerCase();
    if (LOCAL_SHOPS[shopLower]) {
      detectedCategory = LOCAL_SHOPS[shopLower];
      catConfidence = 0.95;
    }
  }

  const isAmountUncertain = amountConfidence < 0.85;
  const isShopUncertain = shopConfidence < 0.85;
  const isDateUncertain = dateConfidence < 0.85;

  return {
    amount: {
      value: isAmountUncertain ? "" : detectedAmount,
      confidence: amountConfidence,
      isUncertain: isAmountUncertain,
    },
    date: {
      value: detectedDate,
      confidence: dateConfidence,
      isUncertain: isDateUncertain,
    },
    shop: {
      value: detectedShop,
      confidence: shopConfidence,
      isUncertain: isShopUncertain,
    },
    category: {
      value: detectedCategory,
      confidence: catConfidence,
      isUncertain: catConfidence < 0.8,
    },
    rawText,
    warnings,
  };
}

/**
 * Sample pre-packaged mock receipt data for instant testing
 */
export const SAMPLE_RECEIPTS = [
  {
    name: "Meena Bazar Grocery Memo",
    preview: "MEENA BAZAR (Dhanmondi Branch)\nDate: 2026-04-12\nItems: Miniket Rice 5kg, Teer Soyabean Oil 2L, Eggs 1 Dozen\nTotal: 2475.00 BDT\nThank you for shopping with us!",
  },
  {
    name: "DESCO Electricity Bill",
    preview: "LOCAL ELECTRIC SUPPLY COMPANY (DESCO)\nBill Month: 2026-04\nIssue Date: 2026-04-05\nAccount: 10492841\nTotal Payable Amount: 856.50 BDT",
  },
  {
    name: "bKash GP Mobile Recharge",
    preview: "bKash Payment Successful\nTo: GP recharge\nTrxID: 9M48XLP12\nDate: 2026-04-10\nAmount: 422.00 Tk",
  },
  {
    name: "Unclear / Blurred Cash Memo (Ambiguous)",
    preview: "Cash Receipt\nItem A: 120\nItem B: 340\nService Fee: 50\nSubtotal: ??? (Smudged)",
  },
];
