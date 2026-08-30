import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'info' | 'success' | 'warning' | 'error' | 'neutral' | 'primary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ 
  children, 
  variant = 'neutral',
  size = 'md',
  className = ''
}) => {
  const variantStyles: Record<string, string> = {
    info: 'bg-blue-50 text-blue-700 border-blue-200',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    error: 'bg-red-50 text-red-700 border-red-200',
    neutral: 'bg-gray-50 text-gray-700 border-gray-200',
    primary: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    outline: 'bg-transparent text-gray-700 border-gray-300',
  };

  const sizeStyles: Record<string, string> = {
    sm: 'px-1.5 py-0 text-[10px]',
    md: 'px-2.5 py-0.5 text-xs',
    lg: 'px-3 py-1 text-sm',
  };

  return (
    <span className={`inline-flex items-center rounded-full font-medium border ${variantStyles[variant] ?? variantStyles.neutral} ${sizeStyles[size] ?? sizeStyles.md} ${className}`}>
      {children}
    </span>
  );
};
