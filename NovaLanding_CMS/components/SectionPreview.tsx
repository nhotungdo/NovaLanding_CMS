
import React from 'react';
import { Section, SectionType, ThemeConfig } from '../types';
import { Icons } from './Icons';

interface SectionPreviewProps {
  section: Section;
  theme: ThemeConfig;
  isMobileView?: boolean;
}

const Hero: React.FC<SectionPreviewProps> = ({ section, theme, isMobileView }) => (
  <section
    className={`py-20 px-6 text-center ${isMobileView ? '' : 'lg:text-left'} overflow-hidden relative`}
    style={{ backgroundColor: section.content.backgroundColor, color: section.content.textColor }}
  >
    <div className={`max-w-7xl mx-auto flex flex-col ${isMobileView ? '' : 'lg:flex-row'} items-center gap-12`}>
      <div className="flex-1 space-y-6">
        <h1 className={`text-4xl ${isMobileView ? '' : 'lg:text-6xl'} font-extrabold font-heading leading-tight`}>
          {section.content.title}
        </h1>
        <p className="text-xl opacity-80 leading-relaxed max-w-2xl">
          {section.content.subtitle}
        </p>
        <div className="pt-4">
          <button
            className="px-8 py-4 font-bold text-white shadow-lg transition-transform hover:scale-105"
            style={{ backgroundColor: theme.primaryColor, borderRadius: theme.borderRadius }}
          >
            {section.content.ctaText}
          </button>
        </div>
      </div>
      <div className="flex-1 w-full max-w-xl">
        <img
          src={section.content.imageUrl}
          alt="Hero"
          className="shadow-2xl w-full h-[450px] object-cover"
          style={{ borderRadius: theme.borderRadius }}
        />
      </div>
    </div>
  </section>
);

const Features: React.FC<SectionPreviewProps> = ({ section, theme, isMobileView }) => (
  <section className="py-20 px-6" style={{ backgroundColor: section.content.backgroundColor }}>
    <div className="max-w-7xl mx-auto text-center space-y-4 mb-16">
      <h2 className={`text-3xl ${isMobileView ? '' : 'lg:text-4xl'} font-bold font-heading`}>{section.content.title}</h2>
      <p className="text-slate-600 max-w-2xl mx-auto">{section.content.subtitle}</p>
    </div>
    <div className={`max-w-7xl mx-auto grid grid-cols-1 ${isMobileView ? '' : 'md:grid-cols-3'} gap-8`}>
      {section.content.items?.map((item, idx) => (
        <div key={idx} className="p-8 bg-white shadow-sm border border-slate-100 hover:shadow-md transition-shadow" style={{ borderRadius: theme.borderRadius }}>
          <div
            className="w-12 h-12 flex items-center justify-center mb-6 text-white"
            style={{ backgroundColor: theme.primaryColor, borderRadius: '8px' }}
          >
            <Icons.Zap size={24} />
          </div>
          <h3 className="text-xl font-bold mb-3">{item.title}</h3>
          <p className="text-slate-600 leading-relaxed">{item.description}</p>
        </div>
      ))}
    </div>
  </section>
);

const Pricing: React.FC<SectionPreviewProps> = ({ section, theme, isMobileView }) => (
  <section className="py-20 px-6" style={{ backgroundColor: section.content.backgroundColor }}>
    <div className="max-w-7xl mx-auto text-center mb-16">
      <h2 className={`text-3xl ${isMobileView ? '' : 'lg:text-4xl'} font-bold font-heading`}>{section.content.title}</h2>
      <p className="text-slate-600 mt-4">{section.content.subtitle}</p>
    </div>
    <div className={`max-w-7xl mx-auto grid grid-cols-1 ${isMobileView ? '' : 'md:grid-cols-3'} gap-8`}>
      {section.content.items?.map((item, idx) => (
        <div key={idx} className={`p-8 border relative transition-all ${item.isPopular ? 'border-2 shadow-xl ring-2' : 'border-slate-100'}`}
          style={{
            borderRadius: theme.borderRadius,
            borderColor: item.isPopular ? theme.primaryColor : undefined,
            backgroundColor: '#fff'
          }}>
          {item.isPopular && (
            <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest" style={{ backgroundColor: theme.primaryColor }}>
              Most Popular
            </span>
          )}
          <h3 className="text-xl font-bold mb-2">{item.plan}</h3>
          <div className="text-4xl font-bold mb-6">{item.price}<span className="text-base font-normal text-slate-400">/mo</span></div>
          <ul className="space-y-4 mb-8">
            {item.features?.map((f: string, i: number) => (
              <li key={i} className="flex items-center gap-3 text-slate-600 text-sm">
                <Icons.Check size={16} className="text-green-500" /> {f}
              </li>
            ))}
          </ul>
          <button className="w-full py-3 font-bold transition-all border-2"
            style={{
              borderRadius: theme.borderRadius,
              backgroundColor: item.isPopular ? theme.primaryColor : 'transparent',
              color: item.isPopular ? '#fff' : theme.primaryColor,
              borderColor: theme.primaryColor
            }}>
            Get Started
          </button>
        </div>
      ))}
    </div>
  </section>
);

const About: React.FC<SectionPreviewProps> = ({ section, theme, isMobileView }) => (
  <section className="py-20 px-6" style={{ backgroundColor: section.content.backgroundColor }}>
    <div className={`max-w-7xl mx-auto flex flex-col ${isMobileView ? '' : 'md:flex-row'} items-center gap-16`}>
      <div className={`flex-1 ${isMobileView ? 'order-2' : 'order-2 md:order-1'}`}>
        <img
          src={section.content.imageUrl}
          alt="About"
          className="shadow-xl w-full h-[400px] object-cover"
          style={{ borderRadius: theme.borderRadius }}
        />
      </div>
      <div className={`flex-1 space-y-6 ${isMobileView ? 'order-1' : 'order-1 md:order-2'}`}>
        <h2 className={`text-3xl ${isMobileView ? '' : 'lg:text-4xl'} font-bold font-heading`}>{section.content.title}</h2>
        <p className="text-lg text-slate-600 leading-relaxed">
          {section.content.description}
        </p>
      </div>
    </div>
  </section>
);

const Footer: React.FC<SectionPreviewProps> = ({ section, isMobileView }) => (
  <footer className="py-12 px-6" style={{ backgroundColor: section.content.backgroundColor, color: section.content.textColor }}>
    <div className={`max-w-7xl mx-auto flex flex-col ${isMobileView ? '' : 'md:flex-row'} justify-between items-center gap-8 text-center ${isMobileView ? '' : 'md:text-left'}`}>
      <div>
        <h3 className="text-2xl font-bold mb-2">{section.content.title}</h3>
        <p className="opacity-70">{section.content.description}</p>
      </div>
      <div className="flex gap-6">
        <a href="#" className="hover:opacity-80 transition-opacity">Privacy Policy</a>
        <a href="#" className="hover:opacity-80 transition-opacity">Terms of Service</a>
      </div>
    </div>
  </footer>
);

export const SectionRenderer: React.FC<SectionPreviewProps> = (props) => {
  switch (props.section.type) {
    case SectionType.HERO: return <Hero {...props} />;
    case SectionType.FEATURES: return <Features {...props} />;
    case SectionType.PRICING: return <Pricing {...props} />;
    case SectionType.ABOUT: return <About {...props} />;
    case SectionType.FOOTER: return <Footer {...props} />;
    default: return null;
  }
};
