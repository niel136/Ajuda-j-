
import { GoogleGenAI } from "@google/genai";

// Removed global helper to follow the guideline of instantiating GoogleGenAI 
// right before making an API call to ensure use of the most up-to-date configuration.

export const analyzeRequestConfidence = async (
  title: string,
  description: string
): Promise<number> => {
  try {
    // Correct initialization as per @google/genai guidelines
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const prompt = `Analise a veracidade e clareza deste pedido de ajuda:
    Título: ${title}
    Descrição: ${description}
    
    Retorne um score de confiança de 0 a 100, onde 100 é totalmente confiável e claro, e 0 é suspeito ou confuso.
    Retorne apenas o número.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    // Access .text property directly (not a method) from GenerateContentResponse
    const scoreStr = response.text?.replace(/\D/g, '') || "50";
    const score = parseInt(scoreStr);
    return isNaN(score) ? 50 : score;
  } catch (error) {
    console.error('Erro ao analisar confiança com Gemini:', error);
    return 50; 
  }
};

export const enhanceDescription = async (
  rawText: string,
  category: string
): Promise<string> => {
  try {
    // Correct initialization as per @google/genai guidelines
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const prompt = `
      Melhore o seguinte texto de um pedido de ajuda na categoria "${category}".
      Texto: "${rawText}".
      Mantenha humilde e digno. Máximo 3 parágrafos.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    // Access .text property directly (not a method) from GenerateContentResponse
    return response.text || rawText;
  } catch (error) {
    console.error('Erro ao melhorar descrição com Gemini:', error);
    return rawText;
  }
};
