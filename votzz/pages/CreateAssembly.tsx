import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Calendar, Type, FileText, ArrowLeft, Loader2, Video } from 'lucide-react';
import { generateAssemblyDescription } from '../services/geminiService'; // Mantendo IA
// MockService removido
import { api } from '../services/api';

const CreateAssembly: React.FC = () => {
  const navigate = useNavigate();
  const [loadingAi, setLoadingAi] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    titulo: '',              // Alterado para corresponder ao Backend
    description: '',
    dataInicio: '',          // Alterado para corresponder ao Backend
    dataFim: '',             // Alterado para corresponder ao Backend
    linkVideoConferencia: '',// Campo novo para YouTube
    tipoAssembleia: 'AGE',   // Enum backend
    quorumType: 'SIMPLE',
    voteType: 'YES_NO_ABSTAIN',
    votePrivacy: 'OPEN'
  });

  const handleAiGenerate = async () => {
    if (!formData.titulo) return alert("Digite um título para o tema primeiro.");
    
    setLoadingAi(true);
    try {
      const desc = await generateAssemblyDescription(formData.titulo, "Foco em transparência e regras do código civil.");
      setFormData(prev => ({ ...prev, description: desc }));
    } catch (e) {
      console.error(e);
      alert("Erro ao gerar descrição com IA");
    } finally {
      setLoadingAi(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
        // Envia para o backend
        await api.post('/assemblies', formData);
        navigate('/assemblies');
    } catch (error) {
        console.error("Erro ao criar assembleia", error);
        alert("Erro ao salvar assembleia. Verifique os dados.");
    } finally {
        setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <button onClick={() => navigate('/assemblies')} className="flex items-center text-slate-500 hover:text-slate-800 mb-6 transition-colors">
        <ArrowLeft className="h-4 w-4 mr-2" /> Voltar para Assembleias
      </button>
      
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
           <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
             <Sparkles className="h-6 w-6 text-emerald-500" />
             Nova Assembleia
           </h1>
           <p className="text-slate-500 mt-1">Crie uma pauta de votação segura e imutável.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Título */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Título da Pauta</label>
            <div className="relative">
               <Type className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
               <input 
                 type="text" 
                 value={formData.titulo}
                 onChange={e => setFormData({...formData, titulo: e.target.value})}
                 className="pl-10 w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                 placeholder="Ex: Aprovação de Reforma da Fachada"
                 required
               />
            </div>
          </div>

          {/* Link YouTube */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Link da Live (YouTube)</label>
            <div className="relative">
               <Video className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
               <input 
                 type="url" 
                 value={formData.linkVideoConferencia}
                 onChange={e => setFormData({...formData, linkVideoConferencia: e.target.value})}
                 className="pl-10 w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                 placeholder="https://youtube.com/live/..."
               />
            </div>
            <p className="text-xs text-slate-400 mt-1">Opcional: Cole o link da transmissão ao vivo.</p>
          </div>

          {/* Descrição com IA */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-slate-700">Descrição Detalhada</label>
              <button 
                type="button" 
                onClick={handleAiGenerate}
                disabled={loadingAi || !formData.titulo}
                className="text-xs flex items-center text-purple-600 hover:text-purple-700 font-medium disabled:opacity-50"
              >
                {loadingAi ? <Loader2 className="h-3 w-3 animate-spin mr-1"/> : <Sparkles className="h-3 w-3 mr-1"/>}
                Gerar com Gemini AI
              </button>
            </div>
            <div className="relative">
              <FileText className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
              <textarea 
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                className="pl-10 w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none min-h-[120px]"
                placeholder="Descreva os detalhes da votação..."
                required
              />
            </div>
          </div>

          {/* Datas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Data Início</label>
              <input 
                type="datetime-local"
                value={formData.dataInicio}
                onChange={e => setFormData({...formData, dataInicio: e.target.value})}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Data Fim</label>
              <input 
                type="datetime-local"
                value={formData.dataFim}
                onChange={e => setFormData({...formData, dataFim: e.target.value})}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                required
              />
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="pt-6 border-t border-slate-100 flex justify-end space-x-3">
             <button 
              type="button" 
              onClick={() => navigate('/assemblies')}
              className="px-6 py-2 border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              disabled={saving}
              className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors shadow-sm flex items-center"
            >
              {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              {saving ? 'Criando...' : 'Criar Assembleia Oficial'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAssembly;