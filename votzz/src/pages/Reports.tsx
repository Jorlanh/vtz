import React, { useEffect, useState } from 'react';
import { Download, Search } from 'lucide-react';
import { getAuditLogs } from '../services/apiService';
import { AuditLog } from '../types';

const Reports: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);

  useEffect(() => {
    getAuditLogs().then(setLogs).catch(console.error);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Relatórios de Auditoria</h1>
          <p className="text-sm text-slate-500 mt-1">Registro imutável de todas as ações</p>
        </div>
        <button className="flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700">
          <Download className="h-4 w-4 mr-2" /> Exportar CSV
        </button>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Data</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Ação</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Usuário</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Detalhes</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {logs.map(log => (
              <tr key={log.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{new Date(log.createdAt).toLocaleString('pt-BR')}</td>
                <td className="px-6 py-4 text-sm font-medium text-slate-900">{log.acao}</td>
                <td className="px-6 py-4 text-sm text-slate-500">{log.userId}</td>
                <td className="px-6 py-4 text-sm text-slate-500">{log.detalhes}</td>
              </tr>
            ))}
            {logs.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-slate-500">Nenhum registro de auditoria encontrado.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Reports;