import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { User as UserIcon, Lock, Mail, CreditCard } from 'lucide-react';
import { api } from '../services/api';
import { Logo } from '../components/Logo';

interface AuthProps {
  onLogin: (user: any) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  // Estados dos campos - NOMES SINCRONIZADOS COM O JAVA
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');

  useEffect(() => {
    if (location.state?.isRegister) setIsLogin(false);
  }, [location.state]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        // Chamada de Login Real
        const response = await api.post('/auth/login', { email, password });
        const { token, user } = response.data;

        localStorage.setItem('vtz_token', token);
        localStorage.setItem('vtz_user', JSON.stringify(user));

        onLogin(user);
        navigate('/dashboard');
      } else {
        // Chamada de Registro Real (Sincronizado com User.java)
        await api.post('/auth/register', { 
          nome: nome,      // Atributo 'nome' no Java
          email: email,    // Atributo 'email' no Java
          password: password, // Atributo 'password' no Java
          cpf: cpf,        // Atributo 'cpf' no Java
          role: 'RESIDENT' 
        });
        
        alert("Cadastro realizado com sucesso! Agora você já pode entrar.");
        setIsLogin(true);
      }
    } catch (err: any) {
      // Captura a mensagem de erro vinda do Map.of("message", ...) do Java
      const msg = err.response?.data?.message || 'Erro ao processar. Verifique os dados.';
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="bg-slate-900 p-12 flex flex-col items-center justify-center border-b-4 border-emerald-500">
          <Link to="/" className="hover:opacity-90 transition-opacity">
            <Logo theme="light" size="lg" showSlogan={true} />
          </Link>
          <p className="text-slate-400 text-sm mt-6 font-medium tracking-wide uppercase">Decisão Condominial Inteligente</p>
        </div>

        <div className="p-8">
          <form onSubmit={handleAuth} className="space-y-4">
            <div className="text-center mb-6">
              <h2 className="text-xl font-semibold text-slate-800">
                {isLogin ? 'Bem-vindo de volta' : 'Crie sua conta'}
              </h2>
            </div>

            {!isLogin && (
              <>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nome Completo</label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                    <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 transition-all outline-none" placeholder="Ex: João Silva" required />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">CPF</label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                    <input type="text" value={cpf} onChange={(e) => setCpf(e.target.value)} className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 transition-all outline-none" placeholder="000.000.000-00" required />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">E-mail</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 transition-all outline-none" placeholder="seu@email.com" required />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Senha</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 transition-all outline-none" placeholder="••••••••" required />
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-lg transition-all shadow-md hover:shadow-lg disabled:opacity-50 mt-4">
              {loading ? 'Processando...' : (isLogin ? 'Entrar no Sistema' : 'Finalizar Cadastro')}
            </button>

            <div className="text-center mt-6">
              <button type="button" onClick={() => setIsLogin(!isLogin)} className="text-sm text-emerald-600 font-bold hover:underline">
                {isLogin ? 'Não tem acesso? Cadastre-se aqui' : 'Já possui conta? Faça o login'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Auth;