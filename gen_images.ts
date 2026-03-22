import { GoogleGenAI } from "@google/genai";
import fs from 'fs';

async function generateImages() {
  const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY || "AIzaSyCUKGYOKezxSM9L8HwTmqJDtbLp4LIzQcY";
  if (!apiKey) {
    console.error("API key not found");
    return;
  }

  const ai = new GoogleGenAI({ apiKey });
  const prompts = [
    { id: "ser_1", prompt: "A professional mechanic working on a high-end car engine in a clean, modern workshop, cinematic lighting, high detail" },
    { id: "ser_2", prompt: "Professional car AC service gauges and tools connected to a car's air conditioning system, close-up, technical, modern workshop" },
    { id: "ser_7", prompt: "A luxury car inside a professional automotive spray paint booth, with specialized lighting and ventilation, high-end finish" }
  ];

  for (const item of prompts) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [{ text: item.prompt }],
        },
        config: {
          imageConfig: {
            aspectRatio: "1:1",
            imageSize: "1K"
          }
        }
      });

      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          const base64 = part.inlineData.data;
          console.log(`---START_${item.id}---`);
          console.log(base64);
          console.log(`---END_${item.id}---`);
        }
      }
    } catch (error) {
      console.error(`Error generating image for ${item.id}:`, error);
    }
  }
}

generateImages();
