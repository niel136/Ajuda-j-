import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface NotificationPreferences {
  newRequestsNearby: boolean;
  myRequestUpdates: boolean;
  marketing: boolean;
  categories: string[];
}

interface NotificationContextType {
  permission: NotificationPermission;
  preferences: NotificationPreferences;
  requestPermission: () => Promise<void>;
  updatePreferences: (prefs: Partial<NotificationPreferences>) => void;
  sendLocalNotification: (title: string, body: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const DEFAULT_PREFS: NotificationPreferences = {
  newRequestsNearby: true,
  myRequestUpdates: true,
  marketing: false,
  categories: ['Alimentação', 'Saúde']
};

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [preferences, setPreferences] = useState<NotificationPreferences>(DEFAULT_PREFS);

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
    
    // Load prefs from local storage
    const storedPrefs = localStorage.getItem('ajudaJa_notif_prefs');
    if (storedPrefs) {
      setPreferences(JSON.parse(storedPrefs));
    }
  }, []);

  const requestPermission = async () => {
    if (!('Notification' in window)) {
      alert("Seu navegador não suporta notificações.");
      return;
    }

    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      if (result === 'granted') {
        // In a real app, here we would subscribe the user to the VAPID server
        // navigator.serviceWorker.ready.then((registration) => {
        //   registration.pushManager.subscribe({ ... })
        // });
        sendLocalNotification('Notificações Ativadas!', 'Você agora receberá alertas sobre pedidos urgentes.');
      }
    } catch (error) {
      console.error("Error requesting permission", error);
    }
  };

  const updatePreferences = (newPrefs: Partial<NotificationPreferences>) => {
    const updated = { ...preferences, ...newPrefs };
    setPreferences(updated);
    localStorage.setItem('ajudaJa_notif_prefs', JSON.stringify(updated));
  };

  const sendLocalNotification = (title: string, body: string) => {
    if (permission === 'granted' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(registration => {
        registration.showNotification(title, {
          body,
          icon: 'https://picsum.photos/192/192',
          vibrate: [200, 100, 200],
          badge: 'https://picsum.photos/96/96'
        } as any);
      });
    } else if (permission === 'granted') {
        // Fallback for non-SW contexts
        new Notification(title, { body, icon: 'https://picsum.photos/192/192' });
    }
  };

  return (
    <NotificationContext.Provider value={{ permission, preferences, requestPermission, updatePreferences, sendLocalNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};