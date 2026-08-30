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
        <div className="border-3 border-black p-3.5 bg-[#FFFDF5] shadow-neo-xs flex items-center gap-3">
          <div className="p-2 border-2 border-black bg-[#00E5FF] shadow-neo-xs">
            <Sliders className="w-5 h-5 stroke-[2.5px]" />
          </div>
          <div className="text-xs font-bold text-black/80">
            Select an expense category and simulate a percentage spending reduction. Watch how extra savings instantly pull forward completion dates for all your savings pockets!
          </div>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Category Selector */}
          <div className="border-3 border-black p-4 bg-white shadow-neo-xs flex flex-col gap-2">
            <label className="text-xs font-black uppercase text-black">
              1. Select Category to Optimize
            </label>
            <select
              value={whatIfCategory}
              onChange={(e) => setWhatIf(e.target.value, whatIfCutPercent)}
              className="w-full p-2.5 font-black text-sm border-3 border-black bg-[#FFD93D] outline-none shadow-neo-xs"
            >
              {allCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Cut Percentage Slider */}
          <div className="border-3 border-black p-4 bg-white shadow-neo-xs flex flex-col justify-center">
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
            <div className="border-3 border-black p-4 bg-[#00F0B5]/25 shadow-neo-xs grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
              <div>
                <span className="text-[10px] font-black uppercase text-black/60 block">
                  Category Forecast
                </span>
                <span className="text-base font-black text-black">
                  ৳{whatIfResult.current_category_projected_bdt.toLocaleString("en-IN")}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-black uppercase text-black/60 block">
                  Monthly Cash Saved
                </span>
                <span className="text-base font-black text-[#00B894]">
                  +৳{whatIfResult.saved_amount_bdt.toLocaleString("en-IN", { minimumFractionDigits: 2 })}/mo
                </span>
              </div>
              <div>
                <span className="text-[10px] font-black uppercase text-black/60 block">
                  New Projected Surplus
                </span>
                <span className="text-base font-black text-black">
                  ৳{whatIfResult.new_projected_surplus_bdt.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            {/* Impact on Pockets Table */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-black flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#FFD93D]" /> Immediate Effect on Savings Pocket Target Dates
              </span>

              <div className="border-3 border-black overflow-x-auto shadow-neo-xs">
                <table className="w-full text-left text-xs font-bold border-collapse bg-white">
                  <thead className="bg-[#00E5FF] border-b-2 border-black text-[11px] font-black uppercase">
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
                          <span className="font-black block text-black">{shift.pocket_name}</span>
                          <span className="text-[10px] text-black/60">{shift.item}</span>
                        </td>
                        <td className="p-2.5 text-black/70">
                          {shift.original_completion_date}
                        </td>
                        <td className="p-2.5 font-black text-black">
                          <span className="bg-[#00F0B5] px-2 py-0.5 border border-black shadow-neo-xs inline-flex items-center gap-1">
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
                            <span className="text-[10px] text-black/50 font-bold">Unchanged</span>
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
          <div className="p-6 text-center border-2 border-dashed border-black bg-white/50 text-xs font-bold text-black/60">
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
