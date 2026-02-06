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
    user_id: 'u2',
    titulo: 'Reforma do Telhado - Chuvas',
    descricao: 'Com as últimas chuvas, nosso telhado cedeu. Precisamos de telhas e madeira.',
    categoria: 'Reforma',
    valor_meta: 1500,
    valor_atual: 450,
    status: 'PUBLICADO', // Fixed status from "Em Andamento"
    pix_key: 'joao@pix.mock',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    data_limite: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    score_confianca_ia: 85,
    profiles: {
      nome: 'João Souza',
      avatar_url: 'https://picsum.photos/800/600?random=1',
      avatar_seed: 'joao-seed'
    }
  }
];

export const APP_IMPACT_STATS = {
  familiesHelped: 1240,
  totalRaised: 450200,
  totalActions: 350 // Renamed from activeVolunteers to match globalImpact expectations
};