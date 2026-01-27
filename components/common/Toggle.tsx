
import React from 'react';
import { motion } from 'framer-motion';

interface ToggleProps {
    label: string;
    enabled: boolean;
    setEnabled: (enabled: boolean) => void;
    icon?: React.ComponentType<{ className?: string }>;
    compact?: boolean;
}

const Toggle: React.FC<ToggleProps> = ({ label, enabled, setEnabled, icon: Icon, compact = false }) => {
    return (
        <div
            className={`flex w-full cursor-pointer items-center justify-between rounded-lg transition-all ${compact ? 'p-1.5' : 'p-2.5'} ${enabled ? 'bg-purple-600/20 border border-purple-500/50' : 'bg-panel-light/40 border border-transparent hover:bg-panel-light/60'}`}
            onClick={() => setEnabled(!enabled)}
        >
            <div className="flex items-center gap-2">
                 {Icon && (
                    <div className={`flex items-center justify-center rounded-md transition-colors ${compact ? 'h-6 w-6' : 'h-7 w-7'} ${enabled ? 'bg-purple-600' : 'bg-gray-600'}`}>
                        <Icon className={`${compact ? 'h-3 w-3' : 'h-4 w-4'} text-white`} />
                    </div>
                )}
                <span className={`font-semibold text-gray-200 ${compact ? 'text-xs' : 'text-sm'}`}>{label}</span>
            </div>
            <div className={`relative flex items-center rounded-full transition-colors ${compact ? 'h-5 w-9' : 'h-6 w-11'} ${enabled ? 'bg-purple-600' : 'bg-gray-700'}`}>
                <motion.div
                    className={`absolute rounded-full bg-white ${compact ? 'h-4 w-4' : 'h-5 w-5'}`}
                    layout
                    transition={{ type: 'spring', stiffness: 700, damping: 30 }}
                    initial={{ x: enabled ? (compact ? '1rem' : '1.25rem') : '0.25rem' }}
                    animate={{ x: enabled ? (compact ? '1rem' : '1.25rem') : '0.25rem' }}
                />
            </div>
        </div>
    );
};

export default Toggle;
