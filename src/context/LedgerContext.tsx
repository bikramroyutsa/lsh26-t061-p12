"use client";

import React, { createContext, useContext, useState, useMemo, useEffect } from "react";
import { Expense, MoMComparison, CategoryBreakdownItem, ShorthandCommand } from "@/types/expense";
import { SavingsPocket, DPSCalculationResult } from "@/types/pocket";
import { ForecastResult } from "@/types/forecast";
import { ConcreteInsight } from "@/types/insights";
import { WhatIfResult } from "@/types/whatIf";
import { calculateDPS, roundHalfUp } from "@/lib/calculations/dps";
import { calculateForecast, calculatePocketCompletion } from "@/lib/calculations/forecast";
import { detectRecurringExpenses, RecurringMatch } from "@/lib/calculations/recurring";
import { simulateCategoryCut } from "@/lib/calculations/whatIf";
import { generateDynamicInsights } from "@/lib/calculations/insights";
import { CompetitionCase } from "@/types/dataset";
import { createClient } from "@/lib/supabase/client";

interface LedgerContextType {
  // State
  activeCaseId: string;
  availableCases: CompetitionCase[];
  salary: number;
  expenses: Expense[];
  pockets: SavingsPocket[];
  shorthands: ShorthandCommand[];
  todayDate: string;
  months: { last: string; this: string };
  selectedMonth: string;
  dpsRate: number;
  dpsRule: string;
  whatIfCategory: string;
  whatIfCutPercent: number;
  userId: string | null;

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
  addShorthand: (command: Omit<ShorthandCommand, "id">) => void;
  deleteShorthand: (id: string) => void;
  signOut: () => Promise<void>;
}

const LedgerContext = createContext<LedgerContextType | undefined>(undefined);

