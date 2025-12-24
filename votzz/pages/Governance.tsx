import React, { useState, useEffect } from 'react';
import { 
  BarChart2, CheckSquare, Megaphone, Calendar as CalendarIcon, 
  Plus, Clock, AlertCircle, FileText, UserCheck, Bell, Target, 
  ChevronRight, ShieldCheck, Eye, CheckCircle
} from 'lucide-react';
import { api } from '../services/api'; // API Real
import { Poll, Announcement, User, GovernanceActivity } from '../types';

interface GovernanceProps {
  user: User | null;
}

const Governance: React.FC<GovernanceProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'polls' | 'comms' | 'calendar'>('dashboard');
  const [polls, setPolls] = useState<Poll[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [activities, setActivities] = useState<GovernanceActivity[]>([]);
  const [loading, setLoading] = useState(true);

  // Estados de Criação
  const [showCreatePoll, setShowCreatePoll] = useState(false);
  const [newPollData, setNewPollData] = useState({ title: '', description: '', targetAudience: 'ALL', options: ['Sim', 'Não'] });
  const [showCreateAnn, setShowCreateAnn] = useState(false);
  const [newAnnData, setNewAnnData] = useState({ 
    title: '', content: '', priority: 'NORMAL', targetType: 'ALL', targetValue: '', requiresConfirmation: false 
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
        setLoading(true);
        // Buscando dados reais em paralelo
        const [pollsRes, annRes, auditRes] = await Promise.all([
            api.get('/polls').catch(() => ({ data: [] })), // Fallback se endpoint nao existir
            api.get('/announcements'),
            api.get('/audit-logs')
        ]);

        setPolls(pollsRes.data);
        setAnnouncements(annRes.data);

        // Transformando logs de auditoria em "Atividades"
        const mappedActivities = auditRes.data.map((log: any) => ({
             id: log.id,
             type: 'DOC',
             description: log.action || 'Ação do Sistema',
             date: log.timestamp || new Date().toISOString(),
             user: log.userId
        }));
        setActivities(mappedActivities);
    } catch (e) {
        console.error("Erro ao carregar dados de governança", e);
    } finally {
        setLoading(false);
    }
  };

  const handleCreatePoll = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        await api.post('/polls', {
            ...newPollData,
            // Backend espera lista de objetos, mas o form usa strings simples por enquanto
            options: newPollData.options.map(opt => ({ descricao: opt })), 
            endDate: new Date(Date.now() + 86400000 * 7).toISOString()
        });
        setShowCreatePoll(false);
        loadData();
    } catch (e) { alert("Erro ao criar enquete"); }
  };

  const handleCreateAnn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        await api.post('/announcements', newAnnData);
        setShowCreateAnn(false);
        loadData();
    } catch (e) { alert("Erro ao criar comunicado"); }
  };

  const handleVotePoll = async (pollId: string, optionId: string) => {
    if (!user) return;
    try {
        await api.post(`/polls/${pollId}/vote`, { userId: user.id, optionId });
        loadData();
    } catch (e) { alert("Erro ao votar"); }
  };

  const handleReadAnnouncement = async (id: string) => {
      if(!user) return;
      try {
        await api.post(`/announcements/${id}/read`, { userId: user.id });
        loadData();
      } catch (e) { console.error(e); }
  };

  const unreadCount = announcements.filter(a => user && a.readBy && !a.readBy.includes(user.id)).length;
  const activePolls = polls.filter(p => p.status === 'OPEN').length;

  return (
    <div className="space-y-8">
       {/* Header */}
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl font-bold text-slate-800">Governança Digital</h1>
                <span className="bg-gradient-to-r from-amber-400 to-yellow-500 text-white text-xs font-bold px-2 py-0.5 rounded shadow-sm flex items-center">
                   PRO
                </span>
            </div>
            <p className="text-slate-500">Gestão contínua, comunicados e micro-decisões.</p>
          </div>
          <div className="flex bg-white p-1 rounded-lg border border-slate-200 shadow-sm">
             <TabButton active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} icon={BarChart2} label="Visão Geral" />
             <TabButton active={activeTab === 'polls'} onClick={() => setActiveTab('polls')} icon={CheckSquare} label="Enquetes" />
             <TabButton active={activeTab === 'comms'} onClick={() => setActiveTab('comms')} icon={Megaphone} label="Mural" badge={unreadCount > 0 ? unreadCount : undefined} />
          </div>
       </div>

       {loading ? <div className="p-10 text-center">Carregando governança...</div> : (
         <>
           {/* DASHBOARD CONTENT */}
           {activeTab === 'dashboard' && (
               <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
                   <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                      <KpiCard title="Enquetes Ativas" value={activePolls} icon={CheckSquare} color="text-blue-600" bg="bg-blue-100" />
                      <KpiCard title="Não Lidos" value={unreadCount} icon={Bell} color="text-orange-600" bg="bg-orange-100" />
                      <KpiCard title="Participação" value="82%" icon={UserCheck} color="text-emerald-600" bg="bg-emerald-100" />
                      <KpiCard title="Atividades" value={activities.length} icon={FileText} color="text-purple-600" bg="bg-purple-100" />
                   </div>
                   
                   {/* Activity Feed Simples */}
                   <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                       <h3 className="font-bold text-slate-800 mb-4">Últimas Atividades</h3>
                       <div className="space-y-4">
                           {activities.slice(0, 5).map((act, idx) => (
                               <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                   <span className="text-sm font-medium">{act.description}</span>
                                   <span className="text-xs text-slate-500">{new Date(act.date).toLocaleDateString()}</span>
                               </div>
                           ))}
                       </div>
                   </div>
               </div>
           )}

           {/* POLLS CONTENT */}
           {activeTab === 'polls' && (
               <div className="space-y-6 animate-in fade-in">
                   <div className="flex justify-between items-center">
                       <h2 className="text-xl font-bold text-slate-800">Enquetes</h2>
                       {user?.role === 'MANAGER' && (
                           <button onClick={() => setShowCreatePoll(true)} className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-bold flex items-center hover:bg-emerald-700">
                               <Plus className="w-4 h-4 mr-2" /> Criar Enquete
                           </button>
                       )}
                   </div>

                   {/* Form de Criação Simplificado */}
                   {showCreatePoll && (
                       <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                           <form onSubmit={handleCreatePoll} className="space-y-4">
                               <input type="text" placeholder="Título" required className="w-full p-2 border rounded" value={newPollData.title} onChange={e => setNewPollData({...newPollData, title: e.target.value})} />
                               <textarea placeholder="Descrição" required className="w-full p-2 border rounded" value={newPollData.description} onChange={e => setNewPollData({...newPollData, description: e.target.value})} />
                               <div className="flex justify-end gap-2">
                                   <button type="button" onClick={() => setShowCreatePoll(false)} className="px-4 py-2 text-slate-600">Cancelar</button>
                                   <button type="submit" className="px-4 py-2 bg-emerald-600 text-white rounded font-bold">Salvar</button>
                               </div>
                           </form>
                       </div>
                   )}

                   {/* Lista de Polls */}
                   <div className="grid md:grid-cols-2 gap-6">
                       {polls.map(poll => (
                           <div key={poll.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                               <h3 className="font-bold text-lg">{poll.title}</h3>
                               <p className="text-slate-500 mb-4">{poll.description}</p>
                               <div className="space-y-2">
                                   {poll.options?.map(opt => (
                                       <button key={opt.id} onClick={() => handleVotePoll(poll.id, opt.id)} className="w-full text-left p-2 border rounded hover:bg-slate-50">
                                           {opt.descricao || opt.label}
                                       </button>
                                   ))}
                               </div>
                           </div>
                       ))}
                   </div>
               </div>
           )}

           {/* ANNOUNCEMENTS CONTENT (Simplificado) */}
           {activeTab === 'comms' && (
                <div className="space-y-6 animate-in fade-in">
                     <h2 className="text-xl font-bold text-slate-800">Mural de Avisos</h2>
                     {announcements.map(ann => (
                          <div key={ann.id} className="p-6 bg-white rounded-xl border shadow-sm">
                              <h3 className="font-bold text-lg">{ann.title}</h3>
                              <p className="text-slate-600 mt-2">{ann.content}</p>
                          </div>
                      ))}
                </div>
           )}
         </>
       )}
    </div>
  );
};

// UI Helpers
const TabButton = ({ active, onClick, icon: Icon, label, badge }: any) => (
    <button onClick={onClick} className={`flex-1 flex items-center justify-center py-2 px-4 rounded-md text-sm font-medium transition-all ${active ? 'bg-white shadow text-emerald-600' : 'text-slate-500 hover:text-slate-700'}`}>
        <Icon className="w-4 h-4 mr-2" /> {label}
        {badge && <span className="ml-2 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">{badge}</span>}
    </button>
);
const KpiCard = ({ title, value, icon: Icon, color, bg }: any) => (
    <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between">
        <div><p className="text-slate-500 text-xs font-medium uppercase">{title}</p><p className="text-2xl font-bold text-slate-800 mt-1">{value}</p></div>
        <div className={`${bg} p-2 rounded-lg`}><Icon className={`w-5 h-5 ${color}`} /></div>
    </div>
);

export default Governance;