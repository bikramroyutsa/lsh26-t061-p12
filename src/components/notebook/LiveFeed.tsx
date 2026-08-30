"use client";

import React, { useMemo } from "react";
import { useLedger } from "@/context/LedgerContext";
import { formatBDT } from "@/lib/format";
import { Badge } from "@/components/ui/Badge";
import {
  Clock,
  Trash2,
  TrendingDown,
  Wallet,
  Calendar,
  AlertCircle,
  Receipt,
  Layers,
  Sparkles,
} from "lucide-react";

export const LiveFeed: React.FC = () => {
  const { expenses, todayDate, selectedMonth, salary, forecast, deleteExpense } = useLedger();

  // Filter expenses for today and this month
  const todaysExpenses = useMemo(() => {
    return expenses.filter((e) => e.date === todayDate);
  }, [expenses, todayDate]);

  const recentExpenses = useMemo(() => {
    return expenses.slice(0, 8);
  }, [expenses]);

  const todaySum = useMemo(() => {
    return todaysExpenses.reduce((sum, e) => sum + e.amount_bdt, 0);
  }, [todaysExpenses]);

  return (
    <div className="flex flex-col gap-6">
      {/* Quick Status Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-md flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-gray-900 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> Today ({todayDate})
            </span>
            <span className="text-xs font-mono font-bold bg-indigo-600 text-white px-2 py-0.5">
              {todaysExpenses.length} entries
            </span>
          </div>
          <div className="mt-2">
            <span className="text-2xl sm:text-3xl font-semibold text-gray-900 font-mono">
              ৳{formatBDT(todaySum)}
            </span>
          </div>
        </div>

        <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-md flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-gray-900 flex items-center gap-1">
              <Receipt className="w-3.5 h-3.5" /> Month-to-Date Spend
            </span>
            <span className="text-xs font-mono font-bold bg-indigo-600 text-white px-2 py-0.5">
              {selectedMonth}
            </span>
          </div>
          <div className="mt-2">
            <span className="text-2xl sm:text-3xl font-semibold text-gray-900 font-mono">
              ৳{formatBDT(forecast.current_spent_bdt)}
            </span>
            <span className="text-xs font-semibold text-gray-900 block">
              Burn Rate: ৳{formatBDT(forecast.daily_burn_rate_bdt)}/day
            </span>
          </div>
        </div>

        <div
          className={`border border-gray-200 rounded-lg p-4 shadow-md flex flex-col justify-between ${
            forecast.projected_net_savings_bdt >= 0 ? "bg-white" : "bg-white"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-gray-900 flex items-center gap-1">
              <Wallet className="w-3.5 h-3.5" /> Projected Month-End
            </span>
            <span className="text-xs font-mono font-bold bg-indigo-600 text-white px-2 py-0.5">
              {forecast.projected_net_savings_bdt >= 0 ? "SURPLUS" : "DEFICIT"}
            </span>
          </div>
          <div className="mt-2">
            <span className="text-2xl sm:text-3xl font-semibold text-gray-900 font-mono">
              {forecast.projected_net_savings_bdt >= 0 ? "+" : "-"}৳
              {formatBDT(Math.abs(forecast.projected_net_savings_bdt))}
            </span>
            <span className="text-xs font-semibold text-gray-900 block">
              Salary: ৳{formatBDT(salary)}
            </span>
          </div>
        </div>
      </div>

      {/* Today's Live Notebook Entries */}
      <div className="border border-gray-200 rounded-lg bg-white shadow-md p-6">
        <div className="flex items-center justify-between flex-wrap gap-2 pb-4 border-gray-200 mb-4">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 stroke-[2.5px] text-gray-900" />
            <h2 className="text-lg sm:text-xl font-semibold uppercase tracking-tight text-gray-900">
              Today's Notebook Stream ({todayDate})
            </h2>
          </div>
          <span className="text-xs font-semibold bg-white px-2.5 py-1 border border-gray-200 rounded-lg shadow-md uppercase">
            Total Today: ৳{formatBDT(todaySum)}
          </span>
        </div>

        {todaysExpenses.length === 0 ? (
          <div className="border border-dashed border-gray-200 p-8 text-center bg-white flex flex-col items-center gap-2">
            <Sparkles className="w-8 h-8 text-[#FF9F1C]" />
            <span className="font-semibold text-base uppercase text-gray-900">
              No entries logged yet for today ({todayDate})
            </span>
            <p className="text-xs font-bold text-gray-900 max-w-sm">
              Type <code className="bg-white px-1 font-mono font-semibold text-gray-900">lun 500</code> in the box above and hit Enter to add your first memo!
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            {todaysExpenses.map((e, idx) => (
              <div
                key={e.id || idx}
                className="border border-gray-200 rounded-lg p-3.5 bg-white shadow-md flex items-center justify-between gap-3 hover:translate-x-1 transition-transform"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 bg-white border border-gray-200 rounded-lg flex items-center justify-center font-mono font-semibold text-xs shrink-0">
                    #{idx + 1}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-sm text-gray-900 truncate">
                        {e.shop}
                      </span>
                      <Badge variant="accent" size="sm">
                        {e.category}
                      </Badge>
                      {e.isRecurring && (
                        <Badge variant="mint" size="sm">
                          Recurring
                        </Badge>
                      )}
                    </div>
                    <span className="text-[11px] font-mono font-bold text-gray-900">
                      Logged at {e.date}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-lg font-semibold font-mono text-gray-900">
                    ৳{formatBDT(e.amount_bdt)}
                  </span>
                  <button
                    type="button"
                    onClick={() => deleteExpense(e.id)}
                    title="Delete memo"
                    className="p-1.5 bg-white hover:bg-white text-gray-900 border border-gray-200 rounded-lg shadow-md transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Activity Feed */}
      <div className="border border-gray-200 rounded-lg bg-white shadow-md p-6">
        <div className="flex items-center justify-between pb-3 border-gray-200 mb-4">
          <span className="text-xs font-semibold text-sm text-gray-500 text-gray-900 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" /> Recent Ledger Entries
          </span>
          <span className="text-[11px] font-bold text-gray-900">
            Showing latest {recentExpenses.length} records
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {recentExpenses.map((e) => (
            <div
              key={e.id}
              className="border border-gray-200 rounded-lg p-3 bg-white shadow-md flex items-center justify-between gap-2"
            >
              <div className="flex flex-col min-w-0">
                <span className="font-semibold text-xs text-gray-900 truncate">
                  {e.shop}
                </span>
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-900">
                  <span className="bg-white px-1 border border-gray-200">{e.date}</span>
                  <span>•</span>
                  <span className="text-gray-900 font-bold uppercase">{e.category}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold font-mono text-gray-900">
                  ৳{formatBDT(e.amount_bdt)}
                </span>
                <button
                  type="button"
                  onClick={() => deleteExpense(e.id)}
                  className="p-1 text-gray-900 hover:text-[#FF6B6B] transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
