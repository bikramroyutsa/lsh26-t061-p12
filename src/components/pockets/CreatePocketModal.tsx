"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useLedger } from "@/context/LedgerContext";
import { Target, Plus } from "lucide-react";

interface CreatePocketModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreatePocketModal: React.FC<CreatePocketModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { addPocket } = useLedger();
  const [name, setName] = useState("");
  const [item, setItem] = useState("");
  const [targetBdt, setTargetBdt] = useState("");
  const [monthlyContributionBdt, setMonthlyContributionBdt] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const target = parseFloat(targetBdt);
    const contribution = parseFloat(monthlyContributionBdt);

    if (!name.trim() || !item.trim()) {
      setError("Please specify pocket name and item description.");
      return;
    }
    if (isNaN(target) || target <= 0) {
      setError("Please enter a valid target amount.");
      return;
    }
    if (isNaN(contribution) || contribution <= 0) {
      setError("Please enter a valid monthly contribution.");
      return;
    }

    addPocket({
      name: name.trim(),
      item: item.trim(),
      target_bdt: target,
      monthly_contribution_bdt: contribution,
      current_balance_bdt: 0,
    });

    setName("");
    setItem("");
    setTargetBdt("");
    setMonthlyContributionBdt("");
    setError("");
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Savings Pocket"
      headerBg="secondary"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {error && (
          <div className="p-3 bg-white border border-[#FF6B6B] text-xs font-bold text-gray-900">
            ⚠️ {error}
          </div>
        )}

        <Input
          label="Pocket Name (e.g. Dream Laptop, Honda Bike, Wedding)"
          placeholder="Laptop"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <Input
          label="Item Specifics / Model"
          placeholder="MacBook Air M4 16GB"
          value={item}
          onChange={(e) => setItem(e.target.value)}
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Target Amount (BDT)"
            type="number"
            placeholder="145000"
            value={targetBdt}
            onChange={(e) => setTargetBdt(e.target.value)}
            required
          />

          <Input
            label="Monthly Contribution (BDT)"
            type="number"
            placeholder="15000"
            value={monthlyContributionBdt}
            onChange={(e) => setMonthlyContributionBdt(e.target.value)}
            required
          />
        </div>

        <div className="pt-2 flex justify-end gap-2">
          <Button type="button" variant="white" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="secondary" icon={<Plus className="w-4 h-4" />}>
            Create Pocket
          </Button>
        </div>
      </form>
    </Modal>
  );
};
