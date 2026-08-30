"use client";

import React from "react";
import { useLedger } from "@/context/LedgerContext";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { PieChart, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { roundHalfUp } from "@/lib/calculations/dps";

export const CategoryBreakdown: React.FC = () => {
  const { expenses, selectedMonth, momComparison } = useLedger();

  const monthExpenses = expenses.filter((e) => e.date.startsWith(selectedMonth));
  const totalSpent = monthExpenses.reduce((sum, e) => sum + e.amount_bdt, 0);

  // Group by category
  const categoryMap: Record<string, { total: number; count: number }> = {};
  monthExpenses.forEach((e) => {
    if (!categoryMap[e.category]) {
      categoryMap[e.category] = { total: 0, count: 0 };
    }
    categoryMap[e.category].total += e.amount_bdt;
    categoryMap[e.category].count += 1;
  });

  const sortedCategories = Object.entries(categoryMap)
    .map(([cat, data]) => {
      const percentage = totalSpent > 0 ? (data.total / totalSpent) * 100 : 0;
      const momData = momComparison.category_changes.find((c) => c.category === cat);
      return {
        category: cat,
        total: roundHalfUp(data.total, 2),
        count: data.count,
        percentage: roundHalfUp(percentage, 1),
        delta_bdt: momData?.delta_bdt || 0,
        delta_percentage: momData?.delta_percentage || 0,
      };
    })
    .sort((a, b) => b.total - a.total);

  const getCategoryColor = (index: number) => {
    const colors = ["#FFD93D", "#FF6B6B", "#00F0B5", "#C4B5FD", "#00E5FF", "#FF9F1C", "#FF70A6"];
    return colors[index % colors.length];
  };

  return (
    <Card
      variant="white"
      shadow="md"
      header={
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <PieChart className="w-5 h-5 stroke-[2.5px]" />
            <span>Category Spending Breakdown</span>
          </div>
          <span className="text-xs font-bold text-gray-900">
            {sortedCategories.length} Active Categories
          </span>
        </div>
      }
      headerBg="muted"
    >
      {sortedCategories.length === 0 ? (
        <div className="text-center py-8 font-bold text-gray-900">
          No expenses recorded for {selectedMonth}.
        </div>
      ) : (
        <div className="flex flex-col gap-3.5">
          {sortedCategories.map((item, idx) => {
            const barBg = getCategoryColor(idx);
            return (
              <div
                key={item.category}
                className="border border-gray-200 rounded-lg p-3 bg-white shadow-md flex flex-col gap-2 hover:bg-white transition-all"
              >
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-4 h-4 border border-gray-200 rounded-lg inline-block shadow-md"
                      style={{ backgroundColor: barBg }}
                    />
                    <span className="font-semibold text-sm uppercase">{item.category}</span>
                    <span className="text-xs font-bold text-gray-900">({item.count} items)</span>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* MoM Delta Indicator */}
                    {item.delta_bdt !== 0 && (
                      <span
                        className={`text-xs font-bold flex items-center gap-0.5 px-1.5 py-0.5 border border-gray-200 ${
                          item.delta_bdt > 0 ? "bg-white text-[#FF6B6B]" : "bg-white text-gray-900"
                        }`}
                      >
                        {item.delta_bdt > 0 ? (
                          <ArrowUpRight className="w-3 h-3 stroke-[3px]" />
                        ) : (
                          <ArrowDownRight className="w-3 h-3 stroke-[3px]" />
                        )}
                        ৳{Math.abs(item.delta_bdt).toLocaleString("en-IN")}
                      </span>
                    )}

                    <span className="font-semibold text-sm text-gray-900">
                      ৳{item.total.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </span>
                    <Badge variant="white" size="sm">
                      {item.percentage}%
                    </Badge>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full h-3.5 bg-white border border-gray-200 rounded-lg overflow-hidden relative">
                  <div
                    className="h-full border-gray-200 transition-all duration-300"
                    style={{
                      width: `${item.percentage}%`,
                      backgroundColor: barBg,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
};
