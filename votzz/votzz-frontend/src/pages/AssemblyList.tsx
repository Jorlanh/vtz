import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ChevronRight, Users, Plus } from 'lucide-react';
import { getAssemblies } from '../services/apiService';
import { Assembly, User } from '../types';

const AssemblyList: React.FC<{ user: User | null }> = ({ user }) => {
  const [assemblies, setAssemblies] = useState<Assembly[]>([]);

  useEffect(() => {
    getAssemblies().then(setAssemblies).catch(console.error);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ABERTA': return 'bg-emerald-100 text-emerald-800';
      case 'ENCERRADA': return 'bg-slate-100 text-slate-800';
      default: return 'bg-amber-100 text-amber-800';
    }
  };

  return (
    <div className="space-y-6">
      {user?.role === 'MANAGER' && (
        <Link to="/create-assembly" className="flex items-center justify-center bg-emerald-600 text-white py-4 rounded-xl font-medium hover:bg-emerald-700 transition-colors shadow-sm">
          <Plus className="mr-2 h-5 w-5" /> Criar Nova Assembleia
        </Link>
      )}

      <div className="space-y-4">
        {assemblies.map(assembly => (
          <div key={assembly.id} className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold text-lg text-slate-800">{assembly.titulo}</h3>
                <p className="text-sm text-slate-500 mt-1">{assembly.descricao.substring(0, 100)}...</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(assembly.status)}`}>
                {assembly.status}
              </span>
            </div>
            <div className="flex items-center text-sm text-slate-600 space-x-4">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                {new Date(assembly.dataInicio).toLocaleDateString('pt-BR')}
              </div>
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-1" />
                {assembly.votes?.length || 0} votos
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <Link to={`/assembly/${assembly.id}`} className="text-emerald-600 hover:text-emerald-700 font-medium flex items-center">
                {user?.role === 'MANAGER' ? 'Gerenciar' : 'Entrar na Sala'}
                <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
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