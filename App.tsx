
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { NotificationProvider } from './context/NotificationContext';
import Layout from './components/Layout';
import LoadingScreen from './components/LoadingScreen';
import ErrorBoundary from './components/ErrorBoundary';

const DashboardPF = lazy(() => import('./modules/pf/DashboardPF'));
const DashboardPJ = lazy(() => import('./modules/pj/DashboardPJ'));
const Feed = lazy(() => import('./pages/Feed'));
const CreateRequest = lazy(() => import('./pages/CreateRequest'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const AccountTypeSelection = lazy(() => import('./pages/AccountTypeSelection'));
const OnboardingPF = lazy(() => import('./pages/OnboardingPF'));
const OnboardingPJ = lazy(() => import('./pages/OnboardingPJ'));
const Welcome = lazy(() => import('./pages/Welcome'));
const Admin = lazy(() => import('./pages/Admin'));
const Profile = lazy(() => import('./pages/Profile'));
const EditProfile = lazy(() => import('./pages/EditProfile'));
const InviteFriends = lazy(() => import('./pages/InviteFriends'));
const DonationHistory = lazy(() => import('./pages/DonationHistory'));
const Impact = lazy(() => import('./pages/Impact'));
const Payments = lazy(() => import('./pages/Payments'));
const Onboarding = lazy(() => import('./pages/Onboarding'));

const AppRoutes = () => {
  const { user, profile, authChecked } = useApp();

  if (!authChecked) return <LoadingScreen />;

  // Central Hub: Decide qual dashboard abrir baseado no perfil
  const DashboardSelector = () => {
    if (!user) return <Navigate to="/onboarding" replace />;
    if (profile?.tipo_usuario === 'ADM') return <Navigate to="/admin" replace />;
    if (profile?.tipo_usuario === 'PJ') return <Navigate to="/dashboard/pj" replace />;
    return <Navigate to="/dashboard/pf" replace />;
  };

  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        <Route path="/onboarding" element={user ? <Navigate to="/" replace /> : <Onboarding />} />
        <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
        <Route path="/signup" element={user ? <Navigate to="/" replace /> : <Signup />} />
        <Route path="/welcome" element={!user ? <Navigate to="/onboarding" replace /> : <Welcome />} />
        
        {/* Onboarding Flow */}
        <Route path="/tipo-conta" element={user ? <AccountTypeSelection /> : <Navigate to="/onboarding" replace />} />
        <Route path="/onboarding-pf" element={user ? <OnboardingPF /> : <Navigate to="/onboarding" replace />} />
        <Route path="/onboarding-pj" element={user ? <OnboardingPJ /> : <Navigate to="/onboarding" replace />} />

        {/* Home redirection */}
        <Route path="/" element={<DashboardSelector />} />
        
        {/* MODULE: PF (Pessoa Física) */}
        <Route path="/dashboard/pf" element={<Layout><DashboardPF /></Layout>} />
        
        {/* MODULE: PJ (Pessoa Jurídica) */}
        <Route path="/dashboard/pj" element={<DashboardPJ />} />

        {/* Global Pages */}
        <Route path="/feed" element={!user ? <Navigate to="/onboarding" replace /> : <Layout><Feed /></Layout>} />
        <Route path="/novo-pedido" element={!user ? <Navigate to="/onboarding" replace /> : <Layout><CreateRequest /></Layout>} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/perfil" element={!user ? <Navigate to="/onboarding" replace /> : <Layout><Profile /></Layout>} />
        <Route path="/perfil/editar" element={!user ? <Navigate to="/onboarding" replace /> : <Layout><EditProfile /></Layout>} />
        <Route path="/convidar" element={!user ? <Navigate to="/onboarding" replace /> : <Layout><InviteFriends /></Layout>} />
        <Route path="/historico" element={!user ? <Navigate to="/onboarding" replace /> : <Layout><DonationHistory /></Layout>} />
        <Route path="/impacto" element={!user ? <Navigate to="/onboarding" replace /> : <Layout><Impact /></Layout>} />
        <Route path="/pagamentos" element={!user ? <Navigate to="/onboarding" replace /> : <Layout><Payments /></Layout>} />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};

const App = () => {
  return (
    <ErrorBoundary>
      <NotificationProvider>
        <AppProvider>
          <Router>
            <AppRoutes />
          </Router>
        </AppProvider>
      </NotificationProvider>
    </ErrorBoundary>
  );
};

export default App;
