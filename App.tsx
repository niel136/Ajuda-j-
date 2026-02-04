import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { NotificationProvider } from './context/NotificationContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Feed from './pages/Feed';
import CreateRequest from './pages/CreateRequest';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AccountTypeSelection from './pages/AccountTypeSelection';
import Admin from './pages/Admin';
import Profile from './pages/Profile';
import Onboarding from './pages/Onboarding';

const AuthHandler = () => {
  const { user, isLoading } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isLoading) return;
    const publicPaths = ['/login', '/signup', '/onboarding', '/tipo-conta'];
    if (!user && !publicPaths.includes(location.pathname)) {
      navigate('/onboarding');
    }
  }, [user, navigate, location, isLoading]);

  return null;
};

const App = () => {
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
              <Route path="/signup" element={<Signup />} />
              <Route path="/tipo-conta" element={<AccountTypeSelection />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/impacto" element={<div className="p-8"><h1 className="text-2xl font-black">Seu Impacto</h1><p className="text-gray-400 font-bold mt-2 text-sm uppercase">Em construção...</p></div>} />
              <Route path="/perfil" element={<Profile />} />
            </Routes>
          </Layout>
        </Router>
      </AppProvider>
    </NotificationProvider>
  );
};

export default App;