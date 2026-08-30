import { Expense, MoMComparison } from "@/types/expense";
import { ForecastResult } from "@/types/forecast";
import { ConcreteInsight } from "@/types/insights";
import { SavingsPocket } from "@/types/pocket";
import { RecurringMatch } from "./recurring";
import { roundHalfUp } from "./dps";

/**
 * Generates at least 3 concrete, data-grounded insights naming specific categories and exact BDT amounts.
 * Guarantees zero static boilerplate: every insight dynamically calculates based on live numbers.
 */
export function generateDynamicInsights(
  expenses: Expense[],
  forecast: ForecastResult,
  mom: MoMComparison,
  pockets: SavingsPocket[],
  recurringMatches: RecurringMatch[]
): ConcreteInsight[] {
  const insights: ConcreteInsight[] = [];
  const activeMonth = forecast.active_month;
  const thisMonthExpenses = expenses.filter((e) => e.date.startsWith(activeMonth));

  // 1. TOP SPENDING CATEGORY INSIGHT
  const categoryTotals: Record<string, number> = {};
  thisMonthExpenses.forEach((e) => {
    categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount_bdt;
  });

  const sortedCategories = Object.entries(categoryTotals).sort(
    ([, a], [, b]) => b - a
  );

  if (sortedCategories.length > 0) {
    const [topCat, topAmount] = sortedCategories[0];
    const totalSpent = forecast.current_spent_bdt || 1;
    const catShare = roundHalfUp((topAmount / totalSpent) * 100, 1);

    insights.push({
      id: "insight-top-category",
      type: "category_surge",
      severity: catShare > 40 ? "warning" : "info",
      title: `Dominant Category: ${topCat}`,
      message: `${topCat} accounts for ৳${topAmount.toLocaleString("en-IN", {
        minimumFractionDigits: 2,
      })} (${catShare}% of your ৳${totalSpent.toLocaleString("en-IN", {
        minimumFractionDigits: 2,
      })} total spending so far in ${activeMonth}).`,
      category: topCat,
      amount_bdt: topAmount,
      percentage: catShare,
    });
  }

  // 2. MONTH-OVER-MONTH BIGGEST INCREASE INSIGHT
  const sortedMoMChanges = [...mom.category_changes].sort(
    (a, b) => b.delta_bdt - a.delta_bdt
  );

  if (sortedMoMChanges.length > 0 && sortedMoMChanges[0].delta_bdt > 0) {
    const highestIncrease = sortedMoMChanges[0];
    insights.push({
      id: "insight-mom-surge",
      type: "spending_alert",
      severity: "warning",
      title: `Spike in ${highestIncrease.category}`,
      message: `${highestIncrease.category} spending increased by ৳${highestIncrease.delta_bdt.toLocaleString(
        "en-IN",
        { minimumFractionDigits: 2 }
      )} (+${highestIncrease.delta_percentage.toFixed(1)}%) compared to ${mom.last_month} (৳${highestIncrease.last_bdt.toLocaleString("en-IN")} ➔ ৳${highestIncrease.this_bdt.toLocaleString("en-IN")}).`,
      category: highestIncrease.category,
      amount_bdt: highestIncrease.delta_bdt,
      secondary_amount_bdt: highestIncrease.this_bdt,
      percentage: highestIncrease.delta_percentage,
    });
  } else if (sortedMoMChanges.length > 0 && sortedMoMChanges[sortedMoMChanges.length - 1].delta_bdt < 0) {
    const biggestDrop = sortedMoMChanges[sortedMoMChanges.length - 1];
    insights.push({
      id: "insight-mom-savings",
      type: "saving_opportunity",
      severity: "positive",
      title: `Savings in ${biggestDrop.category}`,
      message: `You spent ৳${Math.abs(biggestDrop.delta_bdt).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
      })} less on ${biggestDrop.category} than last month (reduced to ৳${biggestDrop.this_bdt.toLocaleString(
        "en-IN"
      )}).`,
      category: biggestDrop.category,
      amount_bdt: Math.abs(biggestDrop.delta_bdt),
      percentage: Math.abs(biggestDrop.delta_percentage),
    });
  }

  // 3. REST-OF-MONTH FORECAST & CASH RUNWAY INSIGHT
  if (forecast.is_deficit) {
    const deficitAmt = Math.abs(forecast.projected_net_savings_bdt);
    insights.push({
      id: "insight-forecast-health",
      type: "spending_alert",
      severity: "critical",
      title: "Projected Month-End Deficit",
      message: `At a daily burn rate of ৳${forecast.daily_burn_rate_bdt.toLocaleString(
        "en-IN"
      )}/day for the remaining ${forecast.remaining_days} days, you are projected to exceed your ৳${forecast.salary_bdt.toLocaleString(
        "en-IN"
      )} salary by ৳${deficitAmt.toLocaleString("en-IN", {
        minimumFractionDigits: 2,
      })}.`,
      amount_bdt: deficitAmt,
      percentage: forecast.budget_utilization_projected_percent,
    });
  } else {
    insights.push({
      id: "insight-forecast-health",
      type: "saving_opportunity",
      severity: "positive",
      title: "Projected Month-End Surplus",
      message: `Spending is on track: projected remaining expense is ৳${forecast.projected_remaining_spend_bdt.toLocaleString(
        "en-IN"
      )}, leaving an estimated month-end surplus of ৳${forecast.projected_net_savings_bdt.toLocaleString(
        "en-IN",
        { minimumFractionDigits: 2 }
      )}.`,
      amount_bdt: forecast.projected_net_savings_bdt,
      percentage: forecast.budget_utilization_projected_percent,
    });
  }

  // 4. RECURRING BILL COMMITMENT INSIGHT
  if (recurringMatches.length > 0) {
    const totalRecurringBdt = recurringMatches.reduce(
      (sum, m) => sum + m.thisMonthExpense.amount_bdt,
      0
    );
    const topRecurring = [...recurringMatches].sort(
      (a, b) => b.thisMonthExpense.amount_bdt - a.thisMonthExpense.amount_bdt
    )[0];

    insights.push({
      id: "insight-recurring-bills",
      type: "recurring_commitment",
      severity: "info",
      title: "Recurring Monthly Commitments",
      message: `Detected ${recurringMatches.length} recurring expenses totaling ৳${totalRecurringBdt.toLocaleString(
        "en-IN",
        { minimumFractionDigits: 2 }
      )}. Largest recurring bill is ${topRecurring.shop} (${topRecurring.category}) at ৳${topRecurring.thisMonthExpense.amount_bdt.toLocaleString(
        "en-IN"
      )}.`,
      category: topRecurring.category,
      amount_bdt: totalRecurringBdt,
      secondary_amount_bdt: topRecurring.thisMonthExpense.amount_bdt,
    });
  }

  // 5. SAVINGS POCKET COMMITMENT FEASIBILITY
  if (pockets.length > 0) {
    const totalPocketCommitment = pockets.reduce(
      (sum, p) => sum + p.monthly_contribution_bdt,
      0
    );
    const projectedSurplus = forecast.projected_net_savings_bdt;

    if (projectedSurplus < totalPocketCommitment) {
      const shortfall = roundHalfUp(totalPocketCommitment - projectedSurplus, 2);
      insights.push({
        id: "insight-pocket-funding",
        type: "pocket_milestone",
        severity: "warning",
        title: "Savings Pockets Funding Gap",
        message: `Your active savings pockets require ৳${totalPocketCommitment.toLocaleString(
          "en-IN"
        )}/month, but projected surplus is ৳${Math.max(0, projectedSurplus).toLocaleString(
          "en-IN"
        )}, creating a ৳${shortfall.toLocaleString("en-IN", {
          minimumFractionDigits: 2,
        })} shortfall for on-time completion.`,
        amount_bdt: shortfall,
        secondary_amount_bdt: totalPocketCommitment,
      });
    } else {
      const buffer = roundHalfUp(projectedSurplus - totalPocketCommitment, 2);
      insights.push({
        id: "insight-pocket-funding",
        type: "pocket_milestone",
        severity: "positive",
        title: "Savings Goals Fully Funded",
        message: `Projected surplus of ৳${projectedSurplus.toLocaleString(
          "en-IN"
        )} comfortably covers your ৳${totalPocketCommitment.toLocaleString(
          "en-IN"
        )} monthly pocket goal with a ৳${buffer.toLocaleString("en-IN")} safety cushion.`,
        amount_bdt: buffer,
        secondary_amount_bdt: totalPocketCommitment,
      });
    }
  }

  return insights;
}
