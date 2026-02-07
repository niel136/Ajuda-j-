
import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { HelpRequest, UserRole, StatusPedido } from '../types';
import { APP_IMPACT_STATS, INITIAL_REQUESTS } from '../constants';

interface AppContextType {
  user: any | null;
  profile: any | null;
  requests: HelpRequest[];
  donations: any[];
  isLoading: boolean;
  authChecked: boolean;
  login: (email: string, pass: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  register: (email: string, pass: string, name: string, role: string) => Promise<void>;
  logout: () => Promise<void>;
  saveRequest: (request: any) => Promise<void>;
  updateProfile: (updates: any) => Promise<void>;
  refreshProfile: () => Promise<void>;
  trackFeatureClick: (feature: string) => void;
  updateUserRole: (role: UserRole) => Promise<void>;
  globalImpact: { familiesHelped: number; totalRaised: number; totalActions: number; };
  fetchDonations: () => Promise<void>;
  processDonation: (requestId: string, amount: number) => Promise<void>;
  submitForAnalysis: (requestId: string) => Promise<void>;
  releaseFunds: (requestId: string) => Promise<void>;
  submitProof: (requestId: string, proofUrl: string) => Promise<void>;
  moderateRequest: (requestId: string, action: 'APROVAR' | 'NEGAR' | 'INFO') => Promise<void>;
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
    if (!userId) return;
    try {
      const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
      if (!error && data) setProfile(data);
    } catch (e) {
      console.warn('Profile fetch failed:', e);
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
      console.warn('Requests fetch failed:', e);
    }
  }, []);

  const fetchDonations = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('doacoes')
        .select('*, pedidos_ajuda(titulo)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (!error && data) setDonations(data || []);
    } catch (e) {
      console.warn('Donations fetch failed:', e);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser(session.user);
          await fetchProfile(session.user.id);
        }
      } catch (e) {
        console.error("Auth init error:", e);
      } finally {
        setAuthChecked(true);
      }
      fetchRequests();
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
      const currentUser = session?.user || null;
      setUser(currentUser);
      if (currentUser) {
        fetchProfile(currentUser.id);
      } else {
        setProfile(null);
      }
    });

    return () => {
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

  const loginWithGoogle = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: 'https://ajuda-ja.vercel.app'
        }
      });
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
          id: data.user.id, 
          nome: n, 
          tipo_conta: r, 
          avatar_seed: Math.random().toString(36).substring(7),
          created_at: new Date().toISOString()
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

  const saveRequest = async (data: any) => {
    if (!user) throw new Error("Ação requer login");
    const { error } = await supabase.from('pedidos_ajuda').insert({ 
      ...data, 
      user_id: user.id, 
      status: 'PUBLICADO', 
      created_at: new Date().toISOString()
    });
    if (error) throw error;
    fetchRequests();
  };

  const trackFeatureClick = (f: string) => console.debug(`[Click] ${f}`);
  
  const updateUserRole = async (role: UserRole) => { 
    if (user) {
      await supabase.from('profiles').update({ tipo_conta: role }).eq('id', user.id); 
      await fetchProfile(user.id);
    }
  };

  const refreshProfile = async () => { if (user?.id) fetchProfile(user.id); };
  
  const updateProfile = async (updates: any) => { 
    if (user) await supabase.from('profiles').update(updates).eq('id', user.id); 
    refreshProfile(); 
  };

  const processDonation = async (requestId: string, amount: number) => {
    if (!user) throw new Error("Ação requer login");
    
    const { error: donationError } = await supabase.from('doacoes').insert({
      user_id: user.id,
      pedido_id: requestId,
      valor: amount,
      created_at: new Date().toISOString()
    });
    if (donationError) throw donationError;

    const request = requests.find(r => r.id === requestId);
    if (request) {
      const newVal = (request.valor_atual || 0) + amount;
      let newStatus = request.status;
      if (newVal >= request.valor_meta) {
        newStatus = 'META_BATIDA';
      }
      await supabase.from('pedidos_ajuda').update({ 
        valor_atual: newVal,
        status: newStatus
      }).eq('id', requestId);
    }

    fetchRequests();
    fetchDonations();
    refreshProfile();
  };

  const submitForAnalysis = async (requestId: string) => {
    const { error } = await supabase.from('pedidos_ajuda').update({ status: 'EM_ANALISE' }).eq('id', requestId);
    if (error) throw error;
    fetchRequests();
  };

  const releaseFunds = async (requestId: string) => {
    const { error } = await supabase.from('pedidos_ajuda').update({ status: 'AGUARDANDO_PROVA' }).eq('id', requestId);
    if (error) throw error;
    fetchRequests();
  };

  const submitProof = async (requestId: string, proofUrl: string) => {
    const { error } = await supabase.from('pedidos_ajuda').update({ 
      status: 'CONCLUIDO',
      url_prova_impacto: proofUrl
    }).eq('id', requestId);
    if (error) throw error;
    fetchRequests();
  };

  const moderateRequest = async (requestId: string, action: 'APROVAR' | 'NEGAR' | 'INFO') => {
    let newStatus: StatusPedido = 'PUBLICADO';
    if (action === 'NEGAR') newStatus = 'NEGADO';
    if (action === 'INFO') newStatus = 'FALTA_INFO';
    
    const { error } = await supabase.from('pedidos_ajuda').update({ status: newStatus }).eq('id', requestId);
    if (error) throw error;
    fetchRequests();
  };

  return (
    <AppContext.Provider value={{ 
      user, profile, requests, donations, isLoading, authChecked, 
      login, loginWithGoogle, register, logout, saveRequest, 
      updateProfile, refreshProfile, trackFeatureClick, updateUserRole,
      globalImpact,
      fetchDonations, processDonation, submitForAnalysis, releaseFunds, submitProof, moderateRequest
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
