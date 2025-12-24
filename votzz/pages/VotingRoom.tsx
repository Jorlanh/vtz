import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
// Adicionado 'CheckSquare' na lista de importações
import { ThumbsUp, ThumbsDown, CircleSlash, FileText, Send, CheckSquare } from 'lucide-react';
import { api } from '../services/api';
import { Assembly } from '../types';

export const VotingRoom: React.FC = () => {
  const { id } = useParams();
  const [assembly, setAssembly] = useState<Assembly | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAssembly();
  }, [id]);

  const loadAssembly = async () => {
    try {
      const res = await api.get(`/assemblies/${id}`);
      setAssembly(res.data);
    } catch (e) {
      console.error("Erro ao carregar assembleia");
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (option: 'SIM' | 'NAO' | 'ABSTENCAO') => {
    try {
      // Sincronizado com o endpoint do VoteService.java
      await api.post(`/assemblies/${id}/vote`, { opcao_escolhida: option });
      alert(`Voto "${option}" registrado com sucesso!`);
      loadAssembly(); 
    } catch (e: any) {
      const msg = e.response?.data?.message || "Erro ao enviar voto. Verifique se você já votou.";
      alert(msg);
    }
  };

  if (loading) return <div className="p-10 text-center">Abrindo sala de conferência...</div>;
  if (!assembly) return <div className="p-10 text-center">Assembleia não encontrada.</div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-140px)] animate-in fade-in">
      {/* Coluna do Vídeo e Info */}
      <div className="lg:col-span-2 flex flex-col gap-4">
        <div className="aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-slate-800">
          {assembly.linkVideoConferencia ? (
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${assembly.linkVideoConferencia}`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-500 italic">
              Transmissão via YouTube ainda não iniciada.
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-2xl font-bold text-slate-900">{assembly.titulo}</h1>
            {assembly.attachmentUrl && (
              <a href={assembly.attachmentUrl} target="_blank" rel="noreferrer" className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-colors">
                <FileText size={16} /> Ver Pauta (PDF)
              </a>
            )}
          </div>
          <p className="text-slate-600 text-sm">{assembly.description}</p>
        </div>
      </div>

      {/* Coluna Lateral: Votação e Chat */}
      <div className="flex flex-col gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-xl border border-emerald-100">
          <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
            <CheckSquare className="text-emerald-500" /> Seu Voto é Decisivo
          </h3>
          <div className="space-y-3">
            <button onClick={() => handleVote('SIM')} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-emerald-200">
              <ThumbsUp size={20} /> ACEITO / SIM
            </button>
            <button onClick={() => handleVote('NAO')} className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-red-200">
              <ThumbsDown size={20} /> RECUSO / NÃO
            </button>
            <button onClick={() => handleVote('ABSTENCAO')} className="w-full bg-slate-500 hover:bg-slate-600 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95">
              <CircleSlash size={20} /> ABSTENÇÃO
            </button>
          </div>
        </div>

        {/* Chat de Texto */}
        <div className="bg-slate-900 rounded-2xl flex-1 flex flex-col shadow-2xl overflow-hidden border border-slate-800">
          <div className="p-4 border-b border-white/10 text-white font-bold flex items-center gap-2 text-sm">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div> Chat em Tempo Real
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
             <p className="text-slate-500 text-[10px] text-center uppercase tracking-widest">Início da sessão de chat</p>
          </div>
          <div className="p-3 bg-white/5 border-t border-white/10 flex gap-2">
            <input type="text" placeholder="Comentar..." className="flex-1 bg-white/10 border-none rounded-lg px-4 py-2 text-white text-sm focus:ring-1 focus:ring-emerald-500 outline-none" />
            <button className="p-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-500 transition-colors">
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};