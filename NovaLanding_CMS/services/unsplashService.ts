// Service để lấy ảnh từ Unsplash API
const UNSPLASH_ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY || 'YOUR_UNSPLASH_ACCESS_KEY';
const UNSPLASH_API_URL = 'https://api.unsplash.com';

export interface UnsplashImage {
  id: string;
  urls: {
    raw: string;
    full: string;
    regular: string;
    small: string;
    thumb: string;
  };
  alt_description: string;
  user: {
    name: string;
    username: string;
  };
}

export const searchImages = async (query: string, count: number = 1): Promise<string | null> => {
  try {
    const response = await fetch(
      `${UNSPLASH_API_URL}/search/photos?query=${encodeURIComponent(query)}&per_page=${count}&orientation=landscape`,
      {
        headers: {
          'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`
        }
      }
    );

    if (!response.ok) {
      console.error('Unsplash API error:', response.status);
      return null;
    }

    const data = await response.json();
    
    if (data.results && data.results.length > 0) {
      // Lấy ảnh đầu tiên với chất lượng regular
      return data.results[0].urls.regular;
    }
    
    return null;
  } catch (error) {
    console.error('Failed to fetch image from Unsplash:', error);
    return null;
  }
};

// Hàm tạo query tìm kiếm thông minh từ niche và section type
export const generateSearchQuery = (niche: string, sectionType: 'hero' | 'about' | 'features'): string => {
  const nicheKeywords = niche.toLowerCase();
  
  switch (sectionType) {
    case 'hero':
      return `${nicheKeywords} business professional`;
    case 'about':
      return `${nicheKeywords} team workspace`;
    case 'features':
      return `${nicheKeywords} technology modern`;
    default:
      return nicheKeywords;
  }
};
