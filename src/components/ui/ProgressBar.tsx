import React from "react";

export interface ProgressBarProps {
  value: number; // 0 to 100
  variant?: "accent" | "secondary" | "muted" | "mint" | "cyan" | "dark";
  height?: "sm" | "md" | "lg";
  showLabel?: boolean;
  label?: string;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  variant = "secondary",
  height = "md",
  showLabel = false,
  label,
  className = "",
}) => {
  const clampedValue = Math.min(100, Math.max(0, value));

  const variantStyles = {
    accent: "bg-[#FF6B6B]",
    secondary: "bg-[#FFD93D]",
    muted: "bg-[#C4B5FD]",
    mint: "bg-[#00F0B5]",
    cyan: "bg-[#00E5FF]",
    dark: "bg-[#000000]",
  }[variant];

  const heightStyles = {
    sm: "h-3",
    md: "h-6",
    lg: "h-8",
  }[height];

  return (
    <div className={`w-full flex flex-col gap-1.5 ${className}`}>
      {(showLabel || label) && (
        <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider text-black">
          {label && <span>{label}</span>}
          {showLabel && <span>{clampedValue.toFixed(1)}%</span>}
        </div>
      )}
      <div
        className={`w-full ${heightStyles} bg-white relative overflow-hidden shadow-neo-xs`}
        style={{
          border: "3px solid #000000",
          borderRadius: "0px",
        }}
      >
        <div
          className={`h-full ${variantStyles} transition-all duration-300 ease-out`}
          style={{
            width: `${clampedValue}%`,
            borderRight: clampedValue > 0 && clampedValue < 100 ? "3px solid #000000" : "none",
          }}
        />
      </div>
    </div>
  );
};
