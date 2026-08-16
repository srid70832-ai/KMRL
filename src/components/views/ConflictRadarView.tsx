import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  GitCompare,
  AlertTriangle,
  CheckCircle2,
  FileText,
  Building,
  UserCheck,
  Scale,
  X
} from 'lucide-react';
import { useData } from '../../context/DataContext.js';
import { useAuth } from '../../context/AuthContext.js';
import { ConflictItem } from '../../types.js';

export const ConflictRadarView: React.FC = () => {
  const { currentUser } = useAuth();
  const { conflicts, resolveConflict } = useData();

  const [activeConflictForResolution, setActiveConflictForResolution] = useState<ConflictItem | null>(null);
  const [resolutionStatus, setResolutionStatus] = useState('RESOLVED');
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [isResolving, setIsResolving] = useState(false);

  const handleResolveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeConflictForResolution) return;
    setIsResolving(true);
    await resolveConflict(activeConflictForResolution.id, resolutionStatus, resolutionNotes);
    setIsResolving(false);
    setActiveConflictForResolution(null);
    setResolutionNotes('');
  };

  const activeConflicts = conflicts.filter(c => c.status === 'ACTIVE');
  const resolvedConflicts = conflicts.filter(c => c.status !== 'ACTIVE');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Cross-Document Conflict Radar
          </h1>
          <span className="px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 font-mono text-xs font-bold">
            {activeConflicts.length} Active Discrepancies
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-1 font-light">
          Identifies legal, contractual, and technical contradictions across separate documents, preventing operational friction between contractors and operations.
        </p>
      </div>

      {/* Conflicts List */}
      <div className="space-y-4">
        {conflicts.map(cnf => {
          const isActive = cnf.status === 'ACTIVE';

          return (
            <motion.div
              key={cnf.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-6 rounded-3xl bg-[#091228] border transition-all ${
                isActive ? 'border-amber-500/40 shadow-lg' : 'border-slate-800 opacity-80'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <span
                    className={`text-[10px] font-mono font-bold uppercase px-2.5 py-1 rounded-lg ${
                      cnf.severity === 'CRITICAL'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    }`}
                  >
                    {cnf.severity} Conflict
                  </span>
                  <h3 className="text-sm font-bold text-white">{cnf.title}</h3>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-mono uppercase px-2.5 py-1 rounded-lg font-bold ${
                      isActive
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    }`}
                  >
                    {cnf.status}
                  </span>

                  {isActive && (
                    <button
                      onClick={() => {
                        setActiveConflictForResolution(cnf);
                        setResolutionNotes(`Reviewed by ${currentUser.name}. Harmonized contractual interpretation applied.`);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-mono font-medium transition-colors"
                    >
                      Arbitrate &amp; Resolve
                    </button>
                  )}
                </div>
              </div>

              {/* Side-by-Side Clause Discrepancy Matrix */}
              <div className="mt-4 space-y-3">
                <div className="text-xs text-slate-300">
                  <strong className="text-slate-400 font-mono">Discrepancy Analysis: </strong>
                  {cnf.description}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                  {/* Document 1 Position */}
                  <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-cyan-400 font-bold">
                      <span className="truncate">{cnf.document1Title}</span>
                      <span className="text-[10px] text-slate-400">Page {cnf.document1Page}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-900 text-slate-200 text-[11px] leading-relaxed italic border-l-2 border-cyan-400">
                      &quot;{cnf.document1Quote}&quot;
                    </div>
                  </div>

                  {/* Document 2 Position */}
                  <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-amber-400 font-bold">
                      <span className="truncate">{cnf.document2Title}</span>
                      <span className="text-[10px] text-slate-400">Page {cnf.document2Page}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-900 text-slate-200 text-[11px] leading-relaxed italic border-l-2 border-amber-400">
                      &quot;{cnf.document2Quote}&quot;
                    </div>
                  </div>
                </div>

                {/* Resolution Notes if resolved */}
                {!isActive && cnf.resolutionNotes && (
                  <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-emerald-300 text-xs font-mono flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span><strong>Resolution:</strong> {cnf.resolutionNotes} (By {cnf.resolvedBy || 'Officer'})</span>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Resolution Modal */}
      <AnimatePresence>
        {activeConflictForResolution && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-[#0c152e] border border-cyan-500/40 rounded-3xl p-6 shadow-2xl space-y-4 text-xs"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Scale className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-base font-bold text-white">Arbitrate Document Conflict</h3>
                </div>
                <button
                  onClick={() => setActiveConflictForResolution(null)}
                  className="text-slate-400 hover:text-white p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleResolveSubmit} className="space-y-4">
                <div>
                  <label className="block text-slate-300 font-medium mb-1 font-mono">
                    Conflict Title
                  </label>
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white font-medium">
                    {activeConflictForResolution.title}
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1 font-mono">
                    Resolution Status Decision
                  </label>
                  <select
                    value={resolutionStatus}
                    onChange={e => setResolutionStatus(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-400 font-mono"
                  >
                    <option value="RESOLVED">RESOLVED (Harmonized by Ruling)</option>
                    <option value="ACCEPTED_RISK">ACCEPTED_RISK (Operational Tolerance)</option>
                    <option value="ESCALATED">ESCALATED (Referred to Legal Directorate)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1 font-mono">
                    Arbitration Notes &amp; Justification
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={resolutionNotes}
                    onChange={e => setResolutionNotes(e.target.value)}
                    className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 font-mono text-[11px]"
                  />
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setActiveConflictForResolution(null)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isResolving}
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 text-white font-semibold flex items-center gap-1.5 shadow-lg shadow-cyan-500/20"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Confirm Arbitration</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
