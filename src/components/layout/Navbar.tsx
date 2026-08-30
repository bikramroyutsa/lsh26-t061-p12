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
  LogOut,
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
    signOut,
  } = useLedger();

  const navItems: { id: NavTab; label: string }[] = [
    { id: "notebook", label: "Notebook" },
    { id: "dashboard", label: "Dashboard" },
    { id: "history", label: "History" },
    { id: "pockets", label: "Pockets & DPS" },
    { id: "insights", label: "Insights" },
  ];

  return (
    <header className="w-full bg-white border-b border-gray-100 shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4 flex items-center justify-between gap-4 overflow-x-auto no-scrollbar">
        
        {/* Brand / Logo */}
        <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer">
          <span className="font-semibold text-xl tracking-tight text-slate-800">
            Ledgy
          </span>
        </div>

        {/* Center Navigation Links */}
        <nav className="flex-shrink-0 flex items-center gap-6">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`text-[15px] font-medium whitespace-nowrap transition-colors ${
                  isActive ? "text-slate-800 font-semibold" : "text-gray-500 hover:text-slate-800"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right Section: Compact Controls & Action Buttons */}
        <div className="flex-shrink-0 flex items-center gap-4">
          
          {/* Compact Case & Month Controls */}
          <div className="hidden lg:flex items-center gap-3 text-xs border-none rounded-full px-3 py-1.5 bg-gray-50">
            <select
              value={activeCaseId}
              onChange={(e) => loadCase(e.target.value)}
              className="bg-transparent border-none outline-none cursor-pointer text-gray-700 font-semibold w-16"
            >
              {availableCases.map((c) => (
                <option key={c.case_id} value={c.case_id}>
                  {c.case_id}
                </option>
              ))}
            </select>
            <div className="w-[1px] h-4 bg-gray-300" />
            <button
              onClick={() => setSelectedMonth(months.last)}
              className={selectedMonth === months.last ? "text-[#634E9F] font-bold" : "text-gray-500 hover:text-slate-800"}
            >
              {months.last.substring(0, 3)}
            </button>
            <span className="text-gray-300">/</span>
            <button
              onClick={() => setSelectedMonth(months.this)}
              className={selectedMonth === months.this ? "text-[#634E9F] font-bold" : "text-gray-500 hover:text-slate-800"}
            >
              {months.this.substring(0, 3)}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenOCR}
              className="px-6 py-2.5 min-w-[140px] text-center bg-[#EAE5F8] text-[#554089] font-medium text-sm rounded-full hover:bg-[#DDD3F3] transition-colors"
            >
              Scan Receipt
            </button>
            <button
              onClick={onOpenWhatIf}
              className="px-6 py-2.5 min-w-[140px] text-center bg-[#634E9F] text-white font-medium text-sm rounded-full hover:bg-[#524083] transition-colors"
            >
              What-If
            </button>
            <button
              onClick={signOut}
              className="p-2.5 ml-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
