
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'ghost' | 'danger' | 'default';
    children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ variant = 'default', children, className = '', ...props }) => {
    const baseClasses = "inline-flex items-center select-none justify-center rounded-xl px-4 py-2 text-sm font-bold transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed";

    const variantClasses = {
        primary: 'bg-button-gradient text-white shadow-lg shadow-purple-500/20 hover:brightness-110 hover:shadow-purple-500/40',
        ghost: 'bg-transparent text-white/80 hover:bg-white/10',
        danger: 'bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20',
        default: 'bg-white/5 border border-white/10 text-white/90 hover:bg-white/10',
    };

    return (
        <button className={`${baseClasses} ${variantClasses[variant]} ${className}`} {...props}>
            {children}
        </button>
    );
};

export default Button;
