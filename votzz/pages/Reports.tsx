import React, { useEffect, useState } from 'react';
import { Download, Search, AlertCircle, Loader2 } from 'lucide-react';
import { api } from '../services/api'; // Usando API Real
import { AuditLog } from '../types';

const Reports: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const response = await api.get('/audit-logs');
      setLogs(response.data);
    } catch (error) {
      console.error("Erro ao buscar logs de auditoria", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Relatórios & Auditoria</h1>
          <p className="text-slate-500">Log imutável de ações para compliance</p>
        </div>
        <button className="flex items-center space-x-2 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 px-4 py-2 rounded-lg text-sm font-medium">
          <Download className="h-4 w-4" />
          <span>Exportar PDF</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <h3 className="font-semibold text-slate-700">Registro de Atividades (Audit Trail)</h3>
          <div className="relative">
             <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
             <input 
               type="text" 
               placeholder="Buscar hash ou usuário..."
               className="pl-9 pr-4 py-2 text-sm border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-500 focus:outline-none"
             />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 uppercase font-medium text-xs">
              <tr>
                <th className="px-6 py-3">Timestamp</th>
                <th className="px-6 py-3">Ação</th>
                <th className="px-6 py-3">Usuário ID</th>
                <th className="px-6 py-3">Detalhes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center"><Loader2 className="animate-spin h-6 w-6 mx-auto text-emerald-500"/></td>
                </tr>
              ) : logs.length === 0 ? (
                 <tr>
                   <td colSpan={4} className="px-6 py-8 text-center text-slate-500">Nenhum registro de auditoria encontrado.</td>
                 </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-mono text-slate-600">
                      {log.timestamp ? new Date(log.timestamp).toLocaleString() : '-'}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                        {log.action || 'AÇÃO'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-mono text-xs">{log.userId}</td>
                    <td className="px-6 py-4 text-slate-800 max-w-xs truncate">{JSON.stringify(log.details) || log.details || '-'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;