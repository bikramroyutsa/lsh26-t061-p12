export type ExpenseCategory =
  | "Rent"
  | "Groceries"
  | "Food"
  | "Utilities"
  | "Transport"
  | "Education"
  | "Health"
  | "Mobile"
  | "Shopping"
  | "Entertainment"
  | "Other";

export interface Expense {
  id: string;
  date: string; // YYYY-MM-DD
  category: ExpenseCategory | string;
  shop: string;
  amount_bdt: number;
  isRecurring?: boolean;
  isUncertain?: boolean;
  notes?: string;
}

export interface RawExpense {
  id: string;
  date: string;
  category: string;
  shop: string;
  amount_bdt: string | number;
}

export interface CategoryBreakdownItem {
  category: string;
  total_bdt: number;
  percentage: number;
  count: number;
  last_month_total_bdt?: number;
  delta_bdt?: number;
  delta_percentage?: number;
}

export interface MonthlySpendingSummary {
  month: string; // YYYY-MM
  total_spent_bdt: number;
  salary_bdt: number;
  net_balance_bdt: number;
  expense_count: number;
  category_breakdown: CategoryBreakdownItem[];
  largest_expenses: Expense[];
}

export interface MoMComparison {
  last_month: string;
  this_month: string;
  last_month_spent_bdt: number;
  this_month_spent_bdt: number;
  delta_bdt: number;
  delta_percentage: number;
  category_changes: {
    category: string;
    last_bdt: number;
    this_bdt: number;
    delta_bdt: number;
    delta_percentage: number;
  }[];
}
