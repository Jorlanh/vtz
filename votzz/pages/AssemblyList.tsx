import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ChevronRight, Users, Plus } from 'lucide-react';
import { MockService } from '../services/mockDataService';
import { Assembly, User } from '../types';

const AssemblyList: React.FC<{ user: User | null }> = ({ user }) => {
  const [assemblies, setAssemblies] = useState<Assembly[]>([]);

  useEffect(() => {
    MockService.getAssemblies().then(setAssemblies);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPEN': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'DRAFT': return 'bg-amber-100 text-amber-700 border-amber-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Assembleias e Votações</h1>
          <p className="text-slate-500">Participe das decisões do seu condomínio</p>
        </div>
        {user?.role === 'MANAGER' && (
          <Link 
            to="/create-assembly" 
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Nova Assembleia</span>
          </Link>
        )}
      </div>

      <div className="grid gap-4">
        {assemblies.map((assembly) => (
          <div key={assembly.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${getStatusColor(assembly.status)}`}>
                    {assembly.status === 'OPEN' ? 'ABERTA' : assembly.status}
                  </span>
                  <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">{assembly.type}</span>
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-1">{assembly.title}</h3>
                <p className="text-slate-600 text-sm line-clamp-2 mb-4">{assembly.description}</p>
                
                <div className="flex items-center space-x-6 text-sm text-slate-500">
                  <div className="flex items-center space-x-1.5">
                    <Calendar className="h-4 w-4" />
                    <span>Encerra: {new Date(assembly.endDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <Users className="h-4 w-4" />
                    <span>{assembly.votes.length} Votos computados</span>
                  </div>
                </div>
              </div>

              <div>
                <Link 
                  to={`/assembly/${assembly.id}`}
                  className="inline-flex items-center justify-center px-4 py-2 border border-slate-300 shadow-sm text-sm font-medium rounded-lg text-slate-700 bg-white hover:bg-slate-50 w-full md:w-auto"
                >
                  {user?.role === 'MANAGER' ? 'Gerenciar' : 'Entrar na Sala'}
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        ))}

        {assemblies.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-300">
            <p className="text-slate-500">Nenhuma assembleia ativa no momento.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssemblyList;