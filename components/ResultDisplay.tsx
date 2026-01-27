
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GalleryItem, MediaBundle, Tool } from '../types';
import BeforeAfterSlider from './common/BeforeAfterSlider';
import BundleResultView from './BundleResultView';
import Spinner from './common/Spinner';
import IconFilm from './common/IconFilm';
import Button from './common/Button';
import IconDownload from './common/IconDownload';
import IconLayers from './common/IconLayers';
import IconRefresh from './common/IconRefresh';

// --- Strategy Result Components (No changes needed here) ---
const IconList: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" /></svg>
);
const IconSparkles: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 3v2.355M5.636 5.636l1.666 1.666M2 12h2.355M5.636 18.364l1.666-1.666M12 21v-2.355M18.364 18.364l-1.666-1.666M22 12h-2.355M18.364 5.636l-1.666 1.666" /><path d="M14.5 9.5 12 2l-2.5 7.5L2 12l7.5 2.5L12 22l2.5-7.5L22 12z" /></svg>
);
const IconTrendingUp: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg>
);
const IconCpu: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line><line x1="20" y1="9" x2="23" y2="9"></line><line x1="20" y1="14" x2="23" y2="14"></line><line x1="1" y1="9" x2="4" y2="9"></line><line x1="1" y1="14" x2="4" y2="14"></line></svg>
);
const IconInstagram: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
    </svg>
);

interface IndustrySuggestion {
    title: string;
    items: string[];
}
interface IndustrySpecificData {
    category: string;
    suggestions: IndustrySuggestion[];
}
interface StrategyData {
    postIdeas?: string[];
    specialCampaign?: { title: string; concept: string; steps: string[] };
    newTrends?: { title: string; description: string }[];
    storyIdeas?: string[];
    videoIdeas?: string[];
    industrySpecific?: IndustrySpecificData;
}

