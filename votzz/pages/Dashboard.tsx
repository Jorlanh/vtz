import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, CheckCircle, Plus, Wallet, Calendar, ShieldAlert, ArrowRight, Megaphone, FileText 
} from 'lucide-react';
import { api } from '../services/api'; 
import { Assembly, User, AuditLog } from '../types';

interface DashboardProps {
  user: User | null;
}

export const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const [assemblies, setAssemblies] = useState<Assembly[]>([]);
  const [financial, setFinancial] = useState({ balance: 0, lastUpdate: '' });
  const [condoUsers, setCondoUsers] = useState<User[]>([]);
  const [activities, setActivities] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      // Realiza as chamadas aos endpoints que consomem seu DDL/DML
      const [assData, finData, usersData, auditData] = await Promise.all([
        api.get('/assemblies'),
        api.get('/financial/balance'),
        api.get('/users'),
        api.get('/reports/audit')
      ]);
      
      setAssemblies(assData.data || []);
      setFinancial(finData.data || { balance: 0, lastUpdate: 'Pendente' });
      setCondoUsers(usersData.data || []);
      setActivities(auditData.data || []);
    } catch (e) {
      console.error("Erro ao sincronizar com o banco de dados real", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Sincronizado com seu DML: admin@votzz.com tem role 'SYNDIC'
  const isManager = user?.role === 'ADMIN' || user?.role === 'SYNDIC';
  const totalVotes = assemblies.reduce((acc, curr) => acc + (curr.votes?.length || 0), 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            {/* Tratamento para exibir o nome 'Síndico Carlos' do seu DML */}
            {isManager 
              ? `Olá, ${user?.nome || 'Gestor'}` 
              : `Olá, ${user?.nome?.split(' ')[0] || 'Morador'}`}
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
            {/* Exibe o saldo NUMERIC(19,2) da tabela condo_financial */}
            <h2 className="text-4xl font-black mt-2">
              R$ {financial.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </h2>
            <button className="mt-6 bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-lg font-bold text-[10px] uppercase transition-all flex items-center gap-2">
               <Plus size={14} /> Atualizar Saldo Agora
            </button>
          </div>
          <Wallet className="absolute right-[-10px] bottom-[-10px] text-white/5 w-40 h-40" />
        </div>

        <div className="grid grid-cols-2 gap-4">
           <div className="bg-white p-6 rounded-2xl border shadow-sm flex flex-col justify-center">
              <Users className="text-blue-500 mb-2" />
              <p className="text-2xl font-bold text-slate-800">{condoUsers.length}</p>
              <p className="text-xs text-slate-500 font-medium">Moradores Reais</p>
           </div>
           <div className="bg-white p-6 rounded-2xl border shadow-sm flex flex-col justify-center">
              <CheckCircle className="text-emerald-500 mb-2" />
              <p className="text-2xl font-bold text-slate-800">{totalVotes}</p>
              <p className="text-xs text-slate-500 font-medium">Votos Computados</p>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
         <button className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl flex items-center gap-3 text-emerald-700 font-bold hover:bg-emerald-100 transition-colors">
            <Plus size={20} /> Nova Assembleia
         </button>
         <button className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex items-center gap-3 text-blue-700 font-bold hover:bg-blue-100 transition-colors">
            <Megaphone size={20} /> Novo Comunicado
         </button>
         <Link to="/reports" className="bg-slate-50 border border-slate-100 p-4 rounded-xl flex items-center gap-3 text-slate-700 font-bold hover:bg-slate-100 transition-colors">
            <FileText size={20} /> Relatórios
         </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h2 className="text-lg font-bold text-slate-800">Atividades Recentes no Condomínio</h2>
          <Link to="/reports" className="text-sm text-emerald-600 font-medium hover:underline flex items-center">
            Ver tudo <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
        <div className="divide-y divide-slate-50">
          {activities.slice(0, 5).map((log) => (
            <div key={log.id} className="p-4 flex items-center hover:bg-slate-50 transition-colors">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mr-4">
                <ShieldAlert className="w-5 h-5 text-slate-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-800">
                  {log.acao} - {log.details}
                </p>
                <p className="text-xs text-slate-500">{new Date(log.timestamp).toLocaleString()}</p>
              </div>
            </div>
          ))}
          {activities.length === 0 && !loading && (
            <div className="p-8 text-center text-slate-400 italic">Nenhum log de atividade encontrado no banco.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;