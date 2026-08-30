import { DPSCalculationResult, DPSMonthlyRecord } from "@/types/pocket";

/**
 * Rounds half up to specified decimal places (standard paisa precision)
 */
export function roundHalfUp(num: number, decimals: number = 2): number {
  const factor = Math.pow(10, decimals);
  return Math.round((num + Number.EPSILON) * factor) / factor;
}

/**
 * Calculates DPS (Deposit Pension Scheme) maturity and month-by-month compound schedule.
 * Rule: Each month: balance = balance + deposit, then interest = balance * rate / 12 / 100
 * rounded half up to 2 decimal places (paisa) and added to the balance.
 *
 * @param monthlyDepositBdt - The monthly installment amount in BDT
 * @param durationMonths - Number of months the scheme runs
 * @param annualRatePercent - Stated annual interest rate (e.g. 8.00% or 9.00%)
 */
export function calculateDPS(
  monthlyDepositBdt: number,
  durationMonths: number,
  annualRatePercent: number = 8.0
): DPSCalculationResult {
  if (monthlyDepositBdt <= 0 || durationMonths <= 0) {
    return {
      annual_rate_percent: annualRatePercent,
      monthly_deposit_bdt: monthlyDepositBdt,
      duration_months: 0,
      total_principal_bdt: 0,
      total_interest_earned_bdt: 0,
      maturity_amount_bdt: 0,
      schedule: [],
    };
  }

  const schedule: DPSMonthlyRecord[] = [];
  let currentBalance = 0;
  let totalInterest = 0;
  const totalPrincipal = monthlyDepositBdt * durationMonths;

  for (let m = 1; m <= durationMonths; m++) {
    // 1. Add monthly deposit
    const balanceBeforeInterest = roundHalfUp(currentBalance + monthlyDepositBdt, 2);

    // 2. Compute monthly interest (compounded monthly)
    const rawInterest = (balanceBeforeInterest * annualRatePercent) / 12 / 100;
    const interestEarned = roundHalfUp(rawInterest, 2);

    // 3. Add interest to balance
    const closingBalance = roundHalfUp(balanceBeforeInterest + interestEarned, 2);

    totalInterest = roundHalfUp(totalInterest + interestEarned, 2);
    currentBalance = closingBalance;

    schedule.push({
      month: m,
      deposit_bdt: monthlyDepositBdt,
      balance_before_interest_bdt: balanceBeforeInterest,
      interest_earned_bdt: interestEarned,
      closing_balance_bdt: closingBalance,
    });
  }

  return {
    annual_rate_percent: annualRatePercent,
    monthly_deposit_bdt: monthlyDepositBdt,
    duration_months: durationMonths,
    total_principal_bdt: totalPrincipal,
    total_interest_earned_bdt: totalInterest,
    maturity_amount_bdt: currentBalance,
    schedule,
  };
}
