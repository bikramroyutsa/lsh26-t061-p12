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
      <main className="flex-1 w-full bg-[#F6F5FB] rounded-t-[2.5rem] sm:rounded-t-[4rem] px-4 sm:px-8 py-16 sm:py-24 flex flex-col gap-16 shadow-[0_-4px_20px_rgba(0,0,0,0.02)]">
        <div className="max-w-7xl w-full mx-auto flex flex-col gap-16">
        {/* TAB 1: NOTEBOOK / QUICK LEDGER (DEFAULT) */}
        {activeTab === "notebook" && (
          <div className="flex flex-col gap-8 animate-in fade-in duration-200">
            {/* Hero Banner with Soft SaaS styling */}
            <div className="flex flex-col md:flex-row items-start justify-between gap-12 relative w-full mb-8">
              <div className="flex flex-col gap-6 max-w-2xl z-10">
                <div className="inline-flex items-center gap-2 bg-[#E9E5F4] text-[#554089] px-4 py-1.5 rounded-full text-xs font-semibold w-fit">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#554089]"></span>
                  Fast natural language processing
                </div>
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-gray-900 leading-[1.1]">
                  Type Fast.<br />Log Everything.
                </h1>
                <p className="text-lg text-gray-600 max-w-xl leading-relaxed">
                  Ledgy brings your personal finances together. Type shorthands like <span className="text-gray-900 font-semibold bg-white/50 px-1 rounded">lun 500</span> or <span className="text-gray-900 font-semibold bg-white/50 px-1 rounded">agora 1200</span> and instantly record!
                </p>

                <div className="flex flex-col sm:flex-row gap-4 mt-2">
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={() => setIsOCROpen(true)}
                  >
                    Scan Memo / OCR
                  </Button>
                  <Button
                    variant="secondary"
                    size="lg"
                    onClick={() => setIsAddExpenseOpen(true)}
                  >
                    Manual Form
                  </Button>
                </div>
              </div>
              
              {/* Decorative Blur blob mimicking the screenshot */}
              <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-200/40 rounded-full blur-3xl -z-10 mix-blend-multiply opacity-50 hidden md:block pointer-events-none transform translate-x-1/3 -translate-y-1/4" />
              <div className="absolute right-1/4 bottom-0 w-72 h-72 bg-purple-300/30 rounded-full blur-3xl -z-10 mix-blend-multiply opacity-50 hidden md:block pointer-events-none transform translate-y-1/4" />
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
              <div className="border border-gray-200 rounded-lg bg-white p-6 shadow-md flex flex-col justify-between gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Sliders className="w-5 h-5" />
                    <h2 className="text-xl font-semibold uppercase text-gray-900">
                      "What-If" Category Optimization
                    </h2>
                  </div>
                  <p className="text-xs font-bold text-gray-900 mb-4">
                    Simulate spending cuts on any category and immediately visualize impacts on month-end surplus and savings pocket timelines.
                  </p>
                </div>
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => setIsWhatIfOpen(true)}
                >
                  <Sliders className="w-5 h-5 mr-2" /> Open Category Cut Simulator
                </Button>
              </div>
            </div>
          </div>
        )}
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-white border-t border-gray-100 py-4 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 overflow-x-auto no-scrollbar whitespace-nowrap text-xs text-gray-500">
          <div className="flex items-center gap-3 font-medium">
            <span className="text-gray-900 font-semibold tracking-tight">Ledgy</span>
            <span className="text-gray-300">|</span>
            <span>Team LSH26-T061</span>
            <span className="text-gray-300">|</span>
            <span>Problem P12</span>
          </div>

          <div className="flex items-center gap-3 font-medium">
            <span className="bg-[#F6F5FB] text-[#554089] px-2.5 py-1 rounded-full text-[10px] font-semibold">
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
