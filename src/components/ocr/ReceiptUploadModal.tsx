"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useLedger } from "@/context/LedgerContext";
import { parseReceiptText, SAMPLE_RECEIPTS } from "@/lib/ocr/receiptParser";
import { OCRExtractionResult } from "@/types/ocr";
import { Camera, Upload, AlertTriangle, CheckCircle, FileText, Sparkles, Loader2 } from "lucide-react";

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
  const [isScanning, setIsScanning] = useState(false);

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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsScanning(true);
    setOcrResult(null);
    setError("");

    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch("/api/ocr", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error ?? `Server error ${res.status}`);
      }

      // Map Gemini response → OCRExtractionResult
      const result: OCRExtractionResult = {
        amount: {
          value: data.amountUncertain ? "" : (data.amount ?? ""),
          confidence: data.amountUncertain ? 0.3 : 0.92,
          isUncertain: data.amountUncertain ?? true,
        },
        date: {
          value: data.date || todayDate,
          confidence: data.dateUncertain ? 0.4 : 0.95,
          isUncertain: data.dateUncertain ?? false,
        },
        shop: {
          value: data.shop ?? "",
          confidence: data.shopUncertain ? 0.3 : 0.95,
          isUncertain: data.shopUncertain ?? true,
        },
        category: {
          value: data.category ?? "Other",
          confidence: 0.9,
          isUncertain: false,
        },
        rawText: `[Image scanned via Gemini OCR]`,
        warnings: data.warnings ?? [],
      };

      setOcrResult(result);
      setAmount(result.amount.value);
      setDate(result.date.value || todayDate);
      setShop(result.shop.value);
      setCategory(result.category.value || "Other");
    } catch (err) {
      setError(
        err instanceof Error
          ? `OCR failed: ${err.message}`
          : "OCR failed. Please paste the text manually."
      );
    } finally {
      setIsScanning(false);
      // Reset file input so the same file can be re-uploaded if needed
      e.target.value = "";
    }
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
          <div className="border-2 border-dashed border-gray-200 rounded-2xl p-4 bg-white shadow-sm flex flex-col items-center justify-center gap-3">
            {isScanning ? (
              <div className="flex flex-col items-center gap-2 py-4">
                <Loader2 className="w-8 h-8 text-[#634E9F] animate-spin" />
                <span className="text-xs font-bold uppercase text-center text-slate-800 mt-2">
                  Scanning with Gemini AI…
                </span>
                <span className="text-[10px] font-bold text-slate-400">This may take a few seconds</span>
              </div>
            ) : (
              <div className="flex flex-row w-full gap-3 h-full">
                <label className="flex-1 flex flex-col items-center justify-center gap-2 bg-[#F6F5FB] hover:bg-[#EAE5F8] rounded-xl p-4 cursor-pointer transition-colors border border-transparent hover:border-[#634E9F]/30">
                  <Upload className="w-6 h-6 text-[#634E9F]" />
                  <span className="text-[10px] font-bold uppercase text-center text-slate-800 mt-1">
                    Upload File
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                </label>
                <label className="flex-1 flex flex-col items-center justify-center gap-2 bg-[#F6F5FB] hover:bg-[#EAE5F8] rounded-xl p-4 cursor-pointer transition-colors border border-transparent hover:border-[#634E9F]/30">
                  <Camera className="w-6 h-6 text-[#634E9F]" />
                  <span className="text-[10px] font-bold uppercase text-center text-slate-800 mt-1">
                    Take Photo
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                </label>
              </div>
            )}
          </div>

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
                    <Badge variant="warning">
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
                    <Badge variant="warning">
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
                    <Badge variant="info">
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
