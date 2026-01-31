import { GoogleGenAI } from "@google/genai";

export const enhanceDescription = async (
  rawText: string,
  category: string
): Promise<string> => {
  try {
    // Initialize GoogleGenAI inside the function to use the most current API key from process.env.API_KEY
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

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    // Access the .text property directly from the response object
    return response.text || rawText;
  } catch (error) {
    console.error("Error enhancing description:", error);
    return rawText;
  }
};