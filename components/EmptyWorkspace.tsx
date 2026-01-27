
import React from 'react';
import { motion } from 'framer-motion';
import UploadIcon from './common/UploadIcon';
import Button from './common/Button';

interface EmptyWorkspaceProps {
    onSelectFile: () => void;
}

const EmptyWorkspace: React.FC<EmptyWorkspaceProps> = ({ onSelectFile }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-panel-border bg-panel-dark/50 p-12 text-center"
        >
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-purple-600/20">
                <UploadIcon className="h-8 w-8 text-purple-400" />
            </div>
            <h2 className="mt-6 text-xl font-bold">נסה את זה עכשיו</h2>
            <p className="mt-2 max-w-xs text-sm text-gray-400">
                העלה תמונה וראה את הקסם קורה בזמן אמת. המערכת תזהה את האובייקט ותשלב אותו בתוצאה הסופית.
            </p>
            <Button
                variant="primary"
                className="mt-6 !bg-button-gradient !px-6 !py-2.5"
                onClick={onSelectFile}
            >
                בחר קובץ
            </Button>
        </motion.div>
    );
};

export default EmptyWorkspace;
