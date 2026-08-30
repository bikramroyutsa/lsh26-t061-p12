import React from "react";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "accent" | "secondary" | "muted" | "mint" | "cyan" | "orange" | "pink" | "dark" | "white";
  pill?: boolean;
  rotation?: "none" | "neg2" | "pos1" | "pos2" | "pos3";
  shadow?: "none" | "xs" | "sm";
  size?: "sm" | "md";
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "secondary",
  pill = false,
  rotation = "none",
  shadow = "xs",
  size = "sm",
  className = "",
  style,
  ...props
}) => {
  const bgStyles = {
    accent: "bg-[#FF6B6B] text-black",
    secondary: "bg-[#FFD93D] text-black",
    muted: "bg-[#C4B5FD] text-black",
    mint: "bg-[#00F0B5] text-black",
    cyan: "bg-[#00E5FF] text-black",
    orange: "bg-[#FF9F1C] text-black",
    pink: "bg-[#FF70A6] text-black",
    dark: "bg-[#000000] text-white",
    white: "bg-[#FFFFFF] text-black",
  }[variant];

  const rotationStyles = {
    none: "",
    neg2: "rotate-sticker-neg2",
    pos1: "rotate-sticker-pos1",
    pos2: "rotate-sticker-pos2",
    pos3: "rotate-sticker-pos3",
  }[rotation];

  const shadowStyles = {
    none: "",
    xs: "shadow-neo-xs",
    sm: "shadow-neo-sm",
  }[shadow];

  const sizeStyles = {
    sm: "px-2.5 py-0.5 text-xs font-bold",
    md: "px-3.5 py-1 text-sm font-black tracking-wide",
  }[size];

  return (
    <span
      className={`inline-flex items-center justify-center font-black uppercase tracking-wider ${
        pill ? "rounded-full border-2" : "rounded-none border-2"
      } border-black ${bgStyles} ${rotationStyles} ${shadowStyles} ${sizeStyles} ${className}`}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "4px",
        ...style,
      }}
      {...props}
    >
      {children}
    </span>
  );
};
