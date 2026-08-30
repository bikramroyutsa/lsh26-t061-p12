import React, { useState } from "react";
import { useLedger } from "@/context/LedgerContext";
import { Button } from "@/components/ui/Button";

export const OnboardingModal: React.FC = () => {
  const { updateOnboarding } = useLedger();
  const [salary, setSalary] = useState<string>("");
  const [dpsRate, setDpsRate] = useState<string>("8.0");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!salary || isNaN(Number(salary))) return;
    
    setLoading(true);
    await updateOnboarding(Number(salary), Number(dpsRate || "8.0"));
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md border border-gray-100 flex flex-col gap-6 animate-in zoom-in-95 duration-200">
        <div className="text-center">
          <h2 className="text-2xl font-black text-slate-800 mb-2">Welcome to Ledgy!</h2>
          <p className="text-sm font-semibold text-slate-500">
            Let's set up your profile before we get started.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 ml-1">
              Monthly Salary (BDT) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-[#634E9F] focus:bg-white transition-all"
              placeholder="e.g. 50000"
              required
              min={1}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 ml-1">
              Default DPS Rate (%)
            </label>
            <input
              type="number"
              step="0.1"
              value={dpsRate}
              onChange={(e) => setDpsRate(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-[#634E9F] focus:bg-white transition-all"
              placeholder="8.0"
            />
            <p className="text-[10px] text-slate-400 mt-1 ml-1">
              Used for projecting returns on your savings pockets.
            </p>
          </div>

          <Button type="submit" variant="primary" className="w-full mt-4" disabled={loading}>
            {loading ? "Saving..." : "Start Using Ledgy"}
          </Button>
        </form>
      </div>
    </div>
  );
};
