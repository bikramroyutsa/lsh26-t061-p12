import React, { useEffect } from "react";
import { X } from "lucide-react";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  headerBg?: "secondary" | "accent" | "muted" | "mint" | "cyan" | "white";
  maxWidth?: "sm" | "md" | "lg" | "xl";
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  headerBg = "secondary",
  maxWidth = "md",
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthStyles = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-2xl",
  }[maxWidth];

  const headerBgStyles = {
    secondary: "bg-[#FFD93D]",
    accent: "bg-[#FF6B6B]",
    muted: "bg-[#C4B5FD]",
    mint: "bg-[#00F0B5]",
    cyan: "bg-[#00E5FF]",
    white: "bg-[#FFFFFF]",
  }[headerBg];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.75)",
        backdropFilter: "none",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={`w-full ${maxWidthStyles} bg-[#FFFDF5] shadow-neo-xl animate-in fade-in zoom-in-95 duration-150`}
        style={{
          border: "4px solid #000000",
          borderRadius: "0px",
          overflow: "hidden",
        }}
      >
        <div
          className={`px-5 py-3.5 flex items-center justify-between font-black uppercase tracking-wider text-base ${headerBgStyles}`}
          style={{
            borderBottom: "4px solid #000000",
          }}
        >
          <div className="flex items-center gap-2">{title}</div>
          <button
            onClick={onClose}
            className="p-1 border-2 border-black bg-white hover:bg-[#FF6B6B] transition-colors shadow-neo-xs active:translate-x-0.5 active:translate-y-0.5"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 stroke-[3px]" />
          </button>
        </div>
        <div className="p-6 max-h-[80vh] overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};
