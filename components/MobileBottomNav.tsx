
import React from 'react';
import IconMagic from './common/IconMagic';
import IconGrid from './common/IconGrid';
import IconHistory from './common/IconHistory';

type MobileView = 'workspace' | 'controls' | 'gallery';

interface MobileBottomNavProps {
    activeView: MobileView;
    setView: (view: MobileView) => void;
}

const NavButton: React.FC<{
    icon: React.ElementType;
    label: string;
    isActive: boolean;
    onClick: () => void;
}> = ({ icon: Icon, label, isActive, onClick }) => {
    return (
        <button
            onClick={onClick}
            className={`flex flex-col items-center gap-1 rounded-lg px-3 py-1 text-xs transition-colors ${
                isActive ? 'text-purple-400' : 'text-gray-400 hover:text-white'
            }`}
        >
            <Icon className="h-5 w-5" />
            <span>{label}</span>
        </button>
    );
};

const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ activeView, setView }) => {
    return (
        <div className="fixed bottom-0 left-0 right-0 z-30 flex justify-around border-t border-panel-border bg-panel-dark/80 p-2 backdrop-blur-sm">
            <NavButton
                icon={IconMagic}
                label="כלים"
                isActive={activeView === 'controls'}
                onClick={() => setView('controls')}
            />
             <NavButton
                icon={IconGrid}
                label="סביבת עבודה"
                isActive={activeView === 'workspace'}
                onClick={() => setView('workspace')}
            />
            <NavButton
                icon={IconHistory}
                label="גלריה"
                isActive={activeView === 'gallery'}
                onClick={() => setView('gallery')}
            />
        </div>
    );
};

export default MobileBottomNav;