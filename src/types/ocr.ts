export interface OCRFieldConfidence {
  value: string;
  confidence: number; // 0 to 1
  isUncertain: boolean;
}

export interface OCRExtractionResult {
  amount: OCRFieldConfidence;
  date: OCRFieldConfidence;
  shop: OCRFieldConfidence;
  category: OCRFieldConfidence;
  rawText?: string;
  receiptType?: "bkash" | "superstore" | "utility" | "restaurant" | "pharmacy" | "general";
  warnings: string[];
}
