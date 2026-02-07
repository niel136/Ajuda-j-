
import { GoogleGenAI } from "@google/genai";

// Função para obter o cliente AI de forma segura apenas quando necessário
const getAIClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn('Gemini API Key não encontrada no ambiente.');
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const analyzeRequestConfidence = async (
  title: string,
  description: string
): Promise<number> => {
  try {
    const ai = getAIClient();
    if (!ai) return 50;

    const prompt = `Analise a veracidade e clareza deste pedido de ajuda:
    Título: ${title}
    Descrição: ${description}
    
    Retorne um score de confiança de 0 a 100, onde 100 é totalmente confiável e claro, e 0 é suspeito ou confuso.
    Retorne apenas o número.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

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
    const ai = getAIClient();
    if (!ai) return rawText;

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
    console.error('Erro ao melhorar descrição com Gemini:', error);
    return rawText;
  }
};
