import React from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  icon?: React.ReactNode;
  wrapperClassName?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  helperText,
  error,
  icon,
  className = "",
  wrapperClassName = "",
  id,
  ...props
}) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

  return (
    <div className={`flex flex-col gap-1.5 ${wrapperClassName}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="text-xs font-black uppercase tracking-wider text-black flex items-center gap-1.5"
        >
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {icon && (
          <div className="absolute left-3.5 flex items-center pointer-events-none text-black">
            {icon}
          </div>
        )}
        <input
          id={inputId}
          className={`input-neo ${icon ? "pl-11" : ""} ${
            error ? "bg-[#FF6B6B]/20 border-[#FF6B6B]" : ""
          } ${className}`}
          {...props}
        />
      </div>
      {error ? (
        <span className="text-xs font-bold text-[#FF6B6B] flex items-center gap-1">
          ⚠️ {error}
        </span>
      ) : helperText ? (
        <span className="text-xs font-medium text-black/70">{helperText}</span>
      ) : null}
    </div>
  );
};
