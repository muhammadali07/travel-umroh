
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const summarizeLeadData = async (leads: any[]) => {
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

export const startAIChat = async (history: { role: string, parts: { text: string }[] }[]) => {
  try {
    const chat = ai.chats.create({
      model: 'gemini-3-flash-preview',
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
