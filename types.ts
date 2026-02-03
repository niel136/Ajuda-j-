export type UserRole = 'donor' | 'beneficiary' | 'business' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  role: UserRole;
  avatarUrl?: string;
  // Campos para empresa
  businessName?: string;
  cnpj?: string;
  areaOfExpertise?: string;
  responsibleContact?: string;
  joinedAt: string;
  stats: {
    donationsCount: number;
    totalDonated: number;
    requestsCreated: number;
  };
}

export type RequestCategory = 'Alimentação' | 'Saúde' | 'Reforma' | 'Educação' | 'Outros';
export type RequestUrgency = 'Baixa' | 'Média' | 'Alta' | 'Crítica';
export type RequestStatus = 'Aberto' | 'Em Andamento' | 'Concluído' | 'Cancelado';

export interface HelpRequest {
  id: string;
  userId: string;
  userName: string;
  title: string;
  description: string;
  category: RequestCategory;
  amountNeeded: number;
  amountRaised: number;
  location: string;
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