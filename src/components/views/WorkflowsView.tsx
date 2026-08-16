import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Workflow,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Building,
  UserCheck,
  Clock,
  Sparkles,
  FileText,
  X
} from 'lucide-react';
import { useData } from '../../context/DataContext.js';
import { useAuth } from '../../context/AuthContext.js';
import { ApprovalRequest, WorkflowStage } from '../../types.js';

export const WorkflowsView: React.FC = () => {
  const { currentUser } = useAuth();
  const { workflows, approvals, decideApproval } = useData();

  const [activeSubTab, setActiveSubTab] = useState<'APPROVALS' | 'WORKFLOWS'>('APPROVALS');
  const [selectedApproval, setSelectedApproval] = useState<ApprovalRequest | null>(null);
  const [decisionType, setDecisionType] = useState<'APPROVED' | 'REJECTED' | 'ESCALATED'>('APPROVED');
  const [decisionNote, setDecisionNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const stages: { stage: WorkflowStage; label: string }[] = [
    { stage: 'INGEST', label: '1. Ingest' },
    { stage: 'UNDERSTANDING', label: '2. Understand' },
    { stage: 'CONNECTION', label: '3. Connect' },
    { stage: 'RISK', label: '4. Risk Scan' },
    { stage: 'IMPACT', label: '5. Impact' },
    { stage: 'ACTION', label: '6. Action' },
    { stage: 'DECISION', label: '7. Decision' },
    { stage: 'APPROVAL', label: '8. Approval' },
    { stage: 'AUDIT', label: '9. Audit' }
  ];

  const handleDecisionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApproval) return;
    setIsSubmitting(true);
    await decideApproval(selectedApproval.id, decisionType, decisionNote);
    setIsSubmitting(false);
    setSelectedApproval(null);
    setDecisionNote('');
  };

  const pendingApprovals = approvals.filter(a => a.status === 'PENDING');
  const completedApprovals = approvals.filter(a => a.status !== 'PENDING');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Workflows &amp; Human Approval Gates
          </h1>
          <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono text-xs">
            {pendingApprovals.length} Awaiting Authorization
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-1 font-light">
          Full 9-stage lifecycle orchestration ensuring zero autonomous execution without verified officer sign-off.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 p-1 bg-slate-900 rounded-2xl border border-slate-800 w-fit text-xs">
        <button
          onClick={() => setActiveSubTab('APPROVALS')}
          className={`px-4 py-2 rounded-xl font-medium transition-all ${
            activeSubTab === 'APPROVALS'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Pending Approvals Queue ({pendingApprovals.length})
        </button>
        <button
          onClick={() => setActiveSubTab('WORKFLOWS')}
          className={`px-4 py-2 rounded-xl font-medium transition-all ${
            activeSubTab === 'WORKFLOWS'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Active 9-Stage Workflows ({workflows.length})
        </button>
      </div>

      {/* Content */}
      {activeSubTab === 'APPROVALS' && (
        <div className="space-y-4">
          {approvals.map(appr => {
            const isPending = appr.status === 'PENDING';

            return (
              <motion.div
                key={appr.id}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-6 rounded-3xl bg-[#091228] border transition-all ${
                  isPending
                    ? 'border-cyan-500/40 shadow-[0_0_20px_rgba(6,182,212,0.1)]'
                    : 'border-slate-800 opacity-80'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded ${
                          appr.priority === 'CRITICAL'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        }`}
                      >
                        {appr.priority} Priority
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        Target Role: <strong className="text-cyan-300">{appr.targetRole}</strong>
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-white">{appr.title}</h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-mono uppercase px-2.5 py-1 rounded-lg font-bold ${
                        appr.status === 'APPROVED'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : appr.status === 'REJECTED'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse'
                      }`}
                    >
                      {appr.status}
                    </span>

                    {isPending && (
                      <button
                        onClick={() => {
                          setSelectedApproval(appr);
                          setDecisionNote(`Authorized by ${currentUser.name} (${currentUser.role}).`);
                        }}
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 text-white font-semibold text-xs transition-all shadow-lg shadow-cyan-500/20 cursor-pointer"
                      >
                        Review &amp; Authorize
                      </button>
                    )}
                  </div>
                </div>

                <div className="mt-3 space-y-2 text-xs">
                  <div className="text-slate-300">
                    <strong className="text-slate-400 font-mono">Summary &amp; Context: </strong>
                    {appr.summary}
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-cyan-300 italic border-l-2 border-cyan-400 leading-relaxed">
                    &quot;{appr.evidence}&quot;
                  </div>

                  {appr.decisionNote && (
                    <div className="p-2.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-emerald-300 text-[11px] font-mono">
                      <strong>Decision Note:</strong> {appr.decisionNote} (By {appr.decidedBy || 'Officer'} on {new Date(appr.decidedAt || '').toLocaleDateString()})
                    </div>
                  )}

                  <div className="text-[10px] font-mono text-slate-500 pt-1">
                    Originating Document: {appr.documentTitle} • Created: {new Date(appr.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {activeSubTab === 'WORKFLOWS' && (
        <div className="space-y-4">
          {workflows.map(wf => {
            const currentStageIndex = stages.findIndex(s => s.stage === wf.currentStage);

            return (
              <div key={wf.id} className="p-6 rounded-3xl bg-[#091228] border border-slate-800 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                  <div>
                    <h3 className="text-sm font-bold text-white">{wf.title}</h3>
                    <span className="text-[11px] font-mono text-slate-400">
                      {wf.department} • Ref: {wf.id}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 px-2 py-0.5 rounded-full w-fit">
                    Active Stage: {wf.currentStage}
                  </span>
                </div>

                {/* 9-Stage Visual Progress Track */}
                <div className="grid grid-cols-3 sm:grid-cols-9 gap-1.5 text-[10px] font-mono">
                  {stages.map((stg, idx) => {
                    const isPast = idx < currentStageIndex;
                    const isCurrent = idx === currentStageIndex;

                    return (
                      <div
                        key={stg.stage}
                        className={`p-2 rounded-xl border text-center transition-all ${
                          isPast
                            ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                            : isCurrent
                            ? 'bg-cyan-500/20 border-cyan-500 text-cyan-200 font-bold shadow-[0_0_10px_rgba(6,182,212,0.2)]'
                            : 'bg-slate-950 border-slate-800 text-slate-500'
                        }`}
                      >
                        {stg.label}
                      </div>
                    );
                  })}
                </div>

                {wf.aiRecommendation && (
                  <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 font-light flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>{wf.aiRecommendation}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Decision Modal */}
      <AnimatePresence>
        {selectedApproval && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-[#0c152e] border border-cyan-500/40 rounded-3xl p-6 shadow-2xl space-y-4 text-xs"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-base font-bold text-white">Record Human Approval Decision</h3>
                </div>
                <button
                  onClick={() => setSelectedApproval(null)}
                  className="text-slate-400 hover:text-white p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleDecisionSubmit} className="space-y-4">
                <div>
                  <label className="block text-slate-300 font-mono mb-1">Approval Item</label>
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white font-semibold">
                    {selectedApproval.title}
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-mono mb-1">Decision</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setDecisionType('APPROVED')}
                      className={`p-2.5 rounded-xl border text-center font-mono font-bold transition-all ${
                        decisionType === 'APPROVED'
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                          : 'bg-slate-900 border-slate-800 text-slate-400'
                      }`}
                    >
                      APPROVE
                    </button>
                    <button
                      type="button"
                      onClick={() => setDecisionType('REJECTED')}
                      className={`p-2.5 rounded-xl border text-center font-mono font-bold transition-all ${
                        decisionType === 'REJECTED'
                          ? 'bg-rose-500/20 border-rose-500 text-rose-300 shadow-[0_0_15px_rgba(244,63,94,0.2)]'
                          : 'bg-slate-900 border-slate-800 text-slate-400'
                      }`}
                    >
                      REJECT
                    </button>
                    <button
                      type="button"
                      onClick={() => setDecisionType('ESCALATED')}
                      className={`p-2.5 rounded-xl border text-center font-mono font-bold transition-all ${
                        decisionType === 'ESCALATED'
                          ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                          : 'bg-slate-900 border-slate-800 text-slate-400'
                      }`}
                    >
                      ESCALATE
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-mono mb-1">
                    Officer Authorization Note &amp; Justification
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={decisionNote}
                    onChange={e => setDecisionNote(e.target.value)}
                    className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-400 font-mono text-[11px]"
                  />
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setSelectedApproval(null)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 text-white font-semibold flex items-center gap-1.5 shadow-lg shadow-cyan-500/20"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Confirm Decision</span>
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
