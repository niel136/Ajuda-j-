
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router';
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

const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode, allowedRoles?: string[] }) => {
  const { user, profile, authChecked } = useApp();
  const location = useLocation();

  // Fallback para role cacheada para evitar loading desnecessário
  const userType = profile?.tipo_usuario || localStorage.getItem('ajudaja_user_type');

  if (!authChecked) return <LoadingScreen />;

  if (!user) {
    return <Navigate to="/onboarding" state={{ from: location }} replace />;
  }

  if (allowedRoles && userType && !allowedRoles.includes(userType)) {
    if (userType === 'ADM') return <Navigate to="/admin" replace />;
    if (userType === 'PJ') return <Navigate to="/dashboard/pj" replace />;
    return <Navigate to="/dashboard/pf" replace />;
  }

  return <>{children}</>;
};

const AppRoutes = () => {
  const { user, profile, authChecked } = useApp();
  const userType = profile?.tipo_usuario || localStorage.getItem('ajudaja_user_type');

  // Fast Sync: Se estiver autenticado, sincroniza e redireciona
  if (!authChecked) return <LoadingScreen />;

  const getHomeElement = () => {
    if (!user) return <Navigate to="/onboarding" replace />;
    if (userType === 'ADM') return <Navigate to="/admin" replace />;
    if (userType === 'PJ') return <Navigate to="/dashboard/pj" replace />;
    if (userType === 'PF') return <Navigate to="/dashboard/pf" replace />;
    return <Navigate to="/welcome" replace />;
  };

  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        {/* Onboarding é apenas para quem NÃO está logado */}
        <Route path="/onboarding" element={user ? <Navigate to="/" replace /> : <Onboarding />} />
        <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
        <Route path="/signup" element={user ? <Navigate to="/" replace /> : <Signup />} />
        
        <Route path="/" element={getHomeElement()} />

        <Route path="/welcome" element={<ProtectedRoute><Welcome /></ProtectedRoute>} />
        <Route path="/tipo-conta" element={<ProtectedRoute><AccountTypeSelection /></ProtectedRoute>} />
        <Route path="/onboarding-pf" element={<ProtectedRoute><OnboardingPF /></ProtectedRoute>} />
        <Route path="/onboarding-pj" element={<ProtectedRoute><OnboardingPJ /></ProtectedRoute>} />

        <Route path="/dashboard/pf" element={<ProtectedRoute allowedRoles={['PF']}><Layout><DashboardPF /></Layout></ProtectedRoute>} />
        <Route path="/dashboard/pj" element={<ProtectedRoute allowedRoles={['PJ']}><DashboardPJ /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute allowedRoles={['ADM']}><Admin /></ProtectedRoute>} />

        <Route path="/feed" element={<ProtectedRoute><Layout><Feed /></Layout></ProtectedRoute>} />
        <Route path="/novo-pedido" element={<ProtectedRoute><Layout><CreateRequest /></Layout></ProtectedRoute>} />
        <Route path="/perfil" element={<ProtectedRoute><Layout><Profile /></Layout></ProtectedRoute>} />
        <Route path="/perfil/editar" element={<ProtectedRoute><Layout><EditProfile /></Layout></ProtectedRoute>} />
        <Route path="/convidar" element={<ProtectedRoute><Layout><InviteFriends /></Layout></ProtectedRoute>} />
        <Route path="/historico" element={<ProtectedRoute><Layout><DonationHistory /></Layout></ProtectedRoute>} />
        <Route path="/impacto" element={<ProtectedRoute><Layout><Impact /></Layout></ProtectedRoute>} />
        <Route path="/pagamentos" element={<ProtectedRoute><Layout><Payments /></Layout></ProtectedRoute>} />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};

const App = () => (
  <ErrorBoundary>
    <NotificationProvider>
      <AppProvider>
        <Router><AppRoutes /></Router>
      </AppProvider>
    </NotificationProvider>
  </ErrorBoundary>
);

export default App;
