// ==========================================
// TIPOS SINCRONIZADOS COM O BACKEND (JAVA)
// ==========================================

export interface User {
  id: string;
  nome: string;       // Sincronizado com User.java
  email: string;      // Sincronizado com User.java
  cpf: string;        // Sincronizado com User.java
  role: 'ADMIN' | 'SYNDIC' | 'RESIDENT'; // Sincronizado com as roles do sistema
  unit?: string;      
  tenant?: {          
    id: string;
    name: string;
  };
}

// Enum alinhado com Assembly.java > StatusAssembly
export type AssemblyStatus = 'AGENDADA' | 'ABERTA' | 'ENCERRADA';

export interface Assembly {
  id: string;
  titulo: string;            // Sincronizado com Assembly.java
  description: string;       // Sincronizado com Assembly.java
  dataInicio: string;        // LocalDateTime -> String ISO
  dataFim: string;           // LocalDateTime -> String ISO
  status: AssemblyStatus;    // Sincronizado com Enum Java
  linkVideoConferencia?: string; // ID do YouTube ou Link completo
  attachmentUrl?: string;        // URL do PDF da pauta
  votes?: Vote[];
  chat?: ChatMessage[];
}

// ==========================================
// TIPOS AUXILIARES E MÓDULOS EXTRAS
// ==========================================

export interface Vote {
  id: string;
  assemblyId: string;
  userId: string;
  unit: string;
  option: 'SIM' | 'NAO' | 'ABSTENCAO'; 
  timestamp: string;
}

export interface ChatMessage {
  id: string;
  userId: string;
  userName: string; 
  content: string;
  timestamp: string;
}

export interface VoteOption {
  id: string;
  label: string;
}

export interface Poll {
  id: string;
  title: string;
  description: string;
  targetAudience: 'ALL' | 'COUNCIL';
  status: 'OPEN' | 'CLOSED';
  options: VoteOption[];
  votes: { userId: string; optionId: string }[];
  endDate: string;
  createdBy: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  priority: 'HIGH' | 'NORMAL' | 'LOW';
  targetType: 'ALL' | 'BLOCK' | 'UNIT' | 'GROUP';
  targetValue?: string;
  requiresConfirmation: boolean;
  readBy: string[];
}

// FIX: Adicionado export para resolver erro no Governance.tsx
export interface GovernanceActivity {
  id: string;
  type: 'VOTE' | 'POLL' | 'DOC' | 'COMMUNICATION' | 'BOOKING';
  description: string;
  date: string;
  user: string;
}

// ==========================================
// MÓDULO: ÁREAS COMUNS E RESERVAS
// ==========================================

export type AreaType = 'PARTY_ROOM' | 'BBQ' | 'GYM' | 'POOL' | 'COURT' | 'MEETING' | 'OTHER';

export interface CommonArea {
  id: string;
  name: string;
  type: AreaType;
  capacity: number;
  description: string;
  rules: string;
  imageUrl: string;
  price: number;
  requiresApproval: boolean;
  minTimeBlock: number;
  maxTimeBlock: number;
  cleaningInterval: number;
  openTime: string;
  closeTime: string;
}

export type BookingStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED' | 'COMPLETED';

export interface Booking {
  id: string;
  areaId: string;
  userId: string;
  unit: string;
  date: string;
  startTime: string;
  endTime: string;
  status: BookingStatus;
  totalPrice: number;
  createdAt: string;
  approvedBy?: string;
}

// ==========================================
// MÓDULO: BLOG E AUDITORIA
// ==========================================

export interface AuditLog {
  id: string;
  action: string;
  details: string;
  userId: string;
  timestamp: string;
  hash: string;
}

// FIX: Adicionado export para resolver erro no Blog.tsx
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