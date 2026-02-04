
import { GoogleGenAI } from "@google/genai";

export const enhanceDescription = async (
  rawText: string,
  category: string
): Promise<string> => {
  try {
    // Initializing with named parameter and process.env.API_KEY
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
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

    // Using gemini-3-flash-preview for proofreading/text enhancement task
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ parts: [{ text: prompt }] }],
    });

    // Directly access the .text property
    return response.text || rawText;
  } catch (error) {
    console.error("Error enhancing description:", error);
    return rawText;
  }
};
