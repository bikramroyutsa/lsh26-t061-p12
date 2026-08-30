"use client";

import React from "react";
import { useLedger } from "@/context/LedgerContext";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Compass, AlertTriangle, CheckCircle, Flame, CalendarClock, Coins } from "lucide-react";

export const ForecastCard: React.FC = () => {
  const { forecast, selectedMonth } = useLedger();

  return (
    <Card
      variant="white"
      shadow="md"
      header={
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 stroke-[2.5px]" />
            <span>Rest-of-Month Run-Rate Forecast</span>
          </div>
          <Badge variant="secondary" size="sm">
            DAY {forecast.elapsed_days} OF {forecast.total_days_in_month}
          </Badge>
        </div>
      }
      headerBg="secondary"
    >
      {/* Month-End Surplus / Deficit Big Banner */}
      <div
        className={`border border-gray-200 rounded-lg p-5 mb-5 shadow-md flex items-center justify-between flex-wrap gap-4 ${
          forecast.is_deficit ? "bg-white" : "bg-white"
        }`}
      >
        <div className="flex items-center gap-3.5">
          <div
            className={`p-2.5 border border-gray-200 rounded-lg shadow-md ${
              forecast.is_deficit ? "bg-white text-gray-900" : "bg-white text-gray-900"
            }`}
          >
            {forecast.is_deficit ? (
              <AlertTriangle className="w-7 h-7 stroke-[3px]" />
            ) : (
              <CheckCircle className="w-7 h-7 stroke-[3px]" />
            )}
          </div>
          <div>
            <span className="text-xs font-semibold text-sm text-gray-500 block text-gray-900">
              {forecast.is_deficit ? "Projected Month-End Deficit (Shortfall)" : "Projected Month-End Net Savings (Surplus)"}
            </span>
            <span
              className={`text-2xl sm:text-3xl font-semibold ${
                forecast.is_deficit ? "text-[#FF6B6B]" : "text-gray-900"
              }`}
            >
              {forecast.is_deficit ? "- " : "+ "}৳
              {Math.abs(forecast.projected_net_savings_bdt).toLocaleString("en-IN", {
                minimumFractionDigits: 2,
              })}
            </span>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-2.5 shadow-md text-xs font-bold">
          <span className="block text-gray-900 uppercase text-[10px]">Projected Budget Used:</span>
          <span className="text-base font-semibold text-gray-900">
            {forecast.budget_utilization_projected_percent.toFixed(1)}%
          </span>
        </div>
      </div>

      {/* Forecast Metric Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Daily Burn Rate */}
        <div className="border border-gray-200 rounded-lg p-3.5 bg-white shadow-md flex flex-col gap-1">
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase text-gray-900">
            <Flame className="w-4 h-4 text-[#FF6B6B]" />
            <span>Daily Burn Rate</span>
          </div>
          <span className="text-xl font-semibold text-gray-900">
            ৳{forecast.daily_burn_rate_bdt.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            <span className="text-xs font-bold text-gray-900">/day</span>
          </span>
          <span className="text-[11px] font-bold text-gray-900">
            Over past {forecast.elapsed_days} days
          </span>
        </div>

        {/* Expected Rest of Month Spending */}
        <div className="border border-gray-200 rounded-lg p-3.5 bg-white shadow-md flex flex-col gap-1">
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase text-gray-900">
            <CalendarClock className="w-4 h-4 text-[#00E5FF]" />
            <span>Remaining Spending</span>
          </div>
          <span className="text-xl font-semibold text-gray-900">
            ৳{forecast.projected_remaining_spend_bdt.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
          </span>
          <span className="text-[11px] font-bold text-gray-900">
            For remaining {forecast.remaining_days} days
          </span>
        </div>

        {/* Total Projected Monthly Spend */}
        <div className="border border-gray-200 rounded-lg p-3.5 bg-white shadow-md flex flex-col gap-1">
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase text-gray-900">
            <Coins className="w-4 h-4 text-[#FF9F1C]" />
            <span>Total Month Spend</span>
          </div>
          <span className="text-xl font-semibold text-gray-900">
            ৳{forecast.total_projected_spend_bdt.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
          </span>
          <span className="text-[11px] font-bold text-gray-900">
            Against ৳{forecast.salary_bdt.toLocaleString("en-IN")} salary
          </span>
        </div>
      </div>
    </Card>
  );
};
