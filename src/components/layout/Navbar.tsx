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
      color: "bg-white",
    },
    {
      id: "dashboard",
      label: "📊 Dashboard",
      icon: <LayoutDashboard className="w-4 h-4" />,
      color: "bg-white",
    },
    {
      id: "history",
      label: "📜 History",
      icon: <Receipt className="w-4 h-4" />,
      color: "bg-white",
    },
    {
      id: "pockets",
      label: "🎯 Pockets & DPS",
      icon: <Target className="w-4 h-4" />,
      color: "bg-white",
    },
    {
      id: "insights",
      label: "🔮 Insights",
      icon: <Sparkles className="w-4 h-4" />,
      color: "bg-white",
    },
  ];

  return (
    <header className="w-full bg-white border-gray-200 shadow-md sticky top-0 z-40">
      {/* Top Banner: Brand, Context info, and Case selector */}
      <div className="border-gray-200 px-4 sm:px-8 py-3 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Brand & Team Badge */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="bg-white border border-gray-200 rounded-lg px-3 py-1 shadow-md flex items-center gap-2">
              <span className="font-semibold text-lg tracking-tight uppercase text-gray-900">
                DHAKA LEDGER
              </span>
              <span className="text-[10px] font-semibold bg-indigo-600 text-white px-1.5 py-0.5 uppercase">
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
            <div className="flex items-center border border-gray-200 rounded-lg bg-white shadow-md">
              <button
                onClick={() => setSelectedMonth(months.last)}
                className={`px-2.5 py-0.5 text-xs font-semibold uppercase transition-colors ${
                  selectedMonth === months.last
                    ? "bg-white text-gray-900"
                    : "bg-white text-gray-900 hover:bg-gray-100"
                }`}
              >
                {months.last}
              </button>
              <div className="w-[2px] bg-indigo-600 h-full" />
              <button
                onClick={() => setSelectedMonth(months.this)}
                className={`px-2.5 py-0.5 text-xs font-semibold uppercase transition-colors ${
                  selectedMonth === months.this
                    ? "bg-white text-gray-900"
                    : "bg-white text-gray-900 hover:bg-gray-100"
                }`}
              >
                {months.this}
              </button>
            </div>

            {/* Today's Date */}
            <div className="bg-white border border-gray-200 rounded-lg px-2.5 py-0.5 text-xs font-semibold shadow-md flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span className="text-gray-900 uppercase text-[10px]">Date:</span>
              <span>{todayDate}</span>
            </div>

            {/* Benchmark Case Selector */}
            <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg px-2 py-0.5 shadow-md">
              <span className="text-[10px] font-semibold uppercase text-gray-900">Case:</span>
              <select
                value={activeCaseId}
                onChange={(e) => loadCase(e.target.value)}
                className="font-semibold text-xs bg-transparent border-none outline-none cursor-pointer text-gray-900"
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
      <div className="px-4 sm:px-8 bg-white">
        <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto py-2 no-scrollbar">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`px-4 py-2 text-xs sm:text-sm font-semibold text-sm text-gray-500 border border-gray-200 rounded-lg whitespace-nowrap transition-all flex items-center gap-2 ${
                  isActive
                    ? `${item.color} shadow-md translate-y-[-2px]`
                    : "bg-white text-gray-900 hover:bg-white shadow-md"
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
