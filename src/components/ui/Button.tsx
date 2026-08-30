import React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "accent" | "secondary" | "muted" | "white" | "dark" | "cyan" | "mint";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "secondary",
  size = "md",
  fullWidth = false,
  icon,
  className = "",
  disabled,
  ...props
}) => {
  const variantStyles = {
    accent: "bg-[#FF6B6B] text-black hover:bg-[#ff5252]",
    secondary: "bg-[#FFD93D] text-black hover:bg-[#ffcc00]",
    muted: "bg-[#C4B5FD] text-black hover:bg-[#b09afc]",
    white: "bg-[#FFFFFF] text-black hover:bg-[#f0f0f0]",
    dark: "bg-[#000000] text-white hover:bg-[#1a1a1a]",
    cyan: "bg-[#00E5FF] text-black hover:bg-[#00d0e8]",
    mint: "bg-[#00F0B5] text-black hover:bg-[#00d6a2]",
  }[variant];

  const sizeStyles = {
    sm: "px-3 py-1.5 text-xs font-bold",
    md: "px-5 py-2.5 text-sm font-bold",
    lg: "px-7 py-3.5 text-base font-black tracking-wider",
  }[size];

  return (
    <button
      disabled={disabled}
      className={`btn-neo ${variantStyles} ${sizeStyles} ${
        fullWidth ? "w-full" : ""
      } ${className}`}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
        cursor: disabled ? "not-allowed" : "pointer",
      }}
      {...props}
    >
      {icon && <span className="flex items-center">{icon}</span>}
      {children}
    </button>
  );
};
