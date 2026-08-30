import { Expense } from "@/types/expense";

export interface RecurringMatch {
  shop: string;
  category: string;
  lastMonthExpense: Expense;
  thisMonthExpense: Expense;
  variancePercentage: number;
}

/**
 * Checks if two amounts are within 5% tolerance of each other
 */
export function isSimilarAmount(amount1: number, amount2: number, tolerancePercent: number = 5): boolean {
  if (amount1 === 0 && amount2 === 0) return true;
  const maxAmount = Math.max(amount1, amount2);
  if (maxAmount === 0) return false;
  const diff = Math.abs(amount1 - amount2);
  const variancePercent = (diff / maxAmount) * 100;
  return variancePercent <= tolerancePercent;
}

/**
 * Detects recurring expenses between last month and this month.
 * Flags expenses where the same shop name appears with a similar amount (within 5%).
 */
export function detectRecurringExpenses(
  expenses: Expense[],
  lastMonth: string,
  thisMonth: string
): {
  recurringExpenseIds: Set<string>;
  matches: RecurringMatch[];
} {
  const lastMonthExpenses = expenses.filter((e) => e.date.startsWith(lastMonth));
  const thisMonthExpenses = expenses.filter((e) => e.date.startsWith(thisMonth));

  const recurringExpenseIds = new Set<string>();
  const matches: RecurringMatch[] = [];

  for (const thisExp of thisMonthExpenses) {
    const matchingLastExp = lastMonthExpenses.find((lastExp) => {
      const sameShop =
        lastExp.shop.trim().toLowerCase() === thisExp.shop.trim().toLowerCase();
      const similarAmt = isSimilarAmount(lastExp.amount_bdt, thisExp.amount_bdt, 5);
      return sameShop && similarAmt;
    });

    if (matchingLastExp) {
      recurringExpenseIds.add(thisExp.id);
      recurringExpenseIds.add(matchingLastExp.id);

      const maxAmt = Math.max(thisExp.amount_bdt, matchingLastExp.amount_bdt);
      const diff = Math.abs(thisExp.amount_bdt - matchingLastExp.amount_bdt);
      const variancePercentage = maxAmt > 0 ? (diff / maxAmt) * 100 : 0;

      matches.push({
        shop: thisExp.shop,
        category: thisExp.category,
        lastMonthExpense: matchingLastExp,
        thisMonthExpense: thisExp,
        variancePercentage: Math.round(variancePercentage * 10) / 10,
      });
    }
  }

  return { recurringExpenseIds, matches };
}
