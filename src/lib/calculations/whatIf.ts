import { Expense } from "@/types/expense";
import { ForecastResult } from "@/types/forecast";
import { SavingsPocket } from "@/types/pocket";
import { PocketTimelineShift, WhatIfResult } from "@/types/whatIf";
import { calculatePocketCompletion } from "./forecast";
import { roundHalfUp } from "./dps";

/**
 * Simulates cutting a specific expense category by cutPercentage (0 to 100%).
 * Shows the immediate effect on monthly surplus and the completion dates of all active pockets.
 */
export function simulateCategoryCut(
  category: string,
  cutPercentage: number,
  expenses: Expense[],
  baseForecast: ForecastResult,
  pockets: SavingsPocket[]
): WhatIfResult {
  const activeMonth = baseForecast.active_month;

  // Calculate current month's spending in this category
  const categoryExpenses = expenses.filter(
    (e) => e.date.startsWith(activeMonth) && e.category.toLowerCase() === category.toLowerCase()
  );
  const categorySpent = categoryExpenses.reduce((sum, e) => sum + e.amount_bdt, 0);

  // Forecasted total for this category
  const elapsedDays = baseForecast.elapsed_days || 1;
  const totalDays = baseForecast.total_days_in_month || 30;
  const categoryDailyRate = categorySpent / elapsedDays;
  const categoryProjectedMonthlySpend = categoryDailyRate * totalDays;

  // Savings generated from cut
  const savedAmountBdt = roundHalfUp(
    categoryProjectedMonthlySpend * (cutPercentage / 100),
    2
  );

  const newProjectedSurplusBdt = roundHalfUp(
    baseForecast.projected_net_savings_bdt + savedAmountBdt,
    2
  );

  // New simulated forecast
  const simulatedForecast: ForecastResult = {
    ...baseForecast,
    projected_net_savings_bdt: newProjectedSurplusBdt,
    total_projected_spend_bdt: roundHalfUp(
      baseForecast.total_projected_spend_bdt - savedAmountBdt,
      2
    ),
    is_deficit: newProjectedSurplusBdt < 0,
  };

  const totalCommitment = pockets.reduce(
    (sum, p) => sum + p.monthly_contribution_bdt,
    0
  );

  const shifts: PocketTimelineShift[] = pockets.map((pocket) => {
    const original = calculatePocketCompletion(pocket, baseForecast, totalCommitment);
    const updated = calculatePocketCompletion(pocket, simulatedForecast, totalCommitment);

    const monthsSaved = Math.max(0, original.monthsToComplete - updated.monthsToComplete);

    return {
      pocket_id: pocket.id,
      pocket_name: pocket.name,
      item: pocket.item,
      target_bdt: pocket.target_bdt,
      original_completion_date: original.completionDate,
      new_completion_date: updated.completionDate,
      original_months: original.monthsToComplete,
      new_months: updated.monthsToComplete,
      months_saved: original.monthsToComplete === 999 ? 0 : monthsSaved,
    };
  });

  return {
    category,
    cut_percentage: cutPercentage,
    current_category_projected_bdt: roundHalfUp(categoryProjectedMonthlySpend, 2),
    saved_amount_bdt: savedAmountBdt,
    original_surplus_bdt: baseForecast.projected_net_savings_bdt,
    new_projected_surplus_bdt: newProjectedSurplusBdt,
    shifts,
  };
}
