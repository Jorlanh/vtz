
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  FileText, Send, Lock, Clock, ArrowLeft, Download, MessageSquare, 
  AlertCircle, Eye, EyeOff, Gavel, Scale, FileCheck, Shield
} from 'lucide-react';
import { MockService } from '../services/mockDataService';
import { analyzeSentiment } from '../services/geminiService';
import { Assembly, User, VotePrivacy, AssemblyStatus } from '../types';

const VotingRoom: React.FC<{ user: User }> = ({ user }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [assembly, setAssembly] = useState<Assembly | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [chatMsg, setChatMsg] = useState('');
  const [voteReceipt, setVoteReceipt] = useState<string | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<string>('');
  
  // Manager State
  const [activeTab, setActiveTab] = useState<'VOTE' | 'MANAGE'>('VOTE');
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    if (id) loadData();
  }, [id]);

  const loadData = async () => {
    if (!id) return;
    const data = await MockService.getAssemblyById(id);
    if (data) {
      setAssembly(data);
      const userVote = data.votes.find(v => v.userId === user.id);
      if (userVote) {
        setHasVoted(true);
        setVoteReceipt(userVote.hash);
      }
    }
  };

  const handleVote = async () => {
    if (!id || !selectedOption) return;
    try {
      const vote = await MockService.castVote(id, user.id, selectedOption);
      setHasVoted(true);
      setVoteReceipt(vote.hash);
      loadData(); // refresh
    } catch (e: any) {
      alert(e.message);
    }
  };

  const handleCloseAssembly = async () => {
    if (!id || !assembly) return;
    if (!window.confirm("ATENÇÃO: Isso encerrará a votação definitivamente e gerará a Ata. Confirmar?")) return;
    
    setClosing(true);
    try {
        await MockService.closeAssembly(id, user.id);
        alert("Assembleia encerrada com sucesso. Ata gerada.");
        loadData();
    } catch(e: any) {
        alert(e.message);
    } finally {
        setClosing(false);
    }
  };

  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMsg.trim() || !id) return;
    await MockService.postChatMessage(id, user.id, user.name, chatMsg);
    setChatMsg('');
    loadData();
  };

  const runAnalysis = async () => {
    if (!assembly) return;
    const messages = assembly.chat.map(c => `${c.userName}: ${c.content}`);
    setAiAnalysis("Analisando...");
    const result = await analyzeSentiment(messages);
    setAiAnalysis(result);
  }

  const downloadDossier = () => {
      alert("Baixando Dossiê Jurídico (ZIP) contendo: \n- Logs de Auditoria\n- Hashes de Votos\n- Ata em PDF\n- Comprovantes de Convocação");
  };

  if (!assembly) return <div className="p-8 text-center text-slate-500"><Clock className="w-8 h-8 mx-auto mb-2 animate-spin"/> Carregando sala...</div>;

  const isSecret = assembly.votePrivacy === VotePrivacy.SECRET;
  const isManager = user.role === 'MANAGER';
  const isClosed = assembly.status === AssemblyStatus.CLOSED;

  // Calculate stats for manager
  const totalVotes = assembly.votes.length;
  const totalFraction = assembly.votes.reduce((acc, v) => acc + v.fraction, 0);

  return (
    <div className="space-y-6 pb-20">
      <div className="flex justify-between items-center">
        <button onClick={() => navigate('/assemblies')} className="flex items-center text-slate-500 hover:text-slate-800">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Voltar para lista
        </button>
        {isManager && (
            <div className="flex bg-slate-100 p-1 rounded-lg">
                <button 
                  onClick={() => setActiveTab('VOTE')}
                  className={`px-3 py-1 text-sm font-medium rounded-md ${activeTab === 'VOTE' ? 'bg-white shadow text-slate-800' : 'text-slate-500'}`}
                >
                   Sala de Votação
                </button>
                <button 
                  onClick={() => setActiveTab('MANAGE')}
                  className={`px-3 py-1 text-sm font-medium rounded-md ${activeTab === 'MANAGE' ? 'bg-white shadow text-slate-800' : 'text-slate-500'}`}
                >
                   Gestão & Encerramento
                </button>
            </div>
        )}
      </div>

      {activeTab === 'MANAGE' && isManager ? (
          <div className="space-y-6 animate-in fade-in">
             <div className="bg-slate-900 text-white p-6 rounded-xl shadow-lg">
                <div className="flex items-start justify-between">
                    <div>
                        <h2 className="text-xl font-bold flex items-center gap-2">
                           <Gavel className="w-5 h-5 text-emerald-400" /> Painel Legal do Síndico
                        </h2>
                        <p className="text-slate-400 text-sm mt-1">Controle de quórum e formalização jurídica (Art. 1.354-A CC).</p>
                    </div>
                    <div className="text-right">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${isClosed ? 'bg-red-500' : 'bg-emerald-500'}`}>
                            {isClosed ? 'ENCERRADA' : 'EM ANDAMENTO'}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                    <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                        <p className="text-slate-400 text-xs uppercase font-bold">Quórum (Unidades)</p>
                        <p className="text-2xl font-bold mt-1">{totalVotes} <span className="text-sm text-slate-500 font-normal">presentes</span></p>
                    </div>
                    <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                         <p className="text-slate-400 text-xs uppercase font-bold">Fração Ideal Total</p>
                         <p className="text-2xl font-bold mt-1">{(totalFraction * 100).toFixed(4)}%</p>
                    </div>
                     <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                         <p className="text-slate-400 text-xs uppercase font-bold">Convocação</p>
                         <p className="text-2xl font-bold mt-1 text-emerald-400">100% <span className="text-sm text-slate-500 font-normal">entregue</span></p>
                    </div>
                </div>

                {!isClosed ? (
                    <div className="mt-8 border-t border-slate-700 pt-6">
                        <h3 className="font-bold mb-2">Ações Críticas</h3>
                        <p className="text-sm text-slate-400 mb-4">Ao encerrar, o sistema calculará os votos ponderados pela fração ideal e gerará a Ata automaticamente.</p>
                        <button 
                            onClick={handleCloseAssembly}
                            disabled={closing}
                            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 transition-colors disabled:opacity-50"
                        >
                            {closing ? 'Processando...' : <><Lock className="w-4 h-4" /> Encerrar Votação e Lavrar Ata</>}
                        </button>
                    </div>
                ) : (
                    <div className="mt-8 border-t border-slate-700 pt-6">
                        <h3 className="font-bold mb-2 text-emerald-400 flex items-center"><CheckIcon className="w-5 h-5 mr-2" /> Ata Gerada com Sucesso</h3>
                         <div className="bg-white text-slate-800 p-4 rounded-lg font-mono text-xs whitespace-pre-wrap max-h-60 overflow-y-auto mb-4">
                             {assembly.minutes?.content}
                         </div>
                         <div className="flex gap-4">
                             <button className="bg-white text-slate-900 px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-slate-200">
                                 <FileText className="w-4 h-4" /> Baixar Ata (PDF)
                             </button>
                             <button onClick={downloadDossier} className="bg-slate-700 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-slate-600 border border-slate-600">
                                 <Shield className="w-4 h-4" /> Exportar Dossiê Jurídico
                             </button>
                         </div>
                    </div>
                )}
             </div>
          </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* ... Existing User View ... */}
            <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">{assembly.title}</h1>
                    <p className="text-slate-500 mt-1">{assembly.type} • ID: {assembly.id}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${isClosed ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'}`}>
                         <Clock className="h-3 w-3 mr-1" />
                         {isClosed ? 'Encerrada' : `Até ${new Date(assembly.endDate).toLocaleDateString()}`}
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${isSecret ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                        {isSecret ? <EyeOff className="h-3 w-3 mr-1" /> : <Eye className="h-3 w-3 mr-1" />}
                        {isSecret ? 'Voto Secreto' : 'Voto Aberto'}
                    </span>
                </div>
                </div>

                <div className="mt-6 prose prose-slate max-w-none">
                <h3 className="text-sm font-bold uppercase text-slate-400">Pauta e Descrição</h3>
                <p className="text-slate-700 whitespace-pre-line mt-2">{assembly.description}</p>
                </div>

                <div className="mt-8">
                <h3 className="text-sm font-bold uppercase text-slate-400 mb-3">Documentos Anexos</h3>
                <div className="flex flex-wrap gap-3">
                    {assembly.documents.map((doc, idx) => (
                    <div key={idx} className="flex items-center bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
                        <FileText className="h-4 w-4 text-slate-400 mr-2" />
                        <span className="text-sm text-slate-700">{doc}</span>
                        <button className="ml-3 text-emerald-600 hover:text-emerald-700">
                        <Download className="h-4 w-4" />
                        </button>
                    </div>
                    ))}
                </div>
                </div>
            </div>

            {/* Chat Section */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex flex-col h-[500px]">
                <div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-100">
                <h3 className="font-bold text-slate-800 flex items-center">
                    <MessageSquare className="h-5 w-5 mr-2 text-slate-500" />
                    Debate da Assembleia
                </h3>
                {isManager && (
                    <button onClick={runAnalysis} className="text-xs text-purple-600 hover:bg-purple-50 px-2 py-1 rounded">
                    IA: Resumir Discussão
                    </button>
                )}
                </div>
                
                {aiAnalysis && (
                <div className="mb-4 bg-purple-50 p-3 rounded-lg border border-purple-100 text-sm text-purple-800">
                    <strong>Análise IA:</strong> {aiAnalysis}
                </div>
                )}

                <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                {assembly.chat.map((msg) => (
                    <div key={msg.id} className={`flex flex-col ${msg.userId === user.id ? 'items-end' : 'items-start'}`}>
                    <div className={`max-w-[80%] rounded-lg px-4 py-2 text-sm ${
                        msg.userId === user.id ? 'bg-emerald-100 text-emerald-900' : 'bg-slate-100 text-slate-800'
                    }`}>
                        <span className="block text-xs font-bold opacity-50 mb-1">{msg.userName}</span>
                        {msg.content}
                    </div>
                    <span className="text-xs text-slate-400 mt-1">{new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                    </div>
                ))}
                </div>

                <form onSubmit={handleSendChat} className="mt-4 flex gap-2">
                <input 
                    type="text"
                    value={chatMsg}
                    onChange={e => setChatMsg(e.target.value)}
                    placeholder="Digite sua dúvida ou comentário..."
                    className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    disabled={isClosed}
                />
                <button type="submit" disabled={isClosed} className="bg-slate-900 text-white p-2 rounded-lg hover:bg-slate-800 disabled:opacity-50">
                    <Send className="h-5 w-5" />
                </button>
                </form>
            </div>
            </div>

            {/* Right Column: Voting Action */}
            <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 sticky top-6">
                <h3 className="text-lg font-bold text-slate-800 mb-2 flex items-center">
                <Lock className="h-5 w-5 mr-2 text-emerald-600" />
                Cédula de Votação
                </h3>

                <div className="bg-slate-50 p-3 rounded-lg mb-4 border border-slate-200">
                     <p className="text-xs text-slate-500 uppercase font-bold mb-1">Seu Poder de Voto</p>
                     <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-slate-700">Unidade: {user.unit}</span>
                        <span className="bg-emerald-100 text-emerald-800 text-xs px-2 py-1 rounded font-bold flex items-center">
                             <Scale className="w-3 h-3 mr-1" /> {(user.fraction * 100).toFixed(4)}%
                        </span>
                     </div>
                </div>
                
                {isSecret ? (
                <div className="flex items-center text-xs text-purple-700 bg-purple-50 p-2 rounded mb-4">
                    <EyeOff className="w-3 h-3 mr-1" />
                    Votação Secreta.
                </div>
                ) : (
                <div className="flex items-center text-xs text-blue-700 bg-blue-50 p-2 rounded mb-4">
                    <Eye className="w-3 h-3 mr-1" />
                    Voto Aberto.
                </div>
                )}

                {hasVoted ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 text-center">
                    <div className="h-12 w-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <CheckIcon className="h-6 w-6 text-emerald-600" />
                    </div>
                    <h4 className="font-bold text-emerald-900">Voto Confirmado</h4>
                    <p className="text-sm text-emerald-700 mt-1 mb-3">Obrigado por participar.</p>
                    <div className="text-xs bg-white p-2 rounded border border-emerald-100 text-slate-500 break-all font-mono">
                    Receipt: {voteReceipt}
                    </div>
                </div>
                ) : isClosed ? (
                    <div className="bg-slate-100 border border-slate-200 rounded-lg p-4 text-center text-slate-500">
                        <Lock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p className="font-bold">Votação Encerrada</p>
                    </div>
                ) : (
                <div className="space-y-3">
                    {assembly.options.map((opt) => (
                    <button
                        key={opt.id}
                        onClick={() => setSelectedOption(opt.id)}
                        className={`w-full text-left px-4 py-3 rounded-lg border transition-all ${
                        selectedOption === opt.id 
                        ? 'border-emerald-500 ring-1 ring-emerald-500 bg-emerald-50 text-emerald-900' 
                        : 'border-slate-200 hover:border-slate-300 text-slate-700'
                        }`}
                    >
                        <span className="font-medium">{opt.label}</span>
                    </button>
                    ))}

                    <button
                    onClick={handleVote}
                    disabled={!selectedOption}
                    className="w-full mt-6 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-bold py-3 rounded-lg shadow-md transition-colors"
                    >
                    Confirmar Voto Seguro
                    </button>
                </div>
                )}
                
                <div className="mt-6 pt-6 border-t border-slate-100">
                <div className="flex items-start text-xs text-slate-500">
                    <FileCheck className="h-4 w-4 mr-2 flex-shrink-0 text-slate-400" />
                    <p>
                    Em conformidade com Art. 1.354-A do CC. Hash auditável e imutável.
                    </p>
                </div>
                </div>
            </div>
            </div>
        </div>
      )}
    </div>
  );
};

const CheckIcon = ({className}: {className?: string}) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

export default VotingRoom;
