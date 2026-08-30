export interface ForecastResult {
  today_date: string; // YYYY-MM-DD
  active_month: string; // YYYY-MM
  elapsed_days: number;
  total_days_in_month: number;
  remaining_days: number;
  current_spent_bdt: number;
  daily_burn_rate_bdt: number;
  projected_remaining_spend_bdt: number;
  total_projected_spend_bdt: number;
  salary_bdt: number;
  projected_net_savings_bdt: number;
  is_deficit: boolean;
  budget_utilization_projected_percent: number;
}