const StrategyResultView: React.FC<{ data: StrategyData; onClear: () => void; onToast: (msg: string, type: 'success' | 'error') => void; }> = ({ data, onClear, onToast }) => {
    
    const handlePrint = () => {
        window.print();
    };

    const handleCopy = () => {
        const { postIdeas, storyIdeas, videoIdeas, specialCampaign, newTrends, industrySpecific } = data;
        let text = `אסטרטגיית תוכן - ${industrySpecific?.category || ''}\n\n`;
        
        if (postIdeas) text += `--- 10 רעיונות לפוסטים ---\n${postIdeas.join('\n')}\n\n`;
        if (storyIdeas) text += `--- רעיונות לסטורי ---\n${storyIdeas.join('\n')}\n\n`;
        if (videoIdeas) text += `--- רעיונות לסרטונים ---\n${videoIdeas.join('\n')}\n\n`;
        if (specialCampaign) text += `--- קמפיין מיוחד: ${specialCampaign.title} ---\n${specialCampaign.concept}\n\n`;
        if (newTrends) {
            text += `--- טרנדים חדשים ---\n`;
            newTrends.forEach(t => text += `* ${t.title}: ${t.description}\n`);
            text += '\n';
        }
        if (industrySpecific && industrySpecific.suggestions) {
            industrySpecific.suggestions.forEach(s => {
                text += `--- ${s.title} ---\n${s.items.join('\n')}\n\n`;
            });
        }

        navigator.clipboard.writeText(text.trim());
        onToast('האסטרטגיה הועתקה ללוח!', 'success');
    };

    return (
        <div id="strategy-print-area" className="h-full w-full overflow-y-auto p-4 md:p-8" dir="rtl">
            <motion.div 
                initial="hidden"
                animate="visible"
                variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
                className="mx-auto max-w-7xl space-y-6"
            >
                <motion.div variants={{hidden: {opacity:0, y:20}, visible:{opacity:1, y:0}}} className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4 print-hidden">
                    <h1 className="text-3xl font-black text-center sm:text-right print-header-color">אסטרטגיית התוכן שלך</h1>
                    <div className="flex items-center gap-2 flex-wrap justify-center">
                        <Button onClick={onClear} variant="default" className="!text-xs !py-1.5"><IconRefresh className="ml-2 h-4 w-4"/>צור תוכנית חדשה</Button>
                        <Button onClick={handleCopy} variant="default" className="!text-xs !py-1.5"><IconLayers className="ml-2 h-4 w-4"/>העתק הכל</Button>
                        <Button onClick={handlePrint} variant="primary" className="!text-xs !py-1.5"><IconDownload className="ml-2 h-4 w-4"/>הורד כ-PDF</Button>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {data.postIdeas && (
                        <motion.div variants={{hidden: {opacity:0, y:20}, visible:{opacity:1, y:0}}} className="lg:col-span-2 rounded-2xl border border-purple-500/30 bg-gradient-to-br from-purple-500/10 to-panel-dark p-6 print-card">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/20 text-purple-300"><IconList className="h-5 w-5" /></div>
                                <h3 className="font-black text-xl text-purple-300 print-header-color">10 רעיונות לפוסטים</h3>
                            </div>
                            <ul className="space-y-4 text-gray-300 print-text-color">
                                {data.postIdeas.map((idea, i) => (
                                    <li key={i} className="flex items-start gap-4">
                                        <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-purple-500/20 text-xs font-bold text-purple-300">{i + 1}</div>
                                        <span className="pt-0.5">{idea}</span>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    )}

                    <div className="lg:col-span-1 space-y-6">
                        {data.specialCampaign && (
                             <motion.div variants={{hidden: {opacity:0, y:20}, visible:{opacity:1, y:0}}} className="rounded-2xl border border-yellow-500/30 bg-gradient-to-br from-yellow-500/10 to-orange-500/5 p-6 print-card">
                                 <div className="flex items-center gap-3 mb-4">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-yellow-500/20 text-yellow-300"><IconSparkles className="h-5 w-5" /></div>
                                    <h3 className="font-black text-yellow-300 text-lg print-header-color">קמפיין מיוחד</h3>
                                </div>
                                <p className="text-sm font-bold text-gray-200 mb-2 print-header-color">{data.specialCampaign.title}</p>
                                <p className="text-sm text-gray-300 mb-4 print-text-color">{data.specialCampaign.concept}</p>
                            </motion.div>
                        )}
                        {data.newTrends && (
                             <motion.div variants={{hidden: {opacity:0, y:20}, visible:{opacity:1, y:0}}} className="rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-cyan-500/10 to-blue-500/5 p-6 print-card">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/20 text-cyan-300"><IconTrendingUp className="h-5 w-5" /></div>
                                    <h3 className="font-black text-cyan-300 text-lg print-header-color">טרנדים חדשים</h3>
                                </div>
                                <div className="space-y-4">
                                    {data.newTrends.map((trend, i) => (
                                        <div key={i}>
                                            <h4 className="font-bold text-sm text-cyan-400/90 flex items-center gap-2 print-header-color">
                                                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400"></span>
                                                {trend.title}
                                            </h4>
                                            <p className="text-xs text-gray-400 mt-1 mr-4 border-r-2 border-cyan-500/20 pr-3 print-text-color">{trend.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                        {data.industrySpecific && data.industrySpecific.suggestions && (
                            <motion.div variants={{hidden: {opacity:0, y:20}, visible:{opacity:1, y:0}}} className="rounded-2xl border border-gray-500/30 bg-gradient-to-br from-gray-500/10 to-gray-800/5 p-6 print-card">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-500/20 text-gray-300"><IconCpu className="h-5 w-5" /></div>
                                    <h3 className="font-black text-gray-300 text-lg print-header-color">התאמה אישית ({data.industrySpecific.category})</h3>
                                </div>
                                <div className="space-y-4">
                                    {data.industrySpecific.suggestions.map((suggestion, i) => (
                                        <div key={i}>
                                            <h4 className="font-bold text-sm text-gray-300/90 print-header-color">{suggestion.title}</h4>
                                            <ul className="text-xs text-gray-400 mt-2 space-y-1.5 list-inside print-text-color">
                                                {suggestion.items.map((item, j) => (
                                                    <li key={j} className="flex items-start gap-2"><span className="text-gray-500 mt-1.5">●</span>{item}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                         {data.storyIdeas && (
                             <motion.div variants={{hidden: {opacity:0, y:20}, visible:{opacity:1, y:0}}} className="rounded-2xl border border-pink-500/30 bg-gradient-to-br from-pink-500/10 to-purple-500/5 p-6 print-card">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-pink-500/20 text-pink-300"><IconInstagram className="h-5 w-5" /></div>
                                    <h3 className="font-black text-pink-300 text-lg print-header-color">רעיונות לסטורי</h3>
                                </div>
                                <ul className="space-y-2 text-sm text-gray-300 list-inside print-text-color">
                                    {data.storyIdeas.map((idea, i) => <li key={i} className="flex items-start gap-2"><span className="text-pink-400 mt-1.5">●</span>{idea}</li>)}
                                </ul>
                            </motion.div>
                        )}
                        {data.videoIdeas && (
                             <motion.div variants={{hidden: {opacity:0, y:20}, visible:{opacity:1, y:0}}} className="rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-indigo-500/10 to-purple-500/5 p-6 print-card">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-300"><IconFilm className="h-5 w-5" /></div>
                                    <h3 className="font-black text-indigo-300 text-lg print-header-color">רעיונות לסרטונים</h3>
                                </div>
                                <ul className="space-y-2 text-sm text-gray-300 list-inside print-text-color">
                                    {data.videoIdeas.map((idea, i) => <li key={i} className="flex items-start gap-2"><span className="text-indigo-400 mt-1.5">●</span>{idea}</li>)}
                                </ul>
                            </motion.div>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
};


interface ResultDisplayProps {
    result: GalleryItem;
    tool: Tool;
    onClear: () => void;
    onToast: (msg: string, type: 'success' | 'error') => void;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ result, tool, onClear, onToast }) => {
    const [videoBlobUrl, setVideoBlobUrl] = useState<string | null>(null);
    const [videoError, setVideoError] = useState<string | null>(null);
    const [isSourceLoading, setIsSourceLoading] = useState(false);

    useEffect(() => {
        let objectUrl: string | undefined;

        const loadVideoFromExternalUri = async () => {
            if (result.type === 'video' && result.data?.startsWith('https://')) {
                setIsSourceLoading(true);
                setVideoBlobUrl(null);
                setVideoError(null);
                try {
                    const response = await fetch(result.data);
                    if (!response.ok) {
                        throw new Error(`שגיאה בגישה לקובץ הוידאו: ${response.status}`);
                    }
                    const blob = await response.blob();
                    objectUrl = URL.createObjectURL(blob);
                    setVideoBlobUrl(objectUrl);
                } catch (error: any) {
                    console.error("Video Loading Error:", error);
                    setVideoError("לא ניתן היה להציג את הוידאו. ייתכן שחלף הזמן המוקצב לגישה לקובץ.");
                } finally {
                    setIsSourceLoading(false);
                }
            } else if (result.type === 'video') {
                setVideoBlobUrl(result.data); 
            }
        };

        loadVideoFromExternalUri();

        return () => {
            if (objectUrl) {
                URL.revokeObjectURL(objectUrl);
            }
        };
    }, [result]);

    if (result.type === 'bundle') {
        try {
            const bundle: MediaBundle = JSON.parse(result.data);
            return <BundleResultView bundle={bundle} />;
        } catch (e) {
            return <div className="p-4 text-red-400">Error parsing bundle data.</div>;
        }
    }
    
    if (result.type === 'text' && tool.id === 'idea-generator') {
        try {
            let jsonString = result.data.replace(/```json/g, '').replace(/```/g, '').trim();
            const strategyData = JSON.parse(jsonString);
            return <StrategyResultView data={strategyData} onClear={onClear} onToast={onToast} />;
        } catch (e) {
            console.error("Failed to parse strategy JSON:", e);
            return (
                 <div className="p-8 text-center text-red-400">
                    <h3 className="font-bold">שגיאה בניתוח התוצאה</h3>
                    <p className="text-sm text-gray-400 mt-2">התקבלה תגובה לא צפויה מה-AI. נסה שוב או שנה את הניסוח.</p>
                </div>
            )
        }
    }

    const canCompare = result.type === 'image' && result.sourceData;
    const afterImageUrl = `data:image/png;base64,${result.data}`;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="h-full w-full overflow-hidden rounded-lg border border-panel-border bg-black/20 flex items-center justify-center relative"
        >
            {canCompare ? (
                <BeforeAfterSlider beforeImage={result.sourceData!} afterImage={afterImageUrl} />
            ) : result.type === 'image' ? (
                <img src={afterImageUrl} alt="Generated content" className="h-full w-full object-contain" />
            ) : result.type === 'video' ? (
                <div className="h-full w-full flex items-center justify-center">
                    {isSourceLoading ? (
                        <div className="flex flex-col items-center">
                            <Spinner />
                            <p className="mt-4 text-xs text-gray-500">מוריד וידאו לצפייה...</p>
                        </div>
                    ) : videoError ? (
                        <div className="flex flex-col items-center justify-center text-center text-white p-6">
                            <IconFilm className="h-10 w-10 text-red-500 mb-4 opacity-50" />
                            <h3 className="font-bold text-sm text-red-400">בעיה בטעינה</h3>
                            <p className="text-xs text-gray-500 mt-2 max-w-xs">{videoError}</p>
                            <Button variant="default" className="mt-4 !py-1 !text-xs" onClick={() => window.location.reload()}>טען מחדש</Button>
                        </div>
                    ) : videoBlobUrl ? (
                        <video src={videoBlobUrl} controls autoPlay loop className="h-full w-full object-contain">
                            Your browser does not support the video tag.
                        </video>
                    ) : null}
                </div>
            ) : (
                <div className="h-full w-full overflow-y-auto p-4 text-right" dir="rtl">
                    <pre className="whitespace-pre-wrap font-sans text-gray-200">{result.data}</pre>
                </div>
            )}
        </motion.div>
    );
};

export default ResultDisplay;
