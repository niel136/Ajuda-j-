
export type UserRole = 'donor' | 'beneficiary' | 'business' | 'admin';

// Added User interface to match MOCK_USER in constants.ts
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  role: UserRole;
  avatarUrl: string;
  joinedAt: string;
  stats: {
    donationsCount: number;
    totalDonated: number;
    requestsCreated: number;
  }
}

export type StatusPedido = 
  | 'RASCUNHO'
  | 'EM_ANALISE'
  | 'EM_ANALISE_CRITICA'
  | 'FALTA_INFO'
  | 'NEGADO'
  | 'PUBLICADO'
  | 'META_BATIDA'
  | 'ENCERRADO_PARCIAL'
  | 'EXPIRADO'
  | 'AGUARDANDO_PROVA'
  | 'CONCLUIDO'
  | 'BLOQUEADO_INADIMPLENTE';

export type RequestCategory = 'Alimentação' | 'Saúde' | 'Reforma' | 'Educação' | 'Outros';

export interface HelpRequest {
  id: string;
  user_id: string;
  titulo: string;
  descricao: string;
  valor_atual: number;
  valor_meta: number;
  data_limite: string;
  status: StatusPedido;
  score_confianca_ia: number;
  url_prova_impacto?: string;
  categoria: RequestCategory;
  pix_key: string;
  created_at: string;
  updated_at: string;
  profiles?: {
    nome: string;
    avatar_url: string;
    avatar_seed: string;
  };
}