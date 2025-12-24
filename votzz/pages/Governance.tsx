import React, { useState, useEffect } from 'react';
import { 
  BarChart2, CheckSquare, Megaphone, Calendar as CalendarIcon, Plus, Clock, AlertCircle, FileText, UserCheck, Search, CheckCircle, ChevronRight, ShieldCheck, Bell, Target, Eye
} from 'lucide-react';
import { api } from '../services/api'; // Alterado para API Real
import { Poll, Announcement, User, GovernanceActivity } from '../types';

interface GovernanceProps {
  user: User | null;
}

const Governance: React.FC<GovernanceProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'polls' | 'comms' | 'calendar'>('dashboard');
  const [polls, setPolls] = useState<Poll[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [activities, setActivities] = useState<GovernanceActivity[]>([]);
  const isManager = user?.role === 'MANAGER' || user?.role === 'SYNDIC';

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [pRes, aRes, actRes] = await Promise.all([
        api.get('/polls'),
        api.get('/announcements'),
        api.get('/governance/activity')
      ]);
      setPolls(pRes.data);
      setAnnouncements(aRes.data);
      setActivities(actRes.data);
    } catch (e) {
      console.error("Erro ao carregar dados de governança.");
    }
  };

  const handleVotePoll = async (pollId: string, optionId: string) => {
    try {
      await api.post(`/polls/${pollId}/vote`, { optionId });
      loadData();
    } catch (e) {
      alert("Erro ao registrar voto.");
    }
  };

  return (
    <div className="space-y-8">
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Governança Digital</h1>
            <p className="text-slate-500">Gestão de micro-decisões e comunicados reais.</p>
          </div>
          <div className="flex bg-white p-1 rounded-lg border border-slate-200">
             <TabButton active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} icon={BarChart2} label="Visão Geral" />
             <TabButton active={activeTab === 'polls'} onClick={() => setActiveTab('polls')} icon={CheckSquare} label="Micro-decisões" />
             <TabButton active={activeTab === 'comms'} onClick={() => setActiveTab('comms')} icon={Megaphone} label="Comunicados" />
          </div>
       </div>

       {activeTab === 'polls' && (
         <div className="grid md:grid-cols-2 gap-6">
            {polls.map(poll => (
               <div key={poll.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                  <h3 className="font-bold text-slate-900">{poll.title}</h3>
                  <div className="mt-4 space-y-2">
                     {poll.options.map(opt => (
                        <button key={opt.id} onClick={() => handleVotePoll(poll.id, opt.id)} className="w-full border rounded-lg p-3 text-left hover:bg-slate-50">
                           {opt.label}
                        </button>
                     ))}
                  </div>
               </div>
            ))}
         </div>
       )}
       {/* Demais sessões seguem a mesma lógica de mapeamento do data vindo da API */}
    </div>
  );
};

const TabButton = ({ active, onClick, icon: Icon, label }: any) => (
    <button onClick={onClick} className={`flex-1 flex items-center justify-center py-2 px-4 rounded-md text-sm font-medium transition-all ${active ? 'bg-emerald-600 text-white shadow' : 'text-slate-500 hover:bg-slate-50'}`}>
        <Icon className="w-4 h-4 mr-2" /> {label}
    </button>
);

export default Governance;