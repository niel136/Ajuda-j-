import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { NotificationProvider } from './context/NotificationContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Feed from './pages/Feed';
import CreateRequest from './pages/CreateRequest';
import Login from './pages/Login';
import Admin from './pages/Admin';
import Profile from './pages/Profile';
import Onboarding from './pages/Onboarding';

// Component to handle initial redirection logic
const AuthHandler: React.FC = () => {
    const { user } = useApp();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // If user is not logged in and not on login/onboarding page, redirect
        if (!user && location.pathname !== '/login' && location.pathname !== '/onboarding') {
            navigate('/onboarding');
        }
    }, [user, navigate, location]);

    return null;
};

const App: React.FC = () => {
  return (
    <NotificationProvider>
      <AppProvider>
        <Router>
          <AuthHandler />
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/onboarding" element={<Onboarding />} />
              <Route path="/feed" element={<Feed />} />
              <Route path="/novo-pedido" element={<CreateRequest />} />
              <Route path="/login" element={<Login />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/impacto" element={<div className="p-6"><h1 className="text-2xl font-bold">Seu Impacto</h1><p className="mt-4 text-gray-500">Gráficos detalhados em breve.</p></div>} />
              <Route path="/perfil" element={<Profile />} />
            </Routes>
          </Layout>
        </Router>
      </AppProvider>
    </NotificationProvider>
  );
};

export default App;