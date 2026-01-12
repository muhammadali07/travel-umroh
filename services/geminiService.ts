
import { GoogleGenAI } from "@google/genai";

const getAI = () => {
  const apiKey = typeof process !== 'undefined' && process.env?.API_KEY || import.meta.env?.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    console.warn('Gemini API Key not found - AI features will be disabled');
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const summarizeLeadData = async (leads: any[]) => {
  const ai = getAI();
  if (!ai) {
    return "Fitur AI tidak tersedia. Silakan setting GEMINI_API_KEY di environment variable.";
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

export const startAIChat = async () => {
  const ai = getAI();
  if (!ai) {
    return null;
  }

  try {
    const chat = ai.chats.create({
      model: 'gemini-2.0-flash-exp',
      config: {
        systemInstruction: "Anda adalah 'Asisten Mutawwif Al-Barkah'. Anda ahli dalam memberikan panduan ibadah Umroh dan Haji sesuai sunnah. Berikan jawaban yang ramah, menenangkan, dan informatif. Gunakan Bahasa Indonesia yang sopan.",
      },
    });
    return chat;
  } catch (error) {
    console.error("Chat Init Error:", error);
    return null;
  }
};
