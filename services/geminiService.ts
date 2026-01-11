
import { GoogleGenAI } from "@google/genai";

// Always initialize the client with a direct reference to process.env.API_KEY as per guidelines.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const summarizeLeadData = async (leads: any[]) => {
  // Use generateContent directly from ai.models and access response text via the .text property.
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analisa data lead Umroh berikut dan berikan ringkasan singkat dalam Bahasa Indonesia mengenai tren minat jamaah: ${JSON.stringify(leads)}`,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Gagal mendapatkan ringkasan AI.";
  }
};

export const generateMarketingCopy = async (packageName: string) => {
  // Use generateContent directly from ai.models and access response text via the .text property.
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Buat 2 kalimat persuasif untuk mengajak jamaah mendaftar paket ${packageName} sekarang juga.`,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "";
  }
};
