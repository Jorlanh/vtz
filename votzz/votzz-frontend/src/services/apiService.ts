import { api } from '../api';
import { Assembly, User, AuditLog, CommonArea, Booking, Poll, Announcement, GovernanceActivity, BlogPost, ChatMessage, VotePrivacy, AssemblyStatus, VoteType, BookingStatus } from '../types';

export const getAssemblies = async (): Promise<Assembly[]> => {
  const response = await api.get('/assemblies');
  return response.data;
};

export const createAssembly = async (data: Partial<Assembly>): Promise<Assembly> => {
  const response = await api.post('/assemblies', data);
  return response.data;
};

export const getAssemblyById = async (id: string): Promise<Assembly> => {
  const response = await api.get(`/assemblies/${id}`);
  return response.data;
};

export const registerVote = async (assemblyId: string, userId: string, option: string): Promise<any> => {
  const response = await api.post(`/assemblies/${assemblyId}/vote`, null, { params: { userId, opcao: option } });
  return response.data;
};

export const getAuditLogs = async (): Promise<AuditLog[]> => {
  const response = await api.get('/governance/audit-logs'); // Ajuste endpoint se necessário
  return response.data;
};

export const getCommonAreas = async (): Promise<CommonArea[]> => {
  const response = await api.get('/facilities/areas');
  return response.data;
};

export const getBookings = async (): Promise<Booking[]> => {
  const response = await api.get('/facilities/bookings');
  return response.data;
};

export const createBooking = async (data: any): Promise<Booking> => {
  const response = await api.post('/facilities/bookings', data);
  return response.data;
};

export const updateBookingStatus = async (id: string, status: string): Promise<Booking> => {
  const response = await api.patch(`/facilities/bookings/${id}/status`, status);
  return response.data;
};

export const getAnnouncements = async (): Promise<Announcement[]> => {
  const response = await api.get('/governance/announcements');
  return response.data;
};

export const createAnnouncement = async (data: any): Promise<Announcement> => {
  const response = await api.post('/governance/announcements', data);
  return response.data;
};

export const getPolls = async (): Promise<Poll[]> => {
  const response = await api.get('/governance/polls'); // Assuma endpoint; ajuste se necessário
  return response.data;
};

export const login = async (email: string, password?: string): Promise<User> => { // Adicione senha se auth real
  const response = await api.post('/auth/login-demo', { email }); // Atualize para auth real se JWT
  localStorage.setItem('vtz_tenant_id', response.data.tenant.id); // Armazene tenant
  return response.data;
};

// Para chat messages históricas (se persistidas)
export const getChatMessages = async (assemblyId: string): Promise<ChatMessage[]> => {
  const response = await api.get(`/chat/${assemblyId}/messages`); // Assuma endpoint; implemente no backend se necessário
  return response.data;
};