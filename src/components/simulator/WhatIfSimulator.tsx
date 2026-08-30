"use client";

import React from "react";
import { useLedger } from "@/context/LedgerContext";
import { Modal } from "@/components/ui/Modal";
import { Slider } from "@/components/ui/Slider";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Sliders, Sparkles, CheckCircle } from "lucide-react";

interface WhatIfSimulatorProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WhatIfSimulator: React.FC<WhatIfSimulatorProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    expenses,
    whatIfCategory,
    whatIfCutPercent,
    setWhatIf,
    whatIfResult,
  } = useLedger();

  const allCategories = Array.from(new Set(expenses.map((e) => e.category)));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="What-If Category Cut Scenario Simulator"
      headerBg="cyan"
      maxWidth="xl"
    >
      <div className="flex flex-col gap-6">
        {/* Intro */}
        <div className="bg-white rounded-2xl shadow-sm p-4 border border-gray-50 flex items-center gap-3">
          <div className="p-2 rounded-2xl bg-white shadow-sm">
            <Sliders className="w-5 h-5 stroke-[2.5px]" />
          </div>
          <div className="text-xs font-bold text-slate-800">
            Select an expense category and simulate a percentage spending reduction. Watch how extra savings instantly pull forward completion dates for all your savings pockets!
          </div>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Category Selector */}
          <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 sm:p-8 flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase text-slate-800">
              1. Select Category to Optimize
            </label>
            <select
              value={whatIfCategory}
              onChange={(e) => setWhatIf(e.target.value, whatIfCutPercent)}
              className="w-full p-2.5 font-semibold text-sm rounded-2xl bg-white outline-none shadow-sm"
            >
              {allCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Cut Percentage Slider */}
          <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 sm:p-8 flex flex-col justify-center">
            <Slider
              label="2. Spending Cut Percentage"
              value={whatIfCutPercent}
              min={0}
              max={100}
              step={5}
              valueFormatter={(v) => `${v}% CUT`}
              onChange={(newVal) => setWhatIf(whatIfCategory, newVal)}
            />
          </div>
        </div>

        {/* Real-time Calculation Results Banner */}
        {whatIfResult && whatIfCutPercent > 0 ? (
          <div className="flex flex-col gap-4">
            <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 sm:p-8 grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
              <div>
                <span className="text-[10px] font-semibold uppercase text-slate-800 block">
                  Category Forecast
                </span>
                <span className="text-base font-semibold text-slate-800">
                  ৳{whatIfResult.current_category_projected_bdt.toLocaleString("en-IN")}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-semibold uppercase text-slate-800 block">
                  Monthly Cash Saved
                </span>
                <span className="text-base font-semibold text-[#00B894]">
                  +৳{whatIfResult.saved_amount_bdt.toLocaleString("en-IN", { minimumFractionDigits: 2 })}/mo
                </span>
              </div>
              <div>
                <span className="text-[10px] font-semibold uppercase text-slate-800 block">
                  New Projected Surplus
                </span>
                <span className="text-base font-semibold text-slate-800">
                  ৳{whatIfResult.new_projected_surplus_bdt.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            {/* Impact on Pockets Table */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold text-sm text-gray-500 text-slate-800 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#FFD93D]" /> Immediate Effect on Savings Pocket Target Dates
              </span>

              <div className="rounded-2xl overflow-x-auto shadow-sm">
                <table className="w-full text-left text-xs font-bold border-collapse bg-white">
                  <thead className="bg-white border-gray-200 text-[11px] font-semibold uppercase">
                    <tr>
                      <th className="p-2.5">Pocket Goal</th>
                      <th className="p-2.5">Original Target Date</th>
                      <th className="p-2.5">New Target Date</th>
                      <th className="p-2.5 text-right">Time Saved</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/10">
                    {whatIfResult.shifts.map((shift) => (
                      <tr key={shift.pocket_id} className="hover:bg-cyan-50">
                        <td className="p-2.5">
                          <span className="font-semibold block text-slate-800">{shift.pocket_name}</span>
                          <span className="text-[10px] text-slate-800">{shift.item}</span>
                        </td>
                        <td className="p-2.5 text-slate-800">
                          {shift.original_completion_date}
                        </td>
                        <td className="p-2.5 font-semibold text-slate-800">
                          <span className="bg-[#EAE5F8] text-[#554089] px-2 py-0.5 rounded-full border-none shadow-sm inline-flex items-center gap-1">
                            <CheckCircle className="w-3 h-3 stroke-[3px]" />
                            {shift.new_completion_date}
                          </span>
                        </td>
                        <td className="p-2.5 text-right">
                          {shift.months_saved > 0 ? (
                            <Badge variant="primary" size="sm">
                              {shift.months_saved} MONTHS FASTER
                            </Badge>
                          ) : (
                            <span className="text-[10px] text-slate-800 font-bold">Unchanged</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6 text-center border border-dashed border-gray-200 bg-white/50 text-xs font-bold text-slate-800">
            Slide the cut percentage above 0% to see live pocket completion dates shift forward.
          </div>
        )}

        <div className="flex justify-end pt-2">
          <Button variant="secondary" onClick={onClose}>
            Done Exploring
          </Button>
        </div>
      </div>
    </Modal>
  );
};
