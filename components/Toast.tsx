
import React, { useEffect } from 'react';
import { ToastMessage } from '../types';

interface ToastProps extends ToastMessage {
    onDismiss: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, onDismiss }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onDismiss();
        }, 5000);

        return () => {
            clearTimeout(timer);
        };
    }, [onDismiss]);
    
    const baseClasses = 'fixed bottom-5 end-5 z-50 max-w-sm rounded-xl px-4 py-3 text-sm font-semibold shadow-2xl';
    
    const typeClasses = {
        success: 'bg-green-600 text-white',
        error: 'bg-red-600 text-white',
        info: 'bg-cyan-600 text-white'
    };

    return (
        <div className={`${baseClasses} ${typeClasses[type]}`}>
            {message}
        </div>
    );
};

export default Toast;
