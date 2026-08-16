import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  History,
  ShieldCheck,
  Search,
  Filter,
  User,
  Clock,
  FileText,
  Lock,
  Download
} from 'lucide-react';
import { useData } from '../../context/DataContext.js';

export const AuditTrailView: React.FC = () => {
  const { auditLogs } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState('ALL');

  const filteredLogs = auditLogs.filter(log => {
    if (actionFilter !== 'ALL' && log.action !== actionFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        log.userName.toLowerCase().includes(q) ||
        log.resourceName.toLowerCase().includes(q) ||
        log.action.toLowerCase().includes(q) ||
        (log.decision && log.decision.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const exportAuditCSV = () => {
    const headers = ['ID', 'Timestamp', 'Actor Name', 'Role', 'Action', 'Resource Type', 'Resource Name', 'Decision', 'Evidence Source'];
    const rows = filteredLogs.map(l => [
      l.id,
      l.timestamp,
      `"${l.userName}"`,
      l.userRole,
      l.action,
      l.resourceType,
      `"${l.resourceName}"`,
      `"${l.decision || ''}"`,
      `"${l.evidenceSource || ''}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `KMRL_IntelliDocs_Audit_Trail_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Immutable System Audit Trail
            </h1>
            <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono text-xs">
              {auditLogs.length} Events Logged
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-light">
            Cryptographically verifiable transaction ledger tracking every document upload, AI extraction, human verification, and change approval.
          </p>
        </div>

        <button
          onClick={exportAuditCSV}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700 text-xs font-mono transition-all cursor-pointer shrink-0"
        >
          <Download className="w-4 h-4 text-cyan-400" />
          <span>Export Audit CSV</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="p-4 rounded-2xl bg-[#091228] border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={actionFilter}
            onChange={e => setActionFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-300 text-xs focus:outline-none focus:border-cyan-400 font-mono"
          >
            <option value="ALL">All Event Types</option>
            <option value="DOCUMENT_UPLOAD">DOCUMENT_UPLOAD</option>
            <option value="DOCUMENT_PROCESSED">DOCUMENT_PROCESSED</option>
            <option value="CHANGE_IMPACT_SIMULATION">CHANGE_IMPACT_SIMULATION</option>
            <option value="APPROVAL_DECISION">APPROVAL_DECISION</option>
            <option value="RISK_VERIFIED">RISK_VERIFIED</option>
            <option value="CONFLICT_RESOLVED">CONFLICT_RESOLVED</option>
            <option value="COPILOT_QUERY">COPILOT_QUERY</option>
          </select>
        </div>

        <div className="relative min-w-[240px] w-full sm:w-auto">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by actor, decision or resource..."
            className="w-full pl-8 pr-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
          />
        </div>
      </div>

      {/* Audit Log Table / Stream */}
      <div className="rounded-3xl bg-[#091228] border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 border-b border-slate-800 font-mono text-[11px] text-slate-400">
              <tr>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Actor</th>
                <th className="py-3 px-4">Action Type</th>
                <th className="py-3 px-4">Target Resource</th>
                <th className="py-3 px-4">Decision / Detail</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
              {filteredLogs.map(log => (
                <tr key={log.id} className="hover:bg-slate-900/60 transition-colors">
                  <td className="py-3.5 px-4 text-slate-400 whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white">{log.userName}</span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-900 border border-slate-700 text-cyan-400">
                        {log.userRole}
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-bold">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-300 max-w-[200px] truncate">
                    {log.resourceName}
                  </td>
                  <td className="py-3.5 px-4 text-slate-300 max-w-[280px]">
                    <span className="text-slate-200">
                      {log.decision || log.newValue || 'Standard event recorded.'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
