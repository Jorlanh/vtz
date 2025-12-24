import React, { useState } from 'react';
import { api } from '../services/api';
import { useNavigate } from 'react-router-dom';

export function CreateAssembly() {
  const [title, setTitle] = useState('');
  const [youtubeLink, setYoutubeLink] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    // O backend espera o objeto Assembly como JSON na parte 'data'
    const assemblyData = {
        title: title, // Verifique se no Java é 'title' ou 'titulo'
        linkVideoConferencia: youtubeLink,
        status: 'AGENDADA',
        // ... outros campos
    };

    formData.append('data', new Blob([JSON.stringify(assemblyData)], {
        type: 'application/json'
    }));

    if (file) {
        formData.append('file', file);
    }

    try {
        await api.post('/assemblies', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        navigate('/assemblies');
    } catch (error) {
        console.error("Erro ao criar assembleia", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
       {/* Inputs existentes... */}
       
       <label>Link da Live (YouTube)</label>
       <input 
         type="text" 
         placeholder="https://youtube.com/watch?v=..." 
         onChange={e => setYoutubeLink(e.target.value)} 
       />

       <label>Anexar Pauta (PDF)</label>
       <input 
         type="file" 
         accept="application/pdf"
         onChange={e => setFile(e.target.files ? e.target.files[0] : null)} 
       />
       
       <button type="submit">Agendar Assembleia</button>
    </form>
  );
}