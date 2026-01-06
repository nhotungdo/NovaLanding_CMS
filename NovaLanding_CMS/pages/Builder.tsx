
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { LandingPageConfig, SectionType, Section } from '../types';
import { DEFAULT_CONFIG } from '../constants';
import { PropertiesPanel } from '../components/Editor';
import { SectionRenderer } from '../components/SectionPreview';
import { Icons } from '../components/Icons';
import { generateCopyForNiche, generateImage, getRelevantImage } from '../services/geminiService';

const Builder: React.FC = () => {
    const navigate = useNavigate();
    const [config, setConfig] = useState<LandingPageConfig>(DEFAULT_CONFIG);
    const [history, setHistory] = useState<LandingPageConfig[]>([]);
    const [historyIndex, setHistoryIndex] = useState(-1);

    const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [generationStep, setGenerationStep] = useState<string>('');
    const [isPreviewMode, setIsPreviewMode] = useState(false);
    const [viewDevice, setViewDevice] = useState<'desktop' | 'mobile'>('desktop');

    // Responsive Sidebar State
    const [showLeftSidebar, setShowLeftSidebar] = useState(false);
    const [showRightSidebar, setShowRightSidebar] = useState(false);

    // Initial Load
    useEffect(() => {
        const saved = localStorage.getItem('lando_current_config');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setConfig(parsed);
                setHistory([parsed]);
                setHistoryIndex(0);
            } catch (e) {
                console.error("Failed to parse saved config", e);
            }
        } else {
            setHistory([DEFAULT_CONFIG]);
            setHistoryIndex(0);
        }
    }, []);

    // State Management Helpers
    const updateConfig = useCallback((newConfig: LandingPageConfig, addToHistory = true) => {
        setConfig(newConfig);
        localStorage.setItem('lando_current_config', JSON.stringify(newConfig));
        if (addToHistory) {
            const newHistory = history.slice(0, historyIndex + 1);
            newHistory.push(newConfig);
            if (newHistory.length > 50) newHistory.shift();
            setHistory(newHistory);
            setHistoryIndex(newHistory.length - 1);
        }
    }, [history, historyIndex]);

    const undo = () => {
        if (historyIndex > 0) {
            const prev = history[historyIndex - 1];
            setHistoryIndex(historyIndex - 1);
            setConfig(prev);
        }
    };

    const redo = () => {
        if (historyIndex < history.length - 1) {
            const next = history[historyIndex + 1];
            setHistoryIndex(historyIndex + 1);
            setConfig(next);
        }
    };

    // Section Management
    const addSection = (type: SectionType) => {
        const newId = `${type.toLowerCase()}-${Date.now()}`;
        const newSection: Section = {
            id: newId,
            type,
            isVisible: true,
            content: {
                title: `New ${type} Section`,
                subtitle: "Add a subtitle here",
                description: "Add a description here.",
                backgroundColor: "#ffffff",
                textColor: "#1e293b",
                imageUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80",
                items: type === SectionType.FEATURES ? [
                    { title: "Feature 1", description: "Details..." },
                    { title: "Feature 2", description: "Details..." }
                ] : type === SectionType.PRICING ? [
                    { plan: "Free", price: "$0", features: ["1 User"] }
                ] : []
            }
        };
        const footerIdx = config.sections.findIndex(s => s.type === SectionType.FOOTER);
        const newSections = [...config.sections];
        if (footerIdx !== -1) newSections.splice(footerIdx, 0, newSection);
        else newSections.push(newSection);

        updateConfig({ ...config, sections: newSections });
        setActiveSectionId(newId);
        // On mobile, close sidebar after adding
        setShowLeftSidebar(false);
    };

    const deleteSection = (id: string) => {
        const newSections = config.sections.filter(s => s.id !== id);
        updateConfig({ ...config, sections: newSections });
        if (activeSectionId === id) setActiveSectionId(null);
    };

    const moveSection = (index: number, direction: 'up' | 'down', e: React.MouseEvent) => {
        e.stopPropagation();
        const newSections = [...config.sections];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        if (targetIndex >= 0 && targetIndex < newSections.length) {
            [newSections[index], newSections[targetIndex]] = [newSections[targetIndex], newSections[index]];
            updateConfig({ ...config, sections: newSections });
        }
    };

    const toggleVisibility = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        const newSections = config.sections.map(s =>
            s.id === id ? { ...s, isVisible: !s.isVisible } : s
        );
        updateConfig({ ...config, sections: newSections });
    };

    // AI Generation
    const handleGenerateAI = async (niche: string) => {
        setIsGenerating(true);
        setGenerationStep('Thinking of marketing strategy...');
        try {
            const copy = await generateCopyForNiche(niche);
            setGenerationStep('Crafting compelling content...');

            let updatedSections = config.sections.map(section => {
                if (section.type === SectionType.HERO) {
                    return { ...section, content: { ...section.content, title: copy.hero.title, subtitle: copy.hero.subtitle, ctaText: copy.hero.ctaText } };
                }
                if (section.type === SectionType.FEATURES) {
                    return { ...section, content: { ...section.content, title: copy.features.title, subtitle: copy.features.subtitle, items: copy.features.items } };
                }
                if (section.type === SectionType.ABOUT) {
                    return { ...section, content: { ...section.content, title: copy.about.title, description: copy.about.description } };
                }
                return section;
            });
            updateConfig({ ...config, sections: updatedSections });

            setGenerationStep('Finding perfect images...');
            const heroImg = await getRelevantImage(niche, 'hero');
            if (heroImg) {
                updatedSections = updatedSections.map(s => s.type === SectionType.HERO ? { ...s, content: { ...s.content, imageUrl: heroImg } } : s);
                updateConfig({ ...config, sections: updatedSections });
            } else {
                const heroImgAI = await generateImage(copy.hero.visualPrompt);
                if (heroImgAI) {
                    updatedSections = updatedSections.map(s => s.type === SectionType.HERO ? { ...s, content: { ...s.content, imageUrl: heroImgAI } } : s);
                    updateConfig({ ...config, sections: updatedSections });
                }
            }

            const aboutImg = await getRelevantImage(niche, 'about');
            if (aboutImg) {
                updatedSections = updatedSections.map(s => s.type === SectionType.ABOUT ? { ...s, content: { ...s.content, imageUrl: aboutImg } } : s);
                updateConfig({ ...config, sections: updatedSections });
            }
        } catch (error) {
            console.error("AI Generation failed", error);
        } finally {
            setIsGenerating(false);
            setGenerationStep('');
        }
    };

    return (
        <div className="flex flex-col h-screen bg-[#09090b] text-white overflow-hidden font-sans">
            {/* 1. Header */}
            <header className="h-14 border-b border-white/10 flex items-center justify-between px-4 bg-[#09090b] shrink-0 z-50">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/dashboard')} className="p-2 hover:bg-white/5 rounded-lg text-slate-400 hover:text-white transition-colors">
                        <Icons.ChevronDown size={18} className="rotate-90" />
                    </button>
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-gradient-to-br from-blue-600 to-indigo-600 rounded flex items-center justify-center font-bold text-xs">L</div>
                        <span className="font-semibold text-sm tracking-tight hidden sm:inline">Nova Builder</span>
                    </div>
                </div>

                {/* View Toggles & Mobile Sidebar Toggles */}
                <div className="flex items-center gap-4">
                    <div className="flex items-center bg-[#18181b] p-1 rounded-lg border border-white/5 hidden md:flex">
                        <button
                            onClick={() => setViewDevice('desktop')}
                            className={`p-1.5 rounded transition-all ${viewDevice === 'desktop' ? 'bg-[#27272a] text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
                            title="Desktop View"
                        >
                            <Icons.Monitor size={14} />
                        </button>
                        <button
                            onClick={() => setViewDevice('mobile')}
                            className={`p-1.5 rounded transition-all ${viewDevice === 'mobile' ? 'bg-[#27272a] text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
                            title="Mobile View"
                        >
                            <Icons.Smartphone size={14} />
                        </button>
                    </div>

                    <div className="flex items-center gap-2 bg-[#18181b] p-1 rounded-lg border border-white/5 lg:hidden">
                        <button
                            onClick={() => { setShowLeftSidebar(!showLeftSidebar); setShowRightSidebar(false); }}
                            className={`p-1.5 rounded transition-all ${showLeftSidebar ? 'bg-[#27272a] text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
                        >
                            <Icons.Layers size={14} />
                        </button>
                        <button
                            onClick={() => { setShowRightSidebar(!showRightSidebar); setShowLeftSidebar(false); }}
                            className={`p-1.5 rounded transition-all ${showRightSidebar ? 'bg-[#27272a] text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
                        >
                            <Icons.Settings size={14} />
                        </button>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button onClick={() => setIsPreviewMode(!isPreviewMode)} className={`text-xs font-bold px-4 py-2 rounded-lg transition-all ${isPreviewMode ? 'bg-blue-600 text-white' : 'hover:bg-white/5 text-slate-400'}`}>
                        {isPreviewMode ? 'Edit' : 'Preview'}
                    </button>
                    <button onClick={() => alert('Saved!')} className="bg-white text-black px-4 py-2 rounded-lg text-xs font-bold hover:bg-slate-200 transition-colors">
                        Publish
                    </button>
                </div>
            </header>

            <div className={`flex-1 flex overflow-hidden relative ${viewDevice === 'mobile' ? 'bg-black/50' : ''}`}>
                {/* 2. Left Sidebar: Layers & Add */}
                {!isPreviewMode && (
                    <aside
                        className={`
                            fixed inset-y-0 left-0 z-40 w-64 bg-[#09090b] border-r border-white/10 transform transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 mt-14 lg:mt-0
                            ${showLeftSidebar ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                        `}
                    >
                        <div className="p-4 border-b border-white/10">
                            <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">Layers</h3>
                            <div className="space-y-1">
                                {config.sections.map((section, index) => (
                                    <div
                                        key={section.id}
                                        onClick={() => { setActiveSectionId(section.id); setShowLeftSidebar(false); }}
                                        className={`group flex items-center justify-between p-2 rounded-lg text-xs cursor-pointer transition-all border border-transparent ${activeSectionId === section.id ? 'bg-blue-600/10 border-blue-600/20 text-blue-400' : 'hover:bg-white/5 text-slate-400 hover:text-slate-200'
                                            }`}
                                    >
                                        <div className="flex items-center gap-2">
                                            <Icons.Layers size={14} />
                                            <span className="truncate max-w-[100px]">{section.type}</span>
                                        </div>
                                        <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={(e) => moveSection(index, 'up', e)} className="p-1 hover:text-white"><Icons.ChevronUp size={12} /></button>
                                            <button onClick={(e) => moveSection(index, 'down', e)} className="p-1 hover:text-white"><Icons.ChevronDown size={12} /></button>
                                            <button onClick={(e) => toggleVisibility(section.id, e)} className="p-1 hover:text-white">
                                                {section.isVisible ? <Icons.Eye size={12} /> : <Icons.Eye size={12} className="opacity-50" />}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="p-4">
                            <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-3">Add Section</h3>
                            <div className="grid grid-cols-2 gap-2">
                                {[SectionType.HERO, SectionType.FEATURES, SectionType.PRICING, SectionType.ABOUT, SectionType.CONTACT, SectionType.FOOTER].map(type => (
                                    <button
                                        key={type}
                                        onClick={() => addSection(type)}
                                        className="flex flex-col items-center justify-center gap-2 p-3 bg-[#18181b] hover:bg-[#27272a] border border-white/5 rounded-xl transition-all group"
                                    >
                                        <div className="bg-black/40 p-2 rounded-lg group-hover:bg-blue-600/20 group-hover:text-blue-500 transition-all">
                                            <Icons.Plus size={16} />
                                        </div>
                                        <span className="text-[10px] font-medium text-slate-400 group-hover:text-slate-200">{type}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </aside>
                )}

                {/* 3. Center Canvas */}
                <main className="flex-1 bg-[#18181b] relative overflow-hidden flex flex-col items-center justify-center p-4 lg:p-8">
                    {isGenerating && (
                        <div className="absolute top-10 left-1/2 -translate-x-1/2 z-50 bg-[#09090b] shadow-2xl rounded-xl p-6 border border-blue-500/20 flex flex-col items-center gap-4 animate-in zoom-in slide-in-from-bottom-4 duration-300">
                            <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
                            <span className="text-xs font-bold animate-pulse text-blue-400">{generationStep}</span>
                        </div>
                    )}

                    <div
                        className={`
                            transition-all duration-500 bg-white shadow-2xl overflow-y-auto custom-scrollbar
                            ${viewDevice === 'mobile'
                                ? 'w-[390px] h-[844px] rounded-3xl border-8 border-[#333]'
                                : 'w-full h-full max-w-[1920px] rounded-xl'
                            }
                        `}
                        style={{ fontFamily: config.theme.fontFamily }}
                    >
                        <div className={`${viewDevice === 'mobile' ? 'min-h-full' : 'h-full'}`}>
                            {config.sections.map((section) => (
                                <div
                                    key={section.id}
                                    className={`relative group ${!section.isVisible ? 'opacity-50 grayscale' : ''} ${activeSectionId === section.id && !isPreviewMode ? 'ring-2 ring-blue-500 ring-inset z-10' : 'hover:ring-1 hover:ring-blue-500/50 hover:z-10'}`}
                                    onClick={() => !isPreviewMode && setActiveSectionId(section.id)}
                                >
                                    <SectionRenderer
                                        section={section}
                                        theme={config.theme}
                                        isMobileView={viewDevice === 'mobile'}
                                    />

                                    {!isPreviewMode && activeSectionId === section.id && (
                                        <div className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg z-20">
                                            {section.type}
                                        </div>
                                    )}
                                </div>
                            ))}

                            {config.sections.length === 0 && (
                                <div className="h-full flex flex-col items-center justify-center text-slate-400 min-h-[300px]">
                                    <Icons.Layout size={48} className="mb-4 opacity-20" />
                                    <p className="text-sm">Start by adding a section</p>
                                </div>
                            )}
                        </div>
                    </div>
                </main>

                {/* 4. Right Sidebar: Properties */}
                {!isPreviewMode && (
                    <aside
                        className={`
                            fixed inset-y-0 right-0 z-40 w-80 bg-[#09090b] border-l border-white/10 transform transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 mt-14 lg:mt-0
                            ${showRightSidebar ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
                        `}
                    >
                        <PropertiesPanel
                            config={config}
                            updateConfig={updateConfig}
                            activeSectionId={activeSectionId}
                            onGenerateAI={handleGenerateAI}
                            isGenerating={isGenerating}
                            onDeleteSection={deleteSection}
                        />
                    </aside>
                )}

                {/* Overlay for mobile sidebars */}
                {!isPreviewMode && (showLeftSidebar || showRightSidebar) && (
                    <div
                        className="fixed inset-0 bg-black/50 z-30 lg:hidden mt-14"
                        onClick={() => { setShowLeftSidebar(false); setShowRightSidebar(false); }}
                    ></div>
                )}
            </div>
        </div>
    );
};

export default Builder;
