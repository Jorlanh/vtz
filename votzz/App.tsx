import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { AssemblyList } from './pages/AssemblyList';
import { CreateAssembly } from './pages/CreateAssembly';
import { VotingRoom } from './pages/VotingRoom';
import Reports from './pages/Reports';
import Auth from './pages/Auth';
import LandingPage from './pages/LandingPage';
import GovernanceSales from './pages/GovernanceSales';
import Blog from './pages/Blog';
import Pricing from './pages/Pricing';
import FAQ from './pages/FAQ';
import Governance from './pages/Governance';
import Facilities from './pages/Facilities';
import Compliance from './pages/Compliance';
import TermsOfUse from './pages/TermsOfUse';
import PrivacyPolicy from './pages/PrivacyPolicy';
import { User } from './types';

interface ProtectedRouteProps {
  user: User | null;
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ user, children }) => {
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const App: React.FC = () => {
  // PERSISTÊNCIA: Carrega do localStorage para evitar erro 401 ao dar F5
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('vtz_user');
    return saved ? JSON.parse(saved) : null;
  });

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
  };

  const handleLogout = () => {
    localStorage.removeItem('vtz_user');
    localStorage.removeItem('vtz_token');
    setUser(null);
  };

  return (
    <Router>
      <Routes>
        {/* Rota Inicial: Landing Page */}
        <Route path="/" element={<LandingPage user={user} />} />

        {/* Rota de Autenticação */}
        <Route 
          path="/login" 
          element={user ? <Navigate to="/dashboard" /> : <Auth onLogin={handleLogin} />} 
        />

        {/* Rotas Públicas */}
        <Route path="/governance-solutions" element={<GovernanceSales user={user} />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/compliance" element={<Compliance />} />
        <Route path="/terms" element={<TermsOfUse />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />

        {/* Rotas Protegidas (Exigem Login) */}
        <Route path="/dashboard" element={
          <ProtectedRoute user={user}>
            <Layout user={user} onLogout={handleLogout}>
              <Dashboard user={user} />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/governance" element={
          <ProtectedRoute user={user}>
            <Layout user={user} onLogout={handleLogout}>
              <Governance user={user} />
            </Layout>
          </ProtectedRoute>
        } />

        <Route path="/facilities" element={
          <ProtectedRoute user={user}>
            <Layout user={user} onLogout={handleLogout}>
              <Facilities user={user} />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/assemblies" element={
          <ProtectedRoute user={user}>
            <Layout user={user} onLogout={handleLogout}>
              <AssemblyList />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/create-assembly" element={
          <ProtectedRoute user={user}>
            <Layout user={user} onLogout={handleLogout}>
              {/* Sincronizado com Role SYNDIC do seu DML */}
              {user?.role === 'SYNDIC' || user?.role === 'ADMIN' ? <CreateAssembly /> : <Navigate to="/assemblies" />}
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/assembly/:id" element={
          <ProtectedRoute user={user}>
            <Layout user={user} onLogout={handleLogout}>
              <VotingRoom />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/reports" element={
          <ProtectedRoute user={user}>
            <Layout user={user} onLogout={handleLogout}>
              <Reports />
            </Layout>
          </ProtectedRoute>
        } />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;