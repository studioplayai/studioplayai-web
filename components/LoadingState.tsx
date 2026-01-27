
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Tool } from '../types';

const messages = [
    "מנתח את המדיה שהעלית...",
    "ה-AI חושב על רעיונות יצירתיים...",
    "מרכיב את הקומפוזיציה המושלמת...",
    "מוסיף את נגיעות הקסם האחרונות...",
    "כמעט מוכן! מכין את התוצאה להצגה..."
];

interface LoadingStateProps {
    tool: Tool;
}

const LoadingState: React.FC<LoadingStateProps> = ({ tool }) => {
    const [message, setMessage] = useState(messages[0]);
    const [progress, setProgress] = useState(10);
    const Icon = tool.icon;

    useEffect(() => {
        const messageInterval = setInterval(() => {
            setMessage(prevMessage => {
                const currentIndex = messages.indexOf(prevMessage);
                const nextIndex = (currentIndex + 1) % messages.length;
                return messages[nextIndex];
            });
        }, 3000);

        const progressInterval = setInterval(() => {
            setProgress(prev => {
                const next = prev + Math.random() * 15;
                return next > 95 ? 95 : next;
            });
        }, 1500);

        return () => {
            clearInterval(messageInterval);
            clearInterval(progressInterval);
        };
    }, []);

    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex h-full w-full flex-col items-center justify-center p-6 text-center"
        >
            <div className="relative flex h-24 w-24 items-center justify-center">
                <motion.div 
                    className="absolute h-full w-full rounded-full bg-[conic-gradient(from_0deg,transparent,theme(colors.purple.500))]"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
                <div className="absolute h-[90%] w-[90%] rounded-full bg-[#0D0E1B]"></div>
                <Icon className="z-10 h-10 w-10 text-purple-400" />
            </div>
            
            <h2 className="mt-6 text-xl font-bold">{tool.loadingText || "מעבד את הקסם..."}</h2>
            <p className="mt-2 text-sm text-gray-400">{message}</p>

            <div className="mt-8 w-full max-w-xs">
                <div className="relative h-2 w-full overflow-hidden rounded-full bg-panel-dark">
                    <motion.div 
                        className="absolute left-0 top-0 h-full rounded-full bg-brand-gradient"
                        initial={{ width: '0%' }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 1, ease: 'easeInOut' }}
                    />
                </div>
                <div className="mt-2 flex justify-between text-xs text-gray-500">
                    <span>מעבד...</span>
                    <span>{Math.round(progress)}%</span>
                </div>
            </div>
        </motion.div>
    );
};

export default LoadingState;
