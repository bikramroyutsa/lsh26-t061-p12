"use client";

import React, { useState } from "react";
import { useLedger } from "@/context/LedgerContext";
import { SavingsPocket, DPSCalculationResult } from "@/types/pocket";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Slider } from "@/components/ui/Slider";
import { DPSBreakdownModal } from "./DPSBreakdownModal";
import { Target, Calendar, Landmark, Trash2 } from "lucide-react";

interface PocketCardProps {
  pocket: SavingsPocket & {
    calculatedCompletionDate: string;
    calculatedMonths: number;
    isSurplusConstrained: boolean;
    dpsResult: DPSCalculationResult;
  };
}

export const PocketCard: React.FC<PocketCardProps> = ({ pocket }) => {
  const { updatePocketContribution, deletePocket, dpsRule } = useLedger();
  const [isDPSModalOpen, setIsDPSModalOpen] = useState(false);

  return (
    <>
      <Card
        variant="outline"
        shadow="md"
        hoverLift
        header={
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 stroke-[2.5px]" />
              <span>{pocket.name}</span>
            </div>
            <Badge variant="primary" size="sm">
              {pocket.item}
            </Badge>
          </div>
        }
        headerBg="secondary"
      >
        <div className="flex flex-col gap-4">
          {/* Target & Forecast Completion Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-white rounded-2xl shadow-sm p-4 border border-gray-50 flex flex-col gap-0.5">
              <span className="text-[10px] font-semibold uppercase text-slate-800">
                Target Amount (BDT)
              </span>
              <span className="text-xl font-semibold text-slate-800">
                ৳{pocket.target_bdt.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </span>
            </div>

            <div
              className={`rounded-2xl p-3 shadow-sm flex flex-col gap-0.5 ${
                pocket.isSurplusConstrained ? "bg-white" : "bg-white"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold uppercase text-slate-800 flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> Forecast Target Date
                </span>
                {pocket.isSurplusConstrained && (
                  <span className="text-[9px] font-semibold bg-white text-slate-800 px-1 border-none">
                    Constrained
                  </span>
                )}
              </div>
              <span className="text-xl font-semibold text-slate-800">
                {pocket.calculatedCompletionDate}
              </span>
              <span className="text-[10px] font-bold text-slate-800">
                {pocket.calculatedMonths < 900
                  ? `~${pocket.calculatedMonths} months runway`
                  : "Requires higher surplus"}
              </span>
            </div>
          </div>

          {/* Interactive Monthly Contribution Slider (Bonus 1) */}
          <div className="bg-white rounded-2xl shadow-sm p-4 border border-gray-50 flex flex-col gap-2">
            <Slider
              label="Monthly Contribution (Live Slider)"
              value={pocket.monthly_contribution_bdt}
              min={0}
              max={Math.max(50000, pocket.target_bdt)}
              step={500}
              valueFormatter={(v) => `৳${v.toLocaleString("en-IN")}/mo`}
              onChange={(newVal) => updatePocketContribution(pocket.id, newVal)}
              helperText="Drag slider to instantly shift completion date"
            />
          </div>

          {/* DPS Return Teaser & Compound Details Button */}
          <div className="bg-white rounded-2xl shadow-sm p-4 border border-gray-50 flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-white rounded-2xl shadow-sm">
                <Landmark className="w-4 h-4" />
              </div>
              <div>
                <span className="block text-[10px] font-semibold uppercase text-slate-800">
                  DPS Compound Yield ({pocket.dpsResult.annual_rate_percent}% p.a.)
                </span>
                <span className="font-semibold text-sm text-[#00B894]">
                  +৳{pocket.dpsResult.total_interest_earned_bdt.toLocaleString("en-IN", { minimumFractionDigits: 2 })} interest
                </span>
              </div>
            </div>

            <Button
              variant="muted"
              size="sm"
              onClick={() => setIsDPSModalOpen(true)}
            >
              DPS Table
            </Button>
          </div>

          {/* Delete Button */}
          <div className="flex justify-end pt-1">
            <button
              onClick={() => deletePocket(pocket.id)}
              className="text-xs font-bold text-[#FF6B6B] hover:text-slate-800 hover:underline flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" /> Remove Pocket
            </button>
          </div>
        </div>
      </Card>

      <DPSBreakdownModal
        isOpen={isDPSModalOpen}
        onClose={() => setIsDPSModalOpen(false)}
        pocketName={pocket.name}
        itemName={pocket.item}
        dpsResult={pocket.dpsResult}
        dpsRule={dpsRule}
      />
    </>
  );
};
