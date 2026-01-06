
import React, { useState } from 'react';
import { LandingPageConfig, SectionType } from '../types';
import { Icons } from './Icons';

interface PropertiesPanelProps {
  config: LandingPageConfig;
  updateConfig: (newConfig: LandingPageConfig) => void;
  activeSectionId: string | null;
  onGenerateAI: (niche: string) => void;
  isGenerating: boolean;
  onDeleteSection: (id: string) => void; // Added explicitly
}

export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
  config, updateConfig, activeSectionId, onGenerateAI, isGenerating, onDeleteSection
}) => {
  const [niche, setNiche] = React.useState('');
  const [activeTab, setActiveTab] = useState<'design' | 'seo'>('design');

  const activeSection = config.sections.find(s => s.id === activeSectionId);

  const updateSectionContent = (id: string, updates: any) => {
    const newSections = config.sections.map(s =>
      s.id === id ? { ...s, content: { ...s.content, ...updates } } : s
    );
    updateConfig({ ...config, sections: newSections });
  };

  // Render Global Settings (when no section selected)
  if (!activeSection) {
    return (
      <div className="w-80 h-full bg-[#111] border-l border-white/10 flex flex-col text-slate-300">
        <div className="p-4 border-b border-white/10">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Icons.Settings size={14} className="text-blue-500" />
            Global Settings
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-8">
          {/* AI Magic */}
          <div className="space-y-3">
            <label className="text-[10px] uppercase tracking-wider font-bold text-slate-500 flex items-center gap-1">
              <Icons.Wand2 size={10} /> AI Generator
            </label>
            <div className="p-1 bg-white/5 rounded-xl border border-white/10 focus-within:border-blue-500/50 transition-colors">
              <div className="flex gap-2 p-1">
                <input
                  type="text"
                  placeholder="Describe your business..."
                  className="bg-transparent w-full text-xs text-white placeholder-slate-600 outline-none px-2"
                  value={niche}
                  onChange={(e) => setNiche(e.target.value)}
                />
              </div>
              <button
                onClick={() => onGenerateAI(niche)}
                disabled={isGenerating || !niche}
                className="w-full mt-1 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold py-2 rounded-lg transition-all disabled:opacity-50"
              >
                {isGenerating ? 'GENERATING...' : 'GENERATE SITE CONTENT'}
              </button>
            </div>
          </div>

          <div className="h-px bg-white/10"></div>

          {/* Tabs for Theme/SEO */}
          <div className="flex bg-black/40 p-1 rounded-lg border border-white/5">
            <button
              onClick={() => setActiveTab('design')}
              className={`flex-1 py-1.5 text-[10px] font-bold rounded-md transition-all ${activeTab === 'design' ? 'bg-white/10 text-white' : 'text-slate-500 hover:text-slate-300'}`}
            >
              DESIGN SYSTEM
            </button>
            <button
              onClick={() => setActiveTab('seo')}
              className={`flex-1 py-1.5 text-[10px] font-bold rounded-md transition-all ${activeTab === 'seo' ? 'bg-white/10 text-white' : 'text-slate-500 hover:text-slate-300'}`}
            >
              SEO
            </button>
          </div>

          {activeTab === 'design' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-2 duration-300">
              <div className="space-y-3">
                <label className="text-[10px] uppercase tracking-wider font-bold text-slate-500">Primary Color</label>
                <div className="grid grid-cols-6 gap-2">
                  {['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'].map(c => (
                    <button
                      key={c}
                      onClick={() => updateConfig({ ...config, theme: { ...config.theme, primaryColor: c } })}
                      className={`w-6 h-6 rounded-full transition-transform hover:scale-110 ${config.theme.primaryColor === c ? 'ring-2 ring-white scale-110' : ''}`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] uppercase tracking-wider font-bold text-slate-500">Typography</label>
                <select
                  value={config.theme.fontFamily}
                  onChange={(e) => updateConfig({ ...config, theme: { ...config.theme, fontFamily: e.target.value } })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-blue-500/50"
                >
                  <option value="Inter">Inter</option>
                  <option value="Plus Jakarta Sans">Plus Jakarta Sans</option>
                  <option value="Outfit">Outfit</option>
                  <option value="Cinzel">Cinzel</option>
                </select>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] uppercase tracking-wider font-bold text-slate-500">Border Radius: {parseInt(config.theme.borderRadius)}px</label>
                <input
                  type="range" min="0" max="24" step="4"
                  value={parseInt(config.theme.borderRadius)}
                  onChange={(e) => updateConfig({ ...config, theme: { ...config.theme, borderRadius: `${e.target.value}px` } })}
                  className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>
            </div>
          )}

          {activeTab === 'seo' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-2 duration-300">
              <div className="space-y-3">
                <label className="text-[10px] uppercase tracking-wider font-bold text-slate-500">Meta Title</label>
                <input
                  type="text"
                  value={config.seo.title}
                  onChange={(e) => updateConfig({ ...config, seo: { ...config.seo, title: e.target.value } })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-blue-500/50"
                  placeholder="My Awesome Site"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] uppercase tracking-wider font-bold text-slate-500">Meta Description</label>
                <textarea
                  value={config.seo.description}
                  onChange={(e) => updateConfig({ ...config, seo: { ...config.seo, description: e.target.value } })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-blue-500/50 min-h-[100px]"
                  placeholder="Describe your site for search engines..."
                />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Render Section Editing (when section selected)
  return (
    <div className="w-80 h-full bg-[#111] border-l border-white/10 flex flex-col text-slate-300">
      <div className="p-4 border-b border-white/10 flex items-center justify-between">
        <h2 className="text-sm font-bold text-white flex items-center gap-2">
          <Icons.Layers size={14} className="text-blue-500" />
          Edit {activeSection.type}
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Content Fields */}
        <div className="space-y-4">
          <div>
            <label className="text-[10px] uppercase tracking-wider font-bold text-slate-500 mb-1.5 block">Title</label>
            <input
              type="text"
              value={activeSection.content.title || ''}
              onChange={(e) => updateSectionContent(activeSection.id, { title: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-blue-500/50"
            />
          </div>

          {activeSection.content.subtitle !== undefined && (
            <div>
              <label className="text-[10px] uppercase tracking-wider font-bold text-slate-500 mb-1.5 block">Subtitle</label>
              <textarea
                value={activeSection.content.subtitle}
                onChange={(e) => updateSectionContent(activeSection.id, { subtitle: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-blue-500/50 min-h-[80px]"
              />
            </div>
          )}

          {activeSection.content.description !== undefined && (
            <div>
              <label className="text-[10px] uppercase tracking-wider font-bold text-slate-500 mb-1.5 block">Description</label>
              <textarea
                value={activeSection.content.description}
                onChange={(e) => updateSectionContent(activeSection.id, { description: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-blue-500/50 min-h-[100px]"
              />
            </div>
          )}

          {activeSection.content.ctaText !== undefined && (
            <div>
              <label className="text-[10px] uppercase tracking-wider font-bold text-slate-500 mb-1.5 block">CTA Text</label>
              <input
                type="text"
                value={activeSection.content.ctaText}
                onChange={(e) => updateSectionContent(activeSection.id, { ctaText: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-blue-500/50"
              />
            </div>
          )}

          {activeSection.content.imageUrl !== undefined && (
            <div>
              <label className="text-[10px] uppercase tracking-wider font-bold text-slate-500 mb-1.5 block">Image / Background</label>
              <div className="relative group rounded-lg overflow-hidden border border-white/10 aspect-video bg-black">
                <img src={activeSection.content.imageUrl} className="w-full h-full object-cover opacity-80" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                  <label className="cursor-pointer bg-white text-black px-3 py-1.5 rounded-full text-[10px] font-bold hover:scale-105 transition-transform">
                    Upload Image
                    <input
                      type="file" className="hidden"
                      accept="image/*"
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
            </div>
          )}
        </div>

        <div className="h-px bg-white/10"></div>

        {/* Styles */}
        <div className="space-y-4">
          <label className="text-[10px] uppercase tracking-wider font-bold text-slate-500 block">Appearance</label>

          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">Background</span>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={activeSection.content.backgroundColor || '#ffffff'}
                onChange={(e) => updateSectionContent(activeSection.id, { backgroundColor: e.target.value })}
                className="w-6 h-6 rounded border-none p-0 overflow-hidden cursor-pointer bg-transparent"
              />
              <span className="text-[10px] font-mono text-slate-500">{activeSection.content.backgroundColor}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">Text Color</span>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={activeSection.content.textColor || '#000000'}
                onChange={(e) => updateSectionContent(activeSection.id, { textColor: e.target.value })}
                className="w-6 h-6 rounded border-none p-0 overflow-hidden cursor-pointer bg-transparent"
              />
              <span className="text-[10px] font-mono text-slate-500">{activeSection.content.textColor}</span>
            </div>
          </div>
        </div>

        <div className="pt-6">
          <button
            onClick={() => onDeleteSection(activeSection.id)}
            className="w-full py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2"
          >
            <Icons.Trash2 size={14} /> Remove Section
          </button>
        </div>
      </div>
    </div>
  );
};
