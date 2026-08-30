"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useLedger } from "@/context/LedgerContext";
import { Trash2, Plus } from "lucide-react";
import { ExpenseCategory } from "@/types/expense";

interface ManageShorthandsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ManageShorthandsModal: React.FC<ManageShorthandsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { shorthands, addShorthand, deleteShorthand } = useLedger();
  
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState<ExpenseCategory>("Food");
  const [shop, setShop] = useState("");
  const [error, setError] = useState("");

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyword.trim()) {
      setError("Please enter a keyword.");
      return;
    }
    if (!shop.trim()) {
      setError("Please enter a default shop name.");
      return;
    }
    if (shorthands.some(sh => sh.keyword.toLowerCase() === keyword.toLowerCase().trim())) {
      setError("This keyword already exists.");
      return;
    }

    addShorthand({
      keyword: keyword.toLowerCase().trim(),
      category,
      shop: shop.trim(),
    });

    setKeyword("");
    setShop("");
    setError("");
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Manage Notebook Commands"
    >
      <div className="flex flex-col gap-6">
        {/* Existing Shorthands List */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase text-slate-800">Your Active Commands</span>
          {shorthands.length === 0 ? (
            <div className="text-xs text-slate-500 italic p-4 bg-gray-50 rounded-xl text-center">
              No custom commands yet. Add one below!
            </div>
          ) : (
            <div className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-2">
              {shorthands.map((sh) => (
                <div key={sh.id} className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-xl shadow-sm">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-800">{sh.keyword}</span>
                    <span className="text-[10px] font-semibold text-slate-500">{sh.shop} • {sh.category}</span>
                  </div>
                  <button
                    onClick={() => deleteShorthand(sh.id)}
                    className="p-2 text-[#FF6B6B] hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="w-full h-px bg-gray-100" />

        {/* Add New Shorthand Form */}
        <form onSubmit={handleAdd} className="flex flex-col gap-3">
          <span className="text-xs font-semibold uppercase text-slate-800">Create New Command</span>
          
          {error && (
            <div className="p-2 bg-red-50 text-[#FF6B6B] text-xs font-bold rounded-lg">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Keyword"
              placeholder="e.g. gym"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              required
            />
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-semibold uppercase text-slate-500">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
                className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 font-semibold"
              >
                <option value="Food">Food</option>
                <option value="Groceries">Groceries</option>
                <option value="Transport">Transport</option>
                <option value="Rent">Rent</option>
                <option value="Utilities">Utilities</option>
                <option value="Education">Education</option>
                <option value="Health">Health</option>
                <option value="Mobile">Mobile</option>
                <option value="Shopping">Shopping</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
          
          <Input
            label="Default Shop / Memo"
            placeholder="e.g. Iron Fitness"
            value={shop}
            onChange={(e) => setShop(e.target.value)}
            required
          />

          <div className="flex justify-end pt-2">
            <Button type="submit" variant="secondary" className="w-full sm:w-auto">
              <Plus className="w-4 h-4 mr-1 inline" /> Add Command
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
