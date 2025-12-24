import { api } from './api'; // 1. Correção da importação (chaves adicionadas)

export const generateAssemblyDescription = async (topic: string, details: string): Promise<string> => {
  try {
    const response = await api.post('/ai/description', { topic, details });
    // 2. Correção: O api.ts retorna o JSON direto, então acessamos .text diretamente (sem .data)
    return response.text; 
  } catch (error) {
    console.error("Erro ao gerar descrição:", error);
    return "Não foi possível gerar a descrição. Tente novamente mais tarde.";
  }
};

export const generateNotificationDraft = async (assemblyTitle: string, endDate: string): Promise<string> => {
  try {
    const dateStr = new Date(endDate).toLocaleString();
    const response = await api.post('/ai/notification', { title: assemblyTitle, endDate: dateStr });
    return response.text; // Acesso direto
  } catch (error) {
    console.error("Erro ao gerar notificação:", error);
    return "Erro ao gerar notificação.";
  }
};

export const analyzeSentiment = async (messages: string[]): Promise<string> => {
   if (messages.length === 0) return "Sem dados suficientes para análise.";

   try {
     const response = await api.post('/ai/sentiment', { messages });
     return response.text; // Acesso direto
   } catch (error) {
     console.error("Erro ao analisar chat:", error);
     return "Não foi possível analisar o chat.";
   }
};