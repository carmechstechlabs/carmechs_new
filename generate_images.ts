import { GoogleGenAI } from "@google/genai";

async function generateServiceImages() {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  
  const prompts = [
    {
      id: 'periodic',
      text: 'A professional car mechanic performing periodic maintenance on a modern car in a clean, well-lit workshop. High-quality, realistic style, cinematic lighting.'
    },
    {
      id: 'ac',
      text: 'A car air conditioning system being professionally serviced. Focus on the AC gauges and specialized tools in a modern garage. High-quality, realistic style.'
    },
    {
      id: 'paint',
      text: 'A car undergoing professional denting and painting service in a clean spray booth. A technician is carefully working on a car panel. High-quality, realistic style.'
    }
  ];

  for (const prompt of prompts) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [{ text: prompt.text }]
        },
        config: {
          imageConfig: {
            aspectRatio: "16:9"
          }
        }
      });

      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          console.log(`IMAGE_START:${prompt.id}`);
          console.log(part.inlineData.data);
          console.log(`IMAGE_END:${prompt.id}`);
        }
      }
    } catch (error) {
      console.error(`Error generating ${prompt.id}:`, error);
    }
  }
}

generateServiceImages();
