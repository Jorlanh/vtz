import React, { useEffect, useState } from 'react';
import { Download, Search } from 'lucide-react';
import { api } from '../services/api'; // Alterado para API Real
import { AuditLog } from '../types';

const Reports: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/reports/audit')
      .then(res => setLogs(res.data))
      .catch(e => console.error("Erro ao carregar logs."))
      .finally(() => setLoading(false));
  }, []);

  const handleExport = () => {
    // Abre o PDF gerado pelo ReportService.java
    window.open('http://localhost:8080/api/reports/export', '_blank');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Relatórios & Auditoria</h1>
          <p className="text-slate-500">Log imutável sincronizado com o banco de dados.</p>
        </div>
        <button onClick={handleExport} className="flex items-center space-x-2 bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-all">
          <Download className="h-4 w-4" />
          <span>Exportar PDF Real</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 uppercase font-medium text-xs">
              <tr>
                <th className="px-6 py-3">Timestamp</th>
                <th className="px-6 py-3">Ação</th>
                <th className="px-6 py-3">Detalhes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-mono text-slate-600">{new Date(log.timestamp).toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">{log.action}</span>
                  </td>
                  <td className="px-6 py-4 text-slate-800">{log.details}</td>
                </tr>
              ))}
              {logs.length === 0 && !loading && (
                 <tr><td colSpan={3} className="px-6 py-8 text-center text-slate-500">Nenhum log encontrado no banco.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;