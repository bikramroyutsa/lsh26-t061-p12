"use client";

import React from "react";
import { useLedger } from "@/context/LedgerContext";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { TrendingUp, TrendingDown, ArrowRight } from "lucide-react";

export const MonthlyComparison: React.FC = () => {
  const { momComparison } = useLedger();

  const isSpendIncreased = momComparison.delta_bdt > 0;

  return (
    <Card
      variant="outline"
      shadow="md"
      header={
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 stroke-[2.5px]" />
            <span>Month-Over-Month Variance</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-bold">
            <span>{momComparison.last_month}</span>
            <ArrowRight className="w-3.5 h-3.5 stroke-[3px]" />
            <span>{momComparison.this_month}</span>
          </div>
        </div>
      }
      headerBg="cyan"
    >
      {/* Top Banner Metric */}
      <div
        className={`rounded-2xl p-4 mb-4 shadow-sm flex items-center justify-between flex-wrap gap-3 ${
          isSpendIncreased ? "bg-white" : "bg-white"
        }`}
      >
        <div className="flex items-center gap-3">
          {isSpendIncreased ? (
            <div className="p-2 rounded-2xl bg-white text-slate-800 shadow-sm">
              <TrendingUp className="w-6 h-6 stroke-[3px]" />
            </div>
          ) : (
            <div className="p-2 rounded-2xl bg-white text-slate-800 shadow-sm">
              <TrendingDown className="w-6 h-6 stroke-[3px]" />
            </div>
          )}
          <div>
            <span className="text-xs font-semibold uppercase text-slate-800 block">
              Net Spending Delta
            </span>
            <span className="text-xl font-semibold text-slate-800">
              {isSpendIncreased ? "+" : "-"}৳
              {Math.abs(momComparison.delta_bdt).toLocaleString("en-IN", {
                minimumFractionDigits: 2,
              })}{" "}
              <span className="text-sm font-bold text-slate-800">
                ({isSpendIncreased ? "+" : ""}
                {momComparison.delta_percentage.toFixed(1)}%)
              </span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-bold text-slate-800">
          <div>
            <span className="block text-[10px] uppercase text-slate-800">
              {momComparison.last_month} Total:
            </span>
            <span className="font-semibold text-slate-800">
              ৳{momComparison.last_month_spent_bdt.toLocaleString("en-IN")}
            </span>
          </div>
          <div className="w-[2px] h-8 bg-[#634E9F]/20" />
          <div>
            <span className="block text-[10px] uppercase text-slate-800">
              {momComparison.this_month} Total:
            </span>
            <span className="font-semibold text-slate-800">
              ৳{momComparison.this_month_spent_bdt.toLocaleString("en-IN")}
            </span>
          </div>
        </div>
      </div>

      {/* Top Movers list */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-4">
        {/* Top Increases */}
        <div className="flex flex-col gap-3">
          <div className="text-xs font-bold uppercase text-slate-400 mb-2 border-b border-gray-100 pb-2">
            Top Spending Increases
          </div>
          {momComparison.category_changes
            .filter((c) => c.delta_bdt > 0)
            .sort((a, b) => b.delta_bdt - a.delta_bdt)
            .slice(0, 3)
            .map((item) => (
              <div key={item.category} className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-800 uppercase">
                  {item.category}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-[#FF6B6B]">
                    +৳{Math.abs(item.delta_bdt).toLocaleString("en-IN")}
                  </span>
                  <span className="text-[10px] font-bold bg-red-50 text-[#FF6B6B] px-1.5 py-0.5 rounded-md">
                    +{item.delta_percentage.toFixed(0)}%
                  </span>
                </div>
              </div>
            ))}
          {momComparison.category_changes.filter((c) => c.delta_bdt > 0).length === 0 && (
            <span className="text-sm text-slate-400 font-medium">No increases this month.</span>
          )}
        </div>

        {/* Top Decreases */}
        <div className="flex flex-col gap-3">
          <div className="text-xs font-bold uppercase text-slate-400 mb-2 border-b border-gray-100 pb-2">
            Top Savings (Decreases)
          </div>
          {momComparison.category_changes
            .filter((c) => c.delta_bdt < 0)
            .sort((a, b) => a.delta_bdt - b.delta_bdt) // sort ascending so largest negative is first
            .slice(0, 3)
            .map((item) => (
              <div key={item.category} className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-800 uppercase">
                  {item.category}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-[#00B894]">
                    -৳{Math.abs(item.delta_bdt).toLocaleString("en-IN")}
                  </span>
                  <span className="text-[10px] font-bold bg-emerald-50 text-[#00B894] px-1.5 py-0.5 rounded-md">
                    {item.delta_percentage.toFixed(0)}%
                  </span>
                </div>
              </div>
            ))}
          {momComparison.category_changes.filter((c) => c.delta_bdt < 0).length === 0 && (
            <span className="text-sm text-slate-400 font-medium">No decreases this month.</span>
          )}
        </div>
      </div>
    </Card>
  );
};
