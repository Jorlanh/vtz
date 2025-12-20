export enum AssemblyStatus {
  AGENDADA = 'AGENDADA',
  EM_ANDAMENTO = 'EM_ANDAMENTO',
  CONCLUIDA = 'CONCLUIDA',
  CANCELADA = 'CANCELADA'
}

export enum VoteType {
  YES_NO_ABSTAIN = 'YES_NO_ABSTAIN',
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE'
}

export enum VotePrivacy {
  ANONYMOUS = 'ANONYMOUS',
  PUBLIC = 'PUBLIC'
}

export enum BookingStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'MANAGER' | 'RESIDENT' | 'ADMIN';
  tenant?: {
    id: string;
    name: string;
  };
}

export interface Assembly {
  id: string;
  titulo: string;
  descricao: string;
  dataInicio: string;
  dataFim: string;
  status: AssemblyStatus;
  tipoVoto: VoteType;
  privacidade: VotePrivacy;
}

export interface AuditLog {
  id: string;
  createdAt: string;
  acao: string;
  userId: string;
  detalhes: string;
}

export interface CommonArea {
  id: string;
  nome: string;
  capacidade: number;
}

export interface Booking {
  id: string;
  areaId: string;
  userId: string;
  data: string;
  status: BookingStatus;
}

export interface Poll {
  id: string;
  titulo: string;
  ativa: boolean;
}

export interface Announcement {
  id: string;
  titulo: string;
  conteudo: string;
  data: string;
}

export interface ChatMessage {
  id: string;
  senderName: string;
  content: string;
  timestamp: string;
}

export interface GovernanceActivity {
  id: string;
  tipo: string;
  descricao: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
}