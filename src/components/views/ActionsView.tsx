import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  ListTodo,
  CheckCircle2,
  Clock,
  User,
  Filter,
  FileText,
  Building,
  AlertCircle
} from 'lucide-react';
import { useData } from '../../context/DataContext.js';
import { useAuth } from '../../context/AuthContext.js';

export const ActionsView: React.FC = () => {
  const { currentUser } = useAuth();
  const { actions, updateAction } = useData();

  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');

  const filteredActions = actions.filter(a => {
    if (statusFilter !== 'ALL' && a.status !== statusFilter) return false;
    if (priorityFilter !== 'ALL' && a.priority !== priorityFilter) return false;
    return true;
  });

  const handleToggleComplete = async (actionId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'COMPLETED' ? 'PENDING' : 'COMPLETED';
    await updateAction(actionId, nextStatus);
  };

  const handleAssignToMe = async (actionId: string) => {
    await updateAction(actionId, undefined, currentUser.name);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Extracted Operational Obligations &amp; Actions
          </h1>
          <span className="px-2 py-0.5 rounded-full bg-blue-500/20 border border-blue-500/40 text-blue-300 font-mono text-xs font-bold">
            {actions.filter(a => a.status === 'PENDING').length} Pending
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-1 font-light">
          Obligations, inspection requirements, and statutory tasks extracted with exact verbatim clause grounding.
        </p>
      </div>

      {/* Filter Toolbar */}
      <div className="p-4 rounded-2xl bg-[#091228] border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-1.5 p-1 bg-slate-900 rounded-xl border border-slate-800">
          <button
            onClick={() => setStatusFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              statusFilter === 'ALL'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All Actions ({actions.length})
          </button>
          <button
            onClick={() => setStatusFilter('PENDING')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              statusFilter === 'PENDING'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Pending ({actions.filter(a => a.status === 'PENDING').length})
          </button>
          <button
            onClick={() => setStatusFilter('COMPLETED')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              statusFilter === 'COMPLETED'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Completed ({actions.filter(a => a.status === 'COMPLETED').length})
          </button>
        </div>

        <select
          value={priorityFilter}
          onChange={e => setPriorityFilter(e.target.value)}
          className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-300 text-xs focus:outline-none focus:border-cyan-400 font-mono"
        >
          <option value="ALL">All Priorities</option>
          <option value="CRITICAL">Critical</option>
          <option value="HIGH">High</option>
          <option value="MEDIUM">Medium</option>
          <option value="LOW">Low</option>
        </select>
      </div>

      {/* Actions List */}
      <div className="space-y-3">
        {filteredActions.map(act => {
          const isDone = act.status === 'COMPLETED';

          return (
            <motion.div
              key={act.id}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-2xl bg-[#091228] border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                isDone ? 'border-emerald-500/30 opacity-70' : 'border-slate-800 hover:border-cyan-500/40'
              }`}
            >
              <div className="flex items-start gap-3.5 min-w-0">
                <button
                  onClick={() => handleToggleComplete(act.id, act.status)}
                  className={`mt-0.5 w-5 h-5 rounded-lg border flex items-center justify-center transition-colors cursor-pointer shrink-0 ${
                    isDone
                      ? 'bg-emerald-500 border-emerald-400 text-slate-950 font-bold'
                      : 'border-slate-700 bg-slate-900 hover:border-cyan-400 text-transparent'
                  }`}
                  aria-label="Toggle completed"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </button>

                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded ${
                        act.priority === 'CRITICAL'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                          : act.priority === 'HIGH'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                      }`}
                    >
                      {act.priority}
                    </span>
                    <h3 className={`text-xs font-bold ${isDone ? 'line-through text-slate-400' : 'text-white'}`}>
                      {act.action}
                    </h3>
                  </div>

                  <div className="text-[11px] text-slate-400 font-mono flex flex-wrap items-center gap-3">
                    <span>Role: <strong className="text-slate-300">{act.responsibleRole}</strong></span>
                    {act.assignedTo && <span>• Assignee: <strong className="text-cyan-300">{act.assignedTo}</strong></span>}
                    {act.deadline && <span>• Target: <strong className="text-amber-300">{act.deadline}</strong></span>}
                  </div>

                  <p className="text-[11px] text-slate-400 italic border-l-2 border-slate-700 pl-2">
                    &quot;{act.evidence}&quot;
                  </p>
                </div>
              </div>

              {/* Right actions */}
              <div className="flex items-center gap-2 shrink-0 justify-end">
                {!act.assignedTo && (
                  <button
                    onClick={() => handleAssignToMe(act.id)}
                    className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-[11px] font-mono text-cyan-300 transition-colors"
                  >
                    Claim Task
                  </button>
                )}
                <span className="text-[10px] font-mono text-slate-500">
                  {act.documentTitle} (P.{act.pageNumber})
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
