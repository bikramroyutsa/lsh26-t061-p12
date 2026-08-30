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
      <div className="flex flex-wrap items-center justify-center sm:justify-between gap-6 p-6 sm:p-8 bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        {/* 1. Salary Field */}
        <div className="flex flex-col gap-1 w-full xl:w-auto min-w-[140px]">
          <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">
            Monthly Salary
          </span>
          {isEditingSalary ? (
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={tempSalary}
                onChange={(e) => setTempSalary(e.target.value)}
                className="w-28 font-bold text-xl rounded-xl px-3 py-1 bg-[#F6F5FB] outline-none"
                autoFocus
              />
              <Button size="sm" variant="primary" onClick={handleSaveSalary}>
                <Check className="w-4 h-4 stroke-[3px]" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-slate-800">
                ৳{salary.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </span>
              <button
                onClick={() => {
                  setTempSalary(salary.toString());
                  setIsEditingSalary(true);
                }}
                className="p-1.5 rounded-full bg-slate-50 hover:bg-slate-100 transition-colors shrink-0"
                title="Edit Salary"
              >
                <Edit2 className="w-4 h-4 stroke-[2.5px] text-slate-400" />
              </button>
            </div>
          )}
        </div>

        <div className="hidden xl:block w-[1px] h-12 bg-gray-100"></div>

        {/* 2. Total Spent So Far */}
        <div className="flex flex-col gap-1 w-full xl:w-auto min-w-[140px]">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">
              Total Spent
            </span>
            <span className="text-[10px] font-bold bg-[#F6F5FB] text-slate-600 px-1.5 py-0.5 rounded-md whitespace-nowrap">
              {spentPercent.toFixed(1)}% Used
            </span>
          </div>
          <span className="text-2xl font-bold text-[#FF6B6B]">
            ৳{forecast.current_spent_bdt.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
          </span>
        </div>

        <div className="hidden xl:block w-[1px] h-12 bg-gray-100"></div>

        {/* 3. Current In-Hand Balance */}
        <div className="flex flex-col gap-1 w-full xl:w-auto min-w-[140px]">
          <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">
            Current Balance
          </span>
          <span
            className={`text-2xl font-bold ${
              netBalance >= 0 ? "text-[#00F0B5]" : "text-[#FF6B6B]"
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
