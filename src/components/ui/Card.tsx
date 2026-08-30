import React from "react";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "white" | "cream" | "secondary" | "muted" | "accent" | "dark" | "cyan" | "mint";
  shadow?: "none" | "sm" | "md" | "lg" | "xl";
  hoverLift?: boolean;
  header?: React.ReactNode;
  headerBg?: "white" | "secondary" | "muted" | "accent" | "dark" | "cyan" | "mint";
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = "white",
  shadow = "md",
  hoverLift = false,
  header,
  headerBg = "secondary",
  className = "",
  style,
  ...props
}) => {
  const bgStyles = {
    white: "bg-[#FFFFFF] text-black",
    cream: "bg-[#FFFDF5] text-black",
    secondary: "bg-[#FFD93D] text-black",
    muted: "bg-[#C4B5FD] text-black",
    accent: "bg-[#FF6B6B] text-black",
    dark: "bg-[#000000] text-white",
    cyan: "bg-[#00E5FF] text-black",
    mint: "bg-[#00F0B5] text-black",
  }[variant];

  const headerBgStyles = {
    white: "bg-[#FFFFFF] text-black",
    secondary: "bg-[#FFD93D] text-black",
    muted: "bg-[#C4B5FD] text-black",
    accent: "bg-[#FF6B6B] text-black",
    dark: "bg-[#000000] text-white",
    cyan: "bg-[#00E5FF] text-black",
    mint: "bg-[#00F0B5] text-black",
  }[headerBg];

  const shadowStyles = {
    none: "",
    sm: "shadow-neo-sm",
    md: "shadow-neo-md",
    lg: "shadow-neo-lg",
    xl: "shadow-neo-xl",
  }[shadow];

  return (
    <div
      className={`card-neo ${bgStyles} ${shadowStyles} ${
        hoverLift ? "card-neo-hover" : ""
      } ${className}`}
      style={{
        border: "4px solid #000000",
        borderRadius: "0px",
        overflow: "hidden",
        ...style,
      }}
      {...props}
    >
      {header && (
        <div
          className={`px-4 py-2.5 font-black uppercase tracking-wider text-sm ${headerBgStyles}`}
          style={{
            borderBottom: "4px solid #000000",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {header}
        </div>
      )}
      <div className="p-5">{children}</div>
    </div>
  );
};
