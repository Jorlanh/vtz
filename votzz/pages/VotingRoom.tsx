import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../services/api';
import { Assembly } from '../types';

export function VotingRoom() {
  const { id } = useParams();
  const [assembly, setAssembly] = useState<Assembly | null>(null);

  useEffect(() => {
    api.get(`/assemblies/${id}`).then(res => setAssembly(res.data));
    // Aqui você também carregaria o chat e votos via API
  }, [id]);

  if (!assembly) return <div>Carregando...</div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-screen p-4">
      {/* Coluna Principal: Vídeo e Pauta */}
      <div className="lg:col-span-2 space-y-4">
        
        {/* Player do YouTube */}
        <div className="aspect-video bg-black rounded-lg overflow-hidden shadow-xl">
          {assembly.linkVideoConferencia ? (
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${assembly.linkVideoConferencia}`}
              title="Transmissão da Assembleia"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          ) : (
            <div className="flex items-center justify-center h-full text-white">
              Transmissão não iniciada
            </div>
          )}
        </div>

        {/* Informações e Download de PDF */}
        <div className="bg-white p-4 rounded shadow">
           <h1 className="text-2xl font-bold">{assembly.title}</h1>
           {assembly.attachmentUrl && (
             <a href={assembly.attachmentUrl} target="_blank" className="text-blue-600 underline">
               📄 Baixar Pauta (PDF)
             </a>
           )}
        </div>
        
        {/* Área de Votação */}
        <div className="bg-white p-6 rounded shadow mt-4">
           <h3 className="font-bold mb-4">Registre seu Voto</h3>
           <div className="flex gap-4">
              <button className="bg-green-500 text-white px-6 py-2 rounded">SIM / ACEITO</button>
              <button className="bg-red-500 text-white px-6 py-2 rounded">NÃO / RECUSO</button>
              <button className="bg-gray-500 text-white px-6 py-2 rounded">ABSTENÇÃO</button>
           </div>
        </div>
      </div>

      {/* Coluna Lateral: Chat */}
      <div className="lg:col-span-1 bg-white rounded shadow flex flex-col">
         {/* Implementar componente de Chat conectado ao WebSocket ou Polling da API */}
         <div className="p-4 border-b font-bold">Chat Condominial</div>
         <div className="flex-1 p-4 overflow-y-auto">
            {/* Lista de mensagens */}
         </div>
         <div className="p-2">
            {/* Input de envio */}
         </div>
      </div>
    </div>
  );
}