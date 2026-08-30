export type InsightType =
  | "spending_alert"
  | "category_surge"
  | "saving_opportunity"
  | "recurring_commitment"
  | "pocket_milestone"
  | "lifestyle_breakdown";

export type InsightSeverity = "critical" | "warning" | "positive" | "info";

export interface ConcreteInsight {
  id: string;
  type: InsightType;
  severity: InsightSeverity;
  title: string;
  message: string;
  category?: string;
  amount_bdt?: number;
  secondary_amount_bdt?: number;
  percentage?: number;
}
