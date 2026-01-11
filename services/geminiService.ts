
import { GoogleGenAI } from "@google/genai";

// Check if API key is available
const apiKey = import.meta.env.GEMINI_API_KEY || import.meta.env.VITE_GEMINI_API_KEY;

// Only initialize if API key is available
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const summarizeLeadData = async (leads: any[]) => {
  if (!ai) {
    console.warn("Gemini AI not initialized - API key missing");
    return "Fitur AI tidak tersedia. Silakan set GEMINI_API_KEY di environment variables.";
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash-exp',
      contents: `Analisa data lead Umroh berikut dan berikan ringkasan singkat dalam Bahasa Indonesia mengenai tren minat jamaah: ${JSON.stringify(leads)}`,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Gagal mendapatkan ringkasan AI.";
  }
};

export const generateMarketingCopy = async (packageName: string) => {
  if (!ai) {
    console.warn("Gemini AI not initialized - API key missing");
    return "";
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash-exp',
      contents: `Buat 2 kalimat persuasif untuk mengajak jamaah mendaftar paket ${packageName} sekarang juga.`,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "";
  }
};
