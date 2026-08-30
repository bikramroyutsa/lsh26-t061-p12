import { ExpenseCategory } from "@/types/expense";

export interface ParsedExpenseInput {
  raw: string;
  category: ExpenseCategory | string;
  shop: string;
  amount_bdt: number;
  isValid: boolean;
  notes?: string;
}

import { ShorthandCommand } from "@/types/expense";

/**
 * Parses shorthand strings like:
 * - "lun 500" -> Category: Food, Shop: Lunch, Amount: 500
 * - "lunch 450" -> Category: Food, Shop: Lunch, Amount: 450
 * - "agora 1250" -> Category: Groceries, Shop: Agora Superstore, Amount: 1250
 * - "uber dhanmondi 320" -> Category: Transport, Shop: Uber (Dhanmondi), Amount: 320
 * - "rickshaw 60" -> Category: Transport, Shop: Rickshaw, Amount: 60
 * - "desco 3200" -> Category: Utilities, Shop: DESCO Electricity, Amount: 3200
 * - "500 coffee" -> Amount: 500, Category: Food, Shop: Coffee Shop
 */
export function parseShorthandExpense(input: string, customShorthands: ShorthandCommand[]): ParsedExpenseInput {
  const trimmed = input.trim();
  if (!trimmed) {
    return {
      raw: input,
      category: "Other",
      shop: "",
      amount_bdt: 0,
      isValid: false,
    };
  }

  const tokens = trimmed.split(/\s+/);
  let amount = 0;
  let remainingTokens: string[] = [];

  // Find the numeric token (supports 500, 500.50, 500bdt, tk500, ৳500)
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    // Remove tk, bdt, ৳, commas
    const cleanToken = token.replace(/(tk|bdt|৳|,|\/)/gi, "");
    const num = parseFloat(cleanToken);

    if (!isNaN(num) && num > 0 && amount === 0 && /^[\d.]+$/.test(cleanToken)) {
      amount = num;
    } else {
      remainingTokens.push(token);
    }
  }

  if (amount <= 0) {
    return {
      raw: input,
      category: "Other",
      shop: remainingTokens.join(" ") || "Expense",
      amount_bdt: 0,
      isValid: false,
    };
  }

  // Determine category and shop from remaining tokens
  let detectedCategory: ExpenseCategory = "Other";
  let detectedShop = "";
  const queryStr = remainingTokens.join(" ").toLowerCase();

  // Try matching direct keywords from longest to shortest
  for (const token of remainingTokens) {
    const lowerToken = token.toLowerCase();
    const match = customShorthands.find((sh) => sh.keyword.toLowerCase() === lowerToken);
    if (match) {
      detectedCategory = match.category as ExpenseCategory;
      detectedShop = match.shop;
      break;
    }
  }

  // If not found, check if any keyword is a prefix
  if (detectedCategory === "Other") {
    for (const sh of customShorthands) {
      const kw = sh.keyword.toLowerCase();
      if (queryStr.includes(kw) || kw.startsWith(queryStr)) {
        detectedCategory = sh.category as ExpenseCategory;
        detectedShop = sh.shop;
        break;
      }
    }
  }

  // Custom shop name if user typed multiple words e.g. "dinner takeouts 700"
  let finalShop = detectedShop;
  if (remainingTokens.length > 0) {
    const customDesc = remainingTokens
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
    if (customDesc.length > 0) {
      finalShop = customDesc;
    }
  }

  if (!finalShop) {
    finalShop = detectedCategory !== "Other" ? detectedCategory : "Quick Expense";
  }

  return {
    raw: input,
    category: detectedCategory,
    shop: finalShop,
    amount_bdt: amount,
    isValid: true,
  };
}
