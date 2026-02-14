
import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabase';
// Added missing VerificationStatus import
import { HelpRequest, UserRole, StatusPedido, UserType, UserProfile, VerificationStatus } from '../types';
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
  // Updated to use VerificationStatus type for consistency
  verifyUser: (userId: string, status: VerificationStatus) => Promise<void>;
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
  
  const initPromiseRef = useRef<boolean>(false);

  const fetchProfile = useCallback(async (userId: string) => {
    if (!userId) return null;
    try {
      const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle();
      if (data) {
        setProfile(data as UserProfile);
        // Cache da role para carregamento ultra rápido no próximo refresh
        localStorage.setItem('ajudaja_user_type', data.tipo_usuario);
        return data as UserProfile;
      }
      return null;
    } catch (e) {
      return null;
    }
  }, []);

  const fetchRequests = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('pedidos_ajuda')
        .select('*, profiles(nome, avatar_url, avatar_seed, tipo_usuario)')
        .order('created_at', { ascending: false })
        .limit(10); // Busca apenas os mais recentes inicialmente
      if (!error && data) setRequests(data);
    } catch (e) {}
  }, []);

  // Inicialização Otimizada
  useEffect(() => {
    if (initPromiseRef.current) return;
    initPromiseRef.current = true;

    const init = async () => {
      console.time('[Perf] Auth Initialization');
      try {
        // 1. Prioridade Máxima: Sessão
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user) {
          console.debug('[Auth] No session found.');
          setAuthChecked(true);
          console.timeEnd('[Perf] Auth Initialization');
          // Carrega requests em background
          fetchRequests();
          return;
        }

        // 2. Se há sessão, define usuário imediatamente
        setUser(session.user);

        // 3. Verifica se temos a role no cache para liberar o authChecked mais cedo
        const cachedType = localStorage.getItem('ajudaja_user_type');
        if (cachedType) {
          console.debug('[Auth] Using cached role:', cachedType);
          setAuthChecked(true); // Libera UI antes de terminar de buscar o perfil completo
        }

        // 4. Busca dados em paralelo (Não bloqueante para o roteador se houver cache)
        await Promise.all([
          fetchProfile(session.user.id),
          fetchRequests()
        ]);

      } catch (e) {
        console.error("[Auth] Init error:", e);
      } finally {
        setAuthChecked(true);
        console.timeEnd('[Perf] Auth Initialization');
      }
    };

    init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        setUser(session.user);
        fetchProfile(session.user.id);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setProfile(null);
        localStorage.removeItem('ajudaja_user_type');
      }
    });

    return () => subscription?.unsubscribe();
  }, [fetchProfile, fetchRequests]);

  const login = async (e: string, p: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email: e, password: p });
      if (error) throw error;
      if (data.user) {
        const profile = await fetchProfile(data.user.id);
        if (profile) localStorage.setItem('ajudaja_user_type', profile.tipo_usuario);
      }
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
        const newProfile = {
          id: data.user.id, 
          nome: n, 
          tipo_usuario: userType,
          tipo_conta: userType === 'PJ' ? 'business' : (userType === 'ADM' ? 'admin' : 'donor'),
          avatar_seed: Math.random().toString(36).substring(7),
          taxa_percentual: userType === 'PJ' ? 10 : 5,
          status_verificacao: userType === 'PJ' ? 'PENDENTE' : 'VERIFICADO',
          created_at: new Date().toISOString()
        };
        await supabase.from('profiles').upsert(newProfile);
        setProfile(newProfile as any);
        localStorage.setItem('ajudaja_user_type', userType);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setAuthChecked(false);
    await supabase.auth.signOut();
    localStorage.removeItem('ajudaja_user_type');
    setUser(null);
    setProfile(null);
    setAuthChecked(true);
  };

  const fetchDonations = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('doacoes')
      .select('*, pedidos_ajuda(titulo)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    if (data) setDonations(data);
  };

  const processDonation = async (requestId: string, amount: number) => {
    if (!user) throw new Error("Login necessário");
    const { error } = await supabase.from('doacoes').insert({
      user_id: user.id,
      pedido_id: requestId,
      valor: amount,
      created_at: new Date().toISOString()
    });
    if (error) throw error;
    fetchRequests();
  };

  const moderateRequest = async (requestId: string, action: 'APROVAR' | 'NEGAR' | 'INFO') => {
    const status: StatusPedido = action === 'APROVAR' ? 'PUBLICADO' : (action === 'NEGAR' ? 'NEGADO' : 'FALTA_INFO');
    await supabase.from('pedidos_ajuda').update({ status }).eq('id', requestId);
    fetchRequests();
  };

  // Fixed: Added missing type VerificationStatus for status parameter
  const verifyUser = async (userId: string, status: VerificationStatus) => {
    await supabase.from('profiles').update({ status_verificacao: status }).eq('id', userId);
    if (user?.id === userId) fetchProfile(user.id);
  };

  return (
    <AppContext.Provider value={{ 
      user, profile, requests, donations, isLoading, authChecked, 
      login, loginWithGoogle: async () => {}, register, logout, saveRequest: async () => {}, 
      updateProfile: async () => {}, refreshProfile: async () => {}, trackFeatureClick: () => {}, 
      updateUserRole: async () => {}, globalImpact, fetchDonations, processDonation, moderateRequest, verifyUser
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp falhou');
  return context;
};
