import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ChevronRight, Users, Plus, AlertCircle } from 'lucide-react';
import { api } from '../services/api'; 
import { Assembly, User } from '../types';

const AssemblyList: React.FC<{ user: User | null }> = ({ user }) => {
  const [assemblies, setAssemblies] = useState<Assembly[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAssemblies();
  }, []);

  const loadAssemblies = async () => {
    try {
      setLoading(true);
      const response = await api.get('/assemblies');
      setAssemblies(response.data);
    } catch (err) {
      setError("Erro ao carregar assembleias.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Assembleias</h1>
        {user?.role === 'MANAGER' && (
          <Link to="/assemblies/new" className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center shadow-sm">
            <Plus className="h-4 w-4 mr-2" /> Nova Pauta
          </Link>
        )}
      </div>

      {loading && <div className="text-center py-10">Carregando...</div>}
      
      {!loading && error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center"><AlertCircle className="mr-2"/>{error}</div>
      )}

      <div className="space-y-4">
        {assemblies.map((assembly) => (
          <div key={assembly.id} className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex-1">
              <span className="text-xs font-bold px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 mb-2 inline-block">
                {assembly.status}
              </span>
              <h3 className="text-lg font-bold text-slate-800">{assembly.titulo}</h3>
              <div className="flex items-center space-x-6 text-sm text-slate-500 mt-2">
                <div className="flex items-center"><Calendar className="h-4 w-4 mr-1" /> {new Date(assembly.dataInicio).toLocaleDateString()}</div>
                <div className="flex items-center"><Users className="h-4 w-4 mr-1" /> {assembly.votes?.length || 0} Votos</div>
              </div>
            </div>
            <Link to={`/assembly/${assembly.id}`} className="px-4 py-2 border rounded-lg text-slate-700 hover:bg-slate-50 flex items-center">
              Acessar <ChevronRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};
export default AssemblyList;