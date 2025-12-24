import { api } from './api';

export const generateAssemblyDescription = async (topic: string, details: string): Promise<string> => {
  try {
    // Com Axios, a resposta do servidor está sempre em .data
    const response = await api.post('/ai/description', { topic, details });
    return response.data.text; 
  } catch (error) {
    console.error("Erro ao gerar descrição:", error);
    return "Não foi possível gerar a descrição. Tente novamente mais tarde.";
  }
};

export const generateNotificationDraft = async (assemblyTitle: string, endDate: string): Promise<string> => {
  try {
    const dateStr = new Date(endDate).toLocaleString();
    const response = await api.post('/ai/notification', { title: assemblyTitle, endDate: dateStr });
    return response.data.text;
  } catch (error) {
    console.error("Erro ao gerar notificação:", error);
    return "Erro ao gerar notificação.";
  }
};

export const analyzeSentiment = async (messages: string[]): Promise<string> => {
  if (messages.length === 0) return "Sem dados suficientes para análise.";

  try {
    const response = await api.post('/ai/sentiment', { messages });
    return response.data.text;
  } catch (error) {
    console.error("Erro ao analisar chat:", error);
    return "Não foi possível analisar o chat.";
  }
};