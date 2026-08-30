"use client";

import React, { useState } from "react";
import { useLedger } from "@/context/LedgerContext";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Receipt,
  Search,
  Repeat,
  Trash2,
  Filter,
  Plus,
  ArrowUpDown,
} from "lucide-react";

interface ExpenseTableProps {
  onOpenAddExpense: () => void;
}

export const ExpenseTable: React.FC<ExpenseTableProps> = ({ onOpenAddExpense }) => {
  const {
    expenses,
    selectedMonth,
    recurringExpenseIds,
    deleteExpense,
  } = useLedger();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("ALL");
  const [showOnlyRecurring, setShowOnlyRecurring] = useState(false);

  const monthExpenses = expenses.filter((e) => e.date.startsWith(selectedMonth));
  const allCategories = ["ALL", ...Array.from(new Set(expenses.map((e) => e.category)))];

  const filteredExpenses = monthExpenses.filter((e) => {
    const matchesSearch =
      e.shop.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.date.includes(searchQuery);

    const matchesCategory =
      selectedCategoryFilter === "ALL" || e.category === selectedCategoryFilter;

    const matchesRecurring =
      !showOnlyRecurring || recurringExpenseIds.has(e.id);

    return matchesSearch && matchesCategory && matchesRecurring;
  });

  const totalFilteredSum = filteredExpenses.reduce((sum, e) => sum + e.amount_bdt, 0);

  return (
    <Card
      variant="white"
      shadow="md"
      header={
        <div className="flex items-center justify-between w-full flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Receipt className="w-5 h-5 stroke-[2.5px]" />
            <span>Monthly Ledger & Expense Stream</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" size="sm">
              {filteredExpenses.length} ENTRIES
            </Badge>
            <Badge variant="mint" size="sm">
              TOTAL: ৳{totalFilteredSum.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </Badge>
          </div>
        </div>
      }
      headerBg="secondary"
    >
      <div className="flex flex-col gap-4">
        {/* Search & Filter Toolbar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Search Box */}
          <div className="relative flex items-center">
            <Search className="absolute left-3 w-4 h-4 text-gray-900" />
            <input
              type="text"
              placeholder="Search shop, category, date..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg bg-white font-bold text-xs outline-none shadow-md"
            />
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-2.5 py-1 shadow-md">
            <Filter className="w-4 h-4 text-gray-900" />
            <select
              value={selectedCategoryFilter}
              onChange={(e) => setSelectedCategoryFilter(e.target.value)}
              className="w-full bg-transparent font-semibold text-xs outline-none cursor-pointer"
            >
              {allCategories.map((cat) => (
                <option key={cat} value={cat}>
                  Category: {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Recurring Filter Toggle & Add Button */}
          <div className="flex items-center gap-2 justify-end">
            <button
              onClick={() => setShowOnlyRecurring(!showOnlyRecurring)}
              className={`px-3 py-2 border border-gray-200 rounded-lg text-xs font-semibold uppercase transition-all shadow-md ${
                showOnlyRecurring
                  ? "bg-white text-gray-900"
                  : "bg-white text-gray-900 hover:bg-gray-100"
              }`}
            >
              <Repeat className="w-3.5 h-3.5 inline mr-1" />
              Recurring Only
            </button>

            <Button size="sm" variant="dark" onClick={onOpenAddExpense}>
              <Plus className="w-3.5 h-3.5 stroke-[3px]" /> Add
            </Button>
          </div>
        </div>

        {/* Expenses Table */}
        <div className="border border-gray-200 rounded-lg overflow-x-auto shadow-md">
          <table className="w-full text-left text-xs font-bold border-collapse bg-white">
            <thead className="bg-white border-gray-200 text-[11px] font-semibold uppercase">
              <tr>
                <th className="p-2.5">Date</th>
                <th className="p-2.5">Shop / Merchant</th>
                <th className="p-2.5">Category</th>
                <th className="p-2.5 text-right">Amount (BDT)</th>
                <th className="p-2.5 text-center">Tags</th>
                <th className="p-2.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10">
              {filteredExpenses.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-gray-900 font-bold">
                    No expense records matching the active filters.
                  </td>
                </tr>
              ) : (
                filteredExpenses.map((e) => {
                  const isRecurring = recurringExpenseIds.has(e.id);

                  return (
                    <tr
                      key={e.id}
                      className="hover:bg-yellow-50/70 transition-colors"
                    >
                      <td className="p-2.5 font-mono text-[11px] font-bold text-gray-900">
                        {e.date}
                      </td>
                      <td className="p-2.5 font-semibold text-gray-900">
                        {e.shop}
                        {e.notes && (
                          <span className="block text-[10px] font-normal text-gray-900">
                            {e.notes}
                          </span>
                        )}
                      </td>
                      <td className="p-2.5">
                        <Badge variant="white" size="sm">
                          {e.category}
                        </Badge>
                      </td>
                      <td className="p-2.5 text-right font-semibold text-sm text-gray-900">
                        ৳{e.amount_bdt.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                      </td>
                      <td className="p-2.5 text-center">
                        {isRecurring ? (
                          <Badge variant="mint" size="sm" pill>
                            <Repeat className="w-2.5 h-2.5 stroke-[3px]" /> Recurring (2-Mo Match)
                          </Badge>
                        ) : (
                          <span className="text-[10px] text-gray-900 font-bold">—</span>
                        )}
                      </td>
                      <td className="p-2.5 text-right">
                        <button
                          onClick={() => deleteExpense(e.id)}
                          className="p-1 border border-gray-200 bg-white hover:bg-white text-gray-900 transition-colors shadow-md active:translate-x-0.5 active:translate-y-0.5"
                          title="Delete Expense"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Card>
  );
};
