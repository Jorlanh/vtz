
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area 
} from 'recharts';
import { 
  Users, 
  FileText, 
  CheckCircle, 
  AlertTriangle, 
  Plus, 
  Megaphone, 
  TrendingUp, 
  Clock,
  ArrowRight,
  ShieldAlert,
  Calendar
} from 'lucide-react';
import { MockService } from '../services/mockDataService';
import { Assembly, User } from '../types';

interface DashboardProps {
  user: User | null;
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const [assemblies, setAssemblies] = useState<Assembly[]>([]);
  
  useEffect(() => {
    MockService.getAssemblies().then(setAssemblies);
  }, []);

  const activeAssemblies = assemblies.filter(a => a.status === 'OPEN');
  const totalVotes = assemblies.reduce((acc, curr) => acc + curr.votes.length, 0);

  // Mock Data for Charts
  const chartData = [
    { name: 'Jan', votos: 40, participacao: 20 },
    { name: 'Fev', votos: 30, participacao: 25 },
    { name: 'Mar', votos: 20, participacao: 15 },
    { name: 'Abr', votos: 65, participacao: 55 },
    { name: 'Mai', votos: 45, participacao: 40 },
    { name: 'Jun', votos: 80, participacao: 70 },
  ];

  const engagementData = [
    { name: 'Votaram', value: 78, color: '#10b981' }, 
    { name: 'Pendentes', value: 22, color: '#e2e8f0' }
  ];

  // Identificar assembleias críticas (Ex: acabam em breve com quórum baixo)
  const criticalAssemblies = activeAssemblies.filter(a => {
    const hoursLeft = (new Date(a.endDate).getTime() - Date.now()) / 36e5;
    return hoursLeft < 48 && hoursLeft > 0;
  });

  const isManager = user?.role === 'MANAGER';

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            {isManager ? `Olá, Síndico ${user?.name.split(' ')[0]}` : `Olá, ${user?.name.split(' ')[0]}`}
          </h1>
          <p className="text-slate-500 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        </div>
        <div className="flex items-center gap-3">
           <span className="text-xs font-medium bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full border border-emerald-200">
             Sistema Operacional
           </span>
        </div>
      </div>

