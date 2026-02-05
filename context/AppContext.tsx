
import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

interface AppContextType {
  user: any | null;
  profile: any | null;
  requests: any[];
  isLoading: boolean;
  authChecked: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (email: string, pass: string, name: string, role: string) => Promise<void>;
  logout: () => Promise<void>;
  addRequest: (request: any) => Promise<void>;
  approveRequest: (id: string) => Promise<void>;
  updateUserRole: (role: string) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [requests, setRequests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);

  const fetchProfile = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        if (error.code !== 'PGRST116') console.warn("Erro ao buscar perfil:", error);
        setProfile(null);
        return;
      }
      setProfile(data);
    } catch (e) {
      setProfile(null);
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    if (user?.id) await fetchProfile(user.id);
  }, [user, fetchProfile]);

  const fetchRequests = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('pedidos_ajuda')
        .select(`*, profiles(nome, avatar_url)`)
        .order('created_at', { ascending: false });
      
      if (!error) setRequests(data || []);
    } catch (e) {
      console.error("Erro ao buscar pedidos:", e);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isLoading) {
        setIsLoading(false);
        setAuthChecked(true);
      }
    }, 4000);

    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser(session.user);
          await fetchProfile(session.user.id);
        }
      } catch (e) {
        console.error("Erro na checagem inicial de auth:", e);
      } finally {
        setIsLoading(false);
        setAuthChecked(true);
        clearTimeout(timer);
      }
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user);
        await fetchProfile(session.user.id);
      } else {
        setUser(null);
        setProfile(null);
      }
      setIsLoading(false);
      setAuthChecked(true);
    });

    fetchRequests();

    return () => {
      subscription.unsubscribe();
      clearTimeout(timer);
    };
  }, [fetchProfile, fetchRequests]);

  const login = async (email: string, pass: string) => {
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password: pass });
    if (error) {
      setIsLoading(false);
      throw error;
    }
  };

  const register = async (email: string, pass: string, name: string, role: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({ email, password: pass });
      if (error) throw error;
      
      if (data.user) {
        const { error: profileError } = await supabase.from('profiles').insert([{
          id: data.user.id,
          nome: name,
          tipo_conta: role,
          quer: role === 'donor' ? 'ajudar' : 'pedir_ajuda'
        }]);
        if (profileError) console.error("Erro ao criar perfil no signup:", profileError);
      }
    } catch (e) {
      setIsLoading(false);
      throw e;
    }
  };

  const logout = async () => {
    setIsLoading(true);
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setIsLoading(false);
  };

  const addRequest = async (requestData: any) => {
    if (!user) return;
    const { error } = await supabase.from('pedidos_ajuda').insert([{
      user_id: user.id,
      titulo: requestData.title,
      descricao: requestData.description,
      categoria: requestData.category,
      valor_meta: requestData.amountNeeded,
      pix_key: requestData.pixKey,
      status: 'Aberto'
    }]);
    if (error) throw error;
    await fetchRequests();
  };

  const approveRequest = async (id: string) => {
    const { error } = await supabase
      .from('pedidos_ajuda')
      .update({ status: 'Em Andamento' })
      .eq('id', id);
    if (error) throw error;
    await fetchRequests();
  };

  const updateUserRole = async (role: string) => {
    if (user) {
      const { error } = await supabase
        .from('profiles')
        .update({ tipo_conta: role })
        .eq('id', user.id);
      if (error) throw error;
      await fetchProfile(user.id);
    }
  };

  return (
    <AppContext.Provider value={{ 
      user, profile, requests, isLoading, authChecked, login, register, logout, addRequest,
      approveRequest, updateUserRole, refreshProfile
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) throw new Error('useApp must be used within an AppProvider');
  return context;
};
