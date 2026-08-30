"use client";

import React, { useState } from "react";
import { LedgerProvider } from "@/context/LedgerContext";
import { Navbar, NavTab } from "@/components/layout/Navbar";
import { NotebookInput } from "@/components/notebook/NotebookInput";
import { LiveFeed } from "@/components/notebook/LiveFeed";
import { SalaryOverview } from "@/components/dashboard/SalaryOverview";
import { CategoryBreakdown } from "@/components/dashboard/CategoryBreakdown";
import { LargestExpenses } from "@/components/dashboard/LargestExpenses";
import { MonthlyComparison } from "@/components/dashboard/MonthlyComparison";
import { ForecastCard } from "@/components/forecast/ForecastCard";
import { WrittenInsights } from "@/components/forecast/WrittenInsights";
import { PocketList } from "@/components/pockets/PocketList";
import { ExpenseTable } from "@/components/expenses/ExpenseTable";
import { AddExpenseModal } from "@/components/expenses/AddExpenseModal";
import { ReceiptUploadModal } from "@/components/ocr/ReceiptUploadModal";
import { WhatIfSimulator } from "@/components/simulator/WhatIfSimulator";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Camera,
  Plus,
  Sliders,
  BookOpen,
  LayoutDashboard,
  Receipt,
  Target,
  Sparkles,
} from "lucide-react";

function LedgerAppContent() {
  const [activeTab, setActiveTab] = useState<NavTab>("notebook");
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [isOCROpen, setIsOCROpen] = useState(false);
  const [isWhatIfOpen, setIsWhatIfOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenAddExpense={() => setIsAddExpenseOpen(true)}
        onOpenOCR={() => setIsOCROpen(true)}
        onOpenWhatIf={() => setIsWhatIfOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-8 flex flex-col gap-8">
        {/* TAB 1: NOTEBOOK / QUICK LEDGER (DEFAULT) */}
        {activeTab === "notebook" && (
          <div className="flex flex-col gap-8 animate-in fade-in duration-200">
            {/* Hero Banner with Neo-Brutalism styling */}
            <div className="border-4 border-black p-6 bg-[#FFD93D] shadow-neo-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
              <div className="flex flex-col gap-2 max-w-2xl z-10">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="accent" size="sm" rotation="neg2">
                    NOTEBOOK LEDGER
                  </Badge>
                  <Badge variant="dark" size="sm">
                    NATURAL SHORTHAND
                  </Badge>
                  <Badge variant="mint" size="sm" rotation="pos1">
                    AUTODETECT READY
                  </Badge>
                </div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-black leading-none">
                  Type Fast. Log Everything.
                </h1>
                <p className="text-sm font-bold text-black/85">
                  Type shorthands like <span className="bg-white px-1.5 py-0.5 border border-black font-mono font-black">lun 500</span>, <span className="bg-white px-1.5 py-0.5 border border-black font-mono font-black">rickshaw 60</span>, or <span className="bg-white px-1.5 py-0.5 border border-black font-mono font-black">agora 1200</span> and press Enter to instantly record!
                </p>
              </div>

              <div className="flex flex-col sm:flex-row md:flex-col gap-3 z-10 w-full md:w-auto">
                <Button
                  variant="accent"
                  size="md"
                  onClick={() => setIsOCROpen(true)}
                  icon={<Camera className="w-4 h-4 stroke-[3px]" />}
                  fullWidth
                >
                  Scan Memo / OCR
                </Button>
                <Button
                  variant="muted"
                  size="md"
                  onClick={() => setIsAddExpenseOpen(true)}
                  icon={<Plus className="w-4 h-4 stroke-[3px]" />}
                  fullWidth
                >
                  Manual Form
                </Button>
              </div>

              <div className="absolute right-[-20px] bottom-[-30px] opacity-10 pointer-events-none select-none text-9xl font-black font-mono">
                BDT
              </div>
            </div>

            {/* Quick Shorthand Notebook Input */}
            <NotebookInput />

            {/* Live Feed & Quick Ledger Statistics */}
            <LiveFeed />
          </div>
        )}

        {/* TAB 2: DASHBOARD (METRICS & FORECAST) */}
        {activeTab === "dashboard" && (
          <div className="flex flex-col gap-8 animate-in fade-in duration-200">
            {/* ROW 1: Cashflow Overview & Forecast */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SalaryOverview />
              <ForecastCard />
            </div>

            {/* ROW 2: Category Breakdown & MoM Variance */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CategoryBreakdown />
              <MonthlyComparison />
            </div>

            {/* ROW 3: Largest Expenses */}
            <LargestExpenses />
          </div>
        )}

        {/* TAB 3: EXPENSE HISTORY */}
        {activeTab === "history" && (
          <div className="flex flex-col gap-8 animate-in fade-in duration-200">
            <ExpenseTable onOpenAddExpense={() => setIsAddExpenseOpen(true)} />
          </div>
        )}

        {/* TAB 4: SAVINGS POCKETS & DPS COMPOUND ENGINE */}
        {activeTab === "pockets" && (
          <div className="flex flex-col gap-8 animate-in fade-in duration-200">
            <PocketList />
          </div>
        )}

        {/* TAB 5: DYNAMIC CONCRETE INSIGHTS & SIMULATOR */}
        {activeTab === "insights" && (
          <div className="flex flex-col gap-8 animate-in fade-in duration-200">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <WrittenInsights />
              <div className="border-4 border-black bg-white p-6 shadow-neo-md flex flex-col justify-between gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Sliders className="w-5 h-5" />
                    <h2 className="text-xl font-black uppercase text-black">
                      "What-If" Category Optimization
                    </h2>
                  </div>
                  <p className="text-xs font-bold text-black/70 mb-4">
                    Simulate spending cuts on any category and immediately visualize impacts on month-end surplus and savings pocket timelines.
                  </p>
                </div>
                <Button
                  variant="accent"
                  size="lg"
                  onClick={() => setIsWhatIfOpen(true)}
                  icon={<Sliders className="w-5 h-5 stroke-[2.5px]" />}
                >
                  Open Category Cut Simulator
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Neo-Brutalist Footer */}
      <footer className="w-full bg-[#000000] text-white border-t-4 border-black px-4 py-8 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-bold">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="font-black text-sm uppercase text-[#FFD93D]">
              DHAKA PERSONAL LEDGER // TEAM LSH26-T061
            </span>
            <span className="text-white/60">Problem P12</span>
            <span className="text-white/60">• Start Code: LSH26-8490-C900</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="bg-[#FF6B6B] text-black px-2 py-0.5 font-black uppercase text-[10px]">
              Neo-Brutalism
            </span>
            <span className="bg-[#00F0B5] text-black px-2 py-0.5 font-black uppercase text-[10px]">
              DPS Compounded Monthly
            </span>
          </div>
        </div>
      </footer>

      {/* Feature Modals */}
      <AddExpenseModal
        isOpen={isAddExpenseOpen}
        onClose={() => setIsAddExpenseOpen(false)}
      />

      <ReceiptUploadModal
        isOpen={isOCROpen}
        onClose={() => setIsOCROpen(false)}
      />

      <WhatIfSimulator
        isOpen={isWhatIfOpen}
        onClose={() => setIsWhatIfOpen(false)}
      />
    </div>
  );
}

export default function Home() {
  return (
    <LedgerProvider>
      <LedgerAppContent />
    </LedgerProvider>
  );
}
