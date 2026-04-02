
import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

export interface SearchResult {
  title: string;
  description: string;
  url?: string;
  type: 'service' | 'mechanic' | 'general';
}

export const searchWithGrounding = async (query: string): Promise<SearchResult[]> => {
  if (!apiKey) {
    console.warn("GEMINI_API_KEY not found. Falling back to local search only.");
    return [];
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Search for automotive services or mechanics related to: "${query}". Provide a list of relevant results with titles and descriptions. Focus on real-time information and helpful details.`,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text || '';
    // Simple parsing (could be more robust)
    const lines = text.split('\n').filter(line => line.trim().length > 0);
    const results: SearchResult[] = lines.slice(0, 5).map(line => ({
      title: line.replace(/^[-*]\s*/, '').split(':')[0] || 'Result',
      description: line.split(':')[1]?.trim() || line,
      type: 'general'
    }));

    // Extract URLs if available
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (chunks && chunks.length > 0) {
      chunks.forEach((chunk: any, index: number) => {
        if (chunk.web && results[index]) {
          results[index].url = chunk.web.uri;
        }
      });
    }

    return results;
  } catch (error) {
    console.error("Search grounding error:", error);
    return [];
  }
};
