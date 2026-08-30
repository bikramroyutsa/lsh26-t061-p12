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
      variant="white"
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
        className={`border-3 border-black p-4 mb-4 shadow-neo-xs flex items-center justify-between flex-wrap gap-3 ${
          isSpendIncreased ? "bg-[#FF6B6B]/20" : "bg-[#00F0B5]/20"
        }`}
      >
        <div className="flex items-center gap-3">
          {isSpendIncreased ? (
            <div className="p-2 border-2 border-black bg-[#FF6B6B] text-black shadow-neo-xs">
              <TrendingUp className="w-6 h-6 stroke-[3px]" />
            </div>
          ) : (
            <div className="p-2 border-2 border-black bg-[#00F0B5] text-black shadow-neo-xs">
              <TrendingDown className="w-6 h-6 stroke-[3px]" />
            </div>
          )}
          <div>
            <span className="text-xs font-black uppercase text-black/60 block">
              Net Spending Delta
            </span>
            <span className="text-xl font-black text-black">
              {isSpendIncreased ? "+" : "-"}৳
              {Math.abs(momComparison.delta_bdt).toLocaleString("en-IN", {
                minimumFractionDigits: 2,
              })}{" "}
              <span className="text-sm font-bold text-black/70">
                ({isSpendIncreased ? "+" : ""}
                {momComparison.delta_percentage.toFixed(1)}%)
              </span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-bold text-black/70">
          <div>
            <span className="block text-[10px] uppercase text-black/50">
              {momComparison.last_month} Total:
            </span>
            <span className="font-black text-black">
              ৳{momComparison.last_month_spent_bdt.toLocaleString("en-IN")}
            </span>
          </div>
          <div className="w-[2px] h-8 bg-black/20" />
          <div>
            <span className="block text-[10px] uppercase text-black/50">
              {momComparison.this_month} Total:
            </span>
            <span className="font-black text-black">
              ৳{momComparison.this_month_spent_bdt.toLocaleString("en-IN")}
            </span>
          </div>
        </div>
      </div>

      {/* Category Level MoM Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b-2 border-black bg-[#FFFDF5] text-[11px] font-black uppercase">
              <th className="py-2 px-2">Category</th>
              <th className="py-2 px-2 text-right">{momComparison.last_month}</th>
              <th className="py-2 px-2 text-right">{momComparison.this_month}</th>
              <th className="py-2 px-2 text-right">Change (BDT)</th>
              <th className="py-2 px-2 text-right">% Change</th>
            </tr>
          </thead>
          <tbody className="divide-y border-b-2 border-black">
            {momComparison.category_changes.map((item) => {
              const increased = item.delta_bdt > 0;
              const isZero = item.delta_bdt === 0;

              return (
                <tr key={item.category} className="hover:bg-gray-50 text-xs font-bold">
                  <td className="py-2 px-2 font-black uppercase">{item.category}</td>
                  <td className="py-2 px-2 text-right text-black/60">
                    ৳{item.last_bdt.toLocaleString("en-IN")}
                  </td>
                  <td className="py-2 px-2 text-right text-black">
                    ৳{item.this_bdt.toLocaleString("en-IN")}
                  </td>
                  <td
                    className={`py-2 px-2 text-right font-black ${
                      isZero ? "text-black/50" : increased ? "text-[#FF6B6B]" : "text-[#00B894]"
                    }`}
                  >
                    {isZero ? "৳0.00" : `${increased ? "+" : "-"}৳${Math.abs(item.delta_bdt).toLocaleString("en-IN")}`}
                  </td>
                  <td className="py-2 px-2 text-right">
                    <span
                      className={`inline-block px-1.5 py-0.5 border border-black text-[10px] font-black ${
                        isZero
                          ? "bg-white text-black/50"
                          : increased
                          ? "bg-[#FF6B6B]/20 text-[#FF6B6B]"
                          : "bg-[#00F0B5]/20 text-black"
                      }`}
                    >
                      {isZero ? "0.0%" : `${increased ? "+" : ""}${item.delta_percentage.toFixed(1)}%`}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
};
