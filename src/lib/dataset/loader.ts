import rawData from "../../../P12_personal_ledger_public.json";
import { CompetitionCase, PublicDataset } from "@/types/dataset";
import { Expense } from "@/types/expense";
import { SavingsPocket } from "@/types/pocket";

export const dataset = rawData as unknown as PublicDataset;

export function getAllCases(): CompetitionCase[] {
  return dataset.cases || [];
}

export function getCaseById(caseId: string): CompetitionCase | undefined {
  return (dataset.cases || []).find((c) => c.case_id === caseId);
}

/**
 * Converts a raw competition case into typed runtime models with numerical values
 */
export function parseCaseData(compCase: CompetitionCase): {
  salary: number;
  expenses: Expense[];
  pockets: SavingsPocket[];
  today: string;
  months: { last: string; this: string };
  dpsRate: number;
  dpsRule: string;
} {
  const salary = parseFloat(compCase.salary_bdt) || 0;
  const dpsRate = parseFloat(compCase.dps_annual_rate_percent || "8.0") || 8.0;
  const dpsRule = compCase.dps_rule || "Annual rate as stated. Compounded monthly.";

  const expenses: Expense[] = (compCase.expenses || []).map((e) => ({
    id: e.id,
    date: e.date,
    category: e.category,
    shop: e.shop,
    amount_bdt: typeof e.amount_bdt === "string" ? parseFloat(e.amount_bdt) : e.amount_bdt,
  }));

  const pockets: SavingsPocket[] = (compCase.pockets || []).map((p) => ({
    id: p.id,
    name: p.name,
    item: p.item,
    target_bdt: typeof p.target_bdt === "string" ? parseFloat(p.target_bdt) : p.target_bdt,
    monthly_contribution_bdt:
      typeof p.monthly_contribution_bdt === "string"
        ? parseFloat(p.monthly_contribution_bdt)
        : p.monthly_contribution_bdt,
    current_balance_bdt: 0,
  }));

  return {
    salary,
    expenses,
    pockets,
    today: compCase.today,
    months: compCase.months,
    dpsRate,
    dpsRule,
  };
}
