import React from 'react';

export interface SliderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement> | number) => void;
  // Custom display props — consumed here, never forwarded to the DOM
  label?: string;
  helperText?: string;
  valueFormatter?: (value: number) => string;
}

export const Slider: React.FC<SliderProps> = ({
  value,
  min = 0,
  max = 100,
  step = 1,
  onChange,
  className = '',
  label,
  helperText,
  valueFormatter,
  ...props
}) => {
  const displayValue = valueFormatter ? valueFormatter(value) : String(value);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (typeof onChange === 'function') {
      // Support both (e) and (numericValue) call signatures
      try {
        (onChange as (e: React.ChangeEvent<HTMLInputElement>) => void)(e);
      } catch {
        (onChange as (v: number) => void)(Number(e.target.value));
      }
    }
  };

  return (
    <div className={`relative w-full flex flex-col gap-1 ${className}`}>
      {label && (
        <div className="flex items-center justify-between text-xs font-semibold text-gray-600 uppercase">
          <span>{label}</span>
          <span className="font-bold text-gray-900">{displayValue}</span>
        </div>
      )}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={handleChange}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        {...props}
      />
      {helperText && (
        <span className="text-[10px] text-gray-400 font-medium">{helperText}</span>
      )}
    </div>
  );
};
