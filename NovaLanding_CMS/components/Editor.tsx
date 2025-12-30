
import React, { useState } from 'react';
import { LandingPageConfig, Section, SectionType } from '../types';
import { Icons } from './Icons';

interface EditorProps {
  config: LandingPageConfig;
  updateConfig: (newConfig: LandingPageConfig) => void;
  activeSectionId: string | null;
  setActiveSectionId: (id: string | null) => void;
  onGenerateAI: (niche: string) => void;
  isGenerating: boolean;
}

export const Editor: React.FC<EditorProps> = ({ 
  config, updateConfig, activeSectionId, setActiveSectionId, onGenerateAI, isGenerating 
}) => {
  const [niche, setNiche] = React.useState('');
  const [activeTab, setActiveTab] = useState<'sections' | 'theme' | 'seo'>('sections');

  const toggleVisibility = (id: string) => {
    const newSections = config.sections.map(s => 
      s.id === id ? { ...s, isVisible: !s.isVisible } : s
    );
    updateConfig({ ...config, sections: newSections });
  };

  const moveSection = (index: number, direction: 'up' | 'down') => {
    const newSections = [...config.sections];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex >= 0 && targetIndex < newSections.length) {
      [newSections[index], newSections[targetIndex]] = [newSections[targetIndex], newSections[index]];
      updateConfig({ ...config, sections: newSections });
    }
  };

  const removeSection = (id: string) => {
    updateConfig({ ...config, sections: config.sections.filter(s => s.id !== id) });
    if (activeSectionId === id) setActiveSectionId(null);
  };

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
  };

  const updateSectionContent = (id: string, updates: any) => {
    const newSections = config.sections.map(s => 
      s.id === id ? { ...s, content: { ...s.content, ...updates } } : s
    );
    updateConfig({ ...config, sections: newSections });
  };

  const activeSection = config.sections.find(s => s.id === activeSectionId);

  return (
    <div className="w-80 h-full bg-white border-r border-slate-200 flex flex-col overflow-hidden shadow-2xl z-20">
      <div className="p-4 border-b border-slate-100 bg-slate-50/80 backdrop-blur-sm">
        <h2 className="text-lg font-bold flex items-center gap-2 mb-4">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">L</div>
          Lando Pro
        </h2>
        
        <div className="flex bg-slate-200 p-1 rounded-lg">
          <button 
            onClick={() => { setActiveTab('sections'); setActiveSectionId(null); }}
            className={`flex-1 text-[10px] font-bold py-1.5 rounded transition-all ${activeTab === 'sections' ? 'bg-white shadow text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
          >
            SECTIONS
          </button>
          <button 
            onClick={() => { setActiveTab('theme'); setActiveSectionId(null); }}
            className={`flex-1 text-[10px] font-bold py-1.5 rounded transition-all ${activeTab === 'theme' ? 'bg-white shadow text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
          >
            THEME
          </button>
          <button 
            onClick={() => { setActiveTab('seo'); setActiveSectionId(null); }}
            className={`flex-1 text-[10px] font-bold py-1.5 rounded transition-all ${activeTab === 'seo' ? 'bg-white shadow text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
          >
            SEO
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {activeTab === 'sections' && (
          <>
            {!activeSection ? (
              <div className="p-4 animate-in fade-in duration-300">
                <div className="mb-6 p-3 bg-blue-50 border border-blue-100 rounded-xl">
                  <label className="text-[10px] font-bold text-blue-600 uppercase tracking-wider mb-2 block">AI Content Generator</label>
                  <div className="flex flex-col gap-2">
                    <input 
                      type="text" 
                      placeholder="e.g. Gym, Pet Shop, SaaS..." 
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={niche}
                      onChange={(e) => setNiche(e.target.value)}
                    />
                    <button 
                      onClick={() => onGenerateAI(niche)}
                      disabled={isGenerating || !niche}
                      className="flex items-center justify-center gap-2 bg-blue-600 text-white text-xs font-bold py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-all"
                    >
                      {isGenerating ? <div className="animate-spin h-3 w-3 border-2 border-white border-t-transparent rounded-full"></div> : <Icons.Wand2 size={14} />}
                      AI MAGIC
                    </button>
                  </div>
                </div>

                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3 block">Current Structure</label>
                <div className="space-y-2 mb-8">
                  {config.sections.map((section, index) => (
                    <div 
                      key={section.id}
                      className={`group p-3 rounded-xl border transition-all cursor-pointer ${
                        activeSectionId === section.id ? 'border-blue-500 bg-blue-50 shadow-sm' : 'border-slate-100 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                      onClick={() => setActiveSectionId(section.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Icons.Layers size={14} className="text-slate-400" />
                          <span className="text-xs font-bold text-slate-700">{section.type}</span>
                          {!section.isVisible && <span className="text-[8px] bg-slate-200 text-slate-500 px-1 py-0.5 rounded">HIDDEN</span>}
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={(e) => { e.stopPropagation(); moveSection(index, 'up'); }} className="p-1 hover:bg-white rounded shadow-sm"><Icons.ChevronUp size={12} /></button>
                          <button onClick={(e) => { e.stopPropagation(); moveSection(index, 'down'); }} className="p-1 hover:bg-white rounded shadow-sm"><Icons.ChevronDown size={12} /></button>
                          <button onClick={(e) => { e.stopPropagation(); toggleVisibility(section.id); }} className="p-1 hover:bg-white rounded shadow-sm">
                            {section.isVisible ? <Icons.Eye size={12} /> : <Icons.X size={12} />}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3 block">Add New Section</label>
                <div className="grid grid-cols-2 gap-2">
                  {[SectionType.HERO, SectionType.FEATURES, SectionType.PRICING, SectionType.ABOUT].map(type => (
                    <button 
                      key={type}
                      onClick={() => addSection(type)}
                      className="p-3 border border-dashed border-slate-300 rounded-xl text-[10px] font-bold hover:bg-slate-50 hover:border-blue-400 transition-all flex flex-col items-center gap-2"
                    >
                      <Icons.Plus size={16} className="text-blue-500" />
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-4 space-y-6 animate-in slide-in-from-right duration-300">
                <button 
                  onClick={() => setActiveSectionId(null)}
                  className="text-xs font-bold text-blue-600 flex items-center gap-2 hover:underline mb-2"
                >
                  <Icons.ChevronDown size={14} className="rotate-90" /> Back to Sections
                </button>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase mb-1 block">Title</label>
                    <input 
                      type="text"
                      value={activeSection.content.title}
                      onChange={(e) => updateSectionContent(activeSection.id, { title: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  {activeSection.content.subtitle !== undefined && (
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase mb-1 block">Subtitle</label>
                      <textarea 
                        value={activeSection.content.subtitle}
                        onChange={(e) => updateSectionContent(activeSection.id, { subtitle: e.target.value })}
                        className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg h-20"
                      />
                    </div>
                  )}

                  {activeSection.content.imageUrl !== undefined && (
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase mb-1 block">Image</label>
                      <div className="relative group rounded-lg overflow-hidden border border-slate-200 mb-2">
                        <img src={activeSection.content.imageUrl} className="w-full h-24 object-cover" />
                        <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-[10px] font-bold cursor-pointer transition-opacity">
                          CHANGE IMAGE
                          <input 
                            type="file" className="hidden" 
                            onChange={(e) => {
                              const f = e.target.files?.[0];
                              if (f) {
                                const r = new FileReader();
                                r.onload = () => updateSectionContent(activeSection.id, { imageUrl: r.result });
                                r.readAsDataURL(f);
                              }
                            }}
                          />
                        </label>
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase mb-1 block">Background Color</label>
                    <input 
                      type="color"
                      value={activeSection.content.backgroundColor}
                      onChange={(e) => updateSectionContent(activeSection.id, { backgroundColor: e.target.value })}
                      className="w-full h-8 rounded border-none p-0 overflow-hidden cursor-pointer"
                    />
                  </div>

                  <button 
                    onClick={() => removeSection(activeSection.id)}
                    className="w-full py-2 bg-red-50 text-red-600 rounded-lg text-[10px] font-bold flex items-center justify-center gap-2 hover:bg-red-100 transition-colors mt-8"
                  >
                    <Icons.Trash2 size={14} /> DELETE SECTION
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === 'theme' && (
          <div className="p-4 space-y-6 animate-in fade-in duration-300">
             <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase mb-2 block">Primary Color</label>
                <div className="flex gap-2 flex-wrap">
                  {['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'].map(c => (
                    <button 
                      key={c}
                      onClick={() => updateConfig({ ...config, theme: { ...config.theme, primaryColor: c } })}
                      className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${config.theme.primaryColor === c ? 'border-slate-900 scale-110' : 'border-transparent'}`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                  <input 
                    type="color" 
                    value={config.theme.primaryColor}
                    onChange={(e) => updateConfig({ ...config, theme: { ...config.theme, primaryColor: e.target.value } })}
                    className="w-8 h-8 rounded-full border-none p-0 overflow-hidden cursor-pointer"
                  />
                </div>
             </div>

             <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase mb-2 block">Typography</label>
                <select 
                  value={config.theme.fontFamily}
                  onChange={(e) => updateConfig({ ...config, theme: { ...config.theme, fontFamily: e.target.value } })}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
                >
                  <option value="Inter">Inter (Default)</option>
                  <option value="Plus Jakarta Sans">Plus Jakarta Sans</option>
                  <option value="Serif">Classic Serif</option>
                  <option value="Mono">Modern Mono</option>
                </select>
             </div>

             <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase mb-2 block">Border Radius</label>
                <input 
                  type="range" min="0" max="32" step="4"
                  value={parseInt(config.theme.borderRadius)}
                  onChange={(e) => updateConfig({ ...config, theme: { ...config.theme, borderRadius: `${e.target.value}px` } })}
                  className="w-full"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>Sharp</span>
                  <span>Rounded</span>
                </div>
             </div>
          </div>
        )}

        {activeTab === 'seo' && (
          <div className="p-4 space-y-6 animate-in fade-in duration-300">
             <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase mb-1 block">Meta Title</label>
                <input 
                  type="text"
                  value={config.seo.title}
                  onChange={(e) => updateConfig({ ...config, seo: { ...config.seo, title: e.target.value } })}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
                  placeholder="Appears in browser tab"
                />
             </div>
             <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase mb-1 block">Meta Description</label>
                <textarea 
                  value={config.seo.description}
                  onChange={(e) => updateConfig({ ...config, seo: { ...config.seo, description: e.target.value } })}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg h-32"
                  placeholder="Appears in search results"
                />
             </div>
             <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div className="text-blue-600 text-sm font-bold truncate mb-1">{config.seo.title || 'Landing Page Title'}</div>
                <div className="text-green-700 text-[10px] truncate mb-1">https://lando.pro/p/your-site</div>
                <div className="text-slate-500 text-[10px] line-clamp-2">{config.seo.description || 'Add a description to see how it looks in Google search results.'}</div>
             </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-slate-50 border-t border-slate-200">
        <button 
          className="w-full py-3 bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
          onClick={() => alert("Deployment in progress...\nYour site will be live at: lando.pro/draft-123")}
        >
          <Icons.Share2 size={16} /> PUBLISH SITE
        </button>
      </div>
    </div>
  );
};
