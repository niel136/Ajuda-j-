
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface AppContextType {
  user: any | null;
  profile: any | null;
  requests: any[];
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (email: string, pass: string, name: string, role: string) => Promise<void>;
  logout: () => Promise<void>;
  addRequest: (request: any) => Promise<void>;
  // Fix: Added missing properties to the context type definition
  approveRequest: (id: string) => Promise<void>;
  updateUserRole: (role: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [requests, setRequests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Busca dados iniciais e configura Auth
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchProfile(session.user.id);
      setIsLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchProfile(session.user.id);
      else setProfile(null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (id: string) => {
    const { data } = await supabase.from('profiles').select('*').eq('id', id).single();
    if (data) setProfile(data);
  };

  const fetchRequests = async () => {
    const { data, error } = await supabase
      .from('pedidos_ajuda')
      .select(`*, profiles(nome, avatar_url)`)
      .order('created_at', { ascending: false });
    
    if (!error) setRequests(data || []);
  };

  // Configuração do SUPABASE REALTIME
  useEffect(() => {
    fetchRequests();

    // Inscreve no canal de mudanças da tabela pedidos_ajuda
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'pedidos_ajuda' 
        }, 
        (payload) => {
          console.log('Nova atualização em tempo real recebida!', payload);
          // Recarregamos a lista para trazer os dados com o join do profile (nome do autor)
          fetchRequests();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const login = async (email: string, pass: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password: pass });
    if (error) throw error;
  };

  const register = async (email: string, pass: string, name: string, role: string) => {
    const { data, error } = await supabase.auth.signUp({ email, password: pass });
    if (error) throw error;
    
    if (data.user) {
      const { error: profileError } = await supabase.from('profiles').insert([{
        id: data.user.id,
        nome: name,
        tipo_conta: role,
        quer: role === 'donor' ? 'ajudar' : 'pedir_ajuda'
      }]);
      if (profileError) console.error("Erro ao criar perfil:", profileError);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
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
  };

  // Fix: Implemented approveRequest to allow admins to validate help requests
  const approveRequest = async (id: string) => {
    const { error } = await supabase
      .from('pedidos_ajuda')
      .update({ status: 'Em Andamento' })
      .eq('id', id);
    if (error) throw error;
    // UI will update automatically via Realtime Postgres changes
  };

  // Fix: Implemented updateUserRole to update the profile type in the database
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
      user, profile, requests, isLoading, login, register, logout, addRequest,
      approveRequest, updateUserRole
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
