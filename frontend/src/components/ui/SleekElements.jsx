import React from 'react';

export const SleekCard = ({ children, className = "", onClick }) => (
  <div 
    onClick={onClick}
    className={`bg-surface border border-gray-100 rounded-2xl shadow-sleek p-5 ${onClick ? 'cursor-pointer hover:shadow-sleek-md hover:border-primary/20 transition-all active:scale-[0.99]' : ''} ${className}`}
  >
    {children}
  </div>
);

export const SleekButton = ({ children, variant = "primary", className = "", ...props }) => {
  const variants = {
    primary: "sleek-btn-primary",
    secondary: "sleek-btn-secondary",
    outline: "sleek-btn-outline",
    ghost: "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
  };
  
  return (
    <button 
      className={`sleek-btn ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export const SleekInput = ({ className = "", ...props }) => (
  <input 
    className={`sleek-input ${className}`}
    {...props}
  />
);
