
import React, { useState, useMemo } from 'react';
import { Tool, ToolCategory, ToolField, MediaType } from '../types';
import { toolCategories } from '../constants';
import Button from './common/Button';
import Toggle from './common/Toggle';
import IconLightning from './common/IconLightning';
import IconClose from './common/IconClose';
import IconLightbulb from './common/IconLightbulb';
import StyleStudioCategory from './StyleStudioCategory';
import VideoReelCategory from './VideoReelCategory';

interface ControlsSidebarProps {
    tools: Tool[];
    selectedTool: Tool;
    onSelectTool: (toolId: string) => void;
    toolSettings: Record<string, any>;
    setToolSettings: React.Dispatch<React.SetStateAction<Record<string, any>>>;
    files: File[];
    setFiles: (files: File[]) => void;
    onGenerate: (prompt: string, settings: Record<string, any>, files: File[], mediaType?: MediaType) => Promise<void> | void;
    isLoading: boolean;
    isMobileView?: boolean;
    onClose?: () => void;
}

const NavItem: React.FC<{ icon: React.ComponentType<{className?: string}>; isActive: boolean; onClick: () => void; label: string }> = ({ icon: Icon, isActive, onClick, label }) => (
    <button 
        onClick={onClick} 
        title={label}
        className={`group relative flex h-12 w-12 items-center justify-center rounded-xl transition-all ${isActive ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20' : 'text-gray-400 hover:bg-panel-light hover:text-gray-200'}`}
    >
        <Icon className="h-6 w-6" />
        <span className="absolute right-14 scale-0 group-hover:scale-100 transition-all origin-right bg-gray-800 text-white text-[10px] px-2 py-1 rounded-md whitespace-nowrap z-50">
            {label}
        </span>
    </button>
);

const ToolItem: React.FC<{ tool: Tool; isSelected: boolean; onClick: () => void }> = ({ tool, isSelected, onClick }) => (
    <div
        onClick={onClick}
        className={`cursor-pointer rounded-lg border p-2.5 transition-all ${isSelected ? 'border-purple-600 bg-purple-600/10' : 'border-panel-border bg-panel-light hover:border-gray-600'}`}
    >
        <div className="flex items-center gap-2.5">
            <tool.icon className={`h-4 w-4 ${isSelected ? 'text-purple-400' : 'text-gray-400'}`} />
            <div>
                <h4 className="flex-1 font-semibold text-sm truncate">{tool.name}</h4>
                <p className="text-xs text-gray-500 line-clamp-1">{tool.desc}</p>
            </div>
            {tool.isPro && <span className="ml-auto rounded bg-brand-yellow/80 px-1 py-0.5 text-[10px] font-bold text-black self-start">PRO</span>}
        </div>
    </div>
);

