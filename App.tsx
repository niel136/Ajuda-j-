
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Routes, Route, useLocation, Navigate } from 'react-router';
import { AppProvider, useApp } from './context/AppContext';
import { NotificationProvider } from './context/NotificationContext';
import Layout from './components/Layout';
import LoadingScreen from './components/LoadingScreen';
import ErrorBoundary from './components/ErrorBoundary';
import Home from './pages/Home';
import Feed from './pages/Feed';
import CreateRequest from './pages/CreateRequest';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AccountTypeSelection from './pages/AccountTypeSelection';
import Admin from './pages/Admin';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import InviteFriends from './pages/InviteFriends';
import DonationHistory from './pages/DonationHistory';
import Impact from './pages/Impact';
import Payments from './pages/Payments';
import Onboarding from './pages/Onboarding';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, authChecked } = useApp();
  const location = useLocation();

  if (!authChecked) {
    return <LoadingScreen />;
  }
  
  if (!user) {
    return <Navigate to="/onboarding" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, authChecked } = useApp();
  
  if (!authChecked) {
    return <LoadingScreen />;
  }
  
  if (user) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

const AppContent = () => {
  const { authChecked } = useApp();

  if (!authChecked) return <LoadingScreen />;

  return (
    <Layout>
      <ErrorBoundary>
        <Routes>
          <Route path="/onboarding" element={<PublicRoute><Onboarding /></PublicRoute>} />
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
          <Route path="/tipo-conta" element={<PublicRoute><AccountTypeSelection /></PublicRoute>} />

          <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/feed" element={<ProtectedRoute><Feed /></ProtectedRoute>} />
          <Route path="/novo-pedido" element={<ProtectedRoute><CreateRequest /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
          <Route path="/perfil" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/perfil/editar" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
          <Route path="/convidar" element={<ProtectedRoute><InviteFriends /></ProtectedRoute>} />
          <Route path="/historico" element={<ProtectedRoute><DonationHistory /></ProtectedRoute>} />
          <Route path="/impacto" element={<ProtectedRoute><Impact /></ProtectedRoute>} />
          <Route path="/pagamentos" element={<ProtectedRoute><Payments /></ProtectedRoute>} />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ErrorBoundary>
    </Layout>
  );
};

const App = () => {
  return (
    <ErrorBoundary>
      <NotificationProvider>
        <AppProvider>
          <Router>
            <AppContent />
          </Router>
        </AppProvider>
      </NotificationProvider>
    </ErrorBoundary>
  );
};

export default App;
