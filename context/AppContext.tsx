
import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { StatusPedido, HelpRequest, UserRole } from '../types';
import { analyzeRequestConfidence } from '../services/geminiService';
import { APP_IMPACT_STATS } from '../constants';

interface AppContextType {
  user: any | null;
  profile: any | null;
  requests: HelpRequest[];
  donations: any[];
  isLoading: boolean;
  authChecked: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (email: string, pass: string, name: string, role: string) => Promise<void>;
  logout: () => Promise<void>;
  saveDraft: (request: any) => Promise<void>;
  submitForAnalysis: (requestId: string) => Promise<void>;
  moderateRequest: (requestId: string, decision: 'APROVAR' | 'NEGAR' | 'INFO') => Promise<void>;
  processDonation: (requestId: string, amount: number) => Promise<void>;
  releaseFunds: (requestId: string) => Promise<void>;
  submitProof: (requestId: string, url: string) => Promise<void>;
  updateProfile: (updates: any) => Promise<void>;
  refreshProfile: () => Promise<void>;
  // Fix missing properties in AppContextType
  trackFeatureClick: (feature: string) => void;
  updateUserRole: (role: UserRole) => Promise<void>;
  fetchDonations: () => Promise<void>;
  globalImpact: {
    familiesHelped: number;
    totalRaised: number;
    totalActions: number;
  };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [requests, setRequests] = useState<HelpRequest[]>([]);
  const [donations, setDonations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);
  const [globalImpact] = useState(APP_IMPACT_STATS);

  const fetchProfile = useCallback(async (userId: string) => {
    const { data } = await supabase.from('profiles').select('*').eq('id', userId).single();
    setProfile(data || null);
  }, []);

  const fetchRequests = useCallback(async () => {
    const { data } = await supabase
      .from('pedidos_ajuda')
      .select('*, profiles(nome, avatar_url, avatar_seed)')
      .order('created_at', { ascending: false });
    setRequests(data || []);
  }, []);

  const fetchDonations = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from('doacoes')
      .select('*, pedidos_ajuda(*)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    setDonations(data || []);
  }, [user]);

  const refreshProfile = useCallback(async () => {
    if (user?.id) await fetchProfile(user.id);
  }, [user, fetchProfile]);

  const trackFeatureClick = (feature: string) => {
    console.debug(`[Analytics] Feature clicked: ${feature}`);
  };

  const updateUserRole = async (role: UserRole) => {
    if (!user) return;
    await supabase.from('profiles').update({ tipo_conta: role }).eq('id', user.id);
    await fetchProfile(user.id);
  };

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await (supabase.auth as any).getSession();
      if (session?.user) {
        setUser(session.user);
        await fetchProfile(session.user.id);
      }
      await fetchRequests();
      setIsLoading(false);
      setAuthChecked(true);
    };
    init();

    const { data: { subscription } } = (supabase.auth as any).onAuthStateChange(async (event: any, session: any) => {
      setUser(session?.user || null);
      if (session?.user) await fetchProfile(session.user.id);
      else setProfile(null);
    });

    const channel = supabase.channel('realtime-pedidos')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'pedidos_ajuda' }, () => fetchRequests())
      .subscribe();

    return () => {
      subscription.unsubscribe();
      supabase.removeChannel(channel);
    };
  }, [fetchProfile, fetchRequests]);

  const login = async (e: string, p: string) => {
    const { error } = await (supabase.auth as any).signInWithPassword({ email: e, password: p });
    if (error) throw error;
  };

  const register = async (e: string, p: string, n: string, r: string) => {
    const { data, error } = await (supabase.auth as any).signUp({ email: e, password: p });
    if (error) throw error;
    if (data.user) {
      await supabase.from('profiles').upsert({
        id: data.user.id, nome: n, tipo_conta: r, avatar_seed: Math.random().toString(36).substring(7)
      });
    }
  };

  const logout = async () => {
    await (supabase.auth as any).signOut();
  };

  // REGRAS DE NEGÓCIO - MOTOR DE PEDIDOS
  
  const saveDraft = async (data: any) => {
    if (!user) return;
    await supabase.from('pedidos_ajuda').upsert({
      ...data,
      user_id: user.id,
      status: 'RASCUNHO',
      updated_at: new Date().toISOString()
    });
  };

  const submitForAnalysis = async (id: string) => {
    const req = requests.find(r => r.id === id);
    if (!req) return;
    
    const score = await analyzeRequestConfidence(req.titulo, req.descricao);
    const status: StatusPedido = score < 50 ? 'EM_ANALISE_CRITICA' : 'EM_ANALISE';
    
    await supabase.from('pedidos_ajuda').update({ 
      status, 
      score_confianca_ia: score 
    }).eq('id', id);
  };

  const moderateRequest = async (id: string, decision: 'APROVAR' | 'NEGAR' | 'INFO') => {
    let status: StatusPedido = 'PUBLICADO';
    if (decision === 'NEGAR') status = 'NEGADO';
    if (decision === 'INFO') status = 'FALTA_INFO';
    
    await supabase.from('pedidos_ajuda').update({ status }).eq('id', id);
  };

  const processDonation = async (id: string, amount: number) => {
    const req = requests.find(r => r.id === id);
    if (!req || req.status !== 'PUBLICADO') throw new Error("Não aceitando doações");

    const newVal = (req.valor_atual || 0) + amount;
    const isMetaBatida = newVal >= req.valor_meta;

    await supabase.from('doacoes').insert({ pedido_id: id, user_id: user?.id, valor: amount });
    await supabase.from('pedidos_ajuda').update({ 
      valor_atual: newVal,
      status: isMetaBatida ? 'META_BATIDA' : 'PUBLICADO'
    }).eq('id', id);
  };

  const releaseFunds = async (id: string) => {
    await supabase.from('pedidos_ajuda').update({ status: 'AGUARDANDO_PROVA' }).eq('id', id);
  };

  const submitProof = async (id: string, url: string) => {
    await supabase.from('pedidos_ajuda').update({ 
      url_prova_impacto: url,
      status: 'CONCLUIDO'
    }).eq('id', id);
  };

  const updateProfile = async (updates: any) => {
    if (!user) return;
    await supabase.from('profiles').upsert({ ...updates, id: user.id });
    await fetchProfile(user.id);
  };

  return (
    <AppContext.Provider value={{ 
      user, profile, requests, donations, isLoading, authChecked, 
      login, register, logout, saveDraft, submitForAnalysis, 
      moderateRequest, processDonation, releaseFunds, submitProof,
      updateProfile, refreshProfile, trackFeatureClick, updateUserRole,
      fetchDonations, globalImpact
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};