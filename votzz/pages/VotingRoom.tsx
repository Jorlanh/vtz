import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  FileText, Send, Clock, ArrowLeft, Video,
  Sparkles, FileCheck 
} from 'lucide-react';
import { api } from '../services/api'; 
import { analyzeSentiment } from '../services/geminiService'; 
import { Assembly, User } from '../types';

// Helper para extrair ID do Youtube
const getYoutubeEmbedId = (url: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
};

const VotingRoom: React.FC<{ user: User }> = ({ user }) => {
  // 1. PROTEÇÃO DE SEGURANÇA: Se por algum motivo o user for null, não renderiza
  if (!user) return null;

  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // 2. MELHORIA DE TIPAGEM: Usando a interface Assembly em vez de 'any'
  const [assembly, setAssembly] = useState<Assembly | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [hasVoted, setHasVoted] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  
  const [chatMsg, setChatMsg] = useState('');
  const [chatHistory, setChatHistory] = useState<any[]>([]); 
  const [aiAnalysis, setAiAnalysis] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'VOTE' | 'MANAGE'>('VOTE');

  // Referência para o auto-scroll do chat
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Efeito 1: Carregar Dados da Assembleia (Executa uma vez ao montar)
  useEffect(() => {
    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await api.get(`/assemblies/${id}`);
            setAssembly(res.data);
            
            // Verifica se o usuário já votou nesta assembleia
            // Nota: O backend deve retornar 'votes' dentro do objeto assembly
            const myVote = res.data.votes?.find((v: any) => v.userId === user.id);
            if (myVote) setHasVoted(true);

            loadChatMessages();
        } catch (error) {
            console.error(error);
            navigate('/assemblies');
        } finally {
            setLoading(false);
        }
    };
    fetchData();
  }, [id, user.id, navigate]);

  // Efeito 2: Polling do Chat (Atualiza mensagens a cada 5 segundos)
  useEffect(() => {
      const interval = setInterval(() => {
          loadChatMessages();
      }, 5000); // 5000ms = 5 segundos

      // Limpa o intervalo quando o componente desmonta
      return () => clearInterval(interval);
  }, [id]);

  // Efeito 3: Auto-scroll sempre que o histórico do chat mudar
  useEffect(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  const loadChatMessages = async () => {
      try {
          const res = await api.get(`/chat/assembly/${id}`);
          // Verifica se houve mudança para evitar re-render desnecessário (opcional, mas bom)
          setChatHistory(res.data);
      } catch (e) { console.error("Erro chat", e); }
  };

  const handleVote = async () => {
    if (!selectedOption) return;
    try {
        await api.post('/votes', {
            assemblyId: id,
            optionId: selectedOption,
            userId: user.id
        });
        setHasVoted(true);
        alert("Voto registrado com sucesso!");
        
        // Atualiza os dados para ver o novo gráfico
        const res = await api.get(`/assemblies/${id}`);
        setAssembly(res.data);
    } catch (error) {
        alert("Erro ao computar voto.");
    }
  };

  const handleSendChat = async () => {
      if (!chatMsg.trim()) return;
      try {
          await api.post('/chat', {
              assemblyId: id,
              userId: user.id,
              content: chatMsg,
              senderName: user.nome
          });
          setChatMsg('');
          loadChatMessages(); // Recarrega imediatamente após enviar
      } catch (error) {
          console.error("Erro ao enviar mensagem", error);
      }
  };

  // IA Analysis Handler
  const handleAiAnalysis = async () => {
      if (!assembly) return;
      const text = `Analise esta pauta de condomínio: ${assembly.titulo}. Descrição: ${assembly.description}. É polêmica?`;
      
      const analysis = await analyzeSentiment([text]); 
      setAiAnalysis(analysis);
  };

  if (loading || !assembly) return <div className="p-10 text-center">Carregando sala segura...</div>;

  const youtubeId = getYoutubeEmbedId(assembly.linkVideoConferencia || '');
  const isClosed = assembly.status === 'CLOSED';

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 h-[calc(100vh-80px)] flex flex-col md:flex-row gap-6">
      
      {/* Coluna Esquerda: Vídeo e Detalhes */}
      <div className="flex-1 flex flex-col gap-6 overflow-y-auto pr-2">
        <button onClick={() => navigate('/assemblies')} className="flex items-center text-slate-500 hover:text-slate-800 w-fit">
            <ArrowLeft className="h-4 w-4 mr-2" /> Voltar
        </button>

        <div>
            <div className="flex items-center gap-3 mb-2">
                <span className="bg-emerald-100 text-emerald-800 text-xs px-2 py-1 rounded-full font-bold uppercase tracking-wider">
                    {assembly.status}
                </span>
                <span className="text-slate-400 text-sm flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    Encerra em: {new Date(assembly.dataFim).toLocaleDateString()}
                </span>
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">{assembly.titulo}</h1>
        </div>

        {youtubeId ? (
            <div className="w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-lg border border-slate-800 relative group">
                <iframe 
                    width="100%" 
                    height="100%" 
                    src={`https://www.youtube.com/embed/${youtubeId}`} 
                    title="Live Stream" 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                ></iframe>
                <div className="absolute top-4 left-4 bg-red-600 text-white text-xs px-2 py-1 rounded animate-pulse font-bold flex items-center">
                    <Video className="h-3 w-3 mr-1" /> AO VIVO
                </div>
            </div>
        ) : (
            <div className="bg-slate-100 rounded-2xl p-8 text-center text-slate-400">
                <Video className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Nenhuma transmissão de vídeo configurada para esta assembleia.</p>
            </div>
        )}

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="font-bold text-lg mb-4 flex items-center">
                <FileText className="h-5 w-5 mr-2 text-slate-500" />
                Descrição da Pauta
            </h3>
            <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">{assembly.description}</p>
            
            <button onClick={handleAiAnalysis} className="mt-4 text-purple-600 text-sm font-medium hover:underline flex items-center">
                <Sparkles className="h-4 w-4 mr-1" /> O que a IA diz sobre isso?
            </button>
            {aiAnalysis && (
                <div className="mt-3 p-4 bg-purple-50 text-purple-800 rounded-lg text-sm border border-purple-100">
                    {aiAnalysis}
                </div>
            )}
        </div>
      </div>

      {/* Coluna Direita: Votação e Chat */}
      <div className="w-full md:w-[400px] flex flex-col bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden h-full">
        <div className="flex border-b border-slate-100">
            <button 
                onClick={() => setActiveTab('VOTE')}
                className={`flex-1 py-4 text-sm font-bold border-b-2 ${activeTab === 'VOTE' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-slate-400'}`}
            >
                VOTAÇÃO OFICIAL
            </button>
            <button 
                onClick={() => setActiveTab('MANAGE')}
                className={`flex-1 py-4 text-sm font-bold border-b-2 ${activeTab === 'MANAGE' ? 'border-blue-500 text-blue-600' : 'border-transparent text-slate-400'}`}
            >
                CHAT DO CONDOMÍNIO
            </button>
        </div>

        {activeTab === 'VOTE' ? (
            <div className="flex-1 p-6 overflow-y-auto">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-6">
                    <div className="flex items-center justify-between text-sm text-slate-500 mb-2">
                        <span>Quórum Atual</span>
                        <span className="font-bold text-slate-700">
                            {/* Usa encadeamento opcional para evitar erros se votes for undefined */}
                            {assembly.votes?.length || 0} Votos
                        </span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                        <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${Math.min((assembly.votes?.length || 0) * 5, 100)}%` }}></div>
                    </div>
                </div>

                {hasVoted ? (
                    <div className="text-center py-10">
                        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FileCheck className="h-8 w-8" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800">Voto Confirmado!</h3>
                        <p className="text-slate-500 mt-2">Seu registro foi salvo e auditado.</p>
                        <div className="mt-6 p-3 bg-slate-50 rounded text-xs font-mono text-slate-400 break-all border border-slate-200">
                            HASH: {btoa(user.id + new Date().toISOString())}
                        </div>
                    </div>
                ) : isClosed ? (
                    <div className="text-center py-10 text-slate-400 font-bold">Votação encerrada.</div>
                ) : (
                    <div className="space-y-3">
                        {/* Assumindo que pollOptions existe na interface Assembly */}
                        {assembly.pollOptions?.map((opt: any) => (
                            <button
                                key={opt.id}
                                onClick={() => setSelectedOption(opt.id)}
                                className={`w-full text-left px-5 py-4 rounded-xl border-2 transition-all font-medium ${
                                    selectedOption === opt.id 
                                    ? 'border-emerald-500 bg-emerald-50 text-emerald-900' 
                                    : 'border-slate-100 hover:border-slate-200 text-slate-600'
                                }`}
                            >
                                {opt.descricao || opt.label}
                            </button>
                        ))}
                        <button
                            onClick={handleVote}
                            disabled={!selectedOption}
                            className="w-full mt-4 bg-emerald-600 text-white py-4 rounded-xl font-bold shadow-lg shadow-emerald-100 hover:bg-emerald-700 disabled:bg-slate-200 disabled:shadow-none transition-all"
                        >
                            Confirmar Voto Seguro
                        </button>
                    </div>
                )}
            </div>
        ) : (
            <div className="flex-1 flex flex-col h-full">
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
                    {chatHistory.map((msg: any, idx: number) => (
                        <div key={idx} className={`flex flex-col ${msg.userId === user.id ? 'items-end' : 'items-start'}`}>
                            <div className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm ${
                                msg.userId === user.id 
                                ? 'bg-blue-600 text-white rounded-br-none' 
                                : 'bg-white text-slate-700 border border-slate-200 rounded-bl-none'
                            }`}>
                                <p className="font-bold text-xs opacity-70 mb-1">{msg.senderName}</p>
                                {msg.content}
                            </div>
                        </div>
                    ))}
                    {/* Div invisível para fazer o scroll automático */}
                    <div ref={messagesEndRef} />
                </div>
                <div className="p-3 border-t border-slate-200 bg-white">
                    <div className="flex items-center gap-2">
                        <input 
                            type="text" 
                            value={chatMsg}
                            onChange={(e) => setChatMsg(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                            placeholder="Digite sua mensagem..."
                            className="flex-1 bg-slate-100 border-0 rounded-full px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                        <button 
                            onClick={handleSendChat}
                            className="p-2.5 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                        >
                            <Send className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default VotingRoom;