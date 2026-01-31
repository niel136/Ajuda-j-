import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { HelpRequest, User, UserRole } from '../types';
import { INITIAL_REQUESTS } from '../constants';
import { useNotification } from './NotificationContext';

interface AppContextType {
  user: User | null;
  requests: HelpRequest[];
  isLoading: boolean;
  login: (email: string) => void;
  register: (name: string, email: string) => void;
  updateUserRole: (role: UserRole, businessData?: { businessName?: string; cnpj?: string }) => void;
  logout: () => void;
  addRequest: (request: Omit<HelpRequest, 'id' | 'createdAt' | 'updates' | 'amountRaised' | 'status'>) => void;
  addDonation: (requestId: string, amount: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [requests, setRequests] = useState<HelpRequest[]>(INITIAL_REQUESTS);
  const [isLoading, setIsLoading] = useState(false);
  const { sendLocalNotification, preferences } = useNotification();

  useEffect(() => {
    const storedUser = localStorage.getItem('ajudaJa_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (email: string) => {
    setIsLoading(true);
    setTimeout(() => {
      const newUser: User = {
        id: 'u' + Math.random().toString(36).substr(2, 5),
        name: email.split('@')[0],
        email: email,
        role: 'donor',
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
        joinedAt: new Date().toISOString(),
        stats: { donationsCount: 5, totalDonated: 1250, requestsCreated: 0 }
      };
      setUser(newUser);
      localStorage.setItem('ajudaJa_user', JSON.stringify(newUser));
      setIsLoading(false);
    }, 800);
  };

  const register = (name: string, email: string) => {
    setIsLoading(true);
    setTimeout(() => {
      const newUser: User = {
        id: 'u' + Math.random().toString(36).substr(2, 5),
        name,
        email,
        role: 'donor', // Temporário, será definido no Step seguinte
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
        joinedAt: new Date().toISOString(),
        stats: { donationsCount: 0, totalDonated: 0, requestsCreated: 0 }
      };
      setUser(newUser);
      localStorage.setItem('ajudaJa_user', JSON.stringify(newUser));
      setIsLoading(false);
    }, 800);
  };

  const updateUserRole = (role: UserRole, businessData?: { businessName?: string; cnpj?: string }) => {
    if (!user) return;
    const updatedUser = { ...user, role, ...businessData };
    setUser(updatedUser);
    localStorage.setItem('ajudaJa_user', JSON.stringify(updatedUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('ajudaJa_user');
  };

  const addRequest = (newRequestData: any) => {
    const newRequest: HelpRequest = {
      ...newRequestData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      amountRaised: 0,
      status: 'Aberto', 
      updates: []
    };
    setRequests(prev => [newRequest, ...prev]);
  };

  const addDonation = (requestId: string, amount: number) => {
    setRequests(prev => prev.map(req => {
      if (req.id === requestId) {
        const newRaised = req.amountRaised + amount;
        const newStatus = newRaised >= req.amountNeeded ? 'Concluído' : req.status;
        return { ...req, amountRaised: newRaised, status: newStatus };
      }
      return req;
    }));
  };

  return (
    <AppContext.Provider value={{ user, requests, isLoading, login, register, updateUserRole, logout, addRequest, addDonation }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) throw new Error('useApp must be used within an AppProvider');
  return context;
};