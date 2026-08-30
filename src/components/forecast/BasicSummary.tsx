"use client";

import React from "react";
import { useLedger } from "@/context/LedgerContext";
import { Calculator } from "lucide-react";

export function BasicSummary() {
  const { salary, forecast } = useLedger();

  return (
    <div className="border border-gray-200 rounded-lg bg-white p-6 shadow-md flex flex-col justify-between gap-6">
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Calculator className="w-5 h-5 text-gray-900" />
          <h2 className="text-xl font-semibold uppercase text-gray-900">
            Basic Monthly Summary
          </h2>
        </div>
        <p className="text-xs font-medium text-gray-500 mb-6">
          A quick look at your numbers without any complex AI analysis.
        </p>
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center border-b border-gray-100 pb-3">
            <span className="text-sm font-medium text-gray-600">Monthly Salary</span>
            <span className="text-base font-bold text-gray-900">৳{salary.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center border-b border-gray-100 pb-3">
            <span className="text-sm font-medium text-gray-600">Current Spent</span>
            <span className="text-base font-bold text-[#FF6B6B]">৳{forecast.current_spent_bdt.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center border-b border-gray-100 pb-3">
            <span className="text-sm font-medium text-gray-600">Projected Remaining Spend</span>
            <span className="text-base font-bold text-orange-500">৳{forecast.projected_remaining_spend_bdt.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center pt-2 bg-gray-50 p-3 rounded-md border border-gray-100">
            <span className="text-sm font-bold text-gray-900">Projected Month-End</span>
            <span className={`text-lg font-bold ${forecast.is_deficit ? 'text-[#FF6B6B]' : 'text-emerald-600'}`}>
              {forecast.is_deficit ? '-' : '+'}৳{Math.abs(forecast.projected_net_savings_bdt).toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
