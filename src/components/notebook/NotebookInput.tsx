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
} from "lucide-react";

export const NotebookInput: React.FC = () => {
  const { addExpense, todayDate } = useLedger();
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
      setParsed(parseShorthandExpense(inputVal));
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
      <div className="border border-gray-200 rounded-lg bg-white p-6 sm:p-8 shadow-md relative overflow-hidden">
        {/* Top Header Row with Date Badge & Title */}
        <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-3.5 h-3.5 bg-white border border-gray-200 rounded-lg rounded-full" />
            <div className="w-3.5 h-3.5 bg-white border border-gray-200 rounded-lg rounded-full" />
            <div className="w-3.5 h-3.5 bg-white border border-gray-200 rounded-lg rounded-full" />
            <span className="text-xs sm:text-sm font-semibold text-sm text-gray-500 ml-2 bg-white px-2 py-0.5 border border-gray-200 rounded-lg shadow-md">
              📓 DHAKA QUICK NOTEBOOK
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase text-gray-900 flex items-center gap-1 bg-white px-2.5 py-1 border border-gray-200 rounded-lg shadow-md">
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
                className="w-full text-lg sm:text-2xl font-semibold text-gray-900 bg-white border border-gray-200 rounded-lg px-4 sm:px-6 py-4 outline-none shadow-md focus:shadow-md focus:bg-white placeholder:text-gray-900 font-mono transition-all"
              />
              {inputVal && (
                <button
                  type="button"
                  onClick={() => setInputVal("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold bg-indigo-600 text-white px-2 py-1 uppercase hover:bg-white hover:text-gray-900 transition-colors"
                >
                  Clear
                </button>
              )}
            </div>

            <Button
              type="submit"
              variant="accent"
              size="lg"
              disabled={!parsed?.isValid}
              className="text-base font-semibold text-sm text-gray-500 min-w-[140px]"
              icon={<CornerDownLeft className="w-5 h-5 stroke-[3px]" />}
            >
              Add [↵]
            </Button>
          </div>

          {/* Live Auto-Detection Pill */}
          {parsed && (
            <div
              className={`p-3 border border-gray-200 rounded-lg flex items-center justify-between flex-wrap gap-2 transition-all ${
                parsed.isValid
                  ? "bg-white border-gray-200 shadow-md animate-in fade-in zoom-in-95"
                  : "bg-white border-gray-200"
              }`}
            >
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-xs font-semibold text-sm text-gray-500 text-gray-900 flex items-center gap-1">
                  {parsed.isValid ? (
                    <>
                      <Sparkles className="w-4 h-4 text-gray-900 stroke-[2.5px]" /> AUTO-DETECTED:
                    </>
                  ) : (
                    <>
                      <HelpCircle className="w-4 h-4 text-gray-900 stroke-[2.5px]" /> WAITING FOR AMOUNT:
                    </>
                  )}
                </span>

                {parsed.isValid && (
                  <>
                    <div className="flex items-center gap-1 text-xs font-semibold bg-white px-2 py-0.5 border border-gray-200 rounded-lg shadow-md">
                      <Tag className="w-3 h-3 text-[#FF6B6B]" /> Category:{" "}
                      <span className="text-[#FF6B6B] uppercase">{parsed.category}</span>
                    </div>

                    <div className="flex items-center gap-1 text-xs font-semibold bg-white px-2 py-0.5 border border-gray-200 rounded-lg shadow-md">
                      <Store className="w-3 h-3 text-gray-900" /> Memo/Shop:{" "}
                      <span className="text-gray-900">{parsed.shop}</span>
                    </div>

                    <div className="flex items-center gap-1 text-xs font-semibold bg-white px-2.5 py-0.5 border border-gray-200 rounded-lg shadow-md">
                      <DollarSign className="w-3 h-3 text-gray-900" /> Amount:{" "}
                      <span className="text-sm font-semibold text-gray-900">৳{formatBDT(parsed.amount_bdt)}</span>
                    </div>
                  </>
                )}
              </div>

              {parsed.isValid && (
                <span className="text-[11px] font-semibold uppercase bg-indigo-600 text-white px-2 py-0.5">
                  Press Enter to Log
                </span>
              )}
            </div>
          )}

          {/* Success Toast */}
          {recentAdded && (
            <div className="p-3 bg-white border border-gray-200 rounded-lg shadow-md flex items-center justify-between text-gray-900 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 stroke-[2.5px]" />
                <span className="text-xs sm:text-sm font-semibold uppercase tracking-wide">
                  Logged: ৳{formatBDT(recentAdded.amount)} for {recentAdded.shop} ({recentAdded.category})
                </span>
              </div>
              <span className="text-[10px] font-semibold uppercase bg-indigo-600 text-white px-2 py-0.5">
                Saved to Ledger
              </span>
            </div>
          )}
        </form>

        {/* Quick Shorthand Buttons / Chips */}
        <div className="mt-4 pt-4 border-t-2 border-dashed border-gray-200 flex flex-col gap-2">
          <span className="text-[11px] font-semibold uppercase text-gray-900 flex items-center gap-1">
            <Flame className="w-3 h-3 text-[#FF6B6B]" /> Popular Dhaka Shorthands (Click to try):
          </span>
          <div className="flex flex-wrap gap-2">
            {[
              { label: "lun 500", desc: "Lunch (৳500)" },
              { label: "dinner 650", desc: "Dinner (৳650)" },
              { label: "rickshaw 60", desc: "Rickshaw (৳60)" },
              { label: "uber 250", desc: "Uber (৳250)" },
              { label: "agora 1450", desc: "Agora (৳1,450)" },
              { label: "cha 20", desc: "Tong Tea (৳20)" },
              { label: "desco 2800", desc: "DESCO Bill (৳2,800)" },
              { label: "gp 300", desc: "GP Recharge (৳300)" },
              { label: "med 420", desc: "Medicine (৳420)" },
            ].map((chip, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleQuickSuggestion(chip.label)}
                className="text-xs font-mono font-semibold bg-white hover:bg-white active:translate-y-0.5 text-gray-900 px-2.5 py-1 border border-gray-200 rounded-lg shadow-md transition-colors flex items-center gap-1"
              >
                <span className="text-[#FF6B6B] font-bold">»</span> {chip.label}
                <span className="text-[10px] text-gray-900 font-sans">({chip.desc})</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
