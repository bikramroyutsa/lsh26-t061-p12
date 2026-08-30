import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  noPadding?: boolean;
  // Custom props used by callers — consumed here, never forwarded to the DOM
  headerBg?: string;
  shadow?: string;
  header?: React.ReactNode;
  variant?: string;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  noPadding = false,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  headerBg,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  shadow,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  header,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  variant,
  ...props 
}) => {
  return (
    <div 
      className={`bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border-none ${noPadding ? '' : 'p-6 sm:p-8'} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
