import React from 'react';
import { motion } from 'motion/react';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  HelpCircle,
  FileText,
  Building,
  Scale
} from 'lucide-react';
import { useData } from '../../context/DataContext.js';

export const ComplianceCheckerView: React.FC = () => {
  const { compliance } = useData();

  const compliantCount = compliance.filter(c => c.status === 'COMPLIANT').length;
  const nonCompliantCount = compliance.filter(c => c.status === 'NON_COMPLIANT').length;
  const partialCount = compliance.filter(c => c.status === 'PARTIALLY_COMPLIANT').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Metro Rail Statutory Compliance Matrix
          </h1>
          <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-mono text-xs font-bold">
            {Math.round((compliantCount / (compliance.length || 1)) * 100)}% Pass Rate
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-1 font-light">
          Continuous compliance verification against the Metro Railways (Operation and Maintenance) Act 2002, Central Electricity Authority (CEA) Regulations, and ISO 9001/45001 safety mandates.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-2xl bg-[#091228] border border-emerald-500/40 shadow-sm">
          <div className="flex items-center justify-between text-emerald-400 mb-1">
            <span className="text-[11px] font-mono uppercase font-bold">Verified Compliant</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-300">{compliantCount}</div>
          <span className="text-[10px] text-slate-400 font-mono">Statutory Requirements Passed</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#091228] border border-amber-500/40 shadow-sm">
          <div className="flex items-center justify-between text-amber-400 mb-1">
            <span className="text-[11px] font-mono uppercase font-bold">Partially Compliant</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-amber-300">{partialCount}</div>
          <span className="text-[10px] text-slate-400 font-mono">Requires Remedial Action</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#091228] border border-rose-500/40 shadow-sm">
          <div className="flex items-center justify-between text-rose-400 mb-1">
            <span className="text-[11px] font-mono uppercase font-bold">Non-Compliant</span>
            <XCircle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-bold text-rose-300">{nonCompliantCount}</div>
          <span className="text-[10px] text-slate-400 font-mono">Regulatory Exposure</span>
        </div>
      </div>

      {/* Compliance Items Matrix */}
      <div className="space-y-4">
        {compliance.map(cmp => (
          <motion.div
            key={cmp.id}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-5 rounded-2xl bg-[#091228] border transition-all ${
              cmp.status === 'COMPLIANT'
                ? 'border-emerald-500/30'
                : cmp.status === 'NON_COMPLIANT'
                ? 'border-rose-500/40 shadow-[0_0_15px_rgba(244,63,94,0.1)]'
                : 'border-amber-500/30'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <span
                  className={`text-[10px] font-mono font-bold uppercase px-2.5 py-1 rounded-lg ${
                    cmp.status === 'COMPLIANT'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : cmp.status === 'NON_COMPLIANT'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  }`}
                >
                  {cmp.status.replace(/_/g, ' ')}
                </span>
                <h3 className="text-sm font-bold text-white">{cmp.standard}</h3>
              </div>

              <span className="text-xs font-mono text-cyan-400">
                {cmp.clauseReference}
              </span>
            </div>

            <div className="mt-3 space-y-2.5 text-xs">
              <div className="text-slate-200 font-medium">
                <strong className="text-slate-400 font-mono">Mandatory Requirement: </strong>
                {cmp.requirement}
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-300 italic border-l-2 border-cyan-400 leading-relaxed">
                &quot;{cmp.evidence}&quot;
              </div>

              {cmp.riskAssessment && (
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-300">
                  <strong className="text-amber-400">Risk Assessment: </strong>
                  {cmp.riskAssessment}
                </div>
              )}

              <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-1">
                <span>Source Document: {cmp.documentTitle} (Page {cmp.pageNumber})</span>
                <span>Last Verified: {new Date(cmp.lastChecked).toLocaleDateString()}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
