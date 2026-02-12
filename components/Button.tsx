
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'black';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  fullWidth?: boolean;
  isLoading?: boolean;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  fullWidth = false, 
  isLoading = false,
  className = '',
  disabled,
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center font-bold transition-all duration-300 transform active:scale-95 select-none disabled:opacity-30 disabled:grayscale disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-[#C6F64E] text-[#111111] hover:brightness-105",
    black: "bg-[#111111] text-white hover:bg-[#222222]",
    secondary: "bg-white text-[#111111] border border-[#111111]/10",
    outline: "border-2 border-[#111111] text-[#111111] bg-transparent hover:bg-[#111111] hover:text-white",
    ghost: "bg-transparent text-[#111111]/60 hover:text-[#111111]",
    danger: "bg-red-500 text-white"
  };

  const sizes = {
    sm: "px-5 py-2.5 text-xs rounded-full h-10",
    md: "px-8 py-4 text-sm rounded-2xl h-14", 
    lg: "px-10 py-5 text-base rounded-[2rem] h-16",
    icon: "p-4 w-14 h-14 rounded-full"
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : null}
      {children}
    </button>
  );
};

export default Button;
