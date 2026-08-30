import React from 'react';

export interface ProgressBarProps {
  progress: number; // 0 to 100
  color?: string; // Tailwind color class e.g., 'bg-indigo-600'
  height?: string;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ 
  progress, 
  color = 'bg-indigo-600', 
  height = 'h-2',
  className = ''
}) => {
  const safeProgress = Math.max(0, Math.min(100, progress));

  return (
    <div className={`w-full bg-gray-100 rounded-full overflow-hidden ${height} ${className}`}>
      <div 
        className={`${color} h-full transition-all duration-500 ease-out`}
        style={{ width: `${safeProgress}%` }}
      />
    </div>
  );
};
