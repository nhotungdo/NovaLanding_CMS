
import React, { useState, useEffect, useCallback } from 'react';
import { LandingPageConfig, SectionType } from './types';
import { DEFAULT_CONFIG } from './constants';
import { Editor } from './components/Editor';
import { SectionRenderer } from './components/SectionPreview';
import { Icons } from './components/Icons';
import { generateCopyForNiche, generateImage, getRelevantImage } from './services/geminiService';

const App: React.FC = () => {
  const [config, setConfig] = useState<LandingPageConfig>(DEFAULT_CONFIG);
  const [history, setHistory] = useState<LandingPageConfig[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState<string>('');
  const [viewDevice, setViewDevice] = useState<'desktop' | 'mobile'>('desktop');

  // Load from LocalStorage
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

  const updateConfig = useCallback((newConfig: LandingPageConfig, addToHistory = true) => {
    setConfig(newConfig);
    localStorage.setItem('lando_current_config', JSON.stringify(newConfig));
    
    if (addToHistory) {
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(newConfig);
      // Limit history to 50 steps
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

  const handleGenerateAI = async (niche: string) => {
    setIsGenerating(true);
    setGenerationStep('Thinking of marketing strategy...');
    try {
      const copy = await generateCopyForNiche(niche);
      
      setGenerationStep('Crafting compelling content...');
      let updatedSections = config.sections.map(section => {
        if (section.type === SectionType.HERO) {
          return {
            ...section,
            content: { ...section.content, title: copy.hero.title, subtitle: copy.hero.subtitle, ctaText: copy.hero.ctaText }
          };
        }
        if (section.type === SectionType.FEATURES) {
          return {
            ...section,
            content: { ...section.content, title: copy.features.title, subtitle: copy.features.subtitle, items: copy.features.items }
          };
        }
        if (section.type === SectionType.ABOUT) {
          return {
            ...section,
            content: { ...section.content, title: copy.about.title, description: copy.about.description }
          };
        }
        return section;
      });
      
      updateConfig({ ...config, sections: updatedSections });

      setGenerationStep('Finding perfect images for your brand...');
      
      // Thử lấy ảnh từ Unsplash trước (nhanh hơn và chất lượng cao)
      const heroImg = await getRelevantImage(niche, 'hero');
      if (heroImg) {
        updatedSections = updatedSections.map(s => 
          s.type === SectionType.HERO ? { ...s, content: { ...s.content, imageUrl: heroImg } } : s
        );
        updateConfig({ ...config, sections: updatedSections });
      } else {
        // Fallback: Generate ảnh bằng AI nếu Unsplash không có
        const heroImgAI = await generateImage(copy.hero.visualPrompt);
        if (heroImgAI) {
          updatedSections = updatedSections.map(s => 
            s.type === SectionType.HERO ? { ...s, content: { ...s.content, imageUrl: heroImgAI } } : s
          );
          updateConfig({ ...config, sections: updatedSections });
        }
      }

      const aboutImg = await getRelevantImage(niche, 'about');
      if (aboutImg) {
        updatedSections = updatedSections.map(s => 
          s.type === SectionType.ABOUT ? { ...s, content: { ...s.content, imageUrl: aboutImg } } : s
        );
        updateConfig({ ...config, sections: updatedSections });
      } else {
        // Fallback: Generate ảnh bằng AI nếu Unsplash không có
        const aboutImgAI = await generateImage(copy.about.visualPrompt);
        if (aboutImgAI) {
          updatedSections = updatedSections.map(s => 
            s.type === SectionType.ABOUT ? { ...s, content: { ...s.content, imageUrl: aboutImgAI } } : s
          );
          updateConfig({ ...config, sections: updatedSections });
        }
      }

    } catch (error) {
      console.error("AI Generation failed", error);
    } finally {
      setIsGenerating(false);
      setGenerationStep('');
    }
  };

  return (
    <div className="flex h-screen bg-[#f1f5f9] overflow-hidden" style={{ fontFamily: config.theme.fontFamily }}>
      {/* Sidebar Editor */}
      {!isPreviewMode && (
        <Editor 
          config={config} 
          updateConfig={updateConfig} 
          activeSectionId={activeSectionId} 
          setActiveSectionId={setActiveSectionId}
          onGenerateAI={handleGenerateAI}
          isGenerating={isGenerating}
        />
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full relative">
        {/* Topbar Controls */}
        <div className="h-14 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsPreviewMode(!isPreviewMode)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                isPreviewMode ? 'bg-blue-600 text-white shadow-lg' : 'bg-white border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {isPreviewMode ? <Icons.Layout size={14} /> : <Icons.Eye size={14} />}
              {isPreviewMode ? 'BUILDER' : 'PREVIEW'}
            </button>
            <div className="h-4 w-[1px] bg-slate-200 mx-1"></div>
            
            <div className="flex items-center gap-1">
              <button 
                disabled={historyIndex <= 0}
                onClick={undo}
                className="p-1.5 text-slate-500 hover:bg-slate-100 rounded disabled:opacity-30" title="Undo"
              >
                <Icons.ChevronDown size={18} className="rotate-90" />
              </button>
              <button 
                disabled={historyIndex >= history.length - 1}
                onClick={redo}
                className="p-1.5 text-slate-500 hover:bg-slate-100 rounded disabled:opacity-30" title="Redo"
              >
                <Icons.ChevronDown size={18} className="-rotate-90" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center bg-slate-100 p-1 rounded-lg">
              <button 
                onClick={() => setViewDevice('desktop')}
                className={`p-1.5 rounded transition-all ${viewDevice === 'desktop' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500'}`}
              >
                <Icons.Monitor size={16} />
              </button>
              <button 
                onClick={() => setViewDevice('mobile')}
                className={`p-1.5 rounded transition-all ${viewDevice === 'mobile' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500'}`}
              >
                <Icons.Smartphone size={16} />
              </button>
            </div>
            <button className="flex items-center gap-2 bg-slate-900 text-white px-4 py-1.5 rounded-lg text-xs font-bold shadow-md hover:bg-slate-800 transition-all">
              <Icons.Save size={14} />
              SAVE
            </button>
          </div>
        </div>

        {/* Live Canvas Area */}
        <div className={`flex-1 overflow-auto bg-[#e2e8f0] p-4 lg:p-10 flex justify-center transition-all`}>
          {isGenerating && (
             <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-white shadow-2xl rounded-2xl p-6 border border-blue-100 flex flex-col items-center gap-4 min-w-[300px] animate-in zoom-in duration-300">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Icons.Wand2 size={24} className="text-blue-600" />
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-bold text-slate-800 uppercase tracking-widest">{generationStep}</div>
                  <div className="text-[10px] text-slate-400 mt-1 italic">Our AI is building your business presence...</div>
                </div>
             </div>
          )}

          <div 
            className={`bg-white shadow-2xl transition-all duration-500 origin-top ease-out ${
              viewDevice === 'mobile' ? 'w-[375px] rounded-[3rem] ring-[12px] ring-slate-900 h-[812px] overflow-y-auto' : 'w-full max-w-6xl h-fit rounded-xl min-h-full'
            }`}
          >
            <div className="w-full relative">
              {config.sections.map((section) => (
                <div 
                  key={section.id} 
                  className={`group relative ${!section.isVisible ? 'opacity-30 blur-[1px]' : ''} ${
                    !isPreviewMode && activeSectionId === section.id ? 'ring-4 ring-blue-500 ring-inset' : ''
                  }`}
                >
                  <SectionRenderer section={section} theme={config.theme} />
                  
                  {/* Overlay controls for Builder Mode */}
                  {!isPreviewMode && (
                    <div 
                      className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer flex items-center justify-center ${activeSectionId === section.id ? 'bg-blue-500/5' : 'hover:bg-slate-900/5'}`}
                      onClick={() => setActiveSectionId(section.id)}
                    >
                       <div className="absolute top-4 right-4 flex gap-2">
                         <div className="bg-white shadow-lg px-3 py-1 rounded-full text-[10px] font-bold text-slate-500 border border-slate-100 flex items-center gap-2">
                            <Icons.Layers size={12} /> {section.type}
                         </div>
                       </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
