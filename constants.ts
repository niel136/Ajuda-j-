import { HelpRequest, User } from './types';

export const MOCK_USER: User = {
  id: 'u1',
  name: 'Maria Silva',
  email: 'maria@exemplo.com',
  phone: '11988887777',
  city: 'São Paulo, SP',
  role: 'donor',
  avatarUrl: 'https://picsum.photos/100/100',
  joinedAt: new Date('2024-01-01').toISOString(),
  stats: {
    donationsCount: 12,
    totalDonated: 450,
    requestsCreated: 0
  }
};

export const INITIAL_REQUESTS: HelpRequest[] = [
  {
    id: 'r1',
    userId: 'u2',
    userName: 'João Souza',
    title: 'Reforma do Telhado - Chuvas',
    description: 'Com as últimas chuvas, nosso telhado cedeu. Precisamos de telhas e madeira.',
    category: 'Reforma',
    amountNeeded: 1500,
    amountRaised: 450,
    location: 'Jd. Ângela, São Paulo',
    urgency: 'Alta',
    status: 'Em Andamento',
    imageUrl: 'https://picsum.photos/800/600?random=1',
    pixKey: 'joao@pix.mock',
    createdAt: new Date().toISOString(),
    updates: []
  }
];

export const APP_IMPACT_STATS = {
  familiesHelped: 1240,
  totalRaised: 450200,
  activeVolunteers: 350
};