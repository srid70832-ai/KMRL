import React from 'react';
import { motion } from 'motion/react';
import {
  CalendarClock,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Building2,
  Calendar,
  Flame,
  FileText
} from 'lucide-react';
import { useData } from '../../context/DataContext.js';

export const DeadlinesView: React.FC = () => {
  const { deadlines } = useData();

  const overdue = deadlines.filter(d => d.status === 'OVERDUE');
  const dueSoon = deadlines.filter(d => d.status === 'DUE_SOON');
  const upcoming = deadlines.filter(d => d.status === 'UPCOMING');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Operational Deadlines &amp; Milestone Timeline
          </h1>
          <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono text-xs">
            {deadlines.length} Tracked Milestones
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-1 font-light">
          Automatically compiled from contract delivery terms, safety inspection renewals, and civil milestone commitments.
        </p>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-2xl bg-[#091228] border border-rose-500/40 shadow-sm">
          <div className="flex items-center justify-between text-rose-400 mb-1">
            <span className="text-[11px] font-mono uppercase font-bold">Overdue Milestones</span>
            <Flame className="w-4 h-4 text-rose-500 animate-pulse" />
          </div>
          <div className="text-2xl font-bold text-rose-300">{overdue.length}</div>
          <span className="text-[10px] text-slate-400 font-mono">Requires Immediate Recovery Plan</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#091228] border border-amber-500/40 shadow-sm">
          <div className="flex items-center justify-between text-amber-400 mb-1">
            <span className="text-[11px] font-mono uppercase font-bold">Due in &lt; 14 Days</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-amber-300">{dueSoon.length}</div>
          <span className="text-[10px] text-slate-400 font-mono">Active In-Flight Review</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#091228] border border-teal-500/40 shadow-sm">
          <div className="flex items-center justify-between text-teal-400 mb-1">
            <span className="text-[11px] font-mono uppercase font-bold">Upcoming Scheduled</span>
            <CheckCircle2 className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-2xl font-bold text-teal-300">{upcoming.length}</div>
          <span className="text-[10px] text-slate-400 font-mono">Long-Range Targets</span>
        </div>
      </div>

      {/* Timeline Section */}
      <div className="space-y-4">
        {deadlines.map(dl => {
          const isOverdue = dl.status === 'OVERDUE';
          const isDueSoon = dl.status === 'DUE_SOON';

          return (
            <motion.div
              key={dl.id}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-5 rounded-2xl bg-[#091228] border transition-all ${
                isOverdue
                  ? 'border-rose-500/40 shadow-[0_0_15px_rgba(244,63,94,0.1)]'
                  : isDueSoon
                  ? 'border-amber-500/40'
                  : 'border-slate-800'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <span
                    className={`text-[10px] font-mono font-bold uppercase px-2.5 py-1 rounded-lg ${
                      isOverdue
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse'
                        : isDueSoon
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'bg-teal-500/20 text-teal-300 border border-teal-500/40'
                    }`}
                  >
                    {isOverdue ? 'OVERDUE' : isDueSoon ? 'DUE SOON' : 'ON SCHEDULE'}
                  </span>
                  <h3 className="text-sm font-bold text-white">{dl.title}</h3>
                </div>

                <div className="flex items-center gap-3 font-mono text-xs">
                  <div className="flex items-center gap-1.5 text-cyan-400">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Target: {dl.dueDate}</span>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                      isOverdue
                        ? 'bg-rose-950 text-rose-300'
                        : isDueSoon
                        ? 'bg-amber-950 text-amber-300'
                        : 'bg-slate-900 text-slate-300'
                    }`}
                  >
                    {dl.daysRemaining < 0
                      ? `${Math.abs(dl.daysRemaining)} Days Overdue`
                      : `${dl.daysRemaining} Days Left`}
                  </span>
                </div>
              </div>

              <div className="mt-3 space-y-2 text-xs">
                <div className="flex items-center gap-3 font-mono text-[11px] text-slate-400">
                  <span>Responsible Role: <strong className="text-white">{dl.responsibleRole}</strong></span>
                  <span>• Category: <strong className="text-teal-300">{dl.category}</strong></span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-300 italic border-l-2 border-cyan-400">
                  &quot;{dl.evidence}&quot;
                </div>

                <div className="text-[10px] font-mono text-slate-500 pt-1">
                  Source: {dl.documentTitle} (Page {dl.pageNumber})
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
