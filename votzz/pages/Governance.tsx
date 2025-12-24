import React, { useState, useEffect } from 'react';
import { 
  BarChart2, CheckSquare, Megaphone, Plus, Clock, CheckCircle, ChevronRight 
} from 'lucide-react';
import { api } from '../services/api';
import { Poll, Announcement, User } from '../types';

interface GovernanceProps {
  user: User | null;
}

const Governance: React.FC<GovernanceProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'polls' | 'comms'>('dashboard');
  const [polls, setPolls] = useState<Poll[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  const loadData = async () => {
    try {
      const [pRes, aRes] = await Promise.all([
        api.get('/polls'),
        api.get('/announcements')
      ]);
      setPolls(pRes.data || []);
      setAnnouncements(aRes.data || []);
    } catch (e) {
      console.error("Erro ao carregar governança digital.");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleVotePoll = async (pollId: string, optionId: string) => {
    try {
      await api.post(`/polls/${pollId}/vote`, { optionId });
      alert("Voto registado com sucesso!");
      loadData();
    } catch (e) {
      alert("Erro ao enviar voto.");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Governança Digital</h1>
            <p className="text-slate-500">Decisões e comunicados sincronizados com o PostgreSQL.</p>
          </div>
          <div className="flex bg-white p-1 rounded-lg border border-slate-200 shadow-sm">
             <TabButton active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} icon={BarChart2} label="Geral" />
             <TabButton active={activeTab === 'polls'} onClick={() => setActiveTab('polls')} icon={CheckSquare} label="Enquetes" />
             <TabButton active={activeTab === 'comms'} onClick={() => setActiveTab('comms')} icon={Megaphone} label="Mural" />
          </div>
       </div>

       {activeTab === 'polls' && (
         <div className="grid md:grid-cols-2 gap-6">
            {polls.map(poll => (
               <div key={poll.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-bold text-slate-900 text-lg">{poll.title}</h3>
                    <span className={`text-xs font-bold px-2 py-1 rounded ${poll.status === 'OPEN' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                      {poll.status === 'OPEN' ? 'ABERTA' : 'FECHADA'}
                    </span>
                  </div>
                  <div className="space-y-2">
                     {poll.options.map(opt => (
                        <button 
                          key={opt.id} 
                          onClick={() => handleVotePoll(poll.id, opt.id)}
                          disabled={poll.status !== 'OPEN'}
                          className="w-full border border-slate-200 rounded-lg p-3 text-left hover:bg-slate-50 transition-colors flex justify-between items-center group"
                        >
                           <span className="font-medium text-slate-700">{opt.label}</span>
                           <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-500" />
                        </button>
                     ))}
                  </div>
               </div>
            ))}
         </div>
       )}

       {activeTab === 'comms' && (
          <div className="space-y-4">
            {announcements.map(ann => (
              <div key={ann.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm border-l-4 border-l-emerald-500">
                <div className="flex justify-between mb-2">
                  <h3 className="font-bold text-slate-900">{ann.title}</h3>
                  <span className="text-xs text-slate-400">{new Date(ann.date).toLocaleDateString()}</span>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed">{ann.content}</p>
              </div>
            ))}
          </div>
       )}
    </div>
  );
};

const TabButton = ({ active, onClick, icon: Icon, label }: any) => (
    <button onClick={onClick} className={`flex items-center py-2 px-4 rounded-md text-sm font-medium transition-all ${active ? 'bg-emerald-600 text-white' : 'text-slate-500 hover:bg-slate-50'}`}>
        <Icon className="w-4 h-4 mr-2" /> {label}
    </button>
);

export default Governance;