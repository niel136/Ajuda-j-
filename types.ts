export type UserRole = 'donor' | 'beneficiary' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
}

export type RequestCategory = 'Alimentação' | 'Saúde' | 'Reforma' | 'Educação' | 'Outros';
export type RequestUrgency = 'Baixa' | 'Média' | 'Alta' | 'Crítica';
export type RequestStatus = 'Aberto' | 'Em Andamento' | 'Concluído' | 'Cancelado';

export interface HelpRequest {
  id: string;
  userId: string;
  userName: string; // Denormalized for simplicity
  title: string;
  description: string;
  category: RequestCategory;
  amountNeeded: number;
  amountRaised: number;
  location: string; // City/Neighborhood
  urgency: RequestUrgency;
  status: RequestStatus;
  imageUrl: string;
  pixKey: string;
  createdAt: string;
  updates: RequestUpdate[];
}

export interface RequestUpdate {
  id: string;
  date: string;
  text: string;
  imageUrl?: string;
}

export interface Donation {
  id: string;
  requestId: string;
  amount: number;
  donorName: string;
  date: string;
}