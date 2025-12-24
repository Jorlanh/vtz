import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area 
} from 'recharts';
import { 
  Users, FileText, CheckCircle, AlertTriangle, Plus, Megaphone, TrendingUp, Clock, ArrowRight, ShieldAlert, Calendar, Wallet, Shield
} from 'lucide-react';
// REMOVIDO: MockService
import { api } from '../services/api'; 
import { Assembly, User } from '../types';

interface DashboardProps {
  user: User | null;
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const [assemblies, setAssemblies] = useState<Assembly[]>([]);
  const [financial, setFinancial] = useState({ balance: 0, lastUpdate: '' });
  const [condoUsers, setCondoUsers] = useState<User[]>([]);
  const [showUserList, setShowUserList] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [assData, finData, usersData] = await Promise.all([
        api.get('/assemblies'),
        api.get('/financial/balance'),
        api.get('/users')
      ]);
      setAssemblies(assData.data || []); // Axios usa .data
      setFinancial(finData.data || { balance: 0, lastUpdate: 'N/A' });
      setCondoUsers(usersData.data || []);
    } catch (e) {
      console.error("Erro ao carregar dados do backend", e);
    }
  };

  const handlePromoteUser = async (userId: string) => {
    if (window.confirm("Deseja dar cargo de Administrador a este usuário?")) {
      try {
        await api.patch(`/users/${userId}/role`, { role: 'MANAGER' });
        alert("Usuário promovido!");
        loadData();
      } catch (err) {
        alert("Erro ao promover usuário.");
      }
    }
  };

  const activeAssemblies = assemblies.filter(a => a.status === 'ABERTA');
  const totalVotes = assemblies.reduce((acc, curr) => acc + (curr.votes?.length || 0), 0);
  
  // Verifica se é administrador (MANAGER ou SYNDIC conforme seu Java)
  const isManager = user?.role === 'MANAGER' || user?.role === 'SYNDIC';

  // MOCK de gráficos mantido para UI, mas use nomes reais se o banco tiver dados
  const chartData = [
    { name: 'Jan', votos: 40 }, { name: 'Fev', votos: 30 }, { name: 'Mar', votos: 20 },
    { name: 'Abr', votos: 65 }, { name: 'Mai', votos: 45 }, { name: 'Jun', votos: 80 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            {/* Correção para user.nome do Java */}
            {isManager ? `Olá, Gestor ${user?.nome.split(' ')[0]}` : `Olá, ${user?.nome.split(' ')[0]}`}
          </h1>
          <p className="text-slate-500 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-xl border-b-4 border-emerald-500 relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-emerald-400 text-xs font-bold uppercase tracking-widest">Saldo Atual em Caixa</p>
            <h2 className="text-4xl font-black mt-2">R$ {financial.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h2>
            {isManager && (
              <button 
                onClick={() => {
                  const val = prompt("Informe o saldo atualizado (R$):", financial.balance.toString());
                  if(val && !isNaN(parseFloat(val))) {
                    api.post('/financial/update', { balance: parseFloat(val) }).then(loadData);
                  }
                }}
                className="mt-6 bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-lg font-bold text-[10px] uppercase transition-all"
              >
                <Plus size={14} /> Atualizar Saldo
              </button>
            )}
          </div>
          <Wallet className="absolute right-[-10px] bottom-[-10px] text-white/5 w-40 h-40" />
        </div>

        <div className="grid grid-cols-2 gap-4">
           <div className="bg-white p-6 rounded-2xl border shadow-sm flex flex-col justify-center">
              <Users className="text-blue-500 mb-2" />
              <p className="text-2xl font-bold text-slate-800">{condoUsers.length}</p>
              <p className="text-xs text-slate-500 font-medium">Moradores Ativos</p>
           </div>
           <div className="bg-white p-6 rounded-2xl border shadow-sm flex flex-col justify-center">
              <CheckCircle className="text-emerald-500 mb-2" />
              <p className="text-2xl font-bold text-slate-800">{totalVotes}</p>
              <p className="text-xs text-slate-500 font-medium">Votos Totais</p>
           </div>
        </div>
      </div>
      
      {/* Restante do seu JSX... substituindo u.name por u.nome na tabela de usuários */}
    </div>
  );
};

export default Dashboard;