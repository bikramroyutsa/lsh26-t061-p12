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
        <div className="border border-gray-200 rounded-lg p-3.5 bg-white shadow-md flex items-center gap-3">
          <div className="p-2 border border-gray-200 rounded-lg bg-white shadow-md">
            <Sliders className="w-5 h-5 stroke-[2.5px]" />
          </div>
          <div className="text-xs font-bold text-gray-900">
            Select an expense category and simulate a percentage spending reduction. Watch how extra savings instantly pull forward completion dates for all your savings pockets!
          </div>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Category Selector */}
          <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-md flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase text-gray-900">
              1. Select Category to Optimize
            </label>
            <select
              value={whatIfCategory}
              onChange={(e) => setWhatIf(e.target.value, whatIfCutPercent)}
              className="w-full p-2.5 font-semibold text-sm border border-gray-200 rounded-lg bg-white outline-none shadow-md"
            >
              {allCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Cut Percentage Slider */}
          <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-md flex flex-col justify-center">
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
            <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-md grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
              <div>
                <span className="text-[10px] font-semibold uppercase text-gray-900 block">
                  Category Forecast
                </span>
                <span className="text-base font-semibold text-gray-900">
                  ৳{whatIfResult.current_category_projected_bdt.toLocaleString("en-IN")}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-semibold uppercase text-gray-900 block">
                  Monthly Cash Saved
                </span>
                <span className="text-base font-semibold text-[#00B894]">
                  +৳{whatIfResult.saved_amount_bdt.toLocaleString("en-IN", { minimumFractionDigits: 2 })}/mo
                </span>
              </div>
              <div>
                <span className="text-[10px] font-semibold uppercase text-gray-900 block">
                  New Projected Surplus
                </span>
                <span className="text-base font-semibold text-gray-900">
                  ৳{whatIfResult.new_projected_surplus_bdt.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            {/* Impact on Pockets Table */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold text-sm text-gray-500 text-gray-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#FFD93D]" /> Immediate Effect on Savings Pocket Target Dates
              </span>

              <div className="border border-gray-200 rounded-lg overflow-x-auto shadow-md">
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
                          <span className="font-semibold block text-gray-900">{shift.pocket_name}</span>
                          <span className="text-[10px] text-gray-900">{shift.item}</span>
                        </td>
                        <td className="p-2.5 text-gray-900">
                          {shift.original_completion_date}
                        </td>
                        <td className="p-2.5 font-semibold text-gray-900">
                          <span className="bg-white px-2 py-0.5 border border-gray-200 shadow-md inline-flex items-center gap-1">
                            <CheckCircle className="w-3 h-3 stroke-[3px]" />
                            {shift.new_completion_date}
                          </span>
                        </td>
                        <td className="p-2.5 text-right">
                          {shift.months_saved > 0 ? (
                            <Badge variant="accent" size="sm">
                              {shift.months_saved} MONTHS FASTER
                            </Badge>
                          ) : (
                            <span className="text-[10px] text-gray-900 font-bold">Unchanged</span>
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
          <div className="p-6 text-center border border-dashed border-gray-200 bg-white/50 text-xs font-bold text-gray-900">
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
