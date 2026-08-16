import React from 'react';
import { motion } from 'motion/react';
import {
  BarChart3,
  TrendingUp,
  PieChart,
  ShieldAlert,
  CheckCircle2,
  Zap,
  Building,
  FileText
} from 'lucide-react';
import { useData } from '../../context/DataContext.js';

export const AnalyticsView: React.FC = () => {
  const { documents, risks, conflicts, actions, compliance, impactAnalyses, graphNodes } = useData();

  // Metrics computation
  const totalPages = documents.reduce((acc, d) => acc + (d.pageCount || 1), 0);
  const totalRisks = risks.length;
  const verifiedRisks = risks.filter(r => r.isVerified).length;
  const verifiedRate = totalRisks > 0 ? Math.round((verifiedRisks / totalRisks) * 100) : 100;
  const compliantCount = compliance.filter(c => c.status === 'COMPLIANT').length;
  const complianceRate = compliance.length > 0 ? Math.round((compliantCount / compliance.length) * 100) : 100;

  // Department breakdown
  const deptCounts: Record<string, number> = {};
  documents.forEach(d => {
    deptCounts[d.department] = (deptCounts[d.department] || 0) + 1;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Operational Intelligence &amp; Analytics
          </h1>
          <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono text-xs">
            Real-time Telemetry
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-1 font-light">
          Aggregate performance, risk velocity, and compliance indices calculated across all Kochi Metro documentation assets.
        </p>
      </div>

      {/* Top High-Level Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-[#091228] border border-cyan-500/30 shadow-sm">
          <span className="text-[10px] font-mono text-cyan-400 uppercase block mb-1">
            Total Pages Vectorized
          </span>
          <div className="text-2xl font-bold text-white">{totalPages} Pages</div>
          <span className="text-[10px] text-slate-400 font-mono">100% Deterministic Grounding</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#091228] border border-emerald-500/30 shadow-sm">
          <span className="text-[10px] font-mono text-emerald-400 uppercase block mb-1">
            Statutory Pass Rate
          </span>
          <div className="text-2xl font-bold text-emerald-300">{complianceRate}%</div>
          <span className="text-[10px] text-slate-400 font-mono">Metro Railways Act 2002</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#091228] border border-blue-500/30 shadow-sm">
          <span className="text-[10px] font-mono text-blue-400 uppercase block mb-1">
            Human Risk Sign-Off
          </span>
          <div className="text-2xl font-bold text-blue-300">{verifiedRate}%</div>
          <span className="text-[10px] text-slate-400 font-mono">{verifiedRisks} / {totalRisks} Items Verified</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#091228] border border-teal-500/30 shadow-sm">
          <span className="text-[10px] font-mono text-teal-400 uppercase block mb-1">
            Knowledge Graph Density
          </span>
          <div className="text-2xl font-bold text-teal-300">{graphNodes.length} Nodes</div>
          <span className="text-[10px] text-slate-400 font-mono">Cross-Corridor Linked</span>
        </div>
      </div>

      {/* Analytics Visual Breakdowns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Document Distribution */}
        <div className="p-6 rounded-3xl bg-[#091228] border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white">Documents by Operational Department</h3>
            <span className="text-[10px] font-mono text-slate-400">{documents.length} Total</span>
          </div>

          <div className="space-y-3 font-mono text-xs">
            {Object.entries(deptCounts).map(([dept, count]) => {
              const pct = Math.round((count / documents.length) * 100);
              return (
                <div key={dept} className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-300">{dept}</span>
                    <span className="text-cyan-400">{count} docs ({pct}%)</span>
                  </div>
                  <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Severity Distribution */}
        <div className="p-6 rounded-3xl bg-[#091228] border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white">Risk Severity Distribution</h3>
            <span className="text-[10px] font-mono text-rose-400">{risks.length} Detected</span>
          </div>

          <div className="space-y-3 font-mono text-xs">
            {['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map(sev => {
              const count = risks.filter(r => r.severity === sev).length;
              const pct = risks.length > 0 ? Math.round((count / risks.length) * 100) : 0;
              const color =
                sev === 'CRITICAL'
                  ? 'from-rose-500 to-rose-700'
                  : sev === 'HIGH'
                  ? 'from-amber-500 to-amber-700'
                  : 'from-blue-500 to-blue-700';

              return (
                <div key={sev} className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-300">{sev}</span>
                    <span className="text-slate-400">{count} items ({pct}%)</span>
                  </div>
                  <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${color} rounded-full`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
