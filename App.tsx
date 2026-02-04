
import React from 'react';
import { HashRouter as Router, Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { NotificationProvider } from './context/NotificationContext';
import Layout from './components/Layout';
import LoadingScreen from './components/LoadingScreen';
import Home from './pages/Home';
import Feed from './pages/Feed';
import CreateRequest from './pages/CreateRequest';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AccountTypeSelection from './pages/AccountTypeSelection';
import Admin from './pages/Admin';
import Profile from './pages/Profile';
import Onboarding from './pages/Onboarding';

// Componente Wrapper para Rotas Protegidas
// Fix: Explicitly define ProtectedRoute with children type to satisfy React 18 / TypeScript requirements
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useApp();
  const location = useLocation();

  if (isLoading) return <LoadingScreen />;
  
  if (!user) {
    return <Navigate to="/onboarding" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

const AppContent = () => {
  const { isLoading } = useApp();

  if (isLoading) return <LoadingScreen />;

  return (
    <Layout>
      <Routes>
        {/* Rotas Públicas */}
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/tipo-conta" element={<AccountTypeSelection />} />

        {/* Rotas Privadas */}
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/feed" element={<ProtectedRoute><Feed /></ProtectedRoute>} />
        <Route path="/novo-pedido" element={<ProtectedRoute><CreateRequest /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
        <Route path="/perfil" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/impacto" element={
          <ProtectedRoute>
            <div className="p-8">
              <h1 className="text-2xl font-black">Seu Impacto</h1>
              <p className="text-gray-400 font-bold mt-2 text-sm uppercase">Em construção...</p>
            </div>
          </ProtectedRoute>
        } />
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
};

const App = () => {
  return (
    <NotificationProvider>
      <AppProvider>
        <Router>
          <AppContent />
        </Router>
      </AppProvider>
    </NotificationProvider>
  );
};

export default App;
