"use client";

import React, { useState } from "react";
import { useLedger } from "@/context/LedgerContext";
import { PocketCard } from "./PocketCard";
import { CreatePocketModal } from "./CreatePocketModal";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Target, Plus, PiggyBank } from "lucide-react";

export const PocketList: React.FC = () => {
  const { pocketsWithProjections } = useLedger();
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const totalMonthlyCommitment = pocketsWithProjections.reduce(
    (sum, p) => sum + p.monthly_contribution_bdt,
    0
  );

  return (
    <div className="flex flex-col gap-4">
      {/* Section Header */}
      <div className="flex items-center justify-between flex-wrap gap-3 bg-white rounded-2xl p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-2xl bg-white shadow-sm">
            <PiggyBank className="w-6 h-6 stroke-[2.5px]" />
          </div>
          <div>
            <h2 className="font-semibold text-xl uppercase tracking-tight text-slate-800">
              Savings Pockets & DPS Yields
            </h2>
            <span className="text-xs font-bold text-slate-800">
              Forecast-derived completion timelines with compound DPS returns
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant="outline" size="md">
            TOTAL: ৳{totalMonthlyCommitment.toLocaleString("en-IN")}/MO
          </Badge>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsCreateOpen(true)}
            
          >
            New Pocket
          </Button>
        </div>
      </div>

      {/* Grid of Pockets */}
      {pocketsWithProjections.length === 0 ? (
        <Card variant="outline" shadow="md">
          <div className="text-center py-10 flex flex-col items-center gap-3">
            <Target className="w-12 h-12 text-slate-800" />
            <p className="font-semibold text-base uppercase text-slate-800">
              No savings pockets created yet
            </p>
            <Button
              variant="secondary"
              size="md"
              onClick={() => setIsCreateOpen(true)}
              
            >
              Create First Pocket
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pocketsWithProjections.map((pocket) => (
            <PocketCard key={pocket.id} pocket={pocket} />
          ))}
        </div>
      )}

      <CreatePocketModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
    </div>
  );
};
