
import React from 'react';

export const Badge: React.FC<{ children: React.ReactNode, variant?: 'success' | 'warning' | 'info' | 'error' | 'primary' }> = ({ children, variant = 'primary' }) => {
  const styles = {
    primary: 'bg-amber-100 text-amber-800',
    success: 'bg-emerald-100 text-emerald-800',
    warning: 'bg-orange-100 text-orange-800',
    info: 'bg-blue-100 text-blue-800',
    error: 'bg-red-100 text-red-800',
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${styles[variant]}`}>
      {children}
    </span>
  );
};

export const Card: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className = '' }) => (
  <div className={`bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden ${className}`}>
    {children}
  </div>
);

export const Button: React.FC<{ 
  children: React.ReactNode, 
  onClick?: () => void, 
  variant?: 'primary' | 'secondary' | 'outline' | 'danger',
  className?: string,
  disabled?: boolean
}> = ({ children, onClick, variant = 'primary', className = '', disabled }) => {
  const variants = {
    primary: 'bg-amber-600 text-white hover:bg-amber-700',
    secondary: 'bg-stone-800 text-white hover:bg-stone-900',
    outline: 'border-2 border-amber-600 text-amber-600 hover:bg-amber-50',
    danger: 'bg-rose-500 text-white hover:bg-rose-600'
  };
  return (
    <button 
      disabled={disabled}
      onClick={onClick} 
      className={`px-4 py-2 rounded-xl font-medium transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100 ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};
