// @ts-nocheck
"use client";

import React, { useState, useEffect, useRef } from "react";
import { useChat } from "@ai-sdk/react";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";
import { useLedger } from "@/context/LedgerContext";

export const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { salary, expenses, pockets, forecast, momComparison } = useLedger();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // We only send minimal necessary context to avoid overwhelming the token limit
  const contextData = {
    salary,
    forecast: {
      spent: forecast.current_spent_bdt,
      projectedRestOfMonth: forecast.projected_remaining_spend_bdt,
      expectedMonthEndSurplus: forecast.projected_net_savings_bdt,
      isDeficit: forecast.is_deficit
    },
    expensesSummary: expenses.slice(0, 20).map(e => ({ amount: e.amount_bdt, category: e.category, shop: e.shop, date: e.date })),
    pockets: pockets.map(p => ({ name: p.name, target: p.target_bdt, monthly: p.monthly_contribution_bdt })),
  };

  const [input, setInput] = useState("");
  const { messages, status, sendMessage } = useChat({
    api: "/api/chat",
    body: { contextData },
  });

  const isLoading = status === 'submitted' || status === 'streaming';

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    sendMessage({ content: input, role: 'user' });
    setInput('');
  };

  const getMessageText = (m: any) => {
    if (typeof m.content === 'string') return m.content;
    if (Array.isArray(m.parts)) {
      return m.parts.filter((p: any) => p.type === 'text').map((p: any) => p.text).join('');
    }
    return '';
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-[#634E9F] text-white rounded-full shadow-xl flex items-center justify-center hover:bg-[#524083] hover:scale-105 transition-all z-50 group"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
        {!isOpen && (
          <span className="absolute -top-10 right-0 bg-white text-slate-800 text-xs font-bold px-3 py-1.5 rounded-xl shadow-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            Chat with Ledgy AI
          </span>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-[350px] sm:w-[400px] max-h-[600px] h-[80vh] bg-white rounded-3xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden z-50 animate-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="bg-[#634E9F] p-4 text-white flex items-center gap-3 shadow-md z-10">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Ledgy AI Assistant</h3>
              <p className="text-[10px] text-white/80">Ask anything about your finances</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 bg-[#F9F8FD]">
            {messages.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center gap-3 text-slate-500 p-6">
                <Bot className="w-12 h-12 text-slate-300" />
                <p className="text-xs font-semibold">
                  Hi! I'm your AI advisor. Ask me things like:<br/><br/>
                  "Am I spending too much on food?"<br/>
                  "How much will I save this month?"
                </p>
              </div>
            ) : (
              messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex gap-3 max-w-[85%] ${m.role === "user" ? "self-end flex-row-reverse" : "self-start"}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${m.role === "user" ? "bg-indigo-100 text-indigo-700" : "bg-purple-100 text-[#634E9F]"}`}>
                    {m.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>
                  <div className={`p-3 rounded-2xl text-[13px] leading-relaxed shadow-sm ${m.role === "user" ? "bg-[#634E9F] text-white rounded-tr-sm" : "bg-white text-slate-800 rounded-tl-sm border border-gray-100"}`}>
                    {getMessageText(m).split('\n').map((line: string, i: number) => (
                      <React.Fragment key={i}>
                        {line}
                        <br />
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              ))
            )}
            {isLoading && (
              <div className="self-start flex gap-3 max-w-[85%]">
                <div className="w-8 h-8 rounded-full bg-purple-100 text-[#634E9F] flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="p-3 bg-white rounded-2xl rounded-tl-sm border border-gray-100 shadow-sm flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-[#634E9F]/50 rounded-full animate-bounce" />
                  <div className="w-1.5 h-1.5 bg-[#634E9F]/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-1.5 h-1.5 bg-[#634E9F]/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSubmit} className="p-3 bg-white border-t border-gray-100 z-10">
            <div className="flex items-center bg-[#F6F5FB] rounded-full p-1 pl-4 pr-1 focus-within:ring-2 focus-within:ring-[#634E9F]/50 transition-all">
              <input
                value={input}
                onChange={handleInputChange}
                placeholder="Ask about your budget..."
                className="flex-1 bg-transparent border-none text-sm outline-none text-slate-800 placeholder-slate-400"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="w-10 h-10 rounded-full bg-[#634E9F] text-white flex items-center justify-center hover:bg-[#524083] disabled:bg-slate-300 disabled:text-slate-500 transition-colors flex-shrink-0"
              >
                <Send className="w-4 h-4 -ml-0.5" />
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};
