import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { HelpRequest, User, Donation } from '../types';
import { INITIAL_REQUESTS, MOCK_USER } from '../constants';
import { useNotification } from './NotificationContext';

interface AppContextType {
  user: User | null;
  requests: HelpRequest[];
  isLoading: boolean;
  login: (email: string) => void;
  logout: () => void;
  addRequest: (request: Omit<HelpRequest, 'id' | 'createdAt' | 'updates' | 'amountRaised' | 'status'>) => void;
  addDonation: (requestId: string, amount: number) => void;
  approveRequest: (requestId: string) => void; // Admin function
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [requests, setRequests] = useState<HelpRequest[]>(INITIAL_REQUESTS);
  const [isLoading, setIsLoading] = useState(false);
  const { sendLocalNotification, preferences } = useNotification();

  // Simulate initial load
  useEffect(() => {
    const storedUser = localStorage.getItem('ajudaJa_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (email: string) => {
    setIsLoading(true);
    setTimeout(() => {
      // Simple mock login logic
      const newUser = { ...MOCK_USER, email };
      if (email.includes('admin')) {
        newUser.role = 'admin';
        newUser.name = 'Administrador';
      }
      setUser(newUser);
      localStorage.setItem('ajudaJa_user', JSON.stringify(newUser));
      setIsLoading(false);
    }, 800);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('ajudaJa_user');
  };

  const addRequest = (newRequestData: Omit<HelpRequest, 'id' | 'createdAt' | 'updates' | 'amountRaised' | 'status'>) => {
    const newRequest: HelpRequest = {
      ...newRequestData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      amountRaised: 0,
      status: 'Aberto', 
      updates: []
    };
    setRequests(prev => [newRequest, ...prev]);
    
    // Simulate notifying donors about a new request nearby
    if (preferences.newRequestsNearby) {
      setTimeout(() => {
        sendLocalNotification(
          "Novo pedido de ajuda próximo!", 
          `Alguém precisa de ${newRequestData.category} no seu bairro. Clique para ver.`
        );
      }, 2000);
    }
  };

  const addDonation = (requestId: string, amount: number) => {
    setRequests(prev => prev.map(req => {
      if (req.id === requestId) {
        const newRaised = req.amountRaised + amount;
        const newStatus = newRaised >= req.amountNeeded ? 'Concluído' : req.status;
        
        // Simulate notifying the beneficiary
        if (preferences.myRequestUpdates) {
             setTimeout(() => {
                 sendLocalNotification(
                     "Oba! Você recebeu uma doação!",
                     `Você recebeu R$ ${amount} para o pedido "${req.title}".`
                 );
             }, 1500);
        }

        return { ...req, amountRaised: newRaised, status: newStatus };
      }
      return req;
    }));
  };

  const approveRequest = (requestId: string) => {
    setRequests(prev => prev.map(req => 
      req.id === requestId ? { ...req, status: 'Em Andamento' } : req
    ));
    
    // Notify the beneficiary their request was approved
    setTimeout(() => {
        sendLocalNotification("Pedido Aprovado", "Seu pedido de ajuda está visível para doadores.");
    }, 1000);
  };

  return (
    <AppContext.Provider value={{ user, requests, isLoading, login, logout, addRequest, addDonation, approveRequest }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};