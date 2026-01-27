
import React, { useRef, useState, useEffect } from 'react';
import { Tool, GalleryItem, AuthUser, MediaType } from '../types';
import GallerySidebar from './GallerySidebar';
import Workspace from './Workspace';
import ControlsSidebar from './ControlsSidebar';
import Header from './Header';
import FloatingToolbar from './FloatingToolbar';
import MobileBottomNav from './MobileBottomNav';

interface EditorLayoutProps {
    user: AuthUser;
    onLogout: () => void;
    tools: Tool[];
    selectedTool: Tool;
    onSelectTool: (toolId: string) => void;
    toolSettings: Record<string, any>;
    setToolSettings: React.Dispatch<React.SetStateAction<Record<string, any>>>;
    files: File[];
    setFiles: (files: File[]) => void;
    onGenerate: (prompt: string, settings: Record<string, any>, files: File[], mediaType?: MediaType) => Promise<void> | void;
    isLoading: boolean;
    result: GalleryItem | null;
    galleryItems: GalleryItem[];
    onSelectItem: (item: GalleryItem | null) => void;
    onDeleteItem: (itemId: string) => void;
    onDownloadItem: (item: GalleryItem) => void;
    onShareItem: (item: GalleryItem) => void;
    onUseItemAsInput: (item: GalleryItem) => void;
    onToast: (msg: string, type: 'success' | 'error') => void;
}

const EditorLayout: React.FC<EditorLayoutProps> = (props) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isGalleryOpen, setIsGalleryOpen] = useState(window.innerWidth > 1200);
    const [isControlsOpen, setIsControlsOpen] = useState(true);
    const [mobileView, setMobileView] = useState<'workspace' | 'controls' | 'gallery'>('workspace');

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 1024) {
                setIsGalleryOpen(false);
                setIsControlsOpen(false);
            } else {
                setIsControlsOpen(true);
            }
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleFileUploadTrigger = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            props.setFiles(Array.from(event.target.files));
        }
    };

    const toggleGallery = () => setIsGalleryOpen(prev => !prev);
    const toggleControls = () => setIsControlsOpen(prev => !prev);

    const hasContent = props.files.length > 0 || !!props.result;

    return (
        <div className="flex h-screen w-full flex-col overflow-hidden bg-[#0D0E1B] text-gray-200 selection:bg-purple-500/30">
            <Header 
                onToggleGallery={toggleGallery} 
                user={props.user} 
                onLogout={props.onLogout} 
                isGalleryOpen={isGalleryOpen}
            />
            
            <div className="flex flex-1 overflow-hidden relative">
                
                {/* Desktop Controls Sidebar */}
                {isControlsOpen && (
                    <div className="hidden h-full lg:flex transition-all duration-300">
                         <ControlsSidebar
                            tools={props.tools}
                            selectedTool={props.selectedTool}
                            onSelectTool={props.onSelectTool}
                            toolSettings={props.toolSettings}
                            setToolSettings={props.setToolSettings}
                            files={props.files}
                            setFiles={props.setFiles}
                            onGenerate={props.onGenerate}
                            isLoading={props.isLoading}
                        />
                    </div>
                )}
                
                {/* Toggle Button for Controls on Desktop */}
                <button 
                    onClick={toggleControls}
                    className={`hidden lg:flex absolute top-1/2 -translate-y-1/2 z-20 items-center justify-center w-5 h-12 bg-panel-light/40 border border-panel-border rounded-l-lg hover:bg-panel-light/60 backdrop-blur-md transition-all ${isControlsOpen ? 'right-[320px] xl:right-[380px]' : 'right-0'}`}
                >
                    <span className="text-[10px] transform rotate-90">{isControlsOpen ? '▶' : '◀'}</span>
                </button>

                <main className="relative flex-1 flex flex-col p-2 md:p-4 lg:p-6 workspace-bg overflow-hidden">
                    <div className="flex-1 relative flex items-center justify-center overflow-hidden bg-black/40 backdrop-blur-sm rounded-3xl border border-white/5 shadow-2xl">
                        <FloatingToolbar isVisible={hasContent && !props.isLoading} />
                        <Workspace
                            isLoading={props.isLoading}
                            result={props.result}
                            selectedTool={props.selectedTool}
                            files={props.files}
                            onFileUpload={handleFileUploadTrigger}
                            onClearResult={() => props.onSelectItem(null)}
                            onToast={props.onToast}
                        />
                    </div>
                </main>

                {/* Desktop Gallery Sidebar */}
                {isGalleryOpen && (
                    <div className="hidden h-full lg:flex transition-all duration-300">
                        <GallerySidebar 
                            toggleGallery={toggleGallery}
                            items={props.galleryItems}
                            onSelectItem={props.onSelectItem}
                            onDeleteItem={props.onDeleteItem}
                            onDownloadItem={props.onDownloadItem}
                            onShareItem={props.onShareItem}
                            onUseItemAsInput={props.onUseItemAsInput}
                        />
                    </div>
                )}

                {/* --- Mobile View Overlays --- */}
                {mobileView === 'controls' && (
                    <div className="fixed inset-0 z-40 lg:hidden">
                        <ControlsSidebar
                            isMobileView={true}
                            onClose={() => setMobileView('workspace')}
                            {...props}
                        />
                    </div>
                )}
                {mobileView === 'gallery' && (
                     <div className="fixed inset-0 z-40 lg:hidden">
                        {/* Fixed: pass galleryItems as items */}
                        <GallerySidebar
                            isMobileView={true}
                            onClose={() => setMobileView('workspace')}
                            toggleGallery={() => {}}
                            items={props.galleryItems}
                            onSelectItem={props.onSelectItem}
                            onDeleteItem={props.onDeleteItem}
                            onDownloadItem={props.onDownloadItem}
                            onShareItem={props.onShareItem}
                            onUseItemAsInput={props.onUseItemAsInput}
                         />
                    </div>
                )}

            </div>

            {/* Mobile Navigation */}
            <div className="lg:hidden">
                <MobileBottomNav activeView={mobileView} setView={setMobileView} />
            </div>

            <input
                id="file-upload"
                type="file"
                multiple
                accept="image/*,video/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileChange}
            />
        </div>
    );
};

export default EditorLayout;
