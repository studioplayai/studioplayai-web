
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MediaBundle } from '../types';
import Button from './common/Button';
import IconDownload from './common/IconDownload';
import IconType from './common/IconType';
import IconZap from './common/IconLightning';
import Spinner from './common/Spinner';

interface BundleResultViewProps {
    bundle: MediaBundle;
}

const BundleResultView: React.FC<BundleResultViewProps> = ({ bundle }) => {
    const [activeTab, setActiveTab] = useState<'visuals' | 'text'>('visuals');
    const [compositedImages, setCompositedImages] = useState({ post: '', story: '', cover: '' });
    const [isCompositing, setIsCompositing] = useState(true);

    useEffect(() => {
        const compositeImageWithText = (base64Data: string, text: string, targetWidth: number, aspectRatio: number): Promise<string> => {
            return new Promise((resolve, reject) => {
                if (!base64Data || base64Data.length < 50) {
                    return reject(new Error("Invalid image data provided for compositing"));
                }

                const img = new Image();
                img.onload = () => {
                    try {
                        const canvas = document.createElement('canvas');
                        const targetHeight = targetWidth / aspectRatio;
                        canvas.width = targetWidth;
                        canvas.height = targetHeight;
                        const ctx = canvas.getContext('2d');
                        if (!ctx) return reject(new Error("Could not get canvas context"));

                        ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
                        
                        if (text) {
                            const baseFontSize = targetWidth / 25;
                            const fontSize = Math.max(24, Math.min(baseFontSize, 96));
                            ctx.font = `900 ${fontSize}px Assistant, sans-serif`;
                            ctx.fillStyle = 'white';
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'middle';
                            ctx.direction = 'rtl';

                            ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
                            ctx.shadowBlur = fontSize / 5;
                            ctx.shadowOffsetX = 0;
                            ctx.shadowOffsetY = fontSize / 20;

                            const yPos = targetHeight * 0.85; 
                            ctx.fillText(text, targetWidth / 2, yPos);
                        }
                        
                        resolve(canvas.toDataURL('image/jpeg', 0.9));
                    } catch (err) {
                        reject(err);
                    }
                };
                img.onerror = () => reject(new Error("Image failed to load for compositing"));
                
                // Clean up base64 string just in case it's a data URL already
                const src = base64Data.includes('data:') ? base64Data : `data:image/jpeg;base64,${base64Data}`;
                img.src = src;
            });
        };

        const processBundle = async () => {
            setIsCompositing(true);
            try {
                await document.fonts.ready;

                const { post, story, cover, captions } = bundle;
                const textToApply = captions.headline || "";

                const [processedPost, processedStory, processedCover] = await Promise.all([
                    compositeImageWithText(post, textToApply, 1080, 1).catch(() => `data:image/jpeg;base64,${post}`),
                    compositeImageWithText(story, textToApply, 1080, 9 / 16).catch(() => `data:image/jpeg;base64,${story}`),
                    compositeImageWithText(cover, textToApply, 1920, 16 / 9).catch(() => `data:image/jpeg;base64,${cover}`),
                ]);

                setCompositedImages({ post: processedPost, story: processedStory, cover: processedCover });
            } catch (e) {
                console.error("Failed to process bundle assets:", e);
                setCompositedImages({ 
                    post: `data:image/jpeg;base64,${bundle.post}`, 
                    story: `data:image/jpeg;base64,${bundle.story}`,
                    cover: `data:image/jpeg;base64,${bundle.cover}`
                });
            } finally {
                setIsCompositing(false);
            }
        };

        processBundle();
    }, [bundle]);


    const downloadAll = () => {
        const assets = [
            { data: compositedImages.post, name: 'studioplay-post.jpg' },
            { data: compositedImages.story, name: 'studioplay-story.jpg' },
            { data: compositedImages.cover, name: 'studioplay-cover.jpg' }
        ];
        assets.forEach(asset => {
            if (!asset.data) return;
            const link = document.createElement('a');
            link.href = asset.data;
            link.download = asset.name;
            link.click();
        });
    };

    const renderVisuals = () => {
        if (isCompositing) {
            return (
                <div className="flex flex-col items-center justify-center h-full min-h-[400px]">
                    <Spinner />
                    <p className="mt-4 text-sm text-gray-400">מטביע את הכותרות על התמונות...</p>
                </div>
            )
        }
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Post (1:1)</label>
                    <div className="aspect-square overflow-hidden rounded-2xl border border-white/10 shadow-2xl bg-panel-light">
                        {compositedImages.post && <img src={compositedImages.post} className="h-full w-full object-cover" alt="Post" />}
                    </div>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="space-y-3">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Story (9:16)</label>
                    <div className="aspect-[9/16] overflow-hidden rounded-2xl border border-white/10 shadow-2xl bg-panel-light">
                        {compositedImages.story && <img src={compositedImages.story} className="h-full w-full object-cover" alt="Story" />}
                    </div>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="space-y-3">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Cover (16:9)</label>
                    <div className="aspect-[16/9] overflow-hidden rounded-2xl border border-white/10 shadow-2xl bg-panel-light">
                       {compositedImages.cover && <img src={compositedImages.cover} className="h-full w-full object-cover" alt="Cover" />}
                    </div>
                </motion.div>
            </div>
        );
    };

    return (
        <div className="flex h-full w-full flex-col overflow-hidden bg-[#0a0b14]">
            <div className="flex items-center justify-between border-b border-white/5 bg-panel-dark/80 p-4 backdrop-blur-xl">
                <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-pink-500">
                        <IconZap className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <h2 className="text-sm font-bold">Auto Creator Bundle</h2>
                        <p className="text-[10px] text-gray-500">3 Assets + Marketing Copy</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <div className="flex rounded-xl bg-white/5 p-1">
                        <button 
                            onClick={() => setActiveTab('visuals')}
                            className={`rounded-lg px-4 py-1.5 text-xs font-bold transition-all ${activeTab === 'visuals' ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20' : 'text-gray-400 hover:text-white'}`}
                        >
                            עיצובים
                        </button>
                        <button 
                            onClick={() => setActiveTab('text')}
                            className={`rounded-lg px-4 py-1.5 text-xs font-bold transition-all ${activeTab === 'text' ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20' : 'text-gray-400 hover:text-white'}`}
                        >
                            טקסט שיווקי
                        </button>
                    </div>
                    <Button variant="primary" onClick={downloadAll} className="h-9 !py-1 !text-xs" disabled={isCompositing}>
                        <IconDownload className="ml-2 h-4 w-4" />
                        הורד הכל
                    </Button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 md:p-8 no-scrollbar">
                {activeTab === 'visuals' ? renderVisuals() : (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mx-auto max-w-2xl space-y-6 text-right" dir="rtl">
                        <div className="rounded-3xl border border-white/10 bg-panel-dark/50 p-8 shadow-2xl">
                            <div className="mb-4 flex items-center justify-between">
                                <IconType className="h-6 w-6 text-purple-400" />
                                <span className="text-[10px] font-bold uppercase text-gray-500">הצעה לתוכן פוסט</span>
                            </div>
                            <h3 className="text-2xl font-black text-white">{bundle.captions.headline}</h3>
                            <p className="mt-4 text-lg text-gray-300 leading-relaxed whitespace-pre-wrap">{bundle.captions.body}</p>
                            <div className="mt-8 pt-6 border-t border-white/5">
                                <div className="text-[10px] font-bold text-purple-400 mb-2">האשטאגים מומלצים</div>
                                <p className="text-cyan-400 font-medium">{bundle.captions.hashtags}</p>
                            </div>
                            <Button className="mt-8 w-full !bg-white/5 hover:!bg-white/10" onClick={() => navigator.clipboard.writeText(`${bundle.captions.headline}\n\n${bundle.captions.body}\n\n${bundle.captions.hashtags}`)}>
                                העתק הכל ללוח
                            </Button>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default BundleResultView;
