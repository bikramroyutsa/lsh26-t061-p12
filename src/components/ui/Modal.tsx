import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  /** Accepted for API compat — currently unused visually */
  headerBg?: string;
  /** Controls max width: 'sm' | 'md' | 'lg' | 'xl' | '2xl'. Defaults to 'lg'. */
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | string;
}

const maxWidthClass: Record<string, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
};

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, headerBg: _headerBg, maxWidth = 'lg' }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal Box */}
      <div 
        className={`relative bg-white rounded-[2rem] shadow-[0_20px_60px_rgb(0,0,0,0.08)] w-full ${maxWidthClass[maxWidth] ?? 'max-w-lg'} mx-auto overflow-hidden animate-in fade-in zoom-in-95 duration-200`}
        role="dialog"
        aria-modal="true"
      >
        <div className="px-8 py-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-800">{title}</h2>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-slate-800 hover:bg-gray-50 rounded-full transition-colors"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};
