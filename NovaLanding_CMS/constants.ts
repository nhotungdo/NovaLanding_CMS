
import { SectionType, LandingPageConfig } from './types';

export const DEFAULT_CONFIG: LandingPageConfig = {
  id: 'landing-1',
  title: "Lando Pro Page",
  theme: {
    primaryColor: "#3b82f6",
    fontFamily: "Inter",
    borderRadius: "12px",
    mode: 'light'
  },
  seo: {
    title: "My Awesome Landing Page",
    description: "Built with Lando No-Code Builder",
    keywords: "landing page, no-code, builder"
  },
  sections: [
    {
      id: 'hero-1',
      type: SectionType.HERO,
      isVisible: true,
      content: {
        title: "Build your dream landing page in minutes",
        subtitle: "No coding required. Just drag, drop, and launch your business today with our intuitive AI-powered builder.",
        ctaText: "Get Started Now",
        imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
        backgroundColor: "#ffffff",
        textColor: "#1e293b"
      }
    },
    {
      id: 'features-1',
      type: SectionType.FEATURES,
      isVisible: true,
      content: {
        title: "Why Choose Lando?",
        subtitle: "Everything you need to succeed online.",
        items: [
          { title: "Fast Performance", description: "Blazing fast loading speeds for your visitors.", icon: "Zap" },
          { title: "SEO Optimized", description: "Get found on Google with built-in SEO features.", icon: "Search" },
          { title: "Fully Responsive", description: "Looks great on mobile, tablet, and desktop.", icon: "Smartphone" }
        ],
        backgroundColor: "#f8fafc"
      }
    },
    {
      id: 'pricing-1',
      type: SectionType.PRICING,
      isVisible: true,
      content: {
        title: "Simple, Transparent Pricing",
        subtitle: "Choose the plan that's right for you.",
        items: [
          { plan: "Starter", price: "$0", features: ["1 Page", "Basic SEO", "Lando Branding"], isPopular: false },
          { plan: "Pro", price: "$29", features: ["Unlimited Pages", "Custom Domain", "AI Assistant"], isPopular: true },
          { plan: "Enterprise", price: "$99", features: ["Team Collaboration", "Advanced Analytics", "24/7 Support"], isPopular: false }
        ],
        backgroundColor: "#ffffff"
      }
    },
    {
      id: 'footer-1',
      type: SectionType.FOOTER,
      isVisible: true,
      content: {
        title: "Lando Builder",
        description: "© 2024 Lando. All rights reserved.",
        backgroundColor: "#0f172a",
        textColor: "#ffffff"
      }
    }
  ]
};
