
import React from 'react';
import { motion } from 'framer-motion';
import LoadingState from './LoadingState';
import ResultDisplay from './ResultDisplay';
import EmptyWorkspace from './EmptyWorkspace';
import FilePreview from './FilePreview';
import { Tool, GalleryItem } from '../types';
import IconLightbulb from './common/IconLightbulb';
import Button from './common/Button';

interface WorkspaceProps {
    isLoading: boolean;
    result: GalleryItem | null;
    selectedTool: Tool;
    files: File[];
    onFileUpload: () => void;
    onClearResult: () => void;
    onToast: (msg: string, type: 'success' | 'error') => void;
}

const TextToolInitialState: React.FC<{ tool: Tool }> = ({ tool }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center p-12 text-center"
        >
            <div className="relative flex h-20 w-20 items-center justify-center mb-6">
                <div className="absolute h-full w-full rounded-full bg-purple-500/10 animate-spin-slow" />
                <div className="absolute h-16 w-16 rounded-full bg-purple-500/20 animate-pulse" />
                <IconLightbulb className="h-8 w-8 text-purple-300" />
            </div>
            <h2 className="text-2xl font-bold">{tool.name}</h2>
            <p className="mt-2 max-w-sm text-sm text-gray-400">
                {tool.desc}
            </p>
            <p className="mt-6 text-xs text-gray-500">
                הגדר את הפרטים בסרגל הכלים ולחץ על "הפק רעיונות" כדי להתחיל.
            </p>
        </motion.div>
    );
};


const Workspace: React.FC<WorkspaceProps> = ({ isLoading, result, selectedTool, files, onFileUpload, onClearResult, onToast }) => {
    const isTextTool = selectedTool.media === 'text';

    const renderContent = () => {
        if (isLoading) {
            return <LoadingState tool={selectedTool} />;
        }
        if (result) {
            return <ResultDisplay result={result} tool={selectedTool} onClear={onClearResult} onToast={onToast} />;
        }
        if (isTextTool) {
            return <TextToolInitialState tool={selectedTool} />;
        }
        if (files.length > 0) {
            return <FilePreview file={files[0]} onReplace={onFileUpload} />;
        }
        return <EmptyWorkspace onSelectFile={onFileUpload} />;
    };

    return (
        <div className="flex h-full w-full items-center justify-center">
            {renderContent()}
        </div>
    );
};

export default Workspace;
