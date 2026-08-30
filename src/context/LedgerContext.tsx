"use client";

import React, { createContext, useContext, useState, useMemo, useEffect } from "react";
import { Expense, MoMComparison, CategoryBreakdownItem } from "@/types/expense";
import { SavingsPocket, DPSCalculationResult } from "@/types/pocket";
import { ForecastResult } from "@/types/forecast";
import { ConcreteInsight } from "@/types/insights";
import { WhatIfResult } from "@/types/whatIf";
import { getAllCases, parseCaseData } from "@/lib/dataset/loader";
import { calculateDPS, roundHalfUp } from "@/lib/calculations/dps";
import { calculateForecast, calculatePocketCompletion } from "@/lib/calculations/forecast";
import { detectRecurringExpenses, RecurringMatch } from "@/lib/calculations/recurring";
import { simulateCategoryCut } from "@/lib/calculations/whatIf";
import { generateDynamicInsights } from "@/lib/calculations/insights";
import { CompetitionCase } from "@/types/dataset";

interface LedgerContextType {
  // State
  activeCaseId: string;
  availableCases: CompetitionCase[];
  salary: number;
  expenses: Expense[];
  pockets: SavingsPocket[];
  todayDate: string;
  months: { last: string; this: string };
  selectedMonth: string;
  dpsRate: number;
  dpsRule: string;
  whatIfCategory: string;
  whatIfCutPercent: number;

  // Derived calculations
  forecast: ForecastResult;
  momComparison: MoMComparison;
  recurringMatches: RecurringMatch[];
  recurringExpenseIds: Set<string>;
  insights: ConcreteInsight[];
  whatIfResult: WhatIfResult | null;
  pocketsWithProjections: (SavingsPocket & {
    calculatedCompletionDate: string;
    calculatedMonths: number;
    isSurplusConstrained: boolean;
    dpsResult: DPSCalculationResult;
  })[];

  // Actions
  loadCase: (caseId: string) => void;
  setSalary: (salary: number) => void;
  setTodayDate: (date: string) => void;
  setSelectedMonth: (month: string) => void;
  setDPSRate: (rate: number) => void;
  addExpense: (expense: Omit<Expense, "id">) => void;
  updateExpense: (id: string, updated: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;
  addPocket: (pocket: Omit<SavingsPocket, "id">) => void;
  updatePocketContribution: (id: string, contribution: number) => void;
  deletePocket: (id: string) => void;
  setWhatIf: (category: string, cutPercent: number) => void;
}

const LedgerContext = createContext<LedgerContextType | undefined>(undefined);

export const LedgerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const availableCases = useMemo(() => getAllCases(), []);

  // Initialize with PUB-01 or fallback
  const initialCase = availableCases[0];
  const initialParsed = initialCase ? parseCaseData(initialCase) : null;

  const [activeCaseId, setActiveCaseId] = useState<string>(initialCase?.case_id || "PUB-01");
  const [salary, setSalary] = useState<number>(initialParsed?.salary || 50000);
  const [expenses, setExpenses] = useState<Expense[]>(initialParsed?.expenses || []);
  const [pockets, setPockets] = useState<SavingsPocket[]>(initialParsed?.pockets || []);
  const [todayDate, setTodayDate] = useState<string>(initialParsed?.today || "2026-04-17");
  const [months, setMonths] = useState<{ last: string; this: string }>(
    initialParsed?.months || { last: "2026-03", this: "2026-04" }
  );
  const [selectedMonth, setSelectedMonth] = useState<string>(initialParsed?.months.this || "2026-04");
  const [dpsRate, setDPSRate] = useState<number>(initialParsed?.dpsRate || 9.0);
  const [dpsRule, setDPSRule] = useState<string>(
    initialParsed?.dpsRule || "Annual rate as stated. Compounded monthly."
  );

  // What-If Simulation State
  const [whatIfCategory, setWhatIfCategory] = useState<string>("Food");
  const [whatIfCutPercent, setWhatIfCutPercent] = useState<number>(0);

  // Load a competition case
  const loadCase = (caseId: string) => {
    const targetCase = availableCases.find((c) => c.case_id === caseId);
    if (!targetCase) return;

    const parsed = parseCaseData(targetCase);
    setActiveCaseId(caseId);
    setSalary(parsed.salary);
    setExpenses(parsed.expenses);
    setPockets(parsed.pockets);
    setTodayDate(parsed.today);
    setMonths(parsed.months);
    setSelectedMonth(parsed.months.this);
    setDPSRate(parsed.dpsRate);
    setDPSRule(parsed.dpsRule);
    setWhatIfCutPercent(0);
  };

  // 1. FORECAST CALCULATION
  const forecast = useMemo(() => {
    return calculateForecast(expenses, salary, todayDate, selectedMonth);
  }, [expenses, salary, todayDate, selectedMonth]);

  // 2. RECURRING EXPENSES DETECTION
  const { recurringExpenseIds, matches: recurringMatches } = useMemo(() => {
    return detectRecurringExpenses(expenses, months.last, months.this);
  }, [expenses, months]);

