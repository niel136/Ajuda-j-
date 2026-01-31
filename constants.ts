
import { HelpRequest, User } from './types';

// Fix: Added missing properties 'joinedAt' and 'stats' required by the User interface defined in types.ts
export const MOCK_USER: User = {
  id: 'u1',
  name: 'Maria Silva',
  email: 'maria@exemplo.com',
  role: 'donor', // Default role for demo
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
    description: 'Com as últimas chuvas, nosso telhado cedeu. Precisamos de telhas e madeira para garantir a segurança das crianças.',
    category: 'Reforma',
    amountNeeded: 1500,
    amountRaised: 450,
    location: 'Jd. Ângela, São Paulo',
    urgency: 'Alta',
    status: 'Em Andamento',
    imageUrl: 'https://picsum.photos/800/600?random=1',
    pixKey: 'joao@pix.mock',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updates: [
      { id: 'up1', date: new Date().toISOString(), text: 'Conseguimos comprar parte das madeiras!', imageUrl: 'https://picsum.photos/400/300?random=10' }
    ]
  },
  {
    id: 'r2',
    userId: 'u3',
    userName: 'Assoc. Moradores Vila Esperança',
    title: 'Cestas Básicas para 50 Famílias',
    description: 'Estamos arrecadando fundos para comprar cestas básicas para famílias que perderam renda este mês.',
    category: 'Alimentação',
    amountNeeded: 5000,
    amountRaised: 1200,
    location: 'Vila Esperança, Bahia',
    urgency: 'Crítica',
    status: 'Aberto',
    imageUrl: 'https://picsum.photos/800/600?random=2',
    pixKey: 'associacao@pix.mock',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    updates: []
  },
  {
    id: 'r3',
    userId: 'u4',
    userName: 'Cláudia Santos',
    title: 'Medicamentos para Diabetes',
    description: 'Preciso de ajuda para comprar insulina para meu pai este mês.',
    category: 'Saúde',
    amountNeeded: 300,
    amountRaised: 300,
    location: 'Centro, Recife',
    urgency: 'Alta',
    status: 'Concluído',
    imageUrl: 'https://picsum.photos/800/600?random=3',
    pixKey: 'claudia@pix.mock',
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
    updates: [
      { id: 'up2', date: new Date().toISOString(), text: 'Remédios comprados! Muito obrigada a todos.', imageUrl: 'https://picsum.photos/400/300?random=11' }
    ]
  }
];

export const APP_IMPACT_STATS = {
  familiesHelped: 1240,
  totalRaised: 450200,
  activeVolunteers: 350
};
