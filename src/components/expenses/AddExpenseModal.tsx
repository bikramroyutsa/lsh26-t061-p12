"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useLedger } from "@/context/LedgerContext";
import { Plus } from "lucide-react";

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddExpenseModal: React.FC<AddExpenseModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { addExpense, todayDate } = useLedger();

  const [date, setDate] = useState(todayDate);
  const [shop, setShop] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);

    if (!shop.trim()) {
      setError("Please specify the shop or merchant name.");
      return;
    }
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError("Please enter a valid positive amount.");
      return;
    }

    addExpense({
      date,
      shop: shop.trim(),
      amount_bdt: parsedAmount,
      category,
      notes: notes.trim() || undefined,
    });

    setShop("");
    setAmount("");
    setNotes("");
    setError("");
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Expense Record"
      headerBg="secondary"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {error && (
          <div className="p-3 bg-white border border-[#FF6B6B] text-xs font-bold text-gray-900">
            ⚠️ {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-sm text-gray-500 text-gray-900">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 font-bold text-sm"
            >
              <option value="Food">Food</option>
              <option value="Groceries">Groceries</option>
              <option value="Rent">Rent</option>
              <option value="Utilities">Utilities</option>
              <option value="Transport">Transport</option>
              <option value="Education">Education</option>
              <option value="Health">Health</option>
              <option value="Mobile">Mobile</option>
              <option value="Shopping">Shopping</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Shop / Merchant"
            placeholder="e.g. Meena Bazar, Uber, DESCO"
            value={shop}
            onChange={(e) => setShop(e.target.value)}
            required
          />

          <Input
            label="Amount (BDT)"
            type="number"
            step="0.01"
            placeholder="e.g. 1500.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>

        <Input
          label="Notes (Optional)"
          placeholder="e.g. Grocery items or voucher details"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        <div className="pt-2 flex justify-end gap-2">
          <Button type="button" variant="white" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="secondary" icon={<Plus className="w-4 h-4" />}>
            Record Expense
          </Button>
        </div>
      </form>
    </Modal>
  );
};
