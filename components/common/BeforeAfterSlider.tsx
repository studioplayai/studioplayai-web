
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface BeforeAfterSliderProps {
    beforeImage: string;
    afterImage: string;
}

const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({ beforeImage, afterImage }) => {
    const [sliderPosition, setSliderPosition] = useState(50);
    const [isDragging, setIsDragging] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleMove = useCallback((clientX: number) => {
        if (!isDragging || !containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = clientX - rect.left;
        let percentage = (x / rect.width) * 100;
        if (percentage < 0) percentage = 0;
        if (percentage > 100) percentage = 100;
        setSliderPosition(percentage);
    }, [isDragging]);

    const handleMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };
    
    const handleTouchStart = (e: React.TouchEvent) => {
        setIsDragging(true);
    };

    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
    }, []);

    const handleMouseMove = useCallback((e: MouseEvent) => {
        handleMove(e.clientX);
    }, [handleMove]);

    const handleTouchMove = useCallback((e: TouchEvent) => {
        if(e.touches[0]) {
            handleMove(e.touches[0].clientX);
        }
    }, [handleMove]);

    useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('touchmove', handleTouchMove);
            window.addEventListener('mouseup', handleMouseUp);
            window.addEventListener('touchend', handleMouseUp);
            document.body.style.cursor = 'ew-resize';
        } else {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('touchend', handleMouseUp);
            document.body.style.cursor = 'default';
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('touchend', handleMouseUp);
            document.body.style.cursor = 'default';
        };
    }, [isDragging, handleMouseMove, handleTouchMove, handleMouseUp]);

    return (
        <div
            ref={containerRef}
            className="relative h-full w-full select-none overflow-hidden bg-gray-900 group"
            style={{ touchAction: 'none' }}
        >
            {/* Before Image */}
            <img
                src={beforeImage}
                alt="Before"
                className="absolute inset-0 h-full w-full object-cover pointer-events-none grayscale opacity-50"
                draggable={false}
            />
            
            {/* After Image (clipped) */}
            <div
                className="absolute inset-0 h-full w-full overflow-hidden pointer-events-none z-10"
                style={{ 
                    clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`,
                    willChange: 'clip-path'
                }}
            >
                <img
                    src={afterImage}
                    alt="After"
                    className="absolute inset-0 h-full w-full object-cover pointer-events-none"
                    draggable={false}
                />
            </div>

            {/* Labels */}
            <AnimatePresence>
                {!isDragging && (
                    <>
                        <motion.div 
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="absolute right-6 top-6 z-20 rounded-2xl border border-white/10 bg-black/60 px-4 py-2 text-xs font-bold uppercase tracking-widest text-white/60 backdrop-blur-md"
                        >
                            מקור
                        </motion.div>
                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="absolute left-6 top-6 z-20 rounded-2xl border border-purple-500/50 bg-purple-600/60 px-4 py-2 text-xs font-black uppercase tracking-widest text-white backdrop-blur-md shadow-[0_0_30px_rgba(168,85,247,0.5)]"
                        >
                            התוצאה ב-AI
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
            
            {/* Slider Divider Line */}
            <div
                className={`absolute top-0 bottom-0 z-30 w-1 transition-all duration-300 ${isDragging ? 'bg-white shadow-[0_0_30px_white]' : 'bg-white/40 group-hover:bg-white/80'}`}
                style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
            >
                {/* Handle Circle */}
                <motion.div
                    onMouseDown={handleMouseDown}
                    onTouchStart={handleTouchStart}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className={`absolute top-1/2 left-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize items-center justify-center rounded-full border-2 transition-all duration-300 ${isDragging ? 'border-white bg-purple-600 shadow-[0_0_40px_rgba(168,85,247,0.8)]' : 'border-white bg-black/40 backdrop-blur-xl'}`}
                >
                    <div className="flex items-center gap-1 text-white">
                        <svg className="h-5 w-5 rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M15 19l-7-7 7-7" />
                        </svg>
                        <svg className="h-5 w-5 -rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M15 19l-7-7 7-7" />
                        </svg>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default BeforeAfterSlider;
