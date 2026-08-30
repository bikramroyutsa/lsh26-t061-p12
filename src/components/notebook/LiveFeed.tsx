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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 sm:p-8 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-500 flex items-center gap-1.5">
              <Clock className="w-4 h-4" /> Today ({todayDate})
            </span>
            <span className="text-xs font-bold bg-[#634E9F] text-white px-3 py-1 rounded-full">
              {todaysExpenses.length} entries
            </span>
          </div>
          <div className="mt-4">
            <span className="text-3xl sm:text-4xl font-bold text-slate-800 tracking-tight">
              ৳{formatBDT(todaySum)}
            </span>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 sm:p-8 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-500 flex items-center gap-1.5">
              <Receipt className="w-4 h-4" /> Month-to-Date
            </span>
            <span className="text-xs font-bold bg-[#634E9F] text-white px-3 py-1 rounded-full">
              {selectedMonth}
            </span>
          </div>
          <div className="mt-4">
            <span className="text-3xl sm:text-4xl font-bold text-slate-800 tracking-tight">
              ৳{formatBDT(forecast.current_spent_bdt)}
            </span>
            <span className="text-sm font-medium text-gray-400 block mt-1">
              Burn Rate: ৳{formatBDT(forecast.daily_burn_rate_bdt)}/day
            </span>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 sm:p-8 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-500 flex items-center gap-1.5">
              <Wallet className="w-4 h-4" /> Proj. Month-End
            </span>
            <span className="text-xs font-bold bg-[#634E9F] text-white px-3 py-1 rounded-full">
              {forecast.projected_net_savings_bdt >= 0 ? "SURPLUS" : "DEFICIT"}
            </span>
          </div>
          <div className="mt-4">
            <span className="text-3xl sm:text-4xl font-bold text-slate-800 tracking-tight">
              {forecast.projected_net_savings_bdt >= 0 ? "+" : "-"}৳{formatBDT(Math.abs(forecast.projected_net_savings_bdt))}
            </span>
            <span className="text-sm font-medium text-gray-400 block mt-1">
              Salary: ৳{formatBDT(salary)}
            </span>
          </div>
        </div>
      </div>

      {/* Today's Live Notebook Entries */}
      <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 sm:p-8">
        <div className="flex items-center justify-between flex-wrap gap-2 pb-4 border-gray-200 mb-4">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 stroke-[2.5px] text-slate-800" />
            <h2 className="text-lg sm:text-xl font-semibold uppercase tracking-tight text-slate-800">
              Today's Notebook Stream ({todayDate})
            </h2>
          </div>
          <span className="text-xs font-semibold bg-white px-2.5 py-1 rounded-2xl shadow-sm uppercase">
            Total Today: ৳{formatBDT(todaySum)}
          </span>
        </div>

        {todaysExpenses.length === 0 ? (
          <div className="border border-dashed border-gray-200 p-8 text-center bg-white flex flex-col items-center gap-2">
            <Sparkles className="w-8 h-8 text-[#FF9F1C]" />
            <span className="font-semibold text-base uppercase text-slate-800">
              No entries logged yet for today ({todayDate})
            </span>
            <p className="text-xs font-bold text-slate-800 max-w-sm">
              Type <code className="bg-[#EAE5F8] text-[#554089] px-2 rounded-full  font-semibold text-slate-800">lun 500</code> in the box above and hit Enter to add your first memo!
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            {todaysExpenses.map((e, idx) => (
              <div
                key={e.id || idx}
                className="bg-white rounded-2xl shadow-sm p-4 border border-gray-50 flex items-center justify-between gap-3 hover:translate-x-1 transition-transform"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 bg-white rounded-2xl flex items-center justify-center  font-semibold text-xs shrink-0">
                    #{idx + 1}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-sm text-slate-800 truncate">
                        {e.shop}
                      </span>
                      <Badge variant="primary" size="sm">
                        {e.category}
                      </Badge>
                      {e.isRecurring && (
                        <Badge variant="primary" size="sm">
                          Recurring
                        </Badge>
                      )}
                    </div>
                    <span className="text-[11px]  font-bold text-slate-800">
                      Logged at {e.date}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-lg font-semibold  text-slate-800">
                    ৳{formatBDT(e.amount_bdt)}
                  </span>
                  <button
                    type="button"
                    onClick={() => deleteExpense(e.id)}
                    title="Delete memo"
                    className="p-1.5 bg-white hover:bg-white text-slate-800 rounded-2xl shadow-sm transition-colors"
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
      <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 sm:p-8">
        <div className="flex items-center justify-between pb-3 border-gray-200 mb-4">
          <span className="text-xs font-semibold text-sm text-gray-500 text-slate-800 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" /> Recent Ledger Entries
          </span>
          <span className="text-[11px] font-bold text-slate-800">
            Showing latest {recentExpenses.length} records
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {recentExpenses.map((e) => (
            <div
              key={e.id}
              className="bg-white rounded-2xl shadow-sm p-4 border border-gray-50 flex items-center justify-between gap-2"
            >
              <div className="flex flex-col min-w-0">
                <span className="font-semibold text-xs text-slate-800 truncate">
                  {e.shop}
                </span>
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-800">
                  <span className="text-gray-500">{e.date}</span>
                  <span>•</span>
                  <span className="text-slate-800 font-bold uppercase">{e.category}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold  text-slate-800">
                  ৳{formatBDT(e.amount_bdt)}
                </span>
                <button
                  type="button"
                  onClick={() => deleteExpense(e.id)}
                  className="p-1 text-slate-800 hover:text-[#FF6B6B] transition-colors"
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
