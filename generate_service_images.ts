import { GoogleGenAI } from "@google/genai";
import fs from "fs";

async function generateServiceImages() {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  
  const services = [
    { name: "periodic_maintenance", prompt: "A professional car mechanic performing periodic maintenance on a modern car engine, changing oil and filters, high quality, realistic automotive photography" },
    { name: "ac_service", prompt: "A technician servicing a car air conditioning system, showing AC gauges and cooling components, professional automotive repair setting, high quality" },
    { name: "denting_painting", prompt: "A car in a professional paint booth being spray painted by a technician in a protective suit, high-end automotive body shop, realistic lighting" }
  ];

  for (const service of services) {
    try {
      console.log(`Generating image for ${service.name}...`);
      const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: service.prompt,
        config: {
          numberOfImages: 1,
        },
      });

      if (response.generatedImages && response.generatedImages.length > 0) {
        const base64Data = response.generatedImages[0].image.imageBytes;
        fs.writeFileSync(`public/service_${service.name}.png`, base64Data, 'base64');
        console.log(`Saved public/service_${service.name}.png`);
      }
    } catch (error) {
      console.error(`Error generating image for ${service.name}:`, error);
    }
  }
}

generateServiceImages();
