
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { NotificationProvider } from './context/NotificationContext';
import Layout from './components/Layout';
import LoadingScreen from './components/LoadingScreen';
import ErrorBoundary from './components/ErrorBoundary';

// Lazy loading para reduzir bundle inicial e evitar quebras de importação no topo
const Home = lazy(() => import('./pages/Home'));
const Feed = lazy(() => import('./pages/Feed'));
const CreateRequest = lazy(() => import('./pages/CreateRequest'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const AccountTypeSelection = lazy(() => import('./pages/AccountTypeSelection'));
const Admin = lazy(() => import('./pages/Admin'));
const Profile = lazy(() => import('./pages/Profile'));
const EditProfile = lazy(() => import('./pages/EditProfile'));
const InviteFriends = lazy(() => import('./pages/InviteFriends'));
const DonationHistory = lazy(() => import('./pages/DonationHistory'));
const Impact = lazy(() => import('./pages/Impact'));
const Payments = lazy(() => import('./pages/Payments'));
const Onboarding = lazy(() => import('./pages/Onboarding'));

const AppRoutes = () => {
  const { user } = useApp();

  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        <Route path="/onboarding" element={user ? <Navigate to="/" /> : <Onboarding />} />
        <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
        <Route path="/signup" element={user ? <Navigate to="/" /> : <Signup />} />
        <Route path="/tipo-conta" element={user ? <Navigate to="/" /> : <AccountTypeSelection />} />

        <Route path="/" element={!user ? <Navigate to="/onboarding" /> : <Home />} />
        <Route path="/feed" element={!user ? <Navigate to="/onboarding" /> : <Feed />} />
        <Route path="/novo-pedido" element={!user ? <Navigate to="/onboarding" /> : <CreateRequest />} />
        <Route path="/admin" element={!user ? <Navigate to="/onboarding" /> : <Admin />} />
        <Route path="/perfil" element={!user ? <Navigate to="/onboarding" /> : <Profile />} />
        <Route path="/perfil/editar" element={!user ? <Navigate to="/onboarding" /> : <EditProfile />} />
        <Route path="/convidar" element={!user ? <Navigate to="/onboarding" /> : <InviteFriends />} />
        <Route path="/historico" element={!user ? <Navigate to="/onboarding" /> : <DonationHistory />} />
        <Route path="/impacto" element={!user ? <Navigate to="/onboarding" /> : <Impact />} />
        <Route path="/pagamentos" element={!user ? <Navigate to="/onboarding" /> : <Payments />} />
        
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
            <Layout>
              <AppRoutes />
            </Layout>
          </Router>
        </AppProvider>
      </NotificationProvider>
    </ErrorBoundary>
  );
};

export default App;
