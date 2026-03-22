import { GoogleGenAI } from "@google/genai";
import fs from "fs";

async function generate() {
  const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
  if (!apiKey) {
    console.error("GEMINI_API_KEY not found");
    return;
  }
  const ai = new GoogleGenAI({ apiKey });
  const model = "gemini-2.5-flash-image";

  const prompts = [
    { id: "periodic", prompt: "A professional car mechanic working on a car engine in a clean workshop, realistic, high quality" },
    { id: "ac", prompt: "Automotive AC gauges and tools connected to a car engine, focus on the gauges, realistic, high quality" },
    { id: "painting", prompt: "A luxury car in a professional paint booth being painted, realistic, high quality" }
  ];

  for (const p of prompts) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: { parts: [{ text: p.prompt }] }
      });
      if (response.candidates && response.candidates[0].content.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
            fs.writeFileSync(`${p.id}.png`, Buffer.from(part.inlineData.data, 'base64'));
            console.log(`Generated ${p.id}.png`);
          }
        }
      }
    } catch (e) {
      console.error(`Error generating ${p.id}:`, e);
    }
  }
}

generate();
