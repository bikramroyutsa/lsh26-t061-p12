"use client";

import React from "react";
import { Modal } from "@/components/ui/Modal";
import { DPSCalculationResult } from "@/types/pocket";
import { Badge } from "@/components/ui/Badge";
import { Landmark, TrendingUp } from "lucide-react";

interface DPSBreakdownModalProps {
  isOpen: boolean;
  onClose: () => void;
  pocketName: string;
  itemName: string;
  dpsResult: DPSCalculationResult;
  dpsRule: string;
}

export const DPSBreakdownModal: React.FC<DPSBreakdownModalProps> = ({
  isOpen,
  onClose,
  pocketName,
  itemName,
  dpsResult,
  dpsRule,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`DPS Yield Analysis: ${pocketName} (${itemName})`}
      headerBg="secondary"
      maxWidth="xl"
    >
      <div className="flex flex-col gap-5">
        {/* Stated DPS Rate & Rule Explanation */}
        <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-md flex flex-col gap-2">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Landmark className="w-5 h-5 text-gray-900" />
              <span className="font-semibold text-sm uppercase">
                Bangladesh Banking DPS Standard
              </span>
            </div>
            <Badge variant="accent" size="sm">
              RATE: {dpsResult.annual_rate_percent.toFixed(2)}% P.A.
            </Badge>
          </div>
          <div className="text-xs font-bold text-gray-900 bg-white border border-gray-200 rounded-lg p-2.5">
            <span className="font-semibold block uppercase text-[10px] text-gray-900 mb-1">
              Interest Calculation & Compounding Rule:
            </span>
            {dpsRule ||
              "Annual rate as stated. Each month: balance = balance + deposit, then interest = balance × rate / 12 / 100 rounded half up to the paisa and added to the balance."}
          </div>
        </div>

        {/* Summary Numbers */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
          <div className="border border-gray-200 rounded-lg p-3 bg-white shadow-md">
            <span className="block text-[10px] font-semibold uppercase text-gray-900">
              Total Principal Deposited
            </span>
            <span className="text-lg font-semibold text-gray-900">
              ৳{dpsResult.total_principal_bdt.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </span>
          </div>

          <div className="border border-gray-200 rounded-lg p-3 bg-white shadow-md">
            <span className="block text-[10px] font-semibold uppercase text-gray-900">
              Compound Interest Earned
            </span>
            <span className="text-lg font-semibold text-[#00B894]">
              +৳{dpsResult.total_interest_earned_bdt.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </span>
          </div>

          <div className="border border-gray-200 rounded-lg p-3 bg-white shadow-md">
            <span className="block text-[10px] font-semibold uppercase text-gray-900">
              Maturity Total (Return)
            </span>
            <span className="text-lg font-semibold text-gray-900">
              ৳{dpsResult.maturity_amount_bdt.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        {/* Month-by-Month Compound Schedule */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold text-sm text-gray-500 text-gray-900 flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4" /> Month-by-Month Compounding Schedule (First {Math.min(24, dpsResult.schedule.length)} Months)
          </span>
          <div className="overflow-x-auto max-h-60 border border-gray-200 rounded-lg shadow-md">
            <table className="w-full text-left text-xs font-bold border-collapse bg-white">
              <thead className="sticky top-0 bg-white border-gray-200 text-[11px] font-semibold uppercase">
                <tr>
                  <th className="p-2">Month</th>
                  <th className="p-2 text-right">Deposit</th>
                  <th className="p-2 text-right">Balance Pre-Int</th>
                  <th className="p-2 text-right">Interest Added</th>
                  <th className="p-2 text-right">Closing Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/10">
                {dpsResult.schedule.slice(0, 36).map((row) => (
                  <tr key={row.month} className="hover:bg-yellow-50">
                    <td className="p-2 font-semibold">Month {row.month}</td>
                    <td className="p-2 text-right">৳{row.deposit_bdt.toLocaleString("en-IN")}</td>
                    <td className="p-2 text-right text-gray-900">
                      ৳{row.balance_before_interest_bdt.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </td>
                    <td className="p-2 text-right font-semibold text-[#00B894]">
                      +৳{row.interest_earned_bdt.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </td>
                    <td className="p-2 text-right font-semibold text-gray-900">
                      ৳{row.closing_balance_bdt.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Modal>
  );
};
