import { ExpenseCategory } from "@/types/expense";

export interface ParsedExpenseInput {
  raw: string;
  category: ExpenseCategory | string;
  shop: string;
  amount_bdt: number;
  isValid: boolean;
  notes?: string;
}

// Category keyword matching rules (including common abbreviations like 'lun' for lunch, 'gro' for groceries, App-specific words)
const CATEGORY_KEYWORDS: Record<string, { category: ExpenseCategory; defaultShop: string }> = {
  // Food & Dining
  lun: { category: "Food", defaultShop: "Lunch" },
  lunch: { category: "Food", defaultShop: "Lunch" },
  din: { category: "Food", defaultShop: "Dinner" },
  dinner: { category: "Food", defaultShop: "Dinner" },
  bf: { category: "Food", defaultShop: "Breakfast" },
  breakfast: { category: "Food", defaultShop: "Breakfast" },
  cha: { category: "Food", defaultShop: "Tong Tea" },
  tea: { category: "Food", defaultShop: "Tea Stall" },
  coffee: { category: "Food", defaultShop: "Coffee Shop" },
  snack: { category: "Food", defaultShop: "Snacks" },
  snacks: { category: "Food", defaultShop: "Snacks" },
  food: { category: "Food", defaultShop: "Restaurant" },
  burger: { category: "Food", defaultShop: "Takeout" },
  biryani: { category: "Food", defaultShop: "Biryani House" },
  kacchi: { category: "Food", defaultShop: "Sultan's Dine" },
  restaurant: { category: "Food", defaultShop: "Restaurant" },

  // Groceries & Market
  gro: { category: "Groceries", defaultShop: "Local Grocery" },
  groc: { category: "Groceries", defaultShop: "Local Grocery" },
  grocery: { category: "Groceries", defaultShop: "Local Grocery" },
  groceries: { category: "Groceries", defaultShop: "Local Grocery" },
  bazaar: { category: "Groceries", defaultShop: "Kacha Bazaar" },
  bazar: { category: "Groceries", defaultShop: "Kacha Bazaar" },
  agora: { category: "Groceries", defaultShop: "Agora Superstore" },
  meena: { category: "Groceries", defaultShop: "Meena Bazar" },
  shwapno: { category: "Groceries", defaultShop: "Shwapno Superstore" },
  unimart: { category: "Groceries", defaultShop: "Unimart" },
  vegetables: { category: "Groceries", defaultShop: "Vegetable Market" },
  fish: { category: "Groceries", defaultShop: "Fish Market" },
  meat: { category: "Groceries", defaultShop: "Meat Shop" },
  rice: { category: "Groceries", defaultShop: "Rice Merchant" },

  // Transport & Commute
  ub: { category: "Transport", defaultShop: "Uber" },
  uber: { category: "Transport", defaultShop: "Uber" },
  pathao: { category: "Transport", defaultShop: "Pathao" },
  cng: { category: "Transport", defaultShop: "CNG Auto" },
  rick: { category: "Transport", defaultShop: "Rickshaw" },
  rickshaw: { category: "Transport", defaultShop: "Rickshaw" },
  bus: { category: "Transport", defaultShop: "Local Bus" },
  metro: { category: "Transport", defaultShop: "Metro Rail" },
  train: { category: "Transport", defaultShop: "Railway" },
  fuel: { category: "Transport", defaultShop: "Petrol Pump" },
  petrol: { category: "Transport", defaultShop: "Filling Station" },
  octane: { category: "Transport", defaultShop: "Filling Station" },
  transport: { category: "Transport", defaultShop: "Transport" },

  // Utilities & Housing
  rent: { category: "Rent", defaultShop: "House Rent / Landlord" },
  house: { category: "Rent", defaultShop: "House Rent" },
  desco: { category: "Utilities", defaultShop: "DESCO Electricity" },
  dpdc: { category: "Utilities", defaultShop: "DPDC Electricity" },
  wasa: { category: "Utilities", defaultShop: "WASA" },
  gas: { category: "Utilities", defaultShop: "Titas Gas" },
  electric: { category: "Utilities", defaultShop: "Electricity Bill" },
  electricity: { category: "Utilities", defaultShop: "Electricity Bill" },
  util: { category: "Utilities", defaultShop: "Utility Bill" },
  utility: { category: "Utilities", defaultShop: "Utility Bill" },
  utilities: { category: "Utilities", defaultShop: "Utility Bill" },
  wifi: { category: "Utilities", defaultShop: "Broadband Internet" },
  internet: { category: "Utilities", defaultShop: "Internet Bill" },
  maid: { category: "Utilities", defaultShop: "House Help / Maid" },

  // Mobile & Recharges
  mob: { category: "Mobile", defaultShop: "Mobile Recharge" },
  mobile: { category: "Mobile", defaultShop: "Mobile Recharge" },
  recharge: { category: "Mobile", defaultShop: "Mobile Flexiload" },
  gp: { category: "Mobile", defaultShop: "Grameenphone" },
  robi: { category: "Mobile", defaultShop: "Robi Axiata" },
  bl: { category: "Mobile", defaultShop: "Banglalink" },
  airtel: { category: "Mobile", defaultShop: "Airtel" },
  teletalk: { category: "Mobile", defaultShop: "Teletalk" },

  // Health & Medicine
  med: { category: "Health", defaultShop: "Pharmacy" },
  medicine: { category: "Health", defaultShop: "Pharmacy" },
  pharma: { category: "Health", defaultShop: "Lazz Pharma" },
  doctor: { category: "Health", defaultShop: "Doctor Consultation" },
  doc: { category: "Health", defaultShop: "Doctor Consultation" },
  hospital: { category: "Health", defaultShop: "Hospital" },
  health: { category: "Health", defaultShop: "Healthcare" },

  // Education
  edu: { category: "Education", defaultShop: "Tuition / School" },
  school: { category: "Education", defaultShop: "School Fee" },
  college: { category: "Education", defaultShop: "College Fee" },
  uni: { category: "Education", defaultShop: "University Tuition" },
  tuition: { category: "Education", defaultShop: "Private Tutor" },
  book: { category: "Education", defaultShop: "Nilkhet Book Market" },
  books: { category: "Education", defaultShop: "Bookstore" },

  // Shopping & Lifestyle
  shop: { category: "Shopping", defaultShop: "Shopping" },
  shopping: { category: "Shopping", defaultShop: "Shopping Mall" },
  aarong: { category: "Shopping", defaultShop: "Aarong" },
  cloth: { category: "Shopping", defaultShop: "Clothing Store" },
  clothes: { category: "Shopping", defaultShop: "Clothing Store" },
  daraz: { category: "Shopping", defaultShop: "Daraz Online" },

  // Entertainment
  movie: { category: "Entertainment", defaultShop: "Star Cineplex" },
  cinema: { category: "Entertainment", defaultShop: "Cinema Hall" },
  game: { category: "Entertainment", defaultShop: "Gaming / Leisure" },
  netflix: { category: "Entertainment", defaultShop: "Netflix Subscription" },
  spotify: { category: "Entertainment", defaultShop: "Spotify Subscription" },
};

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
export function parseShorthandExpense(input: string): ParsedExpenseInput {
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
    if (CATEGORY_KEYWORDS[lowerToken]) {
      detectedCategory = CATEGORY_KEYWORDS[lowerToken].category;
      detectedShop = CATEGORY_KEYWORDS[lowerToken].defaultShop;
      break;
    }
  }

  // If not found, check if any keyword is a prefix (e.g., 'lun' matches 'lunch', 'gro' matches 'groceries')
  if (detectedCategory === "Other") {
    for (const [kw, config] of Object.entries(CATEGORY_KEYWORDS)) {
      if (queryStr.includes(kw) || kw.startsWith(queryStr)) {
        detectedCategory = config.category;
        detectedShop = config.defaultShop;
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
