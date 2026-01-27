
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GalleryItem, MediaBundle } from '../types';
import IconClose from './common/IconClose';
import IconDownload from './common/IconDownload';
import IconShare from './common/IconShare';
import IconImage from './common/IconImage';
import IconFilm from './common/IconFilm';
import IconZap from './common/IconLightning';
import Button from './common/Button';

interface MediaActionsModalProps {
    item: GalleryItem | null;
    onClose: () => void;
    onToast: (msg: string, type: 'success' | 'error' | 'info') => void;
}

const MediaActionsModal: React.FC<MediaActionsModalProps> = ({ item, onClose, onToast }) => {
    const [isConverting, setIsConverting] = useState(false);

    if (!item) return null;

    const convertAndDownload = async (format: 'image/png' | 'image/jpeg' | 'image/webp', ext: string) => {
        if (item.type !== 'image') return;
        setIsConverting(true);
        try {
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                if (ctx) {
                    if (format === 'image/jpeg') {
                        ctx.fillStyle = '#white';
                        ctx.fillRect(0, 0, canvas.width, canvas.height);
                    }
                    ctx.drawImage(img, 0, 0);
                    const dataUrl = canvas.toDataURL(format, 0.9);
                    const link = document.createElement('a');
                    link.href = dataUrl;
                    link.download = `studioplay-${item.id}.${ext}`;
                    link.click();
                    onToast(`התמונה נשמרה בפורמט ${ext.toUpperCase()}`, 'success');
                }
                setIsConverting(false);
            };
            img.src = `data:image/png;base64,${item.data}`;
        } catch (err) {
            onToast('ההמרה נכשלה', 'error');
            setIsConverting(false);
        }
    };

    const downloadVideo = async () => {
        onToast('מכין את הוידאו להורדה...', 'info');
        try {
            const res = await fetch(item.data);
            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `studioplay-video-${item.id}.mp4`;
            link.click();
            window.URL.revokeObjectURL(url);
            onToast('הוידאו ירד בהצלחה', 'success');
        } catch (err) {
            onToast('הורדת הוידאו נכשלה', 'error');
        }
    };

    const handleWebShare = async () => {
        const shareData: ShareData = {
            title: 'היצירה שלי מ-StudioPlayAI',
            text: item.prompt,
        };

        try {
            if (item.type === 'image' && navigator.canShare) {
                const blob = await (await fetch(`data:image/png;base64,${item.data}`)).blob();
                const file = new File([blob], 'studioplay.png', { type: 'image/png' });
                if (navigator.canShare({ files: [file] })) {
                    shareData.files = [file];
                }
            } else {
                shareData.url = item.data;
            }

            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                throw new Error('Not supported');
            }
        } catch (err) {
            navigator.clipboard.writeText(item.type === 'video' ? item.data : 'Image from StudioPlayAI');
            onToast('הקישור הועתק ללוח!', 'success');
        }
    };

    const shareToSocial = (platform: 'wa' | 'fb') => {
        const text = encodeURIComponent(`תראו מה יצרתי ב-StudioPlayAI: ${item.prompt}`);
        const url = item.type === 'video' ? encodeURIComponent(item.data) : '';
        let finalUrl = '';
        
        if (platform === 'wa') finalUrl = `https://wa.me/?text=${text} ${url}`;
        if (platform === 'fb') finalUrl = `https://www.facebook.com/sharer/sharer.php?u=${url || 'https://studioplay.ai'}`;
        
        window.open(finalUrl, '_blank');
    };

    const getModalHeader = () => {
        switch (item.type) {
            case 'bundle':
                return { icon: <IconZap className="h-8 w-8 text-purple-400" />, title: 'הורדת חבילת תוכן' };
            case 'video':
                return { icon: <IconFilm className="h-8 w-8 text-purple-400" />, title: 'הורדה ושיתוף וידאו' };
            case 'image':
            default:
                return { icon: <IconImage className="h-8 w-8 text-purple-400" />, title: 'הורדה ושיתוף תמונה' };
        }
    };
    const { icon: headerIcon, title: headerTitle } = getModalHeader();

    const renderBundleDownloader = () => {
        try {
            const bundle: MediaBundle = JSON.parse(item.data);
    
            const downloadAsset = (data: string, name: string) => {
                const link = document.createElement('a');
                link.href = `data:image/jpeg;base64,${data}`;
                link.download = `studioplay-${name}`;
                link.click();
            };
    
            const downloadAll = () => {
                downloadAsset(bundle.post, 'post.jpg');
                downloadAsset(bundle.story, 'story.jpg');
                downloadAsset(bundle.cover, 'cover.jpg');
                onToast('3 קבצים יורדים...', 'success');
            };
    
            const copyText = () => {
                const textToCopy = `${bundle.captions.headline}\n\n${bundle.captions.body}\n\n${bundle.captions.hashtags}`;
                navigator.clipboard.writeText(textToCopy);
                onToast('הטקסט הועתק ללוח!', 'success');
            };
    
            return (
                <>
                    <div className="space-y-3">
                        <label className="text-xs font-bold uppercase tracking-wider text-gray-500">הורדת תמונות</label>
                        <div className="grid grid-cols-1 gap-2">
                            <Button variant="default" className="w-full justify-between !py-2.5" onClick={() => downloadAsset(bundle.post, 'post.jpg')}>פוסט (1:1) <IconDownload className="h-4 w-4" /></Button>
                            <Button variant="default" className="w-full justify-between !py-2.5" onClick={() => downloadAsset(bundle.story, 'story.jpg')}>סטורי (9:16) <IconDownload className="h-4 w-4" /></Button>
                            <Button variant="default" className="w-full justify-between !py-2.5" onClick={() => downloadAsset(bundle.cover, 'cover.jpg')}>קאבר (16:9) <IconDownload className="h-4 w-4" /></Button>
                        </div>
                        <Button variant="primary" className="w-full !py-3 mt-2" onClick={downloadAll}>
                            <IconDownload className="ml-2 h-5 w-5" />
                            הורד את כל התמונות
                        </Button>
                    </div>
                    <div className="space-y-3 border-t border-white/5 pt-6">
                        <label className="text-xs font-bold uppercase tracking-wider text-gray-500">טקסט שיווקי</label>
                        <div dir="rtl" className="text-right text-sm p-3 bg-white/5 rounded-lg max-h-40 overflow-y-auto no-scrollbar">
                            <p className="font-bold">{bundle.captions.headline}</p>
                            <p className="text-gray-300 mt-2 whitespace-pre-wrap">{bundle.captions.body}</p>
                            <p className="text-cyan-400 mt-4">{bundle.captions.hashtags}</p>
                        </div>
                        <Button variant="default" className="w-full" onClick={copyText}>העתק טקסט</Button>
                    </div>
                </>
            );
        } catch (e) {
            onToast('שגיאה בניתוח חבילת התוכן', 'error');
            return <p className="text-red-400">לא ניתן היה לטעון את פרטי החבילה.</p>;
        }
    };
    
    return (
        <AnimatePresence>
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md"
                onClick={onClose}
            >
                <motion.div 
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-panel-dark p-6 shadow-2xl"
                    onClick={e => e.stopPropagation()}
                >
                    <button onClick={onClose} className="absolute top-4 left-4 text-gray-400 hover:text-white">
                        <IconClose className="h-6 w-6" />
                    </button>

                    <div className="mb-6 flex flex-col items-center text-center">
                        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-600/20">
                            {headerIcon}
                        </div>
                        <h3 className="text-xl font-bold">{headerTitle}</h3>
                        <p className="mt-1 text-sm text-gray-400 line-clamp-1">{item.prompt}</p>
                    </div>

                    <div className="space-y-6">
                        {item.type === 'bundle' ? renderBundleDownloader() : (
                            <>
                                <div className="space-y-3">
                                    <label className="text-xs font-bold uppercase tracking-wider text-gray-500">בחר פורמט הורדה</label>
                                    {item.type === 'image' ? (
                                        <div className="grid grid-cols-3 gap-2">
                                            <FormatButton label="PNG" sub="איכותי" onClick={() => convertAndDownload('image/png', 'png')} disabled={isConverting} />
                                            <FormatButton label="JPG" sub="מהיר" onClick={() => convertAndDownload('image/jpeg', 'jpg')} disabled={isConverting} />
                                            <FormatButton label="WebP" sub="חדש" onClick={() => convertAndDownload('image/webp', 'webp')} disabled={isConverting} />
                                        </div>
                                    ) : (
                                        <Button variant="primary" className="w-full !py-3" onClick={downloadVideo}>
                                            <IconDownload className="ml-2 h-5 w-5" />
                                            הורד כקובץ MP4
                                        </Button>
                                    )}
                                </div>
                                <div className="space-y-3 border-t border-white/5 pt-6">
                                    <label className="text-xs font-bold uppercase tracking-wider text-gray-500">שתף עם חברים</label>
                                    <div className="flex flex-wrap gap-2">
                                        <Button onClick={handleWebShare} className="flex-1 !bg-white/5 hover:!bg-white/10">
                                            <IconShare className="ml-2 h-4 w-4" />
                                            שיתוף מערכת
                                        </Button>
                                        <Button onClick={() => shareToSocial('wa')} className="!bg-[#25D366]/10 !text-[#25D366] hover:!bg-[#25D366]/20 border border-[#25D366]/20">
                                            WhatsApp
                                        </Button>
                                        <Button onClick={() => shareToSocial('fb')} className="!bg-[#1877F2]/10 !text-[#1877F2] hover:!bg-[#1877F2]/20 border border-[#1877F2]/20">
                                            Facebook
                                        </Button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

const FormatButton: React.FC<{ label: string; sub: string; onClick: () => void; disabled?: boolean }> = ({ label, sub, onClick, disabled }) => (
    <button 
        onClick={onClick}
        disabled={disabled}
        className="flex flex-col items-center justify-center rounded-2xl border border-white/5 bg-white/5 py-3 transition-all hover:bg-white/10 active:scale-95 disabled:opacity-50"
    >
        <span className="text-sm font-bold">{label}</span>
        <span className="text-[10px] text-gray-500">{sub}</span>
    </button>
);

export default MediaActionsModal;
