
import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    children: React.ReactNode;
}

const Select: React.FC<SelectProps> = ({ children, className = '', ...props }) => {
    return (
        <select
            className={`rounded-xl border border-white/10 bg-white/5 py-2 pe-8 ps-3 text-xs text-white/90 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 ${className}`}
            {...props}
        >
            {children}
        </select>
    );
};

export default Select;
