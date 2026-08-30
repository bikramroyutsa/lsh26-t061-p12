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
        className={`border border-gray-200 rounded-lg p-4 mb-4 shadow-md flex items-center justify-between flex-wrap gap-3 ${
          isSpendIncreased ? "bg-white" : "bg-white"
        }`}
      >
        <div className="flex items-center gap-3">
          {isSpendIncreased ? (
            <div className="p-2 border border-gray-200 rounded-lg bg-white text-gray-900 shadow-md">
              <TrendingUp className="w-6 h-6 stroke-[3px]" />
            </div>
          ) : (
            <div className="p-2 border border-gray-200 rounded-lg bg-white text-gray-900 shadow-md">
              <TrendingDown className="w-6 h-6 stroke-[3px]" />
            </div>
          )}
          <div>
            <span className="text-xs font-semibold uppercase text-gray-900 block">
              Net Spending Delta
            </span>
            <span className="text-xl font-semibold text-gray-900">
              {isSpendIncreased ? "+" : "-"}৳
              {Math.abs(momComparison.delta_bdt).toLocaleString("en-IN", {
                minimumFractionDigits: 2,
              })}{" "}
              <span className="text-sm font-bold text-gray-900">
                ({isSpendIncreased ? "+" : ""}
                {momComparison.delta_percentage.toFixed(1)}%)
              </span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-bold text-gray-900">
          <div>
            <span className="block text-[10px] uppercase text-gray-900">
              {momComparison.last_month} Total:
            </span>
            <span className="font-semibold text-gray-900">
              ৳{momComparison.last_month_spent_bdt.toLocaleString("en-IN")}
            </span>
          </div>
          <div className="w-[2px] h-8 bg-indigo-600/20" />
          <div>
            <span className="block text-[10px] uppercase text-gray-900">
              {momComparison.this_month} Total:
            </span>
            <span className="font-semibold text-gray-900">
              ৳{momComparison.this_month_spent_bdt.toLocaleString("en-IN")}
            </span>
          </div>
        </div>
      </div>

      {/* Category Level MoM Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-gray-200 bg-white text-[11px] font-semibold uppercase">
              <th className="py-2 px-2">Category</th>
              <th className="py-2 px-2 text-right">{momComparison.last_month}</th>
              <th className="py-2 px-2 text-right">{momComparison.this_month}</th>
              <th className="py-2 px-2 text-right">Change (BDT)</th>
              <th className="py-2 px-2 text-right">% Change</th>
            </tr>
          </thead>
          <tbody className="divide-y border-gray-200">
            {momComparison.category_changes.map((item) => {
              const increased = item.delta_bdt > 0;
              const isZero = item.delta_bdt === 0;

              return (
                <tr key={item.category} className="hover:bg-gray-50 text-xs font-bold">
                  <td className="py-2 px-2 font-semibold uppercase">{item.category}</td>
                  <td className="py-2 px-2 text-right text-gray-900">
                    ৳{item.last_bdt.toLocaleString("en-IN")}
                  </td>
                  <td className="py-2 px-2 text-right text-gray-900">
                    ৳{item.this_bdt.toLocaleString("en-IN")}
                  </td>
                  <td
                    className={`py-2 px-2 text-right font-semibold ${
                      isZero ? "text-gray-900" : increased ? "text-[#FF6B6B]" : "text-[#00B894]"
                    }`}
                  >
                    {isZero ? "৳0.00" : `${increased ? "+" : "-"}৳${Math.abs(item.delta_bdt).toLocaleString("en-IN")}`}
                  </td>
                  <td className="py-2 px-2 text-right">
                    <span
                      className={`inline-block px-1.5 py-0.5 border border-gray-200 text-[10px] font-semibold ${
                        isZero
                          ? "bg-white text-gray-900"
                          : increased
                          ? "bg-white text-[#FF6B6B]"
                          : "bg-white text-gray-900"
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
