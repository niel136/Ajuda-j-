import { GoogleGenAI } from "@google/genai";

// Ideally, this key comes from a secure backend proxy in production.
// For this demo, we assume process.env.API_KEY is available or handle the error.
const apiKey = process.env.API_KEY || '';

const ai = new GoogleGenAI({ apiKey });

export const enhanceDescription = async (
  rawText: string,
  category: string
): Promise<string> => {
  if (!apiKey) {
    console.warn("API Key missing for Gemini.");
    return rawText; // Fallback to original text
  }

  try {
    const prompt = `
      Você é um assistente social voluntário ajudando pessoas a escreverem pedidos de ajuda claros e dignos.
      Melhore o seguinte texto de um pedido de ajuda na categoria "${category}".
      O texto original é: "${rawText}".
      
      Regras:
      1. Mantenha o tom humilde, honesto e urgente.
      2. Corrija erros de português, mas mantenha a linguagem simples.
      3. Seja conciso (máximo 3 parágrafos curtos).
      4. Não invente fatos, apenas melhore a clareza do que foi dito.
      
      Retorne apenas o texto melhorado.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text.trim();
  } catch (error) {
    console.error("Error enhancing description:", error);
    return rawText;
  }
};