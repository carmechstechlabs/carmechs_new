import { GoogleGenAI } from "@google/genai";

async function generateServiceImage() {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        {
          text: 'A professional, high-quality photo for a "Periodic Maintenance" car service. It depicts a skilled mechanic working on a modern car engine in a clean, high-tech workshop. The lighting is cinematic, with dramatic highlights on the engine components and the mechanic\'s tools. High detail, 4k resolution, professional automotive photography style.',
        },
      ],
    },
    config: {
      imageConfig: {
        aspectRatio: "16:9",
        imageSize: "1K"
      },
    },
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      console.log("IMAGE_DATA:" + part.inlineData.data);
    }
  }
}

generateServiceImage();
