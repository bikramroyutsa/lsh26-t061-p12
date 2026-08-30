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
      variant="outline"
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
        className={`rounded-2xl p-5 mb-5 shadow-sm flex items-center justify-between flex-wrap gap-4 ${
          forecast.is_deficit ? "bg-white" : "bg-white"
        }`}
      >
        <div className="flex items-center gap-3.5">
          <div
            className={`p-2.5 rounded-2xl shadow-sm ${
              forecast.is_deficit ? "bg-white text-slate-800" : "bg-white text-slate-800"
            }`}
          >
            {forecast.is_deficit ? (
              <AlertTriangle className="w-7 h-7 stroke-[3px]" />
            ) : (
              <CheckCircle className="w-7 h-7 stroke-[3px]" />
            )}
          </div>
          <div>
            <span className="text-xs font-semibold text-sm text-gray-500 block text-slate-800">
              {forecast.is_deficit ? "Projected Month-End Deficit (Shortfall)" : "Projected Month-End Net Savings (Surplus)"}
            </span>
            <span
              className={`text-2xl sm:text-3xl font-semibold ${
                forecast.is_deficit ? "text-[#FF6B6B]" : "text-slate-800"
              }`}
            >
              {forecast.is_deficit ? "- " : "+ "}৳
              {Math.abs(forecast.projected_net_savings_bdt).toLocaleString("en-IN", {
                minimumFractionDigits: 2,
              })}
            </span>
          </div>
        </div>

        <div className="bg-white bg-[#F6F5FB] rounded-xl p-3.5 shadow-sm text-xs font-bold">
          <span className="block text-slate-800 uppercase text-[10px]">Projected Budget Used:</span>
          <span className="text-base font-semibold text-slate-800">
            {forecast.budget_utilization_projected_percent.toFixed(1)}%
          </span>
        </div>
      </div>

      {/* Forecast Metric Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Daily Burn Rate */}
        <div className="bg-white rounded-2xl shadow-sm p-4 border border-gray-50 flex flex-col gap-1">
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase text-slate-800">
            <Flame className="w-4 h-4 text-[#FF6B6B]" />
            <span>Daily Burn Rate</span>
          </div>
          <span className="text-xl font-semibold text-slate-800">
            ৳{forecast.daily_burn_rate_bdt.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            <span className="text-xs font-bold text-slate-800">/day</span>
          </span>
          <span className="text-[11px] font-bold text-slate-800">
            Over past {forecast.elapsed_days} days
          </span>
        </div>

        {/* Expected Rest of Month Spending */}
        <div className="bg-white rounded-2xl shadow-sm p-4 border border-gray-50 flex flex-col gap-1">
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase text-slate-800">
            <CalendarClock className="w-4 h-4 text-[#00E5FF]" />
            <span>Remaining Spending</span>
          </div>
          <span className="text-xl font-semibold text-slate-800">
            ৳{forecast.projected_remaining_spend_bdt.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
          </span>
          <span className="text-[11px] font-bold text-slate-800">
            For remaining {forecast.remaining_days} days
          </span>
        </div>

        {/* Total Projected Monthly Spend */}
        <div className="bg-white rounded-2xl shadow-sm p-4 border border-gray-50 flex flex-col gap-1">
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase text-slate-800">
            <Coins className="w-4 h-4 text-[#FF9F1C]" />
            <span>Total Month Spend</span>
          </div>
          <span className="text-xl font-semibold text-slate-800">
            ৳{forecast.total_projected_spend_bdt.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
          </span>
          <span className="text-[11px] font-bold text-slate-800">
            Against ৳{forecast.salary_bdt.toLocaleString("en-IN")} salary
          </span>
        </div>
      </div>
    </Card>
  );
};
