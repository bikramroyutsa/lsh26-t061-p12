import { Expense } from "@/types/expense";
import { ForecastResult } from "@/types/forecast";
import { SavingsPocket } from "@/types/pocket";
import { roundHalfUp } from "./dps";

/**
 * Gets total days in a month string 'YYYY-MM'
 */
export function getDaysInMonth(yearMonth: string): number {
  const [yearStr, monthStr] = yearMonth.split("-");
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10);
  // Day 0 of next month gives last day of current month
  return new Date(year, month, 0).getDate();
}

/**
 * Parses date string 'YYYY-MM-DD' to extract day number and year-month
 */
export function parseDateComponents(dateStr: string) {
  const parts = dateStr.split("-");
  const yearMonth = `${parts[0]}-${parts[1]}`;
  const day = parseInt(parts[2], 10);
  return { yearMonth, day, year: parseInt(parts[0], 10), month: parseInt(parts[1], 10) };
}

/**
 * Calculates current month spend and forecasts remaining month spending
 */
export function calculateForecast(
  expenses: Expense[],
  salaryBdt: number,
  todayDate: string,
  activeMonth?: string
): ForecastResult {
  const { yearMonth: todayYearMonth, day: todayDay } = parseDateComponents(todayDate);
  const monthToUse = activeMonth || todayYearMonth;
  const totalDays = getDaysInMonth(monthToUse);

  // If the active month matches today's month, elapsed days is today's day.
  // Otherwise, if looking at a past month, elapsed days = total days.
  const elapsedDays = monthToUse === todayYearMonth ? Math.min(todayDay, totalDays) : totalDays;
  const remainingDays = Math.max(0, totalDays - elapsedDays);

  // Sum expenses strictly for the active month up to today
  const currentSpent = expenses
    .filter((e) => e.date.startsWith(monthToUse))
    .reduce((sum, e) => sum + e.amount_bdt, 0);

  const dailyBurnRate = elapsedDays > 0 ? currentSpent / elapsedDays : 0;
  const projectedRemainingSpend = dailyBurnRate * remainingDays;
  const totalProjectedSpend = currentSpent + projectedRemainingSpend;
  const projectedNetSavings = salaryBdt - totalProjectedSpend;
  const isDeficit = projectedNetSavings < 0;

  const budgetUtilPercent =
    salaryBdt > 0 ? (totalProjectedSpend / salaryBdt) * 100 : 0;

  return {
    today_date: todayDate,
    active_month: monthToUse,
    elapsed_days: elapsedDays,
    total_days_in_month: totalDays,
    remaining_days: remainingDays,
    current_spent_bdt: roundHalfUp(currentSpent, 2),
    daily_burn_rate_bdt: roundHalfUp(dailyBurnRate, 2),
    projected_remaining_spend_bdt: roundHalfUp(projectedRemainingSpend, 2),
    total_projected_spend_bdt: roundHalfUp(totalProjectedSpend, 2),
    salary_bdt: roundHalfUp(salaryBdt, 2),
    projected_net_savings_bdt: roundHalfUp(projectedNetSavings, 2),
    is_deficit: isDeficit,
    budget_utilization_projected_percent: roundHalfUp(budgetUtilPercent, 1),
  };
}

/**
 * Computes forecast-driven completion dates for savings pockets.
 * If monthly surplus is positive, checks if the committed contribution fits within available monthly surplus.
 */
export function calculatePocketCompletion(
  pocket: SavingsPocket,
  forecast: ForecastResult,
  totalPocketsMonthlyCommitment: number
): {
  completionDate: string;
  monthsToComplete: number;
  isSurplusConstrained: boolean;
} {
  const remainingTarget = Math.max(0, pocket.target_bdt - (pocket.current_balance_bdt || 0));
  if (remainingTarget === 0) {
    return {
      completionDate: "Completed! 🎉",
      monthsToComplete: 0,
      isSurplusConstrained: false,
    };
  }

  const requestedContribution = pocket.monthly_contribution_bdt;
  if (requestedContribution <= 0) {
    return {
      completionDate: "Contribution Set to 0",
      monthsToComplete: Infinity,
      isSurplusConstrained: true,
    };
  }

  const availableSurplus = Math.max(0, forecast.projected_net_savings_bdt);
  let effectiveMonthlyContribution = requestedContribution;
  let isSurplusConstrained = false;

  // If projected surplus is lower than total committed contributions across all pockets,
  // scale effective contribution proportional to available surplus.
  if (availableSurplus < totalPocketsMonthlyCommitment) {
    isSurplusConstrained = true;
    if (availableSurplus === 0) {
      return {
        completionDate: "Deficit (Timeline Paused)",
        monthsToComplete: 999,
        isSurplusConstrained: true,
      };
    }
    const ratio = availableSurplus / Math.max(1, totalPocketsMonthlyCommitment);
    effectiveMonthlyContribution = Math.max(100, requestedContribution * ratio);
  }

  const monthsToComplete = Math.max(
    1,
    Math.ceil(remainingTarget / effectiveMonthlyContribution)
  );

  // Compute completion date from forecast.today_date
  const { year, month } = parseDateComponents(forecast.today_date);
  const targetDate = new Date(year, month - 1 + monthsToComplete, 1);
  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];
  const completionDate = `${monthNames[targetDate.getMonth()]} ${targetDate.getFullYear()}`;

  return {
    completionDate,
    monthsToComplete,
    isSurplusConstrained,
  };
}
