
import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { StatusPedido, HelpRequest, UserRole } from '../types';
import { analyzeRequestConfidence } from '../services/geminiService';
import { APP_IMPACT_STATS, INITIAL_REQUESTS } from '../constants';

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
  const [requests, setRequests] = useState<HelpRequest[]>(INITIAL_REQUESTS);
  const [donations, setDonations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [globalImpact] = useState(APP_IMPACT_STATS);
  
  const authTimeoutRef = useRef<number | null>(null);

  const fetchProfile = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
      if (!error) setProfile(data);
    } catch (e) {
      console.warn('Falha silenciosa ao buscar perfil:', e);
    }
  }, []);

  const fetchRequests = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('pedidos_ajuda')
        .select('*, profiles(nome, avatar_url, avatar_seed)')
        .order('created_at', { ascending: false });
      if (!error && data) setRequests(data);
    } catch (e) {
      console.warn('Falha silenciosa ao buscar pedidos:', e);
    }
  }, []);

  const fetchDonations = useCallback(async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('doacoes')
        .select('*, pedidos_ajuda(*)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (!error && data) setDonations(data);
    } catch (e) {
      console.warn('Falha silenciosa ao buscar doações:', e);
    }
  }, [user]);

  const refreshProfile = useCallback(async () => {
    if (user?.id) await fetchProfile(user.id);
  }, [user, fetchProfile]);

  const trackFeatureClick = (feature: string) => {
    console.debug(`[Analytics] Feature: ${feature}`);
  };

  const updateUserRole = async (role: UserRole) => {
    if (!user) return;
    try {
      await supabase.from('profiles').upsert({ id: user.id, tipo_conta: role });
      await fetchProfile(user.id);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    // SAFETY TIMEOUT: Se em 4 segundos o Supabase não responder, liberamos o app
    authTimeoutRef.current = window.setTimeout(() => {
      if (!authChecked) {
        console.warn('Auth check timeout - Liberando renderização por contingência.');
        setAuthChecked(true);
      }
    }, 4000);

    const init = async () => {
      try {
        const { data: { session } } = await (supabase.auth as any).getSession();
        if (session?.user) {
          setUser(session.user);
          await fetchProfile(session.user.id);
        }
      } catch (e) {
        console.error("Erro crítico na inicialização da sessão:", e);
      } finally {
        setAuthChecked(true);
        if (authTimeoutRef.current) clearTimeout(authTimeoutRef.current);
      }
      await fetchRequests();
    };
    
    init();

    const { data: { subscription } } = (supabase.auth as any).onAuthStateChange(async (_event: any, session: any) => {
      const currentUser = session?.user || null;
      setUser(currentUser);
      if (currentUser) {
        fetchProfile(currentUser.id);
        fetchDonations();
      } else {
        setProfile(null);
        setDonations([]);
      }
      setAuthChecked(true);
    });

    return () => {
      subscription.unsubscribe();
      if (authTimeoutRef.current) clearTimeout(authTimeoutRef.current);
    };
  }, [fetchProfile, fetchRequests, fetchDonations]);

  const login = async (e: string, p: string) => {
    setIsLoading(true);
    try {
      const { error } = await (supabase.auth as any).signInWithPassword({ email: e, password: p });
      if (error) throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (e: string, p: string, n: string, r: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await (supabase.auth as any).signUp({ email: e, password: p });
      if (error) throw error;
      if (data.user) {
        await supabase.from('profiles').upsert({
          id: data.user.id, nome: n, tipo_conta: r, avatar_seed: Math.random().toString(36).substring(7)
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await (supabase.auth as any).signOut();
    window.location.href = '/onboarding';
  };

  const saveDraft = async (data: any) => {
    if (!user) throw new Error("Não logado");
    const { error } = await supabase.from('pedidos_ajuda').upsert({
      ...data,
      user_id: user.id,
      status: 'RASCUNHO',
      updated_at: new Date().toISOString()
    });
    if (error) throw error;
    await fetchRequests();
  };

  const submitForAnalysis = async (id: string) => {
    try {
      const req = requests.find(r => r.id === id);
      if (!req) return;
      const score = await analyzeRequestConfidence(req.titulo, req.descricao);
      const status: StatusPedido = score < 50 ? 'EM_ANALISE_CRITICA' : 'EM_ANALISE';
      await supabase.from('pedidos_ajuda').update({ status, score_confianca_ia: score }).eq('id', id);
      await fetchRequests();
    } catch (e) {
      alert("Erro ao enviar para análise. Tente novamente.");
    }
  };

  const moderateRequest = async (id: string, decision: 'APROVAR' | 'NEGAR' | 'INFO') => {
    let status: StatusPedido = 'PUBLICADO';
    if (decision === 'NEGAR') status = 'NEGADO';
    if (decision === 'INFO') status = 'FALTA_INFO';
    await supabase.from('pedidos_ajuda').update({ status }).eq('id', id);
    await fetchRequests();
  };

  const processDonation = async (id: string, amount: number) => {
    const req = requests.find(r => r.id === id);
    if (!req) return;
    try {
      const newVal = (req.valor_atual || 0) + amount;
      const isMetaBatida = newVal >= req.valor_meta;
      await supabase.from('doacoes').insert({ pedido_id: id, user_id: user?.id, valor: amount });
      await supabase.from('pedidos_ajuda').update({ 
        valor_atual: newVal,
        status: isMetaBatida ? 'META_BATIDA' : 'PUBLICADO'
      }).eq('id', id);
      await fetchRequests();
    } catch (e) {
      throw e;
    }
  };

  const releaseFunds = async (id: string) => {
    await supabase.from('pedidos_ajuda').update({ status: 'AGUARDANDO_PROVA' }).eq('id', id);
    await fetchRequests();
  };

  const submitProof = async (id: string, url: string) => {
    await supabase.from('pedidos_ajuda').update({ url_prova_impacto: url, status: 'CONCLUIDO' }).eq('id', id);
    await fetchRequests();
  };

  const updateProfile = async (updates: any) => {
    if (!user) return;
    const { error } = await supabase.from('profiles').upsert({ ...updates, id: user.id });
    if (error) throw error;
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
