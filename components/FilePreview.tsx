
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Button from './common/Button';
import IconPen from './common/IconPen';
import UploadIcon from './common/UploadIcon';

interface FilePreviewProps {
    file: File;
    onReplace: () => void;
}

const FilePreview: React.FC<FilePreviewProps> = ({ file, onReplace }) => {
    const [fileUrl, setFileUrl] = useState<string | null>(null);

    useEffect(() => {
        if (!file) return;
        const url = URL.createObjectURL(file);
        setFileUrl(url);

        return () => {
            URL.revokeObjectURL(url);
        };
    }, [file]);

    if (!fileUrl) {
        return null;
    }
    
    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="relative h-full w-full"
        >
            <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-lg border border-panel-border bg-black/20">
                {isImage ? (
                    <img src={fileUrl} alt={file.name} className="max-h-full max-w-full object-contain" />
                ) : isVideo ? (
                    <video src={fileUrl} controls autoPlay loop className="max-h-full max-w-full object-contain">
                        Your browser does not support the video tag.
                    </video>
                ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center p-4 text-center">
                        <p className="text-lg font-bold">Preview not available</p>
                        <p className="text-sm text-gray-400">{file.name}</p>
                    </div>
                )}
            </div>
            
            {/* Controls */}
            <div className="absolute right-4 top-4 z-10">
                 <Button variant="default" className="!bg-panel-dark/80 !border-panel-border/50 backdrop-blur-sm">
                    <IconPen className="h-4 w-4 ml-2" />
                    ערוך תמונה
                 </Button>
            </div>
            <div className="absolute bottom-4 left-4 z-10">
                <Button variant="default" onClick={onReplace} className="!bg-panel-dark/80 !border-panel-border/50 backdrop-blur-sm">
                     <UploadIcon className="h-4 w-4 ml-2" />
                     החלף תמונה
                 </Button>
            </div>
        </motion.div>
    );
};

export default FilePreview;
