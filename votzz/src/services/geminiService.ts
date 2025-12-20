import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateAssemblyDescription = async (topic: string, details: string): Promise<string> => {
  if (!process.env.API_KEY) return "API Key não configurada. Descrição padrão gerada.";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Atue como um gestor condominial profissional. Crie uma descrição formal e detalhada para uma pauta de assembleia com o tema: "${topic}".
      Detalhes adicionais fornecidos: "${details}".
      
      A descrição deve ser clara, imparcial e conter:
      1. Contextualização do problema ou tema.
      2. Justificativa para a votação.
      3. Implicações da decisão.
      
      Mantenha um tom sério e jurídico adequado para condomínios e associações.`,
    });

    return response.text || "";
  } catch (error) {
    console.error("Erro ao gerar descrição com IA:", error);
    return "Não foi possível gerar a descrição com IA no momento.";
  }
};

export const generateNotificationDraft = async (assemblyTitle: string, endDate: string): Promise<string> => {
  if (!process.env.API_KEY) return "Notificação padrão.";
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Escreva um rascunho de notificação (email/whatsapp) para convocar moradores para a assembleia "${assemblyTitle}". 
      A votação encerra em: ${new Date(endDate).toLocaleString()}.
      
      Inclua chamadas para ação (CTA) para votar na plataforma e lembrete sobre a importância do quórum.`,
    });
    return response.text || "";
  } catch (error) {
    console.error("Error generating notification:", error);
    return "Erro ao gerar notificação.";
  }
};

export const analyzeSentiment = async (messages: string[]): Promise<string> => {
   if (!process.env.API_KEY || messages.length === 0) return "Sem dados suficientes para análise.";

   try {
     const textBlock = messages.join("\n");
     const response = await ai.models.generateContent({
       model: 'gemini-2.5-flash',
       contents: `Analise as seguintes mensagens do chat da assembleia e forneça um resumo executivo das principais preocupações e o sentimento geral (Positivo, Negativo, Neutro). Não invente opiniões, baseie-se apenas no texto abaixo:\n\n${textBlock}`,
     });
     return response.text || "";
   } catch (error) {
     return "Não foi possível analisar o chat.";
   }
}