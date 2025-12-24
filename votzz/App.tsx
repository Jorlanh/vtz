import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layout e Componentes
import Layout from './components/Layout';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import LandingPage from './pages/LandingPage';

// Outras Páginas
import AssemblyList from './pages/AssemblyList';
import CreateAssembly from './pages/CreateAssembly';
import VotingRoom from './pages/VotingRoom';
import Governance from './pages/Governance';
import Reports from './pages/Reports';
import Facilities from './pages/Facilities';
import Blog from './pages/Blog';
import FAQ from './pages/FAQ';
import PrivacyPolicy from './pages/PrivacyPolicy';

import { User } from './types';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // 1. EFEITO DE PERSISTÊNCIA: Recupera o usuário ao recarregar a página
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('accessToken');
    
    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Erro ao restaurar sessão");
        localStorage.clear();
      }
    }
    setLoading(false);
  }, []);

  // 2. HANDLERS DE LOGIN/LOGOUT
  const handleLogin = (loggedUser: User) => {
    setUser(loggedUser);
    localStorage.setItem('user', JSON.stringify(loggedUser));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
  };

  // 3. PROTEÇÃO DE TELA BRANCA: Não renderiza rotas enquanto carrega
  if (loading) {
    return <div className="h-screen flex items-center justify-center text-slate-500">Carregando Votzz...</div>;
  }

  // 4. COMPONENTE DE ROTA PROTEGIDA
  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    if (!user) {
      return <Navigate to="/login" replace />;
    }
    return <Layout user={user} onLogout={handleLogout}>{children}</Layout>;
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* --- ROTAS PÚBLICAS --- */}
        <Route path="/" element={<LandingPage user={user} />} />
        
        <Route 
          path="/login" 
          element={user ? <Navigate to="/dashboard" replace /> : <Auth onLogin={handleLogin} />} 
        />

        {/* Páginas Institucionais */}
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<Blog />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />

        {/* --- ROTAS PRIVADAS --- */}
        <Route path="/dashboard" element={
          <ProtectedRoute><Dashboard user={user} /></ProtectedRoute>
        } />
        
        <Route path="/assemblies" element={
          <ProtectedRoute><AssemblyList user={user} /></ProtectedRoute>
        } />
        
        <Route path="/assemblies/new" element={
          <ProtectedRoute><CreateAssembly /></ProtectedRoute>
        } />
        
        <Route path="/assembly/:id" element={
          <ProtectedRoute><VotingRoom user={user!} /></ProtectedRoute>
        } />
        
        <Route path="/governance" element={
          <ProtectedRoute><Governance user={user} /></ProtectedRoute>
        } />
        
        <Route path="/reports" element={
          <ProtectedRoute><Reports /></ProtectedRoute>
        } />
        
        <Route path="/facilities" element={
          <ProtectedRoute><Facilities user={user} /></ProtectedRoute>
        } />

        {/* Rota Coringa (404) */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;