const renderField = (field: ToolField, settings: Record<string, any>, setter: React.Dispatch<React.SetStateAction<Record<string, any>>>) => {
    const value = settings[field.id] ?? field.defaultValue;

    const handleChange = (newValue: any) => {
        setter(prev => ({...prev, [field.id]: newValue}));
    };
    
    switch(field.type) {
        case 'textarea':
            return (
                 <textarea
                    value={value}
                    onChange={e => handleChange(e.target.value)}
                    placeholder={field.placeholder}
                    className="mt-1 w-full resize-none rounded-lg border border-panel-border bg-panel-dark p-2 text-xs text-gray-200 placeholder-gray-500 focus:border-purple-500 focus:outline-none"
                    rows={3}
                />
            );
        case 'text':
             return (
                 <input
                    type="text"
                    value={value}
                    onChange={e => handleChange(e.target.value)}
                    placeholder={field.placeholder}
                    className="mt-1 w-full rounded-lg border border-panel-border bg-panel-dark p-2 text-xs text-gray-200 placeholder-gray-500 focus:border-purple-500 focus:outline-none h-8"
                />
             )
        case 'select':
            return (
                 <select
                    value={value}
                    onChange={e => handleChange(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-panel-border bg-panel-dark px-2 py-1.5 text-xs text-gray-200 focus:border-purple-500 focus:outline-none h-8"
                >
                    {field.options?.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
            )
        case 'toggle':
            return <Toggle label={field.label} enabled={value} setEnabled={(val) => handleChange(val)} icon={field.icon} compact />
        case 'buttongroup':
            return (
                 <div className="mt-1 grid grid-cols-3 gap-1.5">
                    {field.options?.map(opt => (
                        <Button
                            key={opt.value}
                            variant={value === opt.value ? 'primary' : 'default'}
                            onClick={() => handleChange(opt.value)}
                            className="text-[10px] !py-1 !px-1 h-7 truncate"
                        >{opt.label}</Button>
                    ))}
                </div>
            )
        default:
            return null;
    }
};

const IdeaGeneratorControls: React.FC<{
    settings: Record<string, any>;
    setSettings: React.Dispatch<React.SetStateAction<Record<string, any>>>;
    tool: Tool;
}> = ({ settings, setSettings, tool }) => {
    
    const nicheField = tool.fields?.find(f => f.id === 'niche') as ToolField;
    const descField = tool.fields?.find(f => f.id === 'businessDescription') as ToolField;

    const handleSettingChange = (id: string, value: any) => {
        setSettings(prev => ({ ...prev, [id]: value }));
    };

    return (
        <div className="space-y-3 rounded-lg border border-yellow-500/20 bg-yellow-500/5 p-4">
            <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-yellow-500/20 text-yellow-300">
                    <IconLightbulb className="h-5 w-5" />
                </div>
                <div>
                    <h3 className="font-bold text-yellow-300">תן לי רעיון לפוסט</h3>
                    <p className="text-xs text-yellow-200/50">מחסום כתיבה? ה-AI יבנה עבורך תוכנית תוכן מנצחת.</p>
                </div>
            </div>
            
            <div className="space-y-4 pt-3">
                <div>
                    <label className="text-xs font-semibold text-gray-400">{nicheField.label}</label>
                    <select
                        value={settings.niche || nicheField.defaultValue}
                        onChange={e => handleSettingChange('niche', e.target.value)}
                        className="mt-1 w-full rounded-lg border border-panel-border bg-panel-dark p-2 text-sm text-gray-200 focus:border-purple-500 focus:outline-none"
                    >
                        {nicheField.options?.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </select>
                </div>
                <div>
                    <label className="text-xs font-semibold text-gray-400">{descField.label}</label>
                    <textarea
                        value={settings.businessDescription || descField.defaultValue}
                        onChange={e => handleSettingChange('businessDescription', e.target.value)}
                        placeholder={descField.placeholder}
                        className="mt-1 w-full resize-none rounded-lg border border-panel-border bg-panel-dark p-2 text-sm text-gray-200 placeholder-gray-500 focus:border-purple-500 focus:outline-none"
                        rows={3}
                    />
                </div>
            </div>
        </div>
    );
};


const ControlsSidebar: React.FC<ControlsSidebarProps> = (props) => {
    const { isMobileView = false, onClose } = props;
    const [activeCategory, setActiveCategory] = useState<ToolCategory>(ToolCategory.Ideas);

    const handleGenerateClick = () => {
        const settingsWithNiche = {
            ...props.toolSettings,
            niche: props.toolSettings.niche || props.selectedTool.fields?.find(f => f.id === 'niche')?.defaultValue
        };
        props.onGenerate(props.selectedTool.prompt, settingsWithNiche, props.files, props.selectedTool.media);
    };

    const handleCategorySelect = (category: ToolCategory) => {
        setActiveCategory(category);
        if (category === ToolCategory.Video || category === ToolCategory.StyleStudio) {
            return;
        }
        const firstTool = props.tools.find(t => t.category === category);
        if (firstTool) {
            props.onSelectTool(firstTool.id);
        }
    };


    const visibleTools = props.tools.filter(t => t.category === activeCategory);
    
    const fieldsByGroup: Record<string, ToolField[]> = useMemo(() => {
        if (!props.selectedTool.fields) return {};
        return props.selectedTool.fields.reduce((acc: Record<string, ToolField[]>, field) => {
            const groupName = field.group || 'General';
            if (!acc[groupName]) {
                acc[groupName] = [];
            }
            acc[groupName].push(field);
            return acc;
        }, {} as Record<string, ToolField[]>);
    }, [props.selectedTool]);

    const isIdeaGenerator = props.selectedTool.id === 'idea-generator';

    return (
        <aside className={`flex h-full bg-panel-dark ${isMobileView ? 'w-full flex-col fixed inset-0 z-50' : 'w-[320px] xl:w-[380px] flex-shrink-0 border-l border-panel-border'}`}>
             {isMobileView && (
                <div className="flex flex-shrink-0 items-center justify-between border-b border-panel-border p-4 bg-panel-dark">
                    <h3 className="text-lg font-bold">כלים ועריכה</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white p-2">
                        <IconClose className="h-6 w-6" />
                    </button>
                </div>
            )}
             <div className={`flex flex-1 overflow-hidden`}>
                 {!isMobileView && (
                    <div className="flex flex-col items-center gap-3 border-l border-panel-border bg-black/10 p-2 overflow-y-auto no-scrollbar">
                        {Object.entries(toolCategories).map(([key, { icon, name }]) => (
                            <NavItem
                                key={key}
                                icon={icon}
                                label={name}
                                isActive={activeCategory === key}
                                onClick={() => handleCategorySelect(key as ToolCategory)}
                            />
                        ))}
                    </div>
                 )}
                <div className="flex-1 flex flex-col overflow-hidden">
                   {activeCategory === ToolCategory.StyleStudio ? (
                       <StyleStudioCategory 
                           onGenerate={props.onGenerate}
                           isLoading={props.isLoading}
                           files={props.files}
                           setFiles={props.setFiles}
                       />
                   ) : activeCategory === ToolCategory.Video ? (
                        <VideoReelCategory 
                           onGenerate={props.onGenerate}
                           isLoading={props.isLoading}
                           files={props.files}
                           setFiles={props.setFiles}
                        />
                   ) : (
                    <>
                        <div className="flex-1 overflow-y-auto p-3 space-y-4">
                            {isMobileView && (
                                <div className="mb-2">
                                    <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">קטגוריות</h3>
                                    <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                                        {Object.entries(toolCategories).map(([key, { name }]) => (
                                            <Button
                                                key={key}
                                                onClick={() => handleCategorySelect(key as ToolCategory)}
                                                variant={activeCategory === key ? 'primary' : 'default'}
                                                className="!px-3 !py-1 !text-[11px] whitespace-nowrap h-7"
                                            >{name}</Button>
                                        ))}
                                    </div>
                                </div>
                            )}
                            
                            <div>
                                <h3 className="text-sm font-bold text-gray-300 mb-2">{toolCategories[activeCategory].name}</h3>
                                <div className="grid grid-cols-1 gap-2">
                                    {visibleTools.map(tool => (
                                        <ToolItem
                                            key={tool.id}
                                            tool={tool}
                                            isSelected={props.selectedTool.id === tool.id}
                                            onClick={() => props.onSelectTool(tool.id)}
                                        />
                                    ))}
                                </div>
                            </div>

                            <div className="border-t border-panel-border pt-3">
                               {props.selectedTool.id === 'idea-generator' ? (
                                    <IdeaGeneratorControls 
                                        settings={props.toolSettings}
                                        setSettings={props.setToolSettings}
                                        tool={props.selectedTool}
                                    />
                                ) : (
                                    <div className="space-y-3">
                                    {Object.entries(fieldsByGroup).map(([groupName, fields]) => (
                                        <div key={groupName} className="space-y-2.5 rounded-lg border border-panel-border bg-panel-light/20 p-2.5">
                                            <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{groupName}</h4>
                                            {fields.map((field, index) => {
                                                if (field.columns === 2 && index > 0 && fields[index-1].columns === 2) {
                                                    return null;
                                                }
                                                if (field.columns === 2 && index < fields.length - 1 && fields[index+1].columns === 2) {
                                                    const nextField = fields[index+1];
                                                    return (
                                                        <div key={field.id} className="grid grid-cols-2 gap-2">
                                                                <div>
                                                                <label className="text-[10px] text-gray-400 mb-0.5 block">{field.label}</label>
                                                                {renderField(field, props.toolSettings, props.setToolSettings)}
                                                            </div>
                                                                <div>
                                                                <label className="text-[10px] text-gray-400 mb-0.5 block">{nextField.label}</label>
                                                                {renderField(nextField, props.toolSettings, props.setToolSettings)}
                                                            </div>
                                                        </div>
                                                    );
                                                }
                                                return (
                                                    <div key={field.id}>
                                                        {field.type !== 'toggle' && <label className="text-[10px] text-gray-400 mb-0.5 block">{field.label}</label>}
                                                        {renderField(field, props.toolSettings, props.setToolSettings)}
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="p-3 bg-panel-dark border-t border-panel-border">
                            <Button
                                variant="primary"
                                className={`w-full !py-3 shadow-lg ${isIdeaGenerator ? 'bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 text-black shadow-orange-500/20 hover:brightness-110' : 'bg-button-gradient text-white shadow-pink-600/20'}`}
                                onClick={handleGenerateClick}
                                disabled={props.isLoading}
                            >
                                {props.isLoading ? (isIdeaGenerator ? "חושב על רעיונות..." : "יוצר קסם...") : (
                                    <div className="flex items-center justify-center gap-2">
                                        {isIdeaGenerator ? <IconLightbulb className="h-5 w-5"/> : <IconLightning className="h-4 w-4"/>}
                                        <span className={`text-sm ${isIdeaGenerator ? 'font-black' : 'font-bold'}`}>
                                            {isIdeaGenerator ? 'הפק אסטרטגיה' : 'הפעל קסם'}
                                        </span>
                                    </div>
                                )}
                            </Button>
                        </div>
                    </>
                   )}
                </div>
            </div>
        </aside>
    );
};

export default ControlsSidebar;
