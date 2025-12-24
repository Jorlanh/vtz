import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Calendar, 
  ChevronRight, 
  Download, 
  Archive,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { api } from '../services/api'; // Importação da API real
import { Assembly } from '../types';

// Alterado para export const para manter consistência, 
// a correção do erro de importação está no passo 2.
export const AssemblyList: React.FC = () => {
  const [assemblies, setAssemblies] = useState<Assembly[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAssemblies();
  }, []);

  const fetchAssemblies = async () => {
    try {
      const response = await api.get('/assemblies');
      // Axios coloca a resposta em .data
      setAssemblies(response.data || []);
    } catch (error) {
      console.error("Erro ao carregar assembleias do banco de dados:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadVotes = (assemblyId: string) => {
    // Endpoint real do AssemblyController.java para baixar o CSV de auditoria
    window.open(`http://localhost:8080/api/assemblies/${assemblyId}/votes/csv`, '_blank');
  };

  // Separação de Ativas vs Arquivadas baseada no status do Java
  const activeAssemblies = assemblies.filter(a => a.status !== 'ENCERRADA');
  const archivedAssemblies = assemblies.filter(a => a.status === 'ENCERRADA');

  if (loading) return <div className="p-8 text-center text-slate-500">Carregando assembleias...</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">Assembleias</h1>
        <button 
          onClick={() => navigate('/create-assembly')}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-all shadow-md"
        >
          Agendar Nova
        </button>
      </div>

      {/* Assembleias Ativas */}
      <section className="space-y-4">
        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
          <Clock className="w-4 h-4" /> Em Aberto ou Agendadas
        </h2>
        <div className="grid gap-4">
          {activeAssemblies.map(assembly => (
            <div key={assembly.id} className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all flex items-center justify-between group">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-lg ${assembly.status === 'ABERTA' ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'}`}>
                  <FileText />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">{assembly.titulo}</h3>
                  <p className="text-xs text-slate-500 flex items-center gap-2">
                    <Calendar className="w-3 h-3" /> 
                    {new Date(assembly.dataInicio).toLocaleDateString('pt-BR')} às {new Date(assembly.dataInicio).toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => navigate(`/assembly/${assembly.id}`)}
                className="flex items-center gap-2 text-sm font-bold text-emerald-600 hover:text-emerald-700"
              >
                Acessar <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          ))}
          {activeAssemblies.length === 0 && <p className="text-slate-400 text-sm italic">Nenhuma assembleia pendente.</p>}
        </div>
      </section>

      {/* Assembleias Arquivadas (Auditoria) */}
      <section className="space-y-4 pt-4 border-t border-slate-100">
        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
          <Archive className="w-4 h-4" /> Arquivadas (Histórico)
        </h2>
        <div className="grid gap-3">
          {archivedAssemblies.map(assembly => (
            <div key={assembly.id} className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center justify-between opacity-80 hover:opacity-100 transition-opacity">
              <div className="flex items-center gap-4">
                <CheckCircle2 className="text-slate-400" />
                <div>
                  <h3 className="text-sm font-bold text-slate-700">{assembly.titulo}</h3>
                  <p className="text-[10px] text-slate-500 font-mono italic">ID: {assembly.id}</p>
                </div>
              </div>
              <button 
                onClick={() => handleDownloadVotes(assembly.id)}
                className="bg-white border border-slate-300 text-slate-600 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 hover:bg-slate-100 transition-colors"
              >
                <Download className="w-3 h-3" /> Auditoria de Votos
              </button>
            </div>
          ))}
          {archivedAssemblies.length === 0 && <p className="text-slate-400 text-sm italic">Nenhum registro arquivado.</p>}
        </div>
      </section>
    </div>
  );
};