
import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { HelpRequest, UserRole } from '../types';
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
  globalImpact: { familiesHelped: number; totalRaised: number; totalActions: number; };
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
  
  const hasInitialized = useRef(false);

  const fetchProfile = useCallback(async (userId: string) => {
    if (!userId || !supabase.from) return;
    try {
      const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
      if (!error && data) setProfile(data);
    } catch (e) {
      console.warn('Fetch profile silent failure:', e);
    }
  }, []);

  const fetchRequests = useCallback(async () => {
    if (!supabase.from) return;
    try {
      const { data, error } = await supabase
        .from('pedidos_ajuda')
        .select('*, profiles(nome, avatar_url, avatar_seed)')
        .order('created_at', { ascending: false });
      if (!error && data) setRequests(data);
    } catch (e) {
      console.warn('Fetch requests silent failure:', e);
    }
  }, []);

  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    let isMounted = true;

    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (isMounted) {
          if (session?.user) {
            setUser(session.user);
            await fetchProfile(session.user.id);
          }
          setAuthChecked(true);
        }
      } catch (e) {
        console.error("Auth initialization error:", e);
        if (isMounted) setAuthChecked(true);
      }
      fetchRequests();
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
      if (!isMounted) return;
      const currentUser = session?.user || null;
      setUser(currentUser);
      if (currentUser) {
        fetchProfile(currentUser.id);
      } else {
        setProfile(null);
      }
    });

    return () => {
      isMounted = false;
      subscription?.unsubscribe();
    };
  }, [fetchProfile, fetchRequests]);

  const login = async (e: string, p: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email: e, password: p });
      if (error) throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (e: string, p: string, n: string, r: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({ email: e, password: p });
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
    try {
      await supabase.auth.signOut();
      setUser(null);
      setProfile(null);
      window.location.href = '/onboarding';
    } catch (e) {
      window.location.reload();
    }
  };

  const saveDraft = async (data: any) => {
    if (!user) throw new Error("Ação requer login");
    const { error } = await supabase.from('pedidos_ajuda').upsert({ ...data, user_id: user.id, status: 'RASCUNHO' });
    if (error) throw error;
    fetchRequests();
  };

  const trackFeatureClick = (f: string) => console.debug(`[Click] ${f}`);
  const updateUserRole = async (role: UserRole) => { if (user) await supabase.from('profiles').upsert({ id: user.id, tipo_conta: role }); };
  const fetchDonations = async () => {};
  const refreshProfile = async () => { if (user?.id) fetchProfile(user.id); };
  const submitForAnalysis = async (id: string) => {
    await supabase.from('pedidos_ajuda').update({ status: 'EM_ANALISE' }).eq('id', id);
    fetchRequests();
  };
  const moderateRequest = async (id: string, decision: string) => {
    const status = decision === 'APROVAR' ? 'PUBLICADO' : (decision === 'NEGAR' ? 'NEGADO' : 'FALTA_INFO');
    await supabase.from('pedidos_ajuda').update({ status }).eq('id', id);
    fetchRequests();
  };
  const processDonation = async (id: string, amount: number) => {
    if (!user) return;
    await supabase.from('doacoes').insert({ user_id: user.id, pedido_id: id, valor: amount });
    fetchRequests();
  };
  const releaseFunds = async (id: string) => {
    await supabase.from('pedidos_ajuda').update({ status: 'AGUARDANDO_PROVA' }).eq('id', id);
    fetchRequests();
  };
  const submitProof = async (id: string, url: string) => {
    await supabase.from('pedidos_ajuda').update({ url_prova_impacto: url, status: 'CONCLUIDO' }).eq('id', id);
    fetchRequests();
  };
  const updateProfile = async (updates: any) => { 
    if (user) await supabase.from('profiles').upsert({ ...updates, id: user.id }); 
    refreshProfile(); 
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
  if (!context) throw new Error('useApp falhou: Contexto não encontrado.');
  return context;
};
