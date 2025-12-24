// --- ENUMS & TYPES BÁSICOS ---
export enum UserRole {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER', // Síndico
  RESIDENT = 'RESIDENT' // Condômino
}

export enum AssemblyStatus {
  DRAFT = 'DRAFT',
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
  SCHEDULED = 'SCHEDULED'
}

export enum VoteType {
  YES_NO_ABSTAIN = 'YES_NO_ABSTAIN',
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE'
}

export enum VotePrivacy {
  OPEN = 'OPEN',
  SECRET = 'SECRET'
}

// --- USUÁRIO ---
export interface User {
  id: string;          // UUID
  nome: string;        // Backend: 'nome'
  email: string;
  cpf?: string;
  unidade: string;     // Backend: 'unidade'
  role: UserRole;
  phone?: string;
  fraction?: number;
  tenantId?: string;
}

// --- ASSEMBLEIAS E VOTAÇÃO (MODULO ASSEMBLEIA) ---
export interface VoteOption {
  id: string;
  descricao: string;   // Backend usa 'descricao'
  label?: string;      // Alias para compatibilidade de frontend
  assemblyId?: string;
}

export interface Vote {
  id: string;
  userId: string;
  assemblyId: string;
  voteOptionId: string; // ID da opção escolhida
  timestamp: string;
  hash?: string;        // Hash de auditoria
}

export interface Assembly {
  id: string;
  titulo: string;       // JPA: titulo
  description: string;  
  tipoAssembleia: string; 
  status: AssemblyStatus | string;
  dataInicio: string;   
  dataFim: string;      
  linkVideoConferencia?: string;
  quorumType?: string;
  voteType?: VoteType | string;
  votePrivacy?: VotePrivacy | string;
  
  // Relacionamentos
  pollOptions?: VoteOption[]; 
  votes?: Vote[];
  
  // Opcionais
  minutes?: { content: string; signed: boolean };
}

// --- GOVERNANÇA (ENQUETES E COMUNICADOS) ---

export interface PollOption {
  id: string;
  descricao: string;
  label?: string; // Para evitar erro se o front tentar acessar .label
}

export interface PollVote {
  userId: string;
  optionId: string;
}

export interface Poll {
  id: string;
  title: string;
  description: string;
  status: 'OPEN' | 'CLOSED';
  targetAudience?: string; // 'ALL' | 'COUNCIL'
  options: PollOption[];
  votes: PollVote[];
  endDate?: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  priority: 'NORMAL' | 'HIGH' | 'LOW';
  targetType: 'ALL' | 'BLOCK' | 'UNIT';
  targetValue?: string;
  date: string; // ISO String
  requiresConfirmation: boolean;
  readBy: string[]; // Lista de IDs de usuários que leram
}

export interface GovernanceActivity {
  id: string;
  type: string; // 'VOTE' | 'POLL' | 'DOC' | 'COMMUNICATION'
  description: string;
  date: string;
  user: string;
}

// --- RELATÓRIOS E AUDITORIA ---

export interface AuditLog {
  id: string;
  timestamp: string;
  action: string;
  userId: string;
  details: string; // Pode ser string JSON ou texto simples
  ipAddress?: string;
  hash?: string;
}

// --- BLOG E OUTROS ---

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  category: string;
  imageUrl: string;
  tags: string[];
}

// --- FINANCEIRO ---

export interface FinancialBalance {
  total: number;
  lastUpdate: string;
}