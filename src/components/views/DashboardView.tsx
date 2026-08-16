import React from 'react';
import { motion } from 'motion/react';
import {
  Files,
  ShieldAlert,
  GitCompare,
  ListTodo,
  ShieldCheck,
  Zap,
  ArrowRight,
  Bot,
  Network,
  Upload,
  CalendarClock,
  ChevronRight,
  Clock
} from 'lucide-react';
import { useData } from '../../context/DataContext.js';
import { useAuth } from '../../context/AuthContext.js';
import { NavigationTab } from '../../types.js';

interface DashboardViewProps {
  onNavigate: (tab: NavigationTab) => void;
  onSelectDoc?: (docId: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigate, onSelectDoc }) => {
  const { currentUser } = useAuth();
  const {
    documents,
    risks,
    conflicts,
    actions,
    deadlines,
    compliance,
    approvals
  } = useData();

  const criticalRisks = risks.filter(r => r.severity === 'CRITICAL' || r.severity === 'HIGH');
  const activeConflicts = conflicts.filter(c => c.status === 'ACTIVE');
  const pendingActions = actions.filter(a => a.status === 'PENDING' || a.status === 'IN_PROGRESS');
  const overdueDeadlines = deadlines.filter(d => d.status === 'OVERDUE');

  const compliantCount = compliance.filter(c => c.status === 'COMPLIANT').length;
  const complianceRate = compliance.length > 0 ? Math.round((compliantCount / compliance.length) * 100) : 100;

  // Empty state when repository has no documents
  if (documents.length === 0) {
    return (
      <div className="space-y-6">
        {/* Empty Canvas Banner */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4"
        >
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono text-[10px] font-bold uppercase">
                Active System Ready
              </span>
              <span className="text-xs text-slate-400 font-mono">Workspace Standby</span>
            </div>
            <h2 className="text-xl font-bold text-white mt-1.5">Awaiting Document Ingestion</h2>
            <p className="text-xs text-slate-400 mt-1 max-w-xl font-light">
              Upload authorized organizational contracts, safety directives, or technical specifications to extract evidence-backed operational intelligence.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onNavigate('DOCUMENTS')}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 text-white text-xs font-bold shadow-lg shadow-cyan-500/20 flex items-center gap-2 cursor-pointer transition-all"
            >
              <Upload className="w-4 h-4" />
              <span>Upload Document</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Operational Workflow Steps Card */}
        <div className="p-6 rounded-2xl bg-slate-900/20 border border-slate-800 space-y-4">
          <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest block">
            End-to-End Operational Pipeline
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 text-center text-xs">
            {[
              { step: '1', label: 'DOCUMENT', desc: 'Ingest & OCR' },
              { step: '2', label: 'UNDERSTAND', desc: 'Semantic Parse' },
              { step: '3', label: 'CONNECT', desc: 'Knowledge Graph' },
              { step: '4', label: 'DETECT', desc: 'Discrepancies' },
              { step: '5', label: 'IMPACT', desc: 'Blast Radius' },
              { step: '6', label: 'ACTION', desc: 'Obligations' },
              { step: '7', label: 'DECISION', desc: 'Human Approval' },
              { step: '8', label: 'AUDIT', desc: 'Immutable Log' }
            ].map(s => (
              <div key={s.step} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <span className="text-[10px] font-mono text-cyan-400/80 block">STEP {s.step}</span>
                <span className="text-xs font-bold text-white block mt-1">{s.label}</span>
                <span className="text-[10px] text-slate-500 block mt-0.5">{s.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Sleek KPI Metric Row with Staggered Entrance */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        {/* Processed / Repository */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          whileHover={{ y: -3, transition: { duration: 0.15 } }}
          onClick={() => onNavigate('DOCUMENTS')}
          className="bg-slate-900/40 p-5 rounded-xl border border-slate-800 border-l-4 border-l-cyan-500 cursor-pointer hover:bg-slate-900/60 transition-colors shadow-sm"
        >
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">DOCUMENTS</p>
          </div>
          <div className="flex items-end space-x-2">
            <span className="text-2xl font-bold text-white">{documents.length}</span>
            <span className="text-xs text-cyan-400 font-medium mb-1 font-mono">Active Repository</span>
          </div>
        </motion.div>

        {/* Risks Identified */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          whileHover={{ y: -3, transition: { duration: 0.15 } }}
          onClick={() => onNavigate('RISK_RADAR')}
          className="bg-slate-900/40 p-5 rounded-xl border border-slate-800 border-l-4 border-l-rose-500 cursor-pointer hover:bg-slate-900/60 transition-colors shadow-sm"
        >
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">RISKS DETECTED</p>
          </div>
          <div className="flex items-end space-x-2">
            <span className="text-2xl font-bold text-white">{String(criticalRisks.length).padStart(2, '0')}</span>
            <span className="text-xs text-rose-400 font-medium mb-1 uppercase font-mono">CRITICAL / HIGH</span>
          </div>
        </motion.div>

        {/* Conflicts */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
          whileHover={{ y: -3, transition: { duration: 0.15 } }}
          onClick={() => onNavigate('CONFLICT_RADAR')}
          className="bg-slate-900/40 p-5 rounded-xl border border-slate-800 border-l-4 border-l-orange-500 cursor-pointer hover:bg-slate-900/60 transition-colors shadow-sm"
        >
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">CONFLICTS</p>
          </div>
          <div className="flex items-end space-x-2">
            <span className="text-2xl font-bold text-white">{String(activeConflicts.length).padStart(2, '0')}</span>
            <span className="text-xs text-orange-400 font-medium mb-1 uppercase font-mono">PENDING REVIEW</span>
          </div>
        </motion.div>

        {/* AI Verifications / Compliance */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          whileHover={{ y: -3, transition: { duration: 0.15 } }}
          onClick={() => onNavigate('COMPLIANCE')}
          className="bg-slate-900/40 p-5 rounded-xl border border-slate-800 border-l-4 border-l-emerald-500 cursor-pointer hover:bg-slate-900/60 transition-colors shadow-sm"
        >
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">COMPLIANCE</p>
          </div>
          <div className="flex items-end space-x-2">
            <span className="text-2xl font-bold text-white">{complianceRate}%</span>
            <span className="text-xs text-emerald-400 font-medium mb-1 uppercase font-mono">EVIDENCE BACKED</span>
          </div>
        </motion.div>
      </div>

      {/* Main Row: Change Impact Simulator + Risk Radar & Action Required */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Change Impact Simulator View Container */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1 }}
          className="lg:col-span-2 bg-slate-900/30 rounded-2xl border border-slate-800 flex flex-col p-6 overflow-hidden relative"
        >
          <div className="flex items-center justify-between mb-8 shrink-0">
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">Change Impact Simulator</h2>
              <p className="text-xs text-slate-400 mt-1 uppercase tracking-wide">
                Simulating Change: Service Level Agreement v2.1 Update
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => onNavigate('IMPACT_SIMULATOR')}
              className="bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold py-2 px-4 rounded-lg transition-all shadow-[0_0_15px_rgba(8,145,178,0.3)] cursor-pointer"
            >
              Analyze Change
            </motion.button>
          </div>

          {/* Graphical Connection Simulator Canvas */}
          <div className="flex-1 min-h-[220px] relative flex items-center justify-center py-6">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(6,182,212,0.05)_0%,_transparent_70%)] pointer-events-none" />
            
            <div className="z-10 flex flex-wrap items-center justify-center gap-4 sm:gap-8 lg:gap-10">
              {/* Primary Document Node */}
              <motion.div
                whileHover={{ scale: 1.08 }}
                className="flex flex-col items-center space-y-2"
              >
                <div className="w-16 h-16 rounded-full bg-slate-800 border-2 border-cyan-500 flex items-center justify-center text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
                  <Files className="w-7 h-7" />
                </div>
                <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">Primary Document</span>
              </motion.div>

              {/* Connector Line 1 */}
              <div className="w-12 sm:w-20 h-[2px] bg-gradient-to-r from-cyan-500 to-orange-500 relative hidden sm:block">
                <motion.div
                  animate={{ x: [0, 40, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  className="absolute -top-1 right-0 w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_10px_#f97316]"
                />
              </div>

              {/* Vendor Node */}
              <motion.div
                whileHover={{ scale: 1.08 }}
                className="flex flex-col items-center space-y-2"
              >
                <div className="w-14 h-14 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center text-slate-400 opacity-80">
                  <Network className="w-6 h-6" />
                </div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Vendor: Alstom / NexaCore</span>
              </motion.div>

              {/* Connector Line 2 */}
              <div className="w-12 sm:w-20 h-[2px] bg-slate-800 relative hidden sm:block">
                <motion.div
                  animate={{ x: [0, 40, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear', delay: 1 }}
                  className="absolute -top-1 right-0 w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_10px_#f43f5e]"
                />
              </div>

              {/* Deadline / SLA Risk Node */}
              <motion.div
                whileHover={{ scale: 1.08 }}
                className="flex flex-col items-center space-y-2"
              >
                <div className="w-16 h-16 rounded-full bg-slate-800 border-2 border-rose-500 flex items-center justify-center text-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.2)]">
                  <Clock className="w-7 h-7" />
                </div>
                <span className="text-[10px] text-rose-500 font-bold uppercase tracking-wider">Deadline Risk</span>
              </motion.div>
            </div>
          </div>

          {/* Blast Radius & Confidence Score Summary */}
          <div className="mt-6 border-t border-slate-800 pt-6 flex flex-wrap gap-8 shrink-0">
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Blast Radius</p>
              <p className="text-sm text-slate-300">Moderate — 12 dependent sub-clauses affected across 3 departments.</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Confidence Score</p>
              <p className="text-sm text-emerald-400 font-semibold">94% Evidence Matched</p>
            </div>
          </div>
        </motion.div>

        {/* Right 1 Col: Risk Radar List & Action Required */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.15 }}
          className="flex flex-col space-y-6"
        >
          {/* Risk Radar Box */}
          <div className="bg-slate-900/30 rounded-2xl border border-slate-800 flex flex-col overflow-hidden">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between shrink-0">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Risk Radar</h3>
              <button
                onClick={() => onNavigate('RISK_RADAR')}
                className="text-[10px] font-bold text-cyan-400 hover:underline uppercase cursor-pointer"
              >
                View All
              </button>
            </div>

            <div className="p-4 space-y-3 max-h-[290px] overflow-y-auto custom-scrollbar">
              {risks.slice(0, 3).map((r, idx) => {
                const borderBg = r.severity === 'CRITICAL' ? 'bg-rose-500' : r.severity === 'HIGH' ? 'bg-orange-500' : 'bg-cyan-500';
                const textCol = r.severity === 'CRITICAL' ? 'text-rose-400' : r.severity === 'HIGH' ? 'text-orange-400' : 'text-cyan-400';

                return (
                  <motion.div
                    key={r.id || idx}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => onNavigate('RISK_RADAR')}
                    className="bg-slate-800/40 border border-slate-700 p-3 rounded-lg relative overflow-hidden cursor-pointer hover:border-slate-600 transition-colors"
                  >
                    <div className={`absolute left-0 top-0 bottom-0 w-1 ${borderBg}`} />
                    <div className="flex justify-between items-start mb-1">
                      <span className={`text-[10px] font-bold uppercase ${textCol}`}>{r.severity}</span>
                      <span className="text-[10px] text-slate-500 font-mono">Verified Quote</span>
                    </div>
                    <p className="text-xs font-semibold text-slate-200 leading-tight">
                      {r.title}
                    </p>
                    <p className="text-[10px] text-slate-500 mt-2 italic truncate">
                      {r.evidence}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Action Required Box */}
          <div className="bg-slate-900/30 rounded-2xl border border-slate-800 p-5 shrink-0">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Action Required</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 rounded-full bg-cyan-500 animate-ping" />
                  <span className="text-xs text-slate-300 font-medium">Review Audit Log</span>
                </div>
                <button
                  onClick={() => onNavigate('AUDIT_TRAIL')}
                  className="text-[10px] font-bold text-cyan-400 hover:underline uppercase cursor-pointer"
                >
                  View
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 rounded-full bg-slate-600" />
                  <span className="text-xs text-slate-400 font-medium">Resolve SLA Conflict</span>
                </div>
                <button
                  onClick={() => onNavigate('CONFLICT_RADAR')}
                  className="text-[10px] font-bold text-slate-400 hover:text-white uppercase cursor-pointer"
                >
                  Inspect
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Secondary Fast Access Modules */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          whileHover={{ y: -3, transition: { duration: 0.15 } }}
          onClick={() => onNavigate('COPILOT')}
          className="bg-slate-900/30 rounded-xl border border-slate-800 hover:border-cyan-500/40 p-4 transition-all cursor-pointer flex items-center justify-between group"
        >
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition-transform">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">AI Evidence Copilot</p>
              <p className="text-[10px] text-slate-400">Grounded Q&amp;A with exact citations</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.25 }}
          whileHover={{ y: -3, transition: { duration: 0.15 } }}
          onClick={() => onNavigate('KNOWLEDGE_GRAPH')}
          className="bg-slate-900/30 rounded-xl border border-slate-800 hover:border-blue-500/40 p-4 transition-all cursor-pointer flex items-center justify-between group"
        >
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 group-hover:scale-105 transition-transform">
              <Network className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Knowledge Graph</p>
              <p className="text-[10px] text-slate-400">Interconnected contracts &amp; vendors</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          whileHover={{ y: -3, transition: { duration: 0.15 } }}
          onClick={() => onNavigate('DEADLINES')}
          className="bg-slate-900/30 rounded-xl border border-slate-800 hover:border-emerald-500/40 p-4 transition-all cursor-pointer flex items-center justify-between group"
        >
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
              <CalendarClock className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Contractual Deadlines</p>
              <p className="text-[10px] text-slate-400">Statutory and milestone schedules</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all" />
        </motion.div>
      </div>
    </div>
  );
};

