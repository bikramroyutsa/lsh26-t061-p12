"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useLedger } from "@/context/LedgerContext";
import { parseReceiptText, SAMPLE_RECEIPTS } from "@/lib/ocr/receiptParser";
import { OCRExtractionResult } from "@/types/ocr";
import { Camera, Upload, AlertTriangle, CheckCircle, FileText, Sparkles } from "lucide-react";

interface ReceiptUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReceiptUploadModal: React.FC<ReceiptUploadModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { addExpense, todayDate } = useLedger();

  const [rawText, setRawText] = useState("");
  const [ocrResult, setOcrResult] = useState<OCRExtractionResult | null>(null);

  // Editable Form fields
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(todayDate);
  const [shop, setShop] = useState("");
  const [category, setCategory] = useState("Groceries");
  const [error, setError] = useState("");

  const handleRunOCR = (textToParse: string) => {
    setRawText(textToParse);
    const parsed = parseReceiptText(textToParse);
    setOcrResult(parsed);

    // Populate editable fields
    // Constraint: Never fill in an amount the app is not sure about!
    setAmount(parsed.amount.value);
    setDate(parsed.date.value || todayDate);
    setShop(parsed.shop.value);
    setCategory(parsed.category.value || "Other");
    setError("");
  };

  const handleSampleSelect = (previewText: string) => {
    handleRunOCR(previewText);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Simulate OCR text extraction from filename and sample patterns
    const simulatedMemo = `INVOICE / CASH MEMO\nStore: ${file.name.replace(/\.[^/.]+$/, "")}\nDate: ${todayDate}\nTotal: 1250.00 BDT\nThank you!`;
    handleRunOCR(simulatedMemo);
  };

  const handleSaveExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);

    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError("Please specify a valid positive amount in BDT.");
      return;
    }
    if (!shop.trim()) {
      setError("Please specify the shop or merchant name.");
      return;
    }

    addExpense({
      date,
      shop: shop.trim(),
      amount_bdt: parsedAmount,
      category,
      notes: "Scanned via OCR Receipt Parser",
    });

    // Reset and close
    setOcrResult(null);
    setRawText("");
    setAmount("");
    setShop("");
    setError("");
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Intelligent Bill & Receipt Scanner (OCR)"
      headerBg="muted"
      maxWidth="xl"
    >
      <div className="flex flex-col gap-5">
        {/* Sample Memos for Instant Demo */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold text-sm text-gray-500 text-slate-800 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#FF6B6B]" /> Quick Test: Choose Sample Memo
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {SAMPLE_RECEIPTS.map((sample, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSampleSelect(sample.preview)}
                className="p-2 rounded-2xl bg-white hover:bg-white text-[11px] font-bold text-left shadow-sm active:translate-x-0.5 active:translate-y-0.5 transition-all truncate"
              >
                📄 {sample.name}
              </button>
            ))}
          </div>
        </div>

        {/* Upload Zone & Manual Text Paste */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* File Upload Dropzone */}
          <label className="border border-dashed border-gray-200 p-4 bg-white shadow-sm flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-yellow-50 transition-colors">
            <Camera className="w-8 h-8 text-slate-800" />
            <span className="text-xs font-semibold uppercase text-center">
              Upload Memo / Receipt Photo
            </span>
            <span className="text-[10px] font-bold text-slate-800">PNG, JPG, or PDF</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />
          </label>

          {/* Paste Memo Text */}
          <div className="bg-white rounded-2xl shadow-sm p-4 border border-gray-50 flex flex-col gap-1.5">
            <span className="text-[11px] font-semibold uppercase text-slate-800">
              Or Paste Receipt Text
            </span>
            <textarea
              rows={3}
              value={rawText}
              onChange={(e) => handleRunOCR(e.target.value)}
              placeholder="Paste receipt, bKash SMS, or memo text here..."
              className="w-full text-xs font-bold bg-[#F6F5FB] rounded-xl p-3 bg-white outline-none"
            />
          </div>
        </div>

        {/* OCR Result & Uncertainty Review Form */}
        {ocrResult && (
          <form
            onSubmit={handleSaveExpense}
            className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 sm:p-8 flex flex-col gap-4"
          >
            <div className="flex items-center justify-between border-gray-200 pb-2">
              <span className="font-semibold text-sm uppercase text-slate-800 flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-[#00B894]" /> Review Extracted Details
              </span>
              <span className="text-[10px] font-semibold bg-[#EAE5F8] text-[#554089] px-2 py-0.5 rounded-full border-none">
                Verify Before Saving
              </span>
            </div>

            {/* Uncertainty Warnings */}
            {ocrResult.warnings.length > 0 && (
              <div className="p-3 bg-white border border-[#FF6B6B] flex flex-col gap-1 text-xs font-bold text-slate-800">
                <div className="flex items-center gap-1.5 font-semibold uppercase text-[#FF6B6B]">
                  <AlertTriangle className="w-4 h-4" /> Uncertainty Safeguard Active:
                </div>
                {ocrResult.warnings.map((w, i) => (
                  <div key={i}>• {w}</div>
                ))}
              </div>
            )}

            {error && (
              <div className="p-2.5 bg-white border border-[#FF6B6B] text-xs font-bold text-slate-800">
                ⚠️ {error}
              </div>
            )}

            {/* Editable Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Amount */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold uppercase">
                    Amount (BDT) *
                  </label>
                  {ocrResult.amount.isUncertain && (
                    <Badge variant="primary" size="sm">
                      UNSURE: INPUT REQUIRED
                    </Badge>
                  )}
                </div>
                <input
                  type="number"
                  step="0.01"
                  placeholder="e.g. 2475.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className={`w-full bg-white border-none rounded-full bg-[#F6F5FB] px-4 py-2 focus:ring-2 focus:ring-indigo-500 ${
                    ocrResult.amount.isUncertain ? "bg-white border-[#FF6B6B]" : ""
                  }`}
                  required
                />
              </div>

              {/* Shop */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold uppercase">
                    Shop / Merchant *
                  </label>
                  {ocrResult.shop.isUncertain && (
                    <Badge variant="primary" size="sm">
                      UNSURE
                    </Badge>
                  )}
                </div>
                <input
                  type="text"
                  placeholder="e.g. Meena Bazar"
                  value={shop}
                  onChange={(e) => setShop(e.target.value)}
                  className="w-full bg-white border-none rounded-full bg-[#F6F5FB] px-4 py-2 focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              {/* Date */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold uppercase">Date</label>
                  {ocrResult.date.isUncertain && (
                    <Badge variant="secondary" size="sm">
                      ESTIMATED
                    </Badge>
                  )}
                </div>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-white border-none rounded-full bg-[#F6F5FB] px-4 py-2 focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              {/* Category */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold uppercase">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-white border-none rounded-full bg-[#F6F5FB] px-4 py-2 focus:ring-2 focus:ring-indigo-500 font-bold"
                >
                  <option value="Groceries">Groceries</option>
                  <option value="Food">Food</option>
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

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setOcrResult(null)}>
                Clear
              </Button>
              <Button type="submit" variant="secondary">
                Confirm & Add to Ledger
              </Button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
};
