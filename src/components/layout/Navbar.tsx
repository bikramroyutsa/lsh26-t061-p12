"use client";

import React from "react";
import { useLedger } from "@/context/LedgerContext";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Plus, Camera, Sparkles, Sliders } from "lucide-react";

interface NavbarProps {
  onOpenAddExpense: () => void;
  onOpenOCR: () => void;
  onOpenWhatIf: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenAddExpense,
  onOpenOCR,
  onOpenWhatIf,
}) => {
  const {
    activeCaseId,
    availableCases,
    loadCase,
    todayDate,
    selectedMonth,
    setSelectedMonth,
    months,
  } = useLedger();

  return (
    <header className="w-full bg-[#FFFDF5] border-b-4 border-black px-4 sm:px-8 py-4 shadow-neo-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand & Team Badge */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="bg-[#FFD93D] border-4 border-black px-3 py-1.5 shadow-neo-sm">
            <span className="font-black text-xl tracking-tighter uppercase text-black">
              DHAKA LEDGER 🇧🇩
            </span>
          </div>
          <Badge variant="accent" size="sm" rotation="pos1">
            TEAM LSH26-T061
          </Badge>
          <Badge variant="muted" size="sm">
            PROBLEM P12
          </Badge>
        </div>

        {/* Dataset Case Switcher & Active Date Indicator */}
        <div className="flex items-center gap-3 flex-wrap justify-center">
          {/* Active Month Toggle */}
          <div className="flex items-center border-2 border-black bg-white shadow-neo-xs">
            <button
              onClick={() => setSelectedMonth(months.last)}
              className={`px-3 py-1 text-xs font-black uppercase transition-colors ${
                selectedMonth === months.last
                  ? "bg-[#FF6B6B] text-black"
                  : "bg-white text-black hover:bg-gray-100"
              }`}
            >
              {months.last} (Last)
            </button>
            <div className="w-[2px] bg-black h-full" />
            <button
              onClick={() => setSelectedMonth(months.this)}
              className={`px-3 py-1 text-xs font-black uppercase transition-colors ${
                selectedMonth === months.this
                  ? "bg-[#00F0B5] text-black"
                  : "bg-white text-black hover:bg-gray-100"
              }`}
            >
              {months.this} (Active)
            </button>
          </div>

          {/* Today Indicator */}
          <div className="bg-[#FFFFFF] border-2 border-black px-2.5 py-1 text-xs font-bold shadow-neo-xs flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00F0B5] border border-black inline-block animate-pulse" />
            <span className="text-black/60 uppercase">Today:</span>
            <span className="font-black">{todayDate}</span>
          </div>

          {/* Benchmark Case Selector */}
          <div className="flex items-center gap-1.5 bg-[#FFFFFF] border-2 border-black px-2.5 py-1 shadow-neo-xs">
            <span className="text-xs font-black uppercase text-black/70">Case:</span>
            <select
              value={activeCaseId}
              onChange={(e) => loadCase(e.target.value)}
              className="font-black text-xs bg-transparent border-none outline-none cursor-pointer text-black"
            >
              {availableCases.map((c) => (
                <option key={c.case_id} value={c.case_id}>
                  {c.case_id} ({c.months.this})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Button
            variant="cyan"
            size="sm"
            onClick={onOpenWhatIf}
            icon={<Sliders className="w-4 h-4" />}
          >
            What-If
          </Button>
          <Button
            variant="muted"
            size="sm"
            onClick={onOpenOCR}
            icon={<Camera className="w-4 h-4" />}
          >
            Scan Bill
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={onOpenAddExpense}
            icon={<Plus className="w-4 h-4 stroke-[3px]" />}
          >
            Add Expense
          </Button>
        </div>
      </div>
    </header>
  );
};
