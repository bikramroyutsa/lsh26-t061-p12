"use client";

import React, { useState, useEffect, useRef } from "react";
import { useLedger } from "@/context/LedgerContext";
import { parseShorthandExpense, ParsedExpenseInput } from "@/lib/parser";
import { formatBDT } from "@/lib/format";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Sparkles,
  CornerDownLeft,
  CheckCircle2,
  HelpCircle,
  Flame,
  Tag,
  Store,
  DollarSign,
  Calendar,
  Settings,
} from "lucide-react";
import { ManageShorthandsModal } from "./ManageShorthandsModal";

export const NotebookInput: React.FC = () => {
  const { addExpense, todayDate, shorthands } = useLedger();
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [inputVal, setInputVal] = useState("");
  const [parsed, setParsed] = useState<ParsedExpenseInput | null>(null);
  const [recentAdded, setRecentAdded] = useState<{
    shop: string;
    amount: number;
    category: string;
  } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputVal.trim()) {
      setParsed(parseShorthandExpense(inputVal, shorthands));
    } else {
      setParsed(null);
    }
  }, [inputVal]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!parsed || !parsed.isValid || parsed.amount_bdt <= 0) return;

    addExpense({
      date: todayDate,
      category: parsed.category,
      shop: parsed.shop,
      amount_bdt: parsed.amount_bdt,
    });

    setRecentAdded({
      shop: parsed.shop,
      amount: parsed.amount_bdt,
      category: parsed.category,
    });

    setInputVal("");
    setParsed(null);

    setTimeout(() => {
      setRecentAdded(null);
    }, 4000);
  };

  const handleQuickSuggestion = (text: string) => {
    setInputVal(text);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Main Notebook Input Box */}
      <div className="rounded-2xl bg-[#FEFCE8] border border-[#FDE047] p-6 sm:p-8 shadow-sm relative overflow-hidden">
        {/* Top Header Row with Date Badge & Title */}
        <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-3.5 h-3.5 bg-white rounded-2xl rounded-full" />
            <div className="w-3.5 h-3.5 bg-white rounded-2xl rounded-full" />
            <div className="w-3.5 h-3.5 bg-white rounded-2xl rounded-full" />
            <span className="text-xs sm:text-sm font-semibold text-sm text-gray-500 ml-2 bg-[#EAE5F8] text-[#554089] px-2 py-0.5 rounded-full rounded-2xl shadow-sm">
              📓 QUICK NOTEBOOK
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase text-slate-800 flex items-center gap-1 bg-white px-2.5 py-1 rounded-2xl shadow-sm">
              <Calendar className="w-3.5 h-3.5 stroke-[2.5px]" /> {todayDate}
            </span>
          </div>
        </div>

        {/* Big Notebook Writing Field */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="relative flex flex-col sm:flex-row items-stretch gap-2">
            <div className="relative flex-1">
              <input
                ref={inputRef}
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder='Type shorthand: "lun 500", "rickshaw 60", "agora 1200", "uber 250"'
                autoFocus
                className="w-full text-lg sm:text-2xl font-semibold text-slate-800 bg-white rounded-2xl px-4 sm:px-6 py-4 outline-none shadow-sm focus:shadow-sm focus:bg-white placeholder:text-slate-800  transition-all"
              />
              {inputVal && (
                <button
                  type="button"
                  onClick={() => setInputVal("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold bg-[#634E9F] text-white px-2 py-1 uppercase hover:bg-white hover:text-slate-800 transition-colors"
                >
                  Clear
                </button>
              )}
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={!parsed?.isValid}
              className="text-base font-semibold text-sm text-gray-500 min-w-[140px]"
              
            >
              Add [↵]
            </Button>
          </div>

          {/* Live Auto-Detection Pill */}
          {parsed && (
            <div
              className={`p-3 rounded-2xl flex items-center justify-between flex-wrap gap-2 transition-all ${
                parsed.isValid
                  ? "bg-white border-gray-200 shadow-sm animate-in fade-in zoom-in-95"
                  : "bg-white border-gray-200"
              }`}
            >
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-xs font-semibold text-sm text-gray-500 text-slate-800 flex items-center gap-1">
                  {parsed.isValid ? (
                    <>
                      <Sparkles className="w-4 h-4 text-slate-800 stroke-[2.5px]" /> AUTO-DETECTED:
                    </>
                  ) : (
                    <>
                      <HelpCircle className="w-4 h-4 text-slate-800 stroke-[2.5px]" /> WAITING FOR AMOUNT:
                    </>
                  )}
                </span>

                {parsed.isValid && (
                  <>
                    <div className="flex items-center gap-1 text-xs font-semibold bg-[#EAE5F8] text-[#554089] px-2 py-0.5 rounded-full rounded-2xl shadow-sm">
                      <Tag className="w-3 h-3 text-[#FF6B6B]" /> Category:{" "}
                      <span className="text-[#FF6B6B] uppercase">{parsed.category}</span>
                    </div>

                    <div className="flex items-center gap-1 text-xs font-semibold bg-[#EAE5F8] text-[#554089] px-2 py-0.5 rounded-full rounded-2xl shadow-sm">
                      <Store className="w-3 h-3 text-slate-800" /> Memo/Shop:{" "}
                      <span className="text-slate-800">{parsed.shop}</span>
                    </div>

                    <div className="flex items-center gap-1 text-xs font-semibold bg-white px-2.5 py-0.5 rounded-2xl shadow-sm">
                      <DollarSign className="w-3 h-3 text-slate-800" /> Amount:{" "}
                      <span className="text-sm font-semibold text-slate-800">৳{formatBDT(parsed.amount_bdt)}</span>
                    </div>
                  </>
                )}
              </div>

              {parsed.isValid && (
                <span className="text-[11px] font-semibold uppercase bg-[#634E9F] text-white px-2 py-0.5">
                  Press Enter to Log
                </span>
              )}
            </div>
          )}

          {/* Success Toast */}
          {recentAdded && (
            <div className="p-3 bg-white rounded-2xl shadow-sm flex items-center justify-between text-slate-800 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 stroke-[2.5px]" />
                <span className="text-xs sm:text-sm font-semibold uppercase tracking-wide">
                  Logged: ৳{formatBDT(recentAdded.amount)} for {recentAdded.shop} ({recentAdded.category})
                </span>
              </div>
              <span className="text-[10px] font-semibold uppercase bg-[#634E9F] text-white px-2 py-0.5">
                Saved to Ledger
              </span>
            </div>
          )}
        </form>

        {/* Quick Shorthand Buttons / Chips */}
        <div className="mt-4 pt-4 border-t-2 border-dashed border-gray-200 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase text-slate-800 flex items-center gap-1">
              <Flame className="w-3 h-3 text-[#FF6B6B]" /> Your Shorthands (Click to try):
            </span>
            <button
              onClick={() => setIsManageModalOpen(true)}
              className="text-[10px] font-bold uppercase flex items-center gap-1.5 bg-[#634E9F] text-white px-3 py-1.5 rounded-full hover:bg-[#554089] transition-colors shadow-sm"
            >
              <Settings className="w-3 h-3" /> Manage Commands
            </button>
          </div>
          <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto pr-2 pb-2">
            {shorthands.map((sh) => (
              <button
                key={sh.id}
                type="button"
                onClick={() => handleQuickSuggestion(`${sh.keyword} 500`)}
                className="text-xs font-semibold bg-white hover:bg-gray-50 active:translate-y-0.5 text-slate-800 px-2.5 py-1 rounded-2xl shadow-sm border border-gray-100 transition-colors flex items-center gap-1"
              >
                <span className="text-[#FF6B6B] font-bold">»</span> {sh.keyword} 500
                <span className="text-[10px] text-slate-500 font-sans">({sh.shop})</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <ManageShorthandsModal 
        isOpen={isManageModalOpen} 
        onClose={() => setIsManageModalOpen(false)} 
      />
    </div>
  );
};
