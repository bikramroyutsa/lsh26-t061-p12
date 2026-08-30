export interface SavingsPocket {
  id: string;
  name: string;
  item: string;
  target_bdt: number;
  monthly_contribution_bdt: number;
  current_balance_bdt?: number;
  completion_date?: string; // YYYY-MM-DD or Month YYYY
  months_to_complete?: number;
  dps_projected_return_bdt?: number;
}

export interface RawSavingsPocket {
  id: string;
  name: string;
  item: string;
  target_bdt: string | number;
  monthly_contribution_bdt: string | number;
}

export interface DPSRule {
  annual_rate_percent: number;
  rule_description: string;
}

export interface DPSMonthlyRecord {
  month: number;
  deposit_bdt: number;
  balance_before_interest_bdt: number;
  interest_earned_bdt: number;
  closing_balance_bdt: number;
}

export interface DPSCalculationResult {
  annual_rate_percent: number;
  monthly_deposit_bdt: number;
  duration_months: number;
  total_principal_bdt: number;
  total_interest_earned_bdt: number;
  maturity_amount_bdt: number;
  schedule: DPSMonthlyRecord[];
}
