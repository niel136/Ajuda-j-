
import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { HelpRequest, UserRole, StatusPedido, UserType, UserProfile } from '../types';
import { APP_IMPACT_STATS, INITIAL_REQUESTS } from '../constants';

interface AppContextType {
  user: any | null;
  profile: UserProfile | null;
  requests: HelpRequest[];
  donations: any[];
  isLoading: boolean;
  authChecked: boolean;
  login: (email: string, pass: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  register: (email: string, pass: string, name: string, userType: UserType, onboardingData?: any) => Promise<void>;
  logout: () => Promise<void>;
  saveRequest: (request: any) => Promise<void>;
  updateProfile: (updates: any) => Promise<void>;
  refreshProfile: () => Promise<void>;
  trackFeatureClick: (feature: string) => void;
  updateUserRole: (role: UserRole) => Promise<void>;
  globalImpact: { familiesHelped: number; totalRaised: number; totalActions: number; };
  fetchDonations: () => Promise<void>;
  processDonation: (requestId: string, amount: number) => Promise<void>;
  moderateRequest: (requestId: string, action: 'APROVAR' | 'NEGAR' | 'INFO') => Promise<void>;
  verifyUser: (userId: string, status: 'VERIFICADO' | 'NEGADO' | 'BLOQUEADO') => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [requests, setRequests] = useState<HelpRequest[]>(INITIAL_REQUESTS);
  const [donations, setDonations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [globalImpact] = useState(APP_IMPACT_STATS);
  
  const initPromiseRef = useRef<Promise<void> | null>(null);

  const fetchProfile = useCallback(async (userId: string) => {
    if (!userId) return null;
    try {
      console.debug('[Auth] Fetching profile for:', userId);
      const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle();
      if (error) {
        console.error('[Auth] Profile fetch error:', error);
        return null;
      }
      if (data) {
        console.debug('[Auth] Profile loaded:', data.tipo_usuario);
        setProfile(data as UserProfile);
        return data as UserProfile;
      }
      return null;
    } catch (e) {
      console.warn('[Auth] Profile fetch failed exception:', e);
      return null;
    }
  }, []);

  const fetchRequests = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('pedidos_ajuda')
        .select('*, profiles(nome, avatar_url, avatar_seed, tipo_usuario)')
        .order('created_at', { ascending: false });
      if (!error && data) setRequests(data);
    } catch (e) {
      console.warn('Requests fetch failed:', e);
    }
  }, []);

  // Inicialização Unificada
  useEffect(() => {
    if (initPromiseRef.current) return;

    const init = async () => {
      console.debug('[Auth] Initializing App Session...');
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser(session.user);
          await fetchProfile(session.user.id);
        }
      } catch (e) {
        console.error("[Auth] Session init error:", e);
      } finally {
        console.debug('[Auth] Auth state checked.');
        setAuthChecked(true);
      }
      fetchRequests();
    };

    initPromiseRef.current = init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.debug(`[Auth] Auth Event: ${event}`);
      const currentUser = session?.user || null;
      
      if (event === 'SIGNED_IN') {
        setUser(currentUser);
        if (currentUser) await fetchProfile(currentUser.id);
        setAuthChecked(true);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setProfile(null);
        setAuthChecked(true);
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [fetchProfile, fetchRequests]);

  const login = async (e: string, p: string) => {
    setIsLoading(true);
    setAuthChecked(false); // Reseta para garantir novo check de rota
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email: e, password: p });
      if (error) throw error;
      if (data.user) {
        await fetchProfile(data.user.id);
      }
    } finally {
      setIsLoading(false);
      setAuthChecked(true);
    }
  };

  const loginWithGoogle = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: window.location.origin }
      });
      if (error) throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (e: string, p: string, n: string, userType: UserType, onboardingData?: any) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({ email: e, password: p });
      if (error) throw error;
      if (data.user) {
        const taxa = userType === 'PJ' ? 10 : 5;
        const status = userType === 'PJ' ? 'PENDENTE' : 'VERIFICADO';
        
        const newProfile = {
          id: data.user.id, 
          nome: n, 
          tipo_usuario: userType,
          tipo_conta: userType === 'PJ' ? 'business' : (userType === 'ADM' ? 'admin' : 'donor'),
          avatar_seed: Math.random().toString(36).substring(7),
          taxa_percentual: taxa,
          status_verificacao: status,
          cnpj: onboardingData?.cnpj || null,
          metadata_onboarding: onboardingData || {},
          created_at: new Date().toISOString()
        };

        await supabase.from('profiles').upsert(newProfile);
        setProfile(newProfile as any);
      }
    } finally {
      setIsLoading(false);
      setAuthChecked(true);
    }
  };

  const logout = async () => {
    try {
      setAuthChecked(false);
      await supabase.auth.signOut();
      setUser(null);
      setProfile(null);
    } catch (e) {
      console.error("Logout failed", e);
    } finally {
      setAuthChecked(true);
    }
  };

  const fetchDonations = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('doacoes')
        .select('*, pedidos_ajuda(titulo)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (!error && data) setDonations(data || []);
    } finally {
      setIsLoading(false);
    }
  };

  const processDonation = async (requestId: string, amount: number) => {
    if (!user) throw new Error("Ação requer login");
    
    const taxaValue = (amount * (profile?.taxa_percentual || 5)) / 100;
    
    const { error: donationError } = await supabase.from('doacoes').insert({
      user_id: user.id,
      pedido_id: requestId,
      valor: amount,
      taxa_aplicada: taxaValue,
      created_at: new Date().toISOString()
    });
    if (donationError) throw donationError;

    const request = requests.find(r => r.id === requestId);
    if (request) {
      const newVal = (request.valor_atual || 0) + amount;
      await supabase.from('pedidos_ajuda').update({ 
        valor_atual: newVal,
        status: newVal >= request.valor_meta ? 'META_BATIDA' : request.status
      }).eq('id', requestId);
    }

    fetchRequests();
    refreshProfile();
  };

  const moderateRequest = async (requestId: string, action: 'APROVAR' | 'NEGAR' | 'INFO') => {
    let newStatus: StatusPedido = 'PUBLICADO';
    if (action === 'NEGAR') newStatus = 'NEGADO';
    if (action === 'INFO') newStatus = 'FALTA_INFO';
    
    await supabase.from('pedidos_ajuda').update({ status: newStatus }).eq('id', requestId);
    fetchRequests();
  };

  const verifyUser = async (userId: string, status: 'VERIFICADO' | 'NEGADO' | 'BLOQUEADO') => {
    await supabase.from('profiles').update({ status_verificacao: status }).eq('id', userId);
    if (user?.id === userId) refreshProfile();
  };

  const trackFeatureClick = (f: string) => console.debug(`[Click] ${f}`);
  const refreshProfile = async () => { if (user?.id) fetchProfile(user.id); };
  const updateProfile = async (updates: any) => { 
    if (user) await supabase.from('profiles').update(updates).eq('id', user.id); 
    refreshProfile(); 
  };
  const updateUserRole = async (role: UserRole) => { 
    if (user) await supabase.from('profiles').update({ tipo_conta: role }).eq('id', user.id); 
    refreshProfile(); 
  };

  return (
    <AppContext.Provider value={{ 
      user, profile, requests, donations, isLoading, authChecked, 
      login, loginWithGoogle, register, logout, saveRequest: async (d) => {}, 
      updateProfile, refreshProfile, trackFeatureClick, updateUserRole,
      globalImpact, fetchDonations, processDonation, moderateRequest, verifyUser
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
