"use client";

import React, { useState } from "react";
import { useLedger } from "@/context/LedgerContext";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Badge } from "@/components/ui/Badge";
import { Edit2, Check, Wallet, TrendingDown, DollarSign } from "lucide-react";

export const SalaryOverview: React.FC = () => {
  const { salary, setSalary, forecast, selectedMonth } = useLedger();
  const [isEditingSalary, setIsEditingSalary] = useState(false);
  const [tempSalary, setTempSalary] = useState(salary.toString());

  const handleSaveSalary = () => {
    const val = parseFloat(tempSalary);
    if (!isNaN(val) && val >= 0) {
      setSalary(val);
    }
    setIsEditingSalary(false);
  };

  const spentPercent = salary > 0 ? (forecast.current_spent_bdt / salary) * 100 : 0;
  const netBalance = salary - forecast.current_spent_bdt;

  return (
    <Card
      variant="outline"
      shadow="md"
      header={
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <Wallet className="w-5 h-5 stroke-[2.5px]" />
            <span>Monthly Cashflow & Salary Tracker</span>
          </div>
          <Badge variant="primary" size="sm">
            {selectedMonth}
          </Badge>
        </div>
      }
      headerBg="secondary"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        {/* 1. Salary Field */}
        <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 sm:p-8 flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase text-slate-800 tracking-wider">
            Monthly Salary (BDT)
          </span>
          {isEditingSalary ? (
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={tempSalary}
                onChange={(e) => setTempSalary(e.target.value)}
                className="w-full font-semibold text-xl rounded-2xl px-2 py-1 bg-white outline-none"
                autoFocus
              />
              <Button size="sm" variant="primary" onClick={handleSaveSalary}>
                <Check className="w-4 h-4 stroke-[3px]" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <span className="text-2xl font-semibold text-slate-800">
                ৳{salary.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </span>
              <button
                onClick={() => {
                  setTempSalary(salary.toString());
                  setIsEditingSalary(true);
                }}
                className="p-1.5 rounded-2xl bg-white hover:bg-white shadow-sm active:translate-x-0.5 active:translate-y-0.5 transition-all"
                title="Edit Salary"
              >
                <Edit2 className="w-3.5 h-3.5 stroke-[2.5px]" />
              </button>
            </div>
          )}
        </div>

        {/* 2. Total Spent So Far */}
        <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 sm:p-8 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-800 tracking-wider">
              Total Spent So Far
            </span>
            <Badge variant="primary" size="sm">
              {spentPercent.toFixed(1)}% of Salary
            </Badge>
          </div>
          <span className="text-2xl font-semibold text-[#FF6B6B]">
            ৳{forecast.current_spent_bdt.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
          </span>
        </div>

        {/* 3. Current In-Hand Balance */}
        <div
          className={`rounded-2xl p-4 shadow-sm flex flex-col gap-2 ${
            netBalance >= 0 ? "bg-white" : "bg-white"
          }`}
        >
          <span className="text-xs font-semibold uppercase text-slate-800 tracking-wider">
            Current Balance (In-Hand)
          </span>
          <span
            className={`text-2xl font-semibold ${
              netBalance >= 0 ? "text-slate-800" : "text-[#FF6B6B]"
            }`}
          >
            ৳{netBalance.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      {/* Live Spend Progress Bar */}
      <div className="mt-6 pt-4 border-gray-200 flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs font-semibold uppercase">
          <span>Actual Spent: ৳{forecast.current_spent_bdt.toLocaleString("en-IN")}</span>
          <span>
            Projected Month-End Spend: ৳{forecast.total_projected_spend_bdt.toLocaleString("en-IN")}
          </span>
        </div>
        <ProgressBar
          value={spentPercent}
          variant={spentPercent > 80 ? "accent" : spentPercent > 50 ? "secondary" : "mint"}
          height="md"
        />
      </div>
    </Card>
  );
};
