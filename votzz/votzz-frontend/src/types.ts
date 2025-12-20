// src/types.ts

export enum UserRole {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  USER = 'USER'
}

export interface User {
  id: string;
  nome: string;           // campo real do backend
  email: string;
  cpf: string;
  unidade?: string;
  role: UserRole;
  phone?: string;
  tenant?: {
    id: string;
  };
}

export enum AssemblyStatus {
  AGENDADA = 'AGENDADA',
  ABERTA = 'ABERTA',
  ENCERRADA = 'ENCERRADA'
}

export interface Assembly {
  id: string;
  titulo: string;
  descricao: string;
  dataInicio: string;
  dataFim: string;
  status: AssemblyStatus;
  linkVideoConferencia?: string;
  votes?: Vote[];
  chat?: ChatMessage[];
}

export interface Vote {
  id: string;
  opcaoEscolhida: string;
  dataVoto: string;
  auditHash: string;
}

export interface ChatMessage {
  id: string;
  userName: string;
  content: string;
  timestamp: string;
}

export interface AuditLog {
  id: string;
  acao: string;
  detalhes: string;
  createdAt: string;
}

export interface CommonArea {
  id: string;
  name: string;
  type: string;
  capacity: number;
  description: string;
  rules: string;
  imageUrl?: string;
  price: number;
  requiresApproval: boolean;
  openTime: string;
  closeTime: string;
}

export interface Booking {
  id: string;
  areaId: string;
  unit: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  status: string;
  totalPrice: number;
  createdAt: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  priority?: string;
}