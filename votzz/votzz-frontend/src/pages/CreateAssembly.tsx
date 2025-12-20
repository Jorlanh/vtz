import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Calendar, Type, FileText, ArrowLeft, Loader2, Eye, EyeOff } from 'lucide-react';
import { generateAssemblyDescription } from '../services/geminiService';
import { createAssembly } from '../services/apiService';
import { AssemblyStatus, VoteType, VotePrivacy } from '../types';

const CreateAssembly: React.FC = () => {
  const navigate = useNavigate();
  const [loadingAi, setLoadingAi] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const [form, setForm] = useState({
    title: '',
    details: '',
    description: '',
    date: '',
    startTime: '',
    endTime: '',
    voteType: VoteType.YES_NO_ABSTAIN,
    privacy: VotePrivacy.ANONYMOUS,
    status: AssemblyStatus.AGENDADA,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleGenerateDescription = async () => {
    setLoadingAi(true);
    try {
      const desc = await generateAssemblyDescription(form.title, form.details);
      setForm({ ...form, description: desc });
    } catch (error) {
      console.error(error);
    }
    setLoadingAi(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const newAssembly = await createAssembly({
        titulo: form.title,
        descricao: form.description,
        dataInicio: `${form.date}T${form.startTime}`,
        dataFim: `${form.date}T${form.endTime}`,
        status: form.status,
        // Adicione mais campos se necessário (ex: linkVideoConferencia gerado no backend)
      });
      navigate(`/assembly/${newAssembly.id}`);
    } catch (error) {
      console.error(error);
    }
    setSaving(false);
  };

  // Restante do JSX permanece igual, apenas atualize onSubmit para handleSubmit
  return (
    <div className="max-w-2xl mx-auto">
      <button onClick={() => navigate(-1)} className="flex items-center text-slate-600 hover:text-slate-800 mb-6">
        <ArrowLeft className="h-5 w-5 mr-2" /> Voltar
      </button>

      <h1 className="text-2xl font-bold text-slate-800 mb-8">Criar Nova Assembleia</h1>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
        {/* Campos do form permanecem iguais, use handleChange */}
        <div className="flex justify-end space-x-4 mt-8">
          <button type="button" onClick={() => navigate(-1)} className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50">
            Cancelar
          </button>
          <button type="submit" disabled={saving} className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors shadow-sm flex items-center">
            {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
            {saving ? 'Criando...' : 'Criar Assembleia'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateAssembly;