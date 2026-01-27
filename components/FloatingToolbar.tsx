
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import IconZoomIn from './common/IconZoomIn';
import IconZoomOut from './common/IconZoomOut';
import IconExpand from './common/IconExpand';

interface FloatingToolbarProps {
    isVisible: boolean;
}

const FloatingToolbar: React.FC<FloatingToolbarProps> = ({ isVisible }) => {
    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="absolute left-4 top-4 z-20 flex flex-col gap-1.5 rounded-2xl border border-white/10 bg-panel-dark/40 p-1.5 backdrop-blur-2xl shadow-2xl"
                >
                    <ToolbarButton title="זום פנימה">
                        <IconZoomIn className="h-4 w-4 md:h-5 md:w-5" />
                    </ToolbarButton>
                    <ToolbarButton title="זום החוצה">
                        <IconZoomOut className="h-4 w-4 md:h-5 md:w-5" />
                    </ToolbarButton>
                    
                    <div className="my-1 h-px w-full bg-white/10"></div>
                    
                    <ToolbarButton title="מסך מלא">
                        <IconExpand className="h-4 w-4 md:h-5 md:w-5" />
                    </ToolbarButton>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

const ToolbarButton: React.FC<{ children: React.ReactNode; title: string; onClick?: () => void }> = ({ children, title, onClick }) => (
    <button 
        onClick={onClick}
        title={title}
        className="flex h-9 w-9 items-center justify-center rounded-xl text-gray-400 transition-all duration-200 hover:bg-white/10 hover:text-white active:scale-90"
    >
        {children}
    </button>
);

export default FloatingToolbar;
