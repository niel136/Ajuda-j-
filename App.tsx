
import React, { useEffect } from 'react';
// Corrected imports for react-router-dom v6
import { 
  HashRouter as Router, 
  Routes, 
  Route, 
  useLocation, 
  Navigate 
} from 'react-router-dom';
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
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading, authChecked } = useApp();
  const location = useLocation();

  // Enquanto estiver checando a autenticação inicial, mostra loading
  if (!authChecked || isLoading) return <LoadingScreen />;
  
  // Se terminou de checar e não tem usuário, manda pro onboarding
  if (!user) {
    return <Navigate to="/onboarding" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

// Componente para evitar que usuários logados acessem telas de login/onboarding
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, authChecked, isLoading } = useApp();
  
  if (!authChecked || isLoading) return <LoadingScreen />;
  
  if (user) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

const AppContent = () => {
  const { authChecked, isLoading } = useApp();

  // O AppContent só renderiza as rotas após a PRIMEIRA checagem de auth
  if (!authChecked && isLoading) return <LoadingScreen />;

  return (
    <Layout>
      <Routes>
        {/* Rotas Públicas com Proteção contra usuários logados */}
        <Route path="/onboarding" element={<PublicRoute><Onboarding /></PublicRoute>} />
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
        <Route path="/tipo-conta" element={<PublicRoute><AccountTypeSelection /></PublicRoute>} />

        {/* Rotas Privadas com Redirecionamento replace() */}
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/feed" element={<ProtectedRoute><Feed /></ProtectedRoute>} />
        <Route path="/novo-pedido" element={<ProtectedRoute><CreateRequest /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
        <Route path="/perfil" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/impacto" element={
          <ProtectedRoute>
            <div className="p-8">
              <h1 className="text-2xl font-black">Seu Impacto</h1>
              <p className="text-gray-400 font-bold mt-2 text-sm uppercase">Em desenvolvimento</p>
            </div>
          </ProtectedRoute>
        } />
        
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
