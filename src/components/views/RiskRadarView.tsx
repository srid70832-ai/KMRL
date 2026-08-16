import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  ShieldAlert,
  Flame,
  AlertTriangle,
  CheckCircle2,
  Filter,
  FileText,
  Building,
  UserCheck,
  Zap,
  ArrowRight
} from 'lucide-react';
import { useData } from '../../context/DataContext.js';
import { useAuth } from '../../context/AuthContext.js';
import { RiskSeverity, RiskCategory } from '../../types.js';

export const RiskRadarView: React.FC = () => {
  const { currentUser } = useAuth();
  const { risks, verifyRisk } = useData();

  const [severityFilter, setSeverityFilter] = useState<string>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [verificationFilter, setVerificationFilter] = useState<'ALL' | 'UNVERIFIED' | 'VERIFIED'>('ALL');

  const filteredRisks = risks.filter(r => {
    if (severityFilter !== 'ALL' && r.severity !== severityFilter) return false;
    if (categoryFilter !== 'ALL' && r.category !== categoryFilter) return false;
    if (verificationFilter === 'UNVERIFIED' && r.isVerified) return false;
    if (verificationFilter === 'VERIFIED' && !r.isVerified) return false;
    return true;
  });

  const criticalCount = risks.filter(r => r.severity === 'CRITICAL').length;
  const highCount = risks.filter(r => r.severity === 'HIGH').length;
  const mediumCount = risks.filter(r => r.severity === 'MEDIUM').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Operational Risk Radar
            </h1>
            <span className="px-2 py-0.5 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 font-mono text-xs font-bold">
              {criticalCount} Critical • {highCount} High
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-light">
            Continuous scanning of contractual liquidated damages, emergency safety protocols, and SLA downtime thresholds across active documents.
          </p>
        </div>
      </div>

      {/* KPI Metrics with Staggered Entrance & Radar Animation */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.05 }}
          whileHover={{ y: -2 }}
          className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 border-l-4 border-l-rose-500 shadow-sm"
        >
          <div className="flex items-center justify-between text-rose-400 mb-1">
            <span className="text-[11px] font-mono uppercase font-bold">Critical Severity</span>
            <Flame className="w-4 h-4 text-rose-500 animate-pulse" />
          </div>
          <div className="text-2xl font-bold text-rose-300">{criticalCount}</div>
          <span className="text-[10px] text-slate-400 font-mono">Immediate Interventions</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.1 }}
          whileHover={{ y: -2 }}
          className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 border-l-4 border-l-orange-500 shadow-sm"
        >
          <div className="flex items-center justify-between text-orange-400 mb-1">
            <span className="text-[11px] font-mono uppercase font-bold">High Severity</span>
            <AlertTriangle className="w-4 h-4 text-orange-400" />
          </div>
          <div className="text-2xl font-bold text-orange-300">{highCount}</div>
          <span className="text-[10px] text-slate-400 font-mono">Departmental Escalations</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.15 }}
          whileHover={{ y: -2 }}
          className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 border-l-4 border-l-blue-500 shadow-sm"
        >
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-mono uppercase font-bold">Medium / Low</span>
            <ShieldAlert className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-white">{mediumCount}</div>
          <span className="text-[10px] text-slate-400 font-mono">Monitored Items</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.2 }}
          whileHover={{ y: -2 }}
          className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 border-l-4 border-l-emerald-500 shadow-sm"
        >
          <div className="flex items-center justify-between text-emerald-400 mb-1">
            <span className="text-[11px] font-mono uppercase font-bold">Verified by Human</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-300">
            {risks.filter(r => r.isVerified).length} / {risks.length}
          </div>
          <span className="text-[10px] text-slate-400 font-mono">Officer Sign-Offs</span>
        </motion.div>
      </div>

      {/* Filter Bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs"
      >
        <div className="flex items-center gap-1.5 p-1 bg-slate-900 rounded-lg border border-slate-800">
          <button
            onClick={() => setVerificationFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
              verificationFilter === 'ALL'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All Risks
          </button>
          <button
            onClick={() => setVerificationFilter('UNVERIFIED')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
              verificationFilter === 'UNVERIFIED'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Unverified ({risks.filter(r => !r.isVerified).length})
          </button>
          <button
            onClick={() => setVerificationFilter('VERIFIED')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
              verificationFilter === 'VERIFIED'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Verified ({risks.filter(r => r.isVerified).length})
          </button>
        </div>

        <div className="flex items-center gap-2.5">
          <select
            value={severityFilter}
            onChange={e => setSeverityFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-300 text-xs focus:outline-none focus:border-cyan-400 font-mono"
          >
            <option value="ALL">All Severities</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>

          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-300 text-xs focus:outline-none focus:border-cyan-400 font-mono"
          >
            <option value="ALL">All Categories</option>
            <option value="SLA">SLA</option>
            <option value="CONTRACT">Contract</option>
            <option value="COMPLIANCE">Compliance</option>
            <option value="DEADLINE">Deadline</option>
            <option value="FINANCIAL">Financial</option>
          </select>
        </div>
      </motion.div>

      {/* Risk Items Cards with Staggered Entrance */}
      <div className="space-y-3">
        {filteredRisks.map((rk, idx) => (
          <motion.div
            key={rk.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: idx * 0.04 }}
            whileHover={{ y: -2 }}
            className={`p-5 rounded-xl bg-slate-900/40 border transition-all ${
              rk.severity === 'CRITICAL'
                ? 'border-slate-800 border-l-4 border-l-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.08)]'
                : rk.severity === 'HIGH'
                ? 'border-slate-800 border-l-4 border-l-orange-500'
                : 'border-slate-800 border-l-4 border-l-cyan-500'
            }`}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
              <div className="flex items-center gap-2.5">
                <span
                  className={`text-[10px] font-mono font-bold uppercase px-2.5 py-1 rounded-lg ${
                    rk.severity === 'CRITICAL'
                      ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                      : rk.severity === 'HIGH'
                      ? 'bg-orange-500/10 text-orange-400 border border-orange-500/30'
                      : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                  }`}
                >
                  {rk.severity} • {rk.category}
                </span>
                <h3 className="text-sm font-bold text-white">{rk.title}</h3>
              </div>

              <div className="flex items-center gap-2">
                {rk.isVerified ? (
                  <span className="inline-flex items-center gap-1 text-emerald-400 text-xs font-mono">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Verified by {rk.verifiedBy || 'Officer'}</span>
                  </span>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => verifyRisk(rk.id)}
                    className="px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-xs font-mono font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Human Verify Risk</span>
                  </motion.button>
                )}
              </div>
            </div>

            {/* Content Details */}
            <div className="mt-3 space-y-2 text-xs">
              <div className="text-slate-300 leading-relaxed font-light">
                <strong className="text-slate-400 font-mono">Operational Reason: </strong>
                {rk.reason}
              </div>

              {/* Exact Evidence quote */}
              <div className="p-3 rounded-lg bg-slate-950/90 border border-slate-800 text-[11px] font-mono text-slate-300 leading-relaxed italic border-l-2 border-rose-400">
                &quot;{rk.evidence}&quot;
              </div>

              {/* Recommended Action */}
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-teal-300 text-[11px] font-mono flex items-center gap-2">
                <Zap className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                <span><strong>Recommended Action:</strong> {rk.recommendedAction}</span>
              </div>

              <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-1">
                <span>Originating Document: {rk.documentTitle} (Page {rk.pageNumber})</span>
                <span>Created: {new Date(rk.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
