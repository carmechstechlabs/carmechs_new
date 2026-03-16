import { GoogleGenAI } from "@google/genai";

async function generateServiceImages() {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });
  const model = "gemini-2.5-flash-image";

  const prompts = [
    { id: "ser_1", title: "Periodic Maintenance", prompt: "A high-quality, professional photo of a modern car undergoing periodic maintenance in a clean, well-lit workshop. A mechanic is checking the engine with professional tools. Cinematic lighting, 4k, realistic." },
    { id: "ser_2", title: "AC Service & Repair", prompt: "A professional close-up photo of a car's air conditioning system being serviced. A technician is using a pressure gauge and specialized tools. Focus on the AC vents and the tools. Clean, professional, realistic." },
    { id: "ser_3", title: "Denting & Painting", prompt: "A high-quality photo of a car in a professional paint booth. A technician in a protective suit is using a spray gun to paint a car door. Vibrant colors, professional environment, realistic." }
  ];

  for (const p of prompts) {
    console.log(`Generating image for: ${p.title}...`);
    try {
      const response = await ai.models.generateContent({
        model: model,
        contents: {
          parts: [{ text: p.prompt }]
        },
        config: {
          imageConfig: {
            aspectRatio: "16:9"
          }
        }
      });

      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          console.log(`IMAGE_START:${p.id}`);
          console.log(part.inlineData.data);
          console.log(`IMAGE_END:${p.id}`);
        }
      }
    } catch (error) {
      console.error(`Error generating image for ${p.title}:`, error);
    }
  }
}

generateServiceImages();
