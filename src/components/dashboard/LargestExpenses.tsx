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
      variant="white"
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
        <div className="text-center py-8 font-bold text-black/60">
          No expenses recorded for {selectedMonth}.
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {largest.map((item, idx) => {
            const isRecurring = recurringExpenseIds.has(item.id);

            return (
              <div
                key={item.id}
                className="border-3 border-black p-3 bg-[#FFFDF5] shadow-neo-xs flex items-center justify-between flex-wrap gap-2 hover:bg-[#FFE600]/15 transition-all"
              >
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 bg-black text-white font-black text-xs flex items-center justify-center border border-black shadow-neo-xs">
                    #{idx + 1}
                  </span>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-sm text-black">{item.shop}</span>
                      {isRecurring && (
                        <Badge variant="mint" size="sm" pill>
                          <Repeat className="w-2.5 h-2.5 stroke-[3px]" /> Recurring
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs font-bold text-black/60">
                      <span className="flex items-center gap-1">
                        <Store className="w-3 h-3" /> {item.category}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {item.date}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-black text-base text-black">
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
