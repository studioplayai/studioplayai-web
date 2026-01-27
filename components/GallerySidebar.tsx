
import React from 'react';
import { GalleryItem } from '../types';
import IconHistory from './common/IconHistory';
import IconClose from './common/IconClose';
import GalleryItemComponent from './GalleryItem';

interface GallerySidebarProps {
    items: GalleryItem[];
    onSelectItem: (item: GalleryItem) => void;
    onDeleteItem: (itemId: string) => void;
    onDownloadItem: (item: GalleryItem) => void;
    onShareItem: (item: GalleryItem) => void;
    onUseItemAsInput: (item: GalleryItem) => void;
    toggleGallery: () => void; // For desktop
    isMobileView?: boolean;
    onClose?: () => void; // For mobile
}

const GallerySidebar: React.FC<GallerySidebarProps> = (props) => {
    const handleClose = props.isMobileView ? props.onClose : props.toggleGallery;

    return (
        <aside className={`flex flex-col border-r border-panel-border bg-panel-dark h-full ${props.isMobileView ? 'w-full fixed inset-0 z-50' : 'w-72 xl:w-80 flex-shrink-0'}`}>
            <div className="flex items-center justify-between p-4 flex-shrink-0 bg-panel-dark">
                <div className="flex items-center gap-2">
                    <IconHistory className="h-5 w-5 text-purple-400" />
                    <h3 className="font-bold text-gray-100">הגלריה שלי</h3>
                </div>
                <button onClick={handleClose} className="text-gray-400 hover:text-white p-1">
                    <IconClose className="h-5 w-5" />
                </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 pt-0 no-scrollbar">
                {props.items.length > 0 ? (
                    <div className={`grid gap-3 ${props.isMobileView ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4' : 'grid-cols-2'}`}>
                        {props.items.map(item => (
                            <GalleryItemComponent 
                                key={item.id} 
                                item={item}
                                onSelect={() => {
                                    props.onSelectItem(item);
                                    if(props.isMobileView && props.onClose) props.onClose();
                                }}
                                onDelete={() => props.onDeleteItem(item.id)}
                                onDownload={() => props.onDownloadItem(item)}
                                onShare={() => props.onShareItem(item)}
                                onUseAsInput={() => props.onUseItemAsInput(item)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="mt-8 flex h-[60%] flex-col items-center justify-center text-center px-4">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-panel-light border border-panel-border/30">
                            <IconHistory className="h-8 w-8 text-gray-600" />
                        </div>
                        <h4 className="mt-4 font-bold text-gray-300 text-sm">אין עדיין יצירות</h4>
                        <p className="mt-1 text-xs text-gray-500">
                            התמונות שתייצר באמצעות ה-AI יופיעו כאן באופן אוטומטי
                        </p>
                    </div>
                )}
            </div>
        </aside>
    );
};

export default GallerySidebar;
