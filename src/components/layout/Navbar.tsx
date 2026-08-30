"use client";

import React from "react";
import { useLedger } from "@/context/LedgerContext";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  BookOpen,
  LayoutDashboard,
  Receipt,
  Target,
  Sparkles,
  Camera,
  Plus,
  Sliders,
  Calendar,
} from "lucide-react";

export type NavTab = "notebook" | "dashboard" | "history" | "pockets" | "insights";

interface NavbarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onOpenAddExpense: () => void;
  onOpenOCR: () => void;
  onOpenWhatIf: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
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

  const navItems: { id: NavTab; label: string; icon: React.ReactNode; color: string }[] = [
    {
      id: "notebook",
      label: "📓 Notebook",
      icon: <BookOpen className="w-4 h-4" />,
      color: "bg-[#FFD93D]",
    },
    {
      id: "dashboard",
      label: "📊 Dashboard",
      icon: <LayoutDashboard className="w-4 h-4" />,
      color: "bg-[#00F0B5]",
    },
    {
      id: "history",
      label: "📜 History",
      icon: <Receipt className="w-4 h-4" />,
      color: "bg-[#00E5FF]",
    },
    {
      id: "pockets",
      label: "🎯 Pockets & DPS",
      icon: <Target className="w-4 h-4" />,
      color: "bg-[#C4B5FD]",
    },
    {
      id: "insights",
      label: "🔮 Insights",
      icon: <Sparkles className="w-4 h-4" />,
      color: "bg-[#FF70A6]",
    },
  ];

  return (
    <header className="w-full bg-[#FFFDF5] border-b-4 border-black shadow-neo-sm sticky top-0 z-40">
      {/* Top Banner: Brand, Context info, and Case selector */}
      <div className="border-b-3 border-black px-4 sm:px-8 py-3 bg-[#FFFDF5]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Brand & Team Badge */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="bg-[#FFD93D] border-3 border-black px-3 py-1 shadow-neo-xs flex items-center gap-2">
              <span className="font-black text-lg tracking-tight uppercase text-black">
                DHAKA LEDGER
              </span>
              <span className="text-[10px] font-black bg-black text-white px-1.5 py-0.5 uppercase">
                P12
              </span>
            </div>
            <Badge variant="accent" size="sm">
              LSH26-T061
            </Badge>
          </div>

          {/* Controls: Month toggle, Date indicator & Benchmark case switcher */}
          <div className="flex items-center gap-2.5 flex-wrap justify-center">
            {/* Active Month Toggle */}
            <div className="flex items-center border-2 border-black bg-white shadow-neo-xs">
              <button
                onClick={() => setSelectedMonth(months.last)}
                className={`px-2.5 py-0.5 text-xs font-black uppercase transition-colors ${
                  selectedMonth === months.last
                    ? "bg-[#FF6B6B] text-black"
                    : "bg-white text-black hover:bg-gray-100"
                }`}
              >
                {months.last}
              </button>
              <div className="w-[2px] bg-black h-full" />
              <button
                onClick={() => setSelectedMonth(months.this)}
                className={`px-2.5 py-0.5 text-xs font-black uppercase transition-colors ${
                  selectedMonth === months.this
                    ? "bg-[#00F0B5] text-black"
                    : "bg-white text-black hover:bg-gray-100"
                }`}
              >
                {months.this}
              </button>
            </div>

            {/* Today's Date */}
            <div className="bg-white border-2 border-black px-2.5 py-0.5 text-xs font-black shadow-neo-xs flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span className="text-black/60 uppercase text-[10px]">Date:</span>
              <span>{todayDate}</span>
            </div>

            {/* Benchmark Case Selector */}
            <div className="flex items-center gap-1 bg-white border-2 border-black px-2 py-0.5 shadow-neo-xs">
              <span className="text-[10px] font-black uppercase text-black/70">Case:</span>
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

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2">
            <Button
              variant="accent"
              size="sm"
              onClick={onOpenOCR}
              icon={<Camera className="w-3.5 h-3.5 stroke-[3px]" />}
            >
              Scan Receipt
            </Button>
            <Button
              variant="cyan"
              size="sm"
              onClick={onOpenWhatIf}
              icon={<Sliders className="w-3.5 h-3.5" />}
            >
              What-If
            </Button>
          </div>
        </div>
      </div>

      {/* Primary Navigation Tabs */}
      <div className="px-4 sm:px-8 bg-[#FFFDF5]">
        <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto py-2 no-scrollbar">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`px-4 py-2 text-xs sm:text-sm font-black uppercase tracking-wider border-3 border-black whitespace-nowrap transition-all flex items-center gap-2 ${
                  isActive
                    ? `${item.color} shadow-neo-sm translate-y-[-2px]`
                    : "bg-white text-black hover:bg-[#FFFDF5] shadow-neo-xs"
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
