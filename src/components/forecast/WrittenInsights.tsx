"use client";

import React from "react";
import { useLedger } from "@/context/LedgerContext";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Sparkles, AlertCircle, TrendingUp, CheckCircle2, Bot, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

export const WrittenInsights: React.FC = () => {
  const { salary, expenses, pockets, forecast, momComparison, insights } = useLedger();
  const [aiInsight, setAiInsight] = React.useState<string | null>(null);
  const [isAskingAi, setIsAskingAi] = React.useState(false);

  const handleAskAi = async () => {
    setIsAskingAi(true);
    setAiInsight(null);
    try {
      const contextData = {
        salary,
        forecast: {
          spent: forecast.current_spent_bdt,
          projectedRestOfMonth: forecast.projected_remaining_spend_bdt,
          expectedMonthEndSurplus: forecast.projected_net_savings_bdt,
          isDeficit: forecast.is_deficit
        },
        mom: {
          lastMonthSpent: momComparison.last_month_spent_bdt,
          thisMonthSpent: momComparison.this_month_spent_bdt,
          deltaPercentage: momComparison.delta_percentage
        },
        expensesSummary: expenses.slice(0, 20).map(e => ({ amount: e.amount_bdt, category: e.category, shop: e.shop, date: e.date })),
        pockets: pockets.map(p => ({ name: p.name, target: p.target_bdt, monthly: p.monthly_contribution_bdt })),
      };

      const res = await fetch("/api/advisor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contextData })
      });
      
      const data = await res.json();
      if (data.insight) {
        setAiInsight(data.insight);
      } else {
        setAiInsight("AI Advisor is currently unavailable. Please check your API keys.");
      }
    } catch (err) {
      setAiInsight("Failed to reach the AI Advisor.");
    } finally {
      setIsAskingAi(false);
    }
  };

  const getSeverityIcon = (type: string, severity: string) => {
    switch (severity) {
      case "critical":
        return <AlertCircle className="w-5 h-5 text-[#FF6B6B] stroke-[3px]" />;
      case "warning":
        return <TrendingUp className="w-5 h-5 text-[#FF9F1C] stroke-[3px]" />;
      case "positive":
        return <CheckCircle2 className="w-5 h-5 text-[#00B894] stroke-[3px]" />;
      default:
        return <Sparkles className="w-5 h-5 text-[#C4B5FD] stroke-[3px]" />;
    }
  };

  const getSeverityBg = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-white border-[#FF6B6B]";
      case "warning":
        return "bg-white border-gray-200";
      case "positive":
        return "bg-white border-gray-200";
      default:
        return "bg-white border-gray-200";
    }
  };

  return (
    <Card
      variant="outline"
      shadow="md"
      header={
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 stroke-[2.5px]" />
            <span>Dynamic Data-Grounded Written Insights</span>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="secondary" onClick={handleAskAi} disabled={isAskingAi} className="bg-white/80 hover:bg-white text-[#634E9F] font-bold">
              {isAskingAi ? <Loader2 className="w-4 h-4 mr-1.5 animate-spin" /> : <Bot className="w-4 h-4 mr-1.5" />}
              {isAskingAi ? "Thinking..." : "Ask AI Advisor"}
            </Button>
            <Badge variant="primary" size="sm">
              {insights.length} CONCRETE INSIGHTS
            </Badge>
          </div>
        </div>
      }
      headerBg="mint"
    >
      <div className="flex flex-col gap-3.5">
        {insights.map((insight) => (
          <div
            key={insight.id}
            className={`border p-4 shadow-sm flex items-start gap-3.5 ${getSeverityBg(
              insight.severity
            )} hover:translate-x-0.5 transition-transform`}
          >
            <div className="p-2 rounded-2xl bg-white shadow-sm mt-0.5">
              {getSeverityIcon(insight.type, insight.severity)}
            </div>

            <div className="flex-1 flex flex-col gap-1">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="font-semibold text-sm uppercase tracking-tight text-slate-800">
                  {insight.title}
                </span>
                {insight.category && (
                  <Badge variant="primary" size="sm">
                    {insight.category}
                  </Badge>
                )}
              </div>
              <p className="text-xs font-bold text-slate-800 leading-relaxed">
                {insight.message}
              </p>
            </div>
          </div>
        ))}

        {aiInsight && (
          <div className="mt-2 border border-purple-200 p-5 shadow-md flex items-start gap-4 bg-purple-50/50 rounded-2xl animate-in fade-in zoom-in-95 duration-300">
            <div className="p-2.5 rounded-full bg-[#634E9F] shadow-sm text-white flex-shrink-0">
              <Bot className="w-5 h-5" />
            </div>
            <div className="flex-1 flex flex-col gap-2">
              <div className="font-bold text-sm uppercase tracking-tight text-[#634E9F]">
                AI Advisor Insights
              </div>
              <div className="text-[13px] font-semibold text-slate-700 leading-relaxed space-y-2 whitespace-pre-wrap">
                {aiInsight}
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
