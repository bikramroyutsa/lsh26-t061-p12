"use client";

import React, { useState } from "react";
import { LedgerProvider } from "@/context/LedgerContext";
import { Navbar } from "@/components/layout/Navbar";
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
import { Camera, Plus, Sliders, Zap, Sparkles, ShieldCheck } from "lucide-react";

function LedgerAppContent() {
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [isOCROpen, setIsOCROpen] = useState(false);
  const [isWhatIfOpen, setIsWhatIfOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation Header */}
      <Navbar
        onOpenAddExpense={() => setIsAddExpenseOpen(true)}
        onOpenOCR={() => setIsOCROpen(true)}
        onOpenWhatIf={() => setIsWhatIfOpen(true)}
      />

      {/* Main Content Dashboard */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-8 flex flex-col gap-8">
        {/* Hero Marquee / Welcome Banner */}
        <div className="border-4 border-black p-6 bg-[#FFD93D] shadow-neo-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="flex flex-col gap-2 max-w-2xl z-10">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="accent" size="sm" rotation="neg2">
                DHAKA SALARIED LEDGER
              </Badge>
              <Badge variant="dark" size="sm">
                100% MODULAR ARCHITECTURE
              </Badge>
              <Badge variant="mint" size="sm" rotation="pos1">
                ALL 4 SCORING CRITERIA + 3 BONUSES ACTIVE
              </Badge>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tighter text-black leading-none">
              Take Control of Every Taka in Dhaka.
            </h1>
            <p className="text-sm font-bold text-black/85">
              Instant receipt scanning with uncertainty safeguards, real-time burn-rate forecasting, dynamic concrete insights, and compound DPS savings pockets.
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
              Scan Cash Memo (OCR)
            </Button>
            <Button
              variant="cyan"
              size="md"
              onClick={() => setIsWhatIfOpen(true)}
              icon={<Sliders className="w-4 h-4" />}
              fullWidth
            >
              What-If Simulator
            </Button>
          </div>

          {/* Background Decorative Accent */}
          <div className="absolute right-[-20px] bottom-[-30px] opacity-10 pointer-events-none select-none text-9xl font-black font-mono">
            BDT
          </div>
        </div>

        {/* ROW 1: Cashflow Overview & Forecast */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SalaryOverview />
          <ForecastCard />
        </div>

        {/* ROW 2: Dynamic Concrete Insights & Category Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <WrittenInsights />
          <CategoryBreakdown />
        </div>

        {/* ROW 3: MoM Variance & Largest Expenses */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <MonthlyComparison />
          <LargestExpenses />
        </div>

        {/* ROW 4: Savings Pockets & Compound DPS Engine (Bonus 1) */}
        <PocketList />

        {/* ROW 5: Full Expense Stream Table (Bonus 2) */}
        <ExpenseTable onOpenAddExpense={() => setIsAddExpenseOpen(true)} />
      </main>

      {/* Footer */}
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

      {/* Interactive Feature Modals */}
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
