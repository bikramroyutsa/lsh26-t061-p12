"use client";

import React from "react";
import { useLedger } from "@/context/LedgerContext";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { DollarSign, Calendar, Store, Repeat } from "lucide-react";

export const LargestExpenses: React.FC = () => {
  const { expenses, selectedMonth, recurringExpenseIds } = useLedger();

  const monthExpenses = expenses.filter((e) => e.date.startsWith(selectedMonth));
  const largest = [...monthExpenses]
    .sort((a, b) => b.amount_bdt - a.amount_bdt)
    .slice(0, 5);

  return (
    <Card
      variant="outline"
      shadow="md"
      header={
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 stroke-[2.5px]" />
            <span>Largest Expenses ({selectedMonth})</span>
          </div>
          <Badge variant="secondary" size="sm">
            TOP 5
          </Badge>
        </div>
      }
      headerBg="accent"
    >
      {largest.length === 0 ? (
        <div className="text-center py-8 font-bold text-slate-800">
          No expenses recorded for {selectedMonth}.
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {largest.map((item, idx) => {
            const isRecurring = recurringExpenseIds.has(item.id);

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl shadow-sm p-4 border border-gray-50 flex items-center justify-between flex-wrap gap-2 hover:bg-white transition-all"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 bg-slate-100 text-slate-500 font-bold text-[10px] flex items-center justify-center rounded-full">
                    {idx + 1}
                  </span>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-800">{item.shop}</span>
                      {isRecurring && (
                        <span className="text-[9px] font-bold bg-[#E9E5F4] text-[#554089] px-1.5 py-0.5 rounded uppercase flex items-center gap-1">
                          <Repeat className="w-2.5 h-2.5" /> Recurring
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
                      <span>{item.category}</span>
                      <span className="text-gray-300">•</span>
                      <span>{item.date}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-bold text-base text-slate-800">
                    ৳{item.amount_bdt.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
};
