
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { NotificationProvider } from './context/NotificationContext';
import Layout from './components/Layout';
import LoadingScreen from './components/LoadingScreen';
import ErrorBoundary from './components/ErrorBoundary';

const Home = lazy(() => import('./pages/Home'));
const Feed = lazy(() => import('./pages/Feed'));
const CreateRequest = lazy(() => import('./pages/CreateRequest'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const AccountTypeSelection = lazy(() => import('./pages/AccountTypeSelection'));
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
  const { user, authChecked } = useApp();

  if (!authChecked) return <LoadingScreen />;

  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        <Route path="/onboarding" element={user ? <Navigate to="/" replace /> : <Onboarding />} />
        <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
        <Route path="/signup" element={user ? <Navigate to="/" replace /> : <Signup />} />
        <Route path="/welcome" element={!user ? <Navigate to="/onboarding" replace /> : <Welcome />} />
        <Route path="/tipo-conta" element={!user ? <Navigate to="/onboarding" replace /> : <AccountTypeSelection />} />

        <Route path="/" element={!user ? <Navigate to="/onboarding" replace /> : <Home />} />
        <Route path="/feed" element={!user ? <Navigate to="/onboarding" replace /> : <Feed />} />
        <Route path="/novo-pedido" element={!user ? <Navigate to="/onboarding" replace /> : <CreateRequest />} />
        <Route path="/admin" element={!user ? <Navigate to="/onboarding" replace /> : <Admin />} />
        <Route path="/perfil" element={!user ? <Navigate to="/onboarding" replace /> : <Profile />} />
        <Route path="/perfil/editar" element={!user ? <Navigate to="/onboarding" replace /> : <EditProfile />} />
        <Route path="/convidar" element={!user ? <Navigate to="/onboarding" replace /> : <InviteFriends />} />
        <Route path="/historico" element={!user ? <Navigate to="/onboarding" replace /> : <DonationHistory />} />
        <Route path="/impacto" element={!user ? <Navigate to="/onboarding" replace /> : <Impact />} />
        <Route path="/pagamentos" element={!user ? <Navigate to="/onboarding" replace /> : <Payments />} />
        
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
