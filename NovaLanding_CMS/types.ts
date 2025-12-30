
export enum SectionType {
  HERO = 'HERO',
  FEATURES = 'FEATURES',
  ABOUT = 'ABOUT',
  PRICING = 'PRICING',
  TESTIMONIALS = 'TESTIMONIALS',
  CONTACT = 'CONTACT',
  FOOTER = 'FOOTER'
}

export interface PricingItem {
  plan: string;
  price: string;
  features: string[];
  isPopular?: boolean;
}

export interface TestimonialItem {
  name: string;
  role: string;
  content: string;
  avatar?: string;
}

export interface SectionContent {
  title?: string;
  subtitle?: string;
  description?: string;
  ctaText?: string;
  ctaLink?: string;
  imageUrl?: string;
  items?: any[]; 
  backgroundColor?: string;
  textColor?: string;
}

export interface Section {
  id: string;
  type: SectionType;
  isVisible: boolean;
  content: SectionContent;
}

export interface ThemeConfig {
  primaryColor: string;
  fontFamily: string;
  borderRadius: string;
  mode: 'light' | 'dark';
}

export interface SEOConfig {
  title: string;
  description: string;
  keywords: string;
}

export interface LandingPageConfig {
  id: string;
  title: string;
  theme: ThemeConfig;
  seo: SEOConfig;
  sections: Section[];
}