  // 3. MONTH-OVER-MONTH (MoM) COMPARISON
  const momComparison = useMemo<MoMComparison>(() => {
    const lastMonthExps = expenses.filter((e) => e.date.startsWith(months.last));
    const thisMonthExps = expenses.filter((e) => e.date.startsWith(months.this));

    const lastTotal = lastMonthExps.reduce((s, e) => s + e.amount_bdt, 0);
    const thisTotal = thisMonthExps.reduce((s, e) => s + e.amount_bdt, 0);

    const delta = thisTotal - lastTotal;
    const deltaPercent = lastTotal > 0 ? (delta / lastTotal) * 100 : 0;

    // Category changes
    const allCategories = Array.from(new Set(expenses.map((e) => e.category)));
    const categoryChanges = allCategories.map((cat) => {
      const lastCat = lastMonthExps
        .filter((e) => e.category === cat)
        .reduce((s, e) => s + e.amount_bdt, 0);
      const thisCat = thisMonthExps
        .filter((e) => e.category === cat)
        .reduce((s, e) => s + e.amount_bdt, 0);
      const catDelta = thisCat - lastCat;
      const catDeltaPercent = lastCat > 0 ? (catDelta / lastCat) * 100 : thisCat > 0 ? 100 : 0;

      return {
        category: cat,
        last_bdt: roundHalfUp(lastCat, 2),
        this_bdt: roundHalfUp(thisCat, 2),
        delta_bdt: roundHalfUp(catDelta, 2),
        delta_percentage: roundHalfUp(catDeltaPercent, 1),
      };
    });

    return {
      last_month: months.last,
      this_month: months.this,
      last_month_spent_bdt: roundHalfUp(lastTotal, 2),
      this_month_spent_bdt: roundHalfUp(thisTotal, 2),
      delta_bdt: roundHalfUp(delta, 2),
      delta_percentage: roundHalfUp(deltaPercent, 1),
      category_changes: categoryChanges,
    };
  }, [expenses, months]);

  // 4. SAVINGS POCKETS PROJECTIONS & DPS CALCULATIONS
  const pocketsWithProjections = useMemo(() => {
    const totalCommitment = pockets.reduce((s, p) => s + p.monthly_contribution_bdt, 0);

    return pockets.map((pocket) => {
      const completion = calculatePocketCompletion(pocket, forecast, totalCommitment);
      const dpsResult = calculateDPS(
        pocket.monthly_contribution_bdt,
        completion.monthsToComplete === 999 ? 12 : Math.min(120, completion.monthsToComplete),
        dpsRate
      );

      return {
        ...pocket,
        calculatedCompletionDate: completion.completionDate,
        calculatedMonths: completion.monthsToComplete,
        isSurplusConstrained: completion.isSurplusConstrained,
        dpsResult,
      };
    });
  }, [pockets, forecast, dpsRate]);

  // 5. WHAT-IF SIMULATION
  const whatIfResult = useMemo(() => {
    if (!whatIfCategory || whatIfCutPercent <= 0) return null;
    return simulateCategoryCut(whatIfCategory, whatIfCutPercent, expenses, forecast, pockets);
  }, [whatIfCategory, whatIfCutPercent, expenses, forecast, pockets]);

  // 6. DYNAMIC CONCRETE INSIGHTS GENERATION
  const insights = useMemo(() => {
    return generateDynamicInsights(expenses, forecast, momComparison, pockets, recurringMatches);
  }, [expenses, forecast, momComparison, pockets, recurringMatches]);

  // ACTION HANDLERS
  const addExpense = (newExp: Omit<Expense, "id">) => {
    const id = `E-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    setExpenses((prev) => [
      {
        ...newExp,
        id,
        amount_bdt: roundHalfUp(newExp.amount_bdt, 2),
      },
      ...prev,
    ]);
  };

  const updateExpense = (id: string, updated: Partial<Expense>) => {
    setExpenses((prev) =>
      prev.map((e) =>
        e.id === id
          ? {
              ...e,
              ...updated,
              amount_bdt:
                updated.amount_bdt !== undefined
                  ? roundHalfUp(updated.amount_bdt, 2)
                  : e.amount_bdt,
            }
          : e
      )
    );
  };

  const deleteExpense = (id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  };

  const addPocket = (newPocket: Omit<SavingsPocket, "id">) => {
    const id = `SP-${Date.now()}`;
    setPockets((prev) => [
      ...prev,
      {
        ...newPocket,
        id,
        target_bdt: roundHalfUp(newPocket.target_bdt, 2),
        monthly_contribution_bdt: roundHalfUp(newPocket.monthly_contribution_bdt, 2),
      },
    ]);
  };

  const updatePocketContribution = (id: string, contribution: number) => {
    setPockets((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, monthly_contribution_bdt: Math.max(0, roundHalfUp(contribution, 2)) }
          : p
      )
    );
  };

  const deletePocket = (id: string) => {
    setPockets((prev) => prev.filter((p) => p.id !== id));
  };

  const setWhatIf = (category: string, cutPercent: number) => {
    setWhatIfCategory(category);
    setWhatIfCutPercent(cutPercent);
  };

  return (
    <LedgerContext.Provider
      value={{
        activeCaseId,
        availableCases,
        salary,
        expenses,
        pockets,
        todayDate,
        months,
        selectedMonth,
        dpsRate,
        dpsRule,
        whatIfCategory,
        whatIfCutPercent,
        forecast,
        momComparison,
        recurringMatches,
        recurringExpenseIds,
        insights,
        whatIfResult,
        pocketsWithProjections,
        loadCase,
        setSalary,
        setTodayDate,
        setSelectedMonth,
        setDPSRate,
        addExpense,
        updateExpense,
        deleteExpense,
        addPocket,
        updatePocketContribution,
        deletePocket,
        setWhatIf,
      }}
    >
      {children}
    </LedgerContext.Provider>
  );
};

export function useLedger() {
  const context = useContext(LedgerContext);
  if (!context) {
    throw new Error("useLedger must be used within a LedgerProvider");
  }
  return context;
}
