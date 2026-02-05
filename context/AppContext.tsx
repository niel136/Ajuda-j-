
import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

interface GlobalImpact {
  totalRaised: number;
  familiesHelped: number;
  totalActions: number;
}

interface AppContextType {
  user: any | null;
  profile: any | null;
  requests: any[];
  donations: any[];
  globalImpact: GlobalImpact;
  isLoading: boolean;
  authChecked: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (email: string, pass: string, name: string, role: string) => Promise<void>;
  logout: () => Promise<void>;
  addRequest: (request: any) => Promise<void>;
  approveRequest: (id: string) => Promise<void>;
  updateUserRole: (role: string) => Promise<void>;
  updateAvatarSeed: (seed: string) => Promise<void>;
  updateProfile: (updates: any) => Promise<void>;
  trackFeatureClick: (featureKey: string) => Promise<void>;
  addDonation: (requestId: string, amount: number) => Promise<void>;
  refreshProfile: () => Promise<void>;
  fetchDonations: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [requests, setRequests] = useState<any[]>([]);
  const [donations, setDonations] = useState<any[]>([]);
  const [globalImpact, setGlobalImpact] = useState<GlobalImpact>({
    totalRaised: 0,
    familiesHelped: 0,
    totalActions: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);

  const fetchGlobalImpact = useCallback(async () => {
    try {
      const { data: donationsData } = await supabase.from('doacoes').select('valor');
      const total = donationsData?.reduce((acc, curr) => acc + (curr.valor || 0), 0) || 0;

      const { count: familiesCount } = await supabase
        .from('pedidos_ajuda')
        .select('*', { count: 'exact', head: true })
        .or('status.eq.Em Andamento,status.eq.Concluído');

      const { count: actionsCount } = await supabase
        .from('doacoes')
        .select('*', { count: 'exact', head: true });

      setGlobalImpact({
        totalRaised: total,
        familiesHelped: familiesCount || 0,
        totalActions: actionsCount || 0
      });
    } catch (e) {
      console.error("Error fetching global impact:", e);
    }
  }, []);

  const fetchProfile = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (!error && data) {
        setProfile(data);
      } else {
        setProfile(null);
      }
    } catch (e) {
      setProfile(null);
    }
  }, []);

  const fetchDonations = useCallback(async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('doacoes')
        .select('*, pedidos_ajuda(titulo)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (!error) setDonations(data || []);
    } catch (e) {
      console.error("Erro ao buscar doações:", e);
    }
  }, [user]);

  const refreshProfile = useCallback(async () => {
    if (user?.id) await fetchProfile(user.id);
  }, [user, fetchProfile]);

  const fetchRequests = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('pedidos_ajuda')
        .select(`*, profiles(nome, avatar_url, avatar_seed)`)
        .order('created_at', { ascending: false });
      
      if (!error) setRequests(data || []);
    } catch (e) {
      console.error("Erro ao buscar pedidos:", e);
    }
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser(session.user);
          fetchProfile(session.user.id);
        }
      } catch (e) {
        console.error("Erro Auth:", e);
      } finally {
        setIsLoading(false);
        setAuthChecked(true);
      }
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser(session.user);
        fetchProfile(session.user.id);
      } else {
        setUser(null);
        setProfile(null);
        setDonations([]);
      }
    });

    fetchRequests();
    fetchGlobalImpact();

    const mainChannel = supabase
      .channel('app-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'doacoes' }, () => {
        fetchGlobalImpact();
        fetchDonations();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'pedidos_ajuda' }, () => {
        fetchRequests();
        fetchGlobalImpact();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
      supabase.removeChannel(mainChannel);
    };
  }, [fetchProfile, fetchRequests, fetchGlobalImpact, fetchDonations]);

  const login = async (email: string, pass: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password: pass });
    if (error) throw error;
  };

  const register = async (email: string, pass: string, name: string, role: string) => {
    const { data, error } = await supabase.auth.signUp({ email, password: pass });
    if (error) throw error;
    
    if (data.user) {
      const randomSeed = Math.random().toString(36).substring(7);
      await supabase.from('profiles').insert([{
        id: data.user.id,
        nome: name,
        tipo_conta: role,
        avatar_seed: randomSeed,
        quer: role === 'donor' ? 'ajudar' : 'pedir_ajuda'
      }]);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  };

  const addDonation = async (requestId: string, amount: number) => {
    if (!user || !profile) return;
    
    const { error: donationError } = await supabase
      .from('doacoes')
      .insert([{
        user_id: user.id,
        pedido_id: requestId,
        valor: amount
      }]);
    if (donationError) throw donationError;

    const requestToUpdate = requests.find(r => r.id === requestId);
    const newArrecadado = (requestToUpdate?.valor_arrecadado || 0) + amount;
    await supabase.from('pedidos_ajuda').update({ valor_arrecadado: newArrecadado }).eq('id', requestId);

    const newDonationsCount = (profile.donations_count || 0) + 1;
    const newTotalDonated = (profile.total_donated || 0) + amount;
    await supabase.from('profiles').update({ 
      donations_count: newDonationsCount,
      total_donated: newTotalDonated
    }).eq('id', user.id);

    await refreshProfile();
    await fetchRequests();
    await fetchDonations();
    await fetchGlobalImpact();
  };

  const updateAvatarSeed = async (seed: string) => {
    if (!user) return;
    const { error } = await supabase.from('profiles').update({ avatar_seed: seed }).eq('id', user.id);
    if (error) throw error;
    await refreshProfile();
  };

  const updateProfile = async (updates: any) => {
    if (!user) return;
    try {
      const { error } = await supabase.from('profiles').update(updates).eq('id', user.id);
      if (error) throw error;
      await refreshProfile();
      await fetchRequests();
    } catch (e) {
      console.error("Profile update failed", e);
      throw e;
    }
  };

  const trackFeatureClick = async (featureKey: string) => {
    if (!user) return;
    try {
      await supabase.from('feature_interactions').insert([{
        user_id: user.id,
        feature_key: featureKey,
        created_at: new Date().toISOString()
      }]);
    } catch (e) {}
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
    const { error } = await supabase.from('pedidos_ajuda').update({ status: 'Em Andamento' }).eq('id', id);
    if (error) throw error;
    await fetchRequests();
  };

  const updateUserRole = async (role: string) => {
    if (user) {
      const { error } = await supabase.from('profiles').update({ tipo_conta: role }).eq('id', user.id);
      if (error) throw error;
      await fetchProfile(user.id);
    }
  };

  return (
    <AppContext.Provider value={{ 
      user, profile, requests, donations, globalImpact, isLoading, authChecked, login, register, logout, addRequest,
      approveRequest, updateUserRole, updateAvatarSeed, updateProfile, trackFeatureClick, addDonation, refreshProfile, fetchDonations
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
