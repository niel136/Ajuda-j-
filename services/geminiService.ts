
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeRequestConfidence = async (
  title: string,
  description: string
): Promise<number> => {
  try {
    const prompt = `Analise a veracidade e clareza deste pedido de ajuda:
    Título: ${title}
    Descrição: ${description}
    
    Retorne um score de confiança de 0 a 100, onde 100 é totalmente confiável e claro, e 0 é suspeito ou confuso.
    Retorne apenas o número.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    const score = parseInt(response.text?.replace(/\D/g, '') || "50");
    return isNaN(score) ? 50 : score;
  } catch (error) {
    return 50; // Fallback seguro
  }
};

export const enhanceDescription = async (
  rawText: string,
  category: string
): Promise<string> => {
  try {
    const prompt = `
      Melhore o seguinte texto de um pedido de ajuda na categoria "${category}".
      Texto: "${rawText}".
      Mantenha humilde e digno. Máximo 3 parágrafos.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || rawText;
  } catch (error) {
    return rawText;
  }
};
