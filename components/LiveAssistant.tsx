
import React, { useState, useEffect, useRef } from 'react';
import { LiveSession } from '../services/geminiLiveService';
import Button from './common/Button';
import CloseIcon from './common/CloseIcon';
import MicIcon from './common/MicIcon';

interface LiveAssistantProps {
    onClose: () => void;
}

const LiveAssistant: React.FC<LiveAssistantProps> = ({ onClose }) => {
    const [session, setSession] = useState<LiveSession | null>(null);
    const [status, setStatus] = useState<'idle' | 'connecting' | 'listening' | 'speaking' | 'error'>('idle');
    const [error, setError] = useState<string | null>(null);

    const handleStartSession = async () => {
        setStatus('connecting');
        setError(null);
        try {
            const newSession = new LiveSession({
                onOpen: () => setStatus('listening'),
                onClose: () => setStatus('idle'),
                onError: (err) => {
                    console.error('Live session error:', err);
                    setError('אירעה שגיאה בחיבור. נסה שוב.');
                    setStatus('error');
                },
                onSpeakingChange: (isSpeaking) => setStatus(isSpeaking ? 'speaking' : 'listening'),
            });
            await newSession.start();
            setSession(newSession);
        } catch (err) {
            console.error('Failed to start session:', err);
            setError('לא ניתן היה לגשת למיקרופון.');
            setStatus('error');
        }
    };

    const handleStopSession = () => {
        session?.close();
        setSession(null);
        setStatus('idle');
    };
    
    useEffect(() => {
        // Cleanup on component unmount
        return () => {
            session?.close();
        };
    }, [session]);

    const statusText: Record<typeof status, string> = {
        idle: 'לחץ על המיקרופון כדי להתחיל שיחה',
        connecting: 'מתחבר...',
        listening: 'מקשיב... שאל אותי כל דבר',
        speaking: 'מדבר...',
        error: error || 'שגיאה',
    };
    
    const isSessionActive = status === 'listening' || status === 'speaking';

    return (
        <div
            className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-white/20 bg-gradient-to-b from-[#14182c]/95 to-[#0a0c18]/95 shadow-2xl shadow-black/50"
                onClick={e => e.stopPropagation()}
            >
                <button onClick={onClose} className="absolute top-4 end-4 text-white/60 hover:text-white" aria-label="Close assistant">
                    <CloseIcon />
                </button>
                <div className="flex flex-col items-center justify-center p-8 pt-12 text-center">
                    <h2 className="text-xl font-bold">עוזר AI קולי</h2>
                    <p className="mt-2 text-sm text-white/60">שאל אותי על רעיונות לקריאייטיב, שיווק, או עיצוב.</p>
                    
                    <div className="my-8 flex h-40 w-40 items-center justify-center">
                        <div className={`relative flex h-28 w-28 items-center justify-center rounded-full transition-all duration-300 ${isSessionActive ? 'bg-purple-600' : 'bg-white/10'}`}>
                           {isSessionActive && (
                             <div className={`absolute h-full w-full rounded-full bg-purple-500/80 ${status === 'speaking' ? 'animate-pulse' : 'animate-ping'}`}></div>
                           )}
                           <button onClick={isSessionActive ? handleStopSession : handleStartSession} className="z-10" aria-label={isSessionActive ? 'Stop session' : 'Start session'}>
                               <MicIcon className="h-10 w-10" />
                           </button>
                        </div>
                    </div>

                    <p className={`text-sm ${status === 'error' ? 'text-red-400' : 'text-white/80'}`}>{statusText[status]}</p>
                </div>
            </div>
        </div>
    );
};

export default LiveAssistant;
