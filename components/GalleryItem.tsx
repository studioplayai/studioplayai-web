
import React from 'react';
import { motion } from 'framer-motion';
import { GalleryItem, MediaBundle } from '../types';
import IconImage from './common/IconImage';
import IconFilm from './common/IconFilm';
import IconType from './common/IconType';
import IconDownload from './common/IconDownload';
import IconShare from './common/IconShare';
import IconTrash from './common/IconTrash';
import IconCornerUpLeft from './common/IconCornerUpLeft';
import IconZap from './common/IconLightning';


interface GalleryItemProps {
    item: GalleryItem;
    onSelect: () => void;
    onDelete: () => void;
    onDownload: () => void;
    onShare: () => void;
    onUseAsInput: () => void;
}

const ActionButton: React.FC<{ onClick: (e: React.MouseEvent) => void; children: React.ReactNode; label: string }> = ({ onClick, children, label }) => (
    <button
        onClick={(e) => { e.stopPropagation(); onClick(e); }}
        className="flex h-7 w-7 items-center justify-center rounded-full bg-black/40 text-white/80 backdrop-blur-sm transition-colors hover:bg-white/20 hover:text-white"
        title={label}
        aria-label={label}
    >
        {children}
    </button>
);

const GalleryItemComponent: React.FC<GalleryItemProps> = (props) => {
    const { item, onSelect, onDelete, onDownload, onShare, onUseAsInput } = props;

    const isBase64 = (str: string) => {
        if (!str) return false;
        return str.length > 100 && !str.includes(' ');
    };

    const getThumbnail = () => {
        if (item.type === 'image' && isBase64(item.data)) {
            return `data:image/png;base64,${item.data}`;
        }
        if (item.type === 'bundle') {
            try {
                const bundle: MediaBundle = JSON.parse(item.data);
                return `data:image/jpeg;base64,${bundle.post}`;
            } catch(e) {}
        }
        return undefined;
    };
    
    const Icon = item.type === 'video' ? IconFilm : item.type === 'text' ? IconType : item.type === 'bundle' ? IconZap : IconImage;
    const thumbnail = getThumbnail();

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            onClick={onSelect}
            className="group relative aspect-square cursor-pointer overflow-hidden rounded-lg border-2 border-transparent bg-panel-light transition-all hover:border-purple-500"
        >
            {thumbnail ? (
                <img src={thumbnail} alt={item.prompt} className="h-full w-full object-cover" />
            ) : (
                <div className="flex h-full w-full flex-col items-center justify-center bg-panel-light p-2 text-center">
                    <Icon className={`mb-2 h-8 w-8 ${item.type === 'bundle' ? 'text-purple-400' : 'text-gray-500'}`} />
                    <span className="text-[10px] text-gray-500 line-clamp-2">
                        {item.type === 'bundle' ? 'חבילת תוכן' : item.type === 'text' ? 'טקסט' : item.type === 'video' ? 'וידאו' : 'תמונה'}
                    </span>
                </div>
            )}
            
            <div className="absolute inset-0 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100" />

            <div className="absolute left-2 top-2 right-2 flex justify-end gap-1.5 opacity-0 transition-opacity group-hover:opacity-100">
                <ActionButton onClick={onDownload} label="הורדה"><IconDownload className="h-4 w-4" /></ActionButton>
                <ActionButton onClick={onShare} label="שיתוף"><IconShare className="h-4 w-4" /></ActionButton>
            </div>
            
            <div className="absolute bottom-2 left-2 right-2 flex justify-between gap-1.5 opacity-0 transition-opacity group-hover:opacity-100">
                <ActionButton onClick={onUseAsInput} label="השתמש כקלט"><IconCornerUpLeft className="h-4 w-4" /></ActionButton>
                <ActionButton onClick={onDelete} label="מחיקה"><IconTrash className="h-4 w-4" /></ActionButton>
            </div>

            {item.type === 'bundle' && (
                <div className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-purple-600 shadow-lg">
                    <IconZap className="h-3.5 w-3.5 text-white" />
                </div>
            )}
        </motion.div>
    );
};

export default GalleryItemComponent;
