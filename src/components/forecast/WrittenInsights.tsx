"use client";

import React from "react";
import { useLedger } from "@/context/LedgerContext";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Sparkles, AlertCircle, TrendingUp, CheckCircle2, Repeat, Target } from "lucide-react";

export const WrittenInsights: React.FC = () => {
  const { insights } = useLedger();

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
          <Badge variant="primary" size="sm">
            {insights.length} CONCRETE INSIGHTS
          </Badge>
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
      </div>
    </Card>
  );
};
