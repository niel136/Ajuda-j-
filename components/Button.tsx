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
  const baseStyles = "inline-flex items-center justify-center font-extrabold transition-all transform active:scale-95 select-none disabled:opacity-30 disabled:grayscale disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-[#E2F687] text-black shadow-[0_4px_15px_rgba(226,246,135,0.3)]",
    black: "bg-black text-white shadow-xl shadow-black/10",
    secondary: "bg-gray-100 text-gray-900 border border-black/5 hover:bg-gray-200",
    outline: "border-2 border-black text-black bg-transparent",
    ghost: "bg-transparent text-gray-500 hover:text-black hover:bg-black/5",
    danger: "bg-red-500 text-white"
  };

  const sizes = {
    sm: "px-4 py-2 text-xs h-10 rounded-xl",
    md: "px-6 py-4 text-sm h-12 rounded-2xl", 
    lg: "px-8 py-5 text-base h-14 rounded-full",
    icon: "p-3 w-12 h-12 rounded-full"
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : null}
      {children}
    </button>
  );
};

export default Button;