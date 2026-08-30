import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-full font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variantClasses = {
    primary: 'bg-[#634E9F] text-white hover:bg-[#524083] focus:ring-[#634E9F]',
    secondary: 'bg-[#EAE5F8] text-[#554089] hover:bg-[#DDD3F3] focus:ring-[#554089]',
    outline: 'bg-transparent text-[#554089] border border-[#DDD3F3] hover:bg-[#F6F5FB] focus:ring-[#554089]',
    ghost: 'bg-transparent text-gray-500 hover:bg-[#F6F5FB] hover:text-[#554089] focus:ring-[#554089]',
    danger: 'bg-[#FEE2E2] text-[#DC2626] hover:bg-[#FECACA] focus:ring-[#DC2626]'
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-base',
    md: 'px-6 py-3 text-lg font-semibold',
    lg: 'px-8 py-4 text-xl font-bold'
  };

  const widthClass = fullWidth ? 'w-full' : 'w-full sm:w-auto';
  const disabledClass = disabled ? 'opacity-50 cursor-not-allowed hover:shadow-none pointer-events-none' : '';

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${disabledClass} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};