export const LedgerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const supabase = createClient();
  const [userId, setUserId] = useState<string | null>(null);
  
  const [activeCaseId, setActiveCaseId] = useState<string>("");
  const [salary, setSalary] = useState<number>(0);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [pockets, setPockets] = useState<SavingsPocket[]>([]);
  const [shorthands, setShorthands] = useState<ShorthandCommand[]>([]);
  
  const [todayDate, setTodayDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [months, setMonths] = useState<{ last: string; this: string }>({ last: "2026-07", this: "2026-08" });
  const [selectedMonth, setSelectedMonth] = useState<string>("2026-08");
  const [dpsRate, setDPSRate] = useState<number>(8.0);
  const [dpsRule, setDPSRule] = useState<string>("Annual rate as stated. Compounded monthly.");
  
  const [whatIfCategory, setWhatIfCategory] = useState<string>("Food");
  const [whatIfCutPercent, setWhatIfCutPercent] = useState<number>(0);

  // Load Cloud Data
  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUserId(session.user.id);
        loadCloudData(session.user.id);
      } else {
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
      }
    };

    fetchSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUserId(session.user.id);
        loadCloudData(session.user.id);
      } else {
        setUserId(null);
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadCloudData = async (uid: string) => {
    // Fetch profile
    const { data: profile } = await supabase.from('user_profiles').select('*').eq('id', uid).single();
    if (profile) {
      setSalary(Number(profile.salary_bdt));
      setDPSRate(Number(profile.dps_rate));
    }

    // Fetch expenses
    const { data: exps } = await supabase.from('expenses').select('*').order('date', { ascending: false });
    if (exps) setExpenses(exps as any);

    // Fetch pockets
    const { data: pocks } = await supabase.from('savings_pockets').select('*');
    if (pocks) setPockets(pocks as any);

    // Fetch shorthands
    const { data: shs } = await supabase.from('shorthands').select('*');
    if (shs) setShorthands(shs as any);
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  // Load a competition case
  const loadCase = (caseId: string) => {
    // We disable this now that we are on cloud, but keep signature for types
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

    const allCategories = Array.from(new Set(expenses.map((e) => e.category)));
    const categoryChanges = allCategories.map((cat) => {
      const lastCat = lastMonthExps.filter((e) => e.category === cat).reduce((s, e) => s + e.amount_bdt, 0);
      const thisCat = thisMonthExps.filter((e) => e.category === cat).reduce((s, e) => s + e.amount_bdt, 0);
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
      return { ...pocket, calculatedCompletionDate: completion.completionDate, calculatedMonths: completion.monthsToComplete, isSurplusConstrained: completion.isSurplusConstrained, dpsResult };
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


  // CLOUD MUTATIONS
  const handleSetSalary = async (newSalary: number) => {
    if (!userId) return;
    setSalary(newSalary);
    await supabase.from('user_profiles').update({ salary_bdt: newSalary }).eq('id', userId);
  };

  const handleAddExpense = async (newExp: Omit<Expense, "id">) => {
    if (!userId) return;
    const expenseData = {
      user_id: userId,
      date: newExp.date,
      category: newExp.category,
      shop: newExp.shop,
      amount_bdt: roundHalfUp(newExp.amount_bdt, 2),
      notes: newExp.notes || null
    };
    
    // Optimistic Update
    const tempId = `temp-${Date.now()}`;
    setExpenses(prev => [{ ...newExp, id: tempId, amount_bdt: expenseData.amount_bdt }, ...prev]);
    
    const { data, error } = await supabase.from('expenses').insert(expenseData).select().single();
    if (data) {
      setExpenses(prev => prev.map(e => e.id === tempId ? data as any : e));
    }
  };

  const handleUpdateExpense = async (id: string, updated: Partial<Expense>) => {
    setExpenses(prev => prev.map(e => e.id === id ? { ...e, ...updated, amount_bdt: updated.amount_bdt !== undefined ? roundHalfUp(updated.amount_bdt, 2) : e.amount_bdt } : e));
    await supabase.from('expenses').update({ ...updated }).eq('id', id);
  };

  const handleDeleteExpense = async (id: string) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
    await supabase.from('expenses').delete().eq('id', id);
  };

  const handleAddPocket = async (newPocket: Omit<SavingsPocket, "id">) => {
    if (!userId) return;
    const pocketData = {
      user_id: userId,
      name: newPocket.name,
      item: newPocket.item,
      target_bdt: roundHalfUp(newPocket.target_bdt, 2),
      monthly_contribution_bdt: roundHalfUp(newPocket.monthly_contribution_bdt, 2),
      current_balance_bdt: 0
    };
    
    const tempId = `temp-${Date.now()}`;
    setPockets(prev => [...prev, { ...newPocket, id: tempId, target_bdt: pocketData.target_bdt, monthly_contribution_bdt: pocketData.monthly_contribution_bdt, current_balance_bdt: 0 }]);
    
    const { data } = await supabase.from('savings_pockets').insert(pocketData).select().single();
    if (data) setPockets(prev => prev.map(p => p.id === tempId ? data as any : p));
  };

  const handleUpdatePocketContribution = async (id: string, contribution: number) => {
    const val = Math.max(0, roundHalfUp(contribution, 2));
    setPockets(prev => prev.map(p => p.id === id ? { ...p, monthly_contribution_bdt: val } : p));
    await supabase.from('savings_pockets').update({ monthly_contribution_bdt: val }).eq('id', id);
  };

  const handleDeletePocket = async (id: string) => {
    setPockets(prev => prev.filter(p => p.id !== id));
    await supabase.from('savings_pockets').delete().eq('id', id);
  };

  const handleAddShorthand = async (command: Omit<ShorthandCommand, "id">) => {
    if (!userId) return;
    const dataObj = { user_id: userId, keyword: command.keyword, category: command.category, shop: command.shop };
    
    const tempId = `temp-${Date.now()}`;
    setShorthands(prev => [...prev, { ...command, id: tempId }]);
    
    const { data } = await supabase.from('shorthands').insert(dataObj).select().single();
    if (data) setShorthands(prev => prev.map(sh => sh.id === tempId ? data as any : sh));
  };

  const handleDeleteShorthand = async (id: string) => {
    setShorthands(prev => prev.filter(sh => sh.id !== id));
    await supabase.from('shorthands').delete().eq('id', id);
  };

  const setWhatIf = (category: string, cutPercent: number) => {
    setWhatIfCategory(category);
    setWhatIfCutPercent(cutPercent);
  };

  return (
    <LedgerContext.Provider
      value={{
        activeCaseId,
        availableCases: [], // Deprecated
        salary,
        expenses,
        pockets,
        shorthands,
        todayDate,
        months,
        selectedMonth,
        dpsRate,
        dpsRule,
        whatIfCategory,
        whatIfCutPercent,
        userId,
        forecast,
        momComparison,
        recurringMatches,
        recurringExpenseIds,
        insights,
        whatIfResult,
        pocketsWithProjections,
        loadCase,
        setSalary: handleSetSalary,
        setTodayDate,
        setSelectedMonth,
        setDPSRate,
        addExpense: handleAddExpense,
        updateExpense: handleUpdateExpense,
        deleteExpense: handleDeleteExpense,
        addPocket: handleAddPocket,
        updatePocketContribution: handleUpdatePocketContribution,
        deletePocket: handleDeletePocket,
        setWhatIf,
        addShorthand: handleAddShorthand,
        deleteShorthand: handleDeleteShorthand,
        signOut,
      }}
    >
      {children}
    </LedgerContext.Provider>
  );
};

export function useLedger() {
  const context = useContext(LedgerContext);
  if (!context) throw new Error("useLedger must be used within a LedgerProvider");
  return context;
}