      {/* Quick Actions (Manager Only) */}
      {isManager && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link to="/create-assembly" className="bg-emerald-600 hover:bg-emerald-700 text-white p-4 rounded-xl shadow-md transition-all hover:-translate-y-1 flex flex-col items-center justify-center text-center group">
            <div className="bg-white/20 p-2 rounded-full mb-2 group-hover:scale-110 transition-transform">
              <Plus className="w-6 h-6" />
            </div>
            <span className="font-bold text-sm">Nova Assembleia</span>
          </Link>
          
          <Link to="/governance" className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-xl shadow-md transition-all hover:-translate-y-1 flex flex-col items-center justify-center text-center group">
            <div className="bg-white/20 p-2 rounded-full mb-2 group-hover:scale-110 transition-transform">
              <Megaphone className="w-6 h-6" />
            </div>
            <span className="font-bold text-sm">Novo Comunicado</span>
          </Link>

          <Link to="/reports" className="bg-slate-700 hover:bg-slate-800 text-white p-4 rounded-xl shadow-md transition-all hover:-translate-y-1 flex flex-col items-center justify-center text-center group">
            <div className="bg-white/20 p-2 rounded-full mb-2 group-hover:scale-110 transition-transform">
              <FileText className="w-6 h-6" />
            </div>
            <span className="font-bold text-sm">Relatórios</span>
          </Link>

          <div className="bg-white border border-slate-200 text-slate-600 p-4 rounded-xl shadow-sm transition-all flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-50">
            <div className="bg-slate-100 p-2 rounded-full mb-2">
              <Users className="w-6 h-6 text-slate-500" />
            </div>
            <span className="font-medium text-sm">Gerenciar Usuários</span>
          </div>
        </div>
      )}

      {/* KPI Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: 'Assembleias Abertas', value: activeAssemblies.length, icon: FileText, color: 'text-blue-600', bg: 'bg-blue-100' },
          { title: 'Total de Votos (Ano)', value: totalVotes + 124, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-100' }, // Mock +124 historic
          { title: 'Engajamento Médio', value: '78%', icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-100' },
          { title: 'Atenção Necessária', value: criticalAssemblies.length, icon: AlertTriangle, color: 'text-orange-600', bg: 'bg-orange-100' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
             <div>
                <p className="text-slate-500 text-xs font-medium uppercase">{stat.title}</p>
                <h3 className="text-2xl font-bold text-slate-800 mt-1">{stat.value}</h3>
             </div>
             <div className={`${stat.bg} p-3 rounded-lg`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
             </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-slate-800">Evolução de Participação</h2>
            <select className="text-sm border-none bg-slate-50 rounded-lg px-2 py-1 text-slate-600 focus:ring-0 cursor-pointer">
              <option>Últimos 6 meses</option>
              <option>Este Ano</option>
            </select>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorVotos" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: '#1e293b', fontWeight: 600 }}
                />
                <Area type="monotone" dataKey="votos" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorVotos)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Alerts & Quorum */}
        <div className="space-y-6">
           {/* Critical Alerts Widget */}
           {criticalAssemblies.length > 0 ? (
             <div className="bg-orange-50 p-5 rounded-xl border border-orange-100">
               <div className="flex items-center gap-2 mb-3">
                 <ShieldAlert className="w-5 h-5 text-orange-600" />
                 <h3 className="font-bold text-orange-800">Atenção Necessária</h3>
               </div>
               <div className="space-y-3">
                 {criticalAssemblies.map(a => (
                   <div key={a.id} className="bg-white p-3 rounded-lg border border-orange-100 shadow-sm">
                      <p className="text-sm font-bold text-slate-800 line-clamp-1">{a.title}</p>
                      <p className="text-xs text-orange-600 mt-1 flex items-center">
                        <Clock className="w-3 h-3 mr-1" /> Encerra em breve
                      </p>
                      <Link to={`/assembly/${a.id}`} className="text-xs font-bold text-slate-500 mt-2 block hover:text-orange-600">
                        Verificar Quórum &rarr;
                      </Link>
                   </div>
                 ))}
               </div>
             </div>
           ) : (
             <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 h-[200px] flex flex-col items-center justify-center text-center">
                <CheckCircle className="w-12 h-12 text-emerald-200 mb-3" />
                <h3 className="font-bold text-slate-700">Tudo em dia!</h3>
                <p className="text-xs text-slate-500 mt-1">Nenhuma assembleia crítica no momento.</p>
             </div>
           )}

           {/* Quorum Chart */}
           <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
             <h3 className="font-bold text-slate-800 mb-4 text-sm">Status Quórum (AGE Atual)</h3>
             <div className="h-40 flex items-center justify-center relative">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={engagementData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={70}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {engagementData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                   <span className="text-2xl font-bold text-slate-800">78%</span>
                </div>
             </div>
           </div>
        </div>
      </div>

      {/* Recent Activity Feed */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h2 className="text-lg font-bold text-slate-800">Atividades Recentes no Condomínio</h2>
          <Link to="/reports" className="text-sm text-emerald-600 font-medium hover:underline flex items-center">
            Ver tudo <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
        <div className="divide-y divide-slate-50">
           {[
             { user: 'Apto 302', action: 'Votou na Assembleia AGE Fachada', time: '10 min atrás', icon: CheckCircle, color: 'text-emerald-500' },
             { user: 'Síndico', action: 'Publicou novo comunicado: Elevador', time: '1 hora atrás', icon: Megaphone, color: 'text-blue-500' },
             { user: 'Apto 104', action: 'Comentou na pauta de Reforma', time: '3 horas atrás', icon: FileText, color: 'text-slate-400' },
             { user: 'Sistema', action: 'Backup diário realizado', time: '5 horas atrás', icon: ShieldAlert, color: 'text-slate-400' },
           ].map((item, idx) => (
             <div key={idx} className="p-4 flex items-center hover:bg-slate-50 transition-colors">
                <div className={`w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mr-4`}>
                   <item.icon className={`w-5 h-5 ${item.color}`} />
                </div>
                <div className="flex-1">
                   <p className="text-sm font-medium text-slate-800">
                     <span className="font-bold">{item.user}</span> {item.action}
                   </p>
                   <p className="text-xs text-slate-500">{item.time}</p>
                </div>
                <button className="text-slate-400 hover:text-slate-600">
                  <ArrowRight className="w-4 h-4" />
                </button>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
