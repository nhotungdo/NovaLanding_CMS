
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateCopyForNiche = async (niche: string) => {
  const prompt = `Generate landing page copy for a business in the niche: "${niche}". 
  Provide copy for a Hero section (title, subtitle, cta), a Features section (title, subtitle, 3 features with title and description), and an About section.
  For the Hero and About sections, also provide a "visualPrompt" which is a highly descriptive prompt for an AI image generator to create a professional, high-quality background or feature image for that section.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          hero: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              subtitle: { type: Type.STRING },
              ctaText: { type: Type.STRING },
              visualPrompt: { type: Type.STRING, description: "Prompt for image generation" }
            },
            required: ["title", "subtitle", "ctaText", "visualPrompt"]
          },
          features: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              subtitle: { type: Type.STRING },
              items: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    description: { type: Type.STRING }
                  },
                  required: ["title", "description"]
                }
              }
            },
            required: ["title", "subtitle", "items"]
          },
          about: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              visualPrompt: { type: Type.STRING, description: "Prompt for image generation" }
            },
            required: ["title", "description", "visualPrompt"]
          }
        },
        required: ["hero", "features", "about"]
      }
    }
  });

  return JSON.parse(response.text);
};

export const generateImage = async (prompt: string): Promise<string | null> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: `Professional website photography: ${prompt}. High resolution, 4k, clean composition, commercial style.` }],
      },
      config: {
        imageConfig: {
          aspectRatio: "16:9"
        }
      }
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Image generation failed:", error);
    return null;
  }
};
