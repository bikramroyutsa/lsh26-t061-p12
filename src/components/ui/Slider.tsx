import React from "react";

export interface SliderProps {
  label?: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  valueFormatter?: (val: number) => string;
  onChange: (value: number) => void;
  className?: string;
  helperText?: string;
}

export const Slider: React.FC<SliderProps> = ({
  label,
  value,
  min,
  max,
  step = 1,
  valueFormatter = (val) => val.toString(),
  onChange,
  className = "",
  helperText,
}) => {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <div className="flex items-center justify-between">
        {label && (
          <label className="text-xs font-black uppercase tracking-wider text-black">
            {label}
          </label>
        )}
        <span className="px-2.5 py-0.5 bg-[#FFD93D] border-2 border-black font-black text-xs shadow-neo-xs">
          {valueFormatter(value)}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="slider-neo"
      />
      <div className="flex items-center justify-between text-[11px] font-bold text-black/60">
        <span>{valueFormatter(min)}</span>
        {helperText && <span className="text-black font-bold">{helperText}</span>}
        <span>{valueFormatter(max)}</span>
      </div>
    </div>
  );
};
