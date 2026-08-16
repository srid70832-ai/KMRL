import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Zap,
  GitCompare,
  ShieldAlert,
  Files,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileText,
  UserCheck,
  Building,
  History,
  Layers,
  ChevronDown,
  Activity,
  Sliders,
  Radio,
  Clock,
  ShieldCheck,
  Flame,
  Check
} from 'lucide-react';
import { useData } from '../../context/DataContext.js';
import { useAuth } from '../../context/AuthContext.js';
import { ChangeImpactAnalysis } from '../../types.js';

export const ChangeImpactSimulatorView: React.FC = () => {
  const { currentUser } = useAuth();
  const { documents, simulateChangeImpact, verifyChangeImpact, impactAnalyses } = useData();

  const [selectedDocId, setSelectedDocId] = useState<string>(documents[0]?.id || '');
  const [newVersionLabel, setNewVersionLabel] = useState('v2.2 Proposed Addendum');
  const [newVersionText, setNewVersionText] = useState('');
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationProgress, setSimulationProgress] = useState(0);
  const [activeTab, setActiveTab] = useState<'VISUAL' | 'DIFF' | 'IMPACT' | 'RISKS'>('VISUAL');
  const [currentAnalysis, setCurrentAnalysis] = useState<ChangeImpactAnalysis | null>(impactAnalyses[0] || null);

  const activeDoc = documents.find(d => d.id === selectedDocId) || documents[0];

  // Predefined Simulation Scenarios for quick evaluation
  const simulationPresets = [
    {
      title: 'Scenario A: CBTC SLA Downtime Variation',
      desc: 'Alstom proposes reducing monthly uptime SLA threshold from 99.98% to 99.90% and capping liquidated damages at INR 10 Lakhs/month.',
      targetDocTitle: 'Alstom CBTC Signalling Service Level Agreement',
      newLabel: 'v2.2-Addendum-Draft',
      severity: 'CRITICAL',
      text: `ADDENDUM TO CBTC SIGNALLING MAINTENANCE SLA (KMRL-S&T-2024-009)
Section 4.1 (Revised Performance Threshold):
The overall CBTC system availability shall be maintained at a minimum of 99.90% (revised from 99.98%) calculated on a quarterly rolling basis.

Section 8.3 (Liquidated Damages Cap):
In the event of signalling outages exceeding permitted downtime thresholds, liquidated damages payable by Alstom Transport India shall be strictly capped at INR 10,00,000 per fiscal quarter.

Section 11.2 (Emergency Replacement Spares):
Critical trackside ATO zone controller spares shall be dispatched within 72 hours (relaxed from 24 hours).`
    },
    {
      title: 'Scenario B: Traction Power Shutdown Window Reduction',
      desc: 'KSEBL / Traction sub-station proposes compressing nightly 25kV de-energization maintenance window from 01:00-04:30 to 02:00-04:00.',
      targetDocTitle: '25kV AC Traction Power Substation Operations & Safety Protocol',
      newLabel: 'v4.1-Night-Window-Revision',
      severity: 'HIGH',
      text: `AMENDMENT TO TRACTION POWER PROTOCOL (KMRL-ELEC-2023-04)
Clause 4.1 (Night Maintenance Window):
Track possession and 25kV traction grid de-energization will commence at 02:00 IST and conclude strictly at 04:00 IST (2 hours total possession window).

Clause 7.2 (Permit to Work Procedure):
Emergency power isolation testing shall be conducted bi-monthly instead of monthly.`
    },
    {
      title: 'Scenario C: Phase 2 Civil Viaduct Timeline Extension',
      desc: 'L&T Civil Infrastructure requests 45-day extension for viaduct pier foundation works on Kakkanad Infopark corridor.',
      targetDocTitle: 'Phase 2 Kakkanad Extension Viaduct Construction Contract',
      newLabel: 'v1.1-Extension-Claim',
      severity: 'MEDIUM',
      text: `CONTRACT VARIATION CLAIM (KMRL-CIVIL-P2-019-V1.1)
Milestone 4 (Viaduct Pier Completion):
The milestone completion target for Piers P-40 to P-120 along Kakkanad Infopark corridor is rescheduled from 2026-06-30 to 2026-08-15 (+45 days).

Mobilization Advance & Escalation:
Material price index adjustment shall apply to reinforcing steel procured after 2026-05-01.`
    }
  ];

  const loadPreset = (preset: typeof simulationPresets[0]) => {
    const matched = documents.find(d => d.title.toLowerCase().includes(preset.targetDocTitle.toLowerCase()));
    if (matched) setSelectedDocId(matched.id);
    setNewVersionLabel(preset.newLabel);
    setNewVersionText(preset.text);
  };

  const handleRunSimulation = async () => {
    if (!selectedDocId || !newVersionText.trim()) return;
    setIsSimulating(true);
    setSimulationProgress(15);
    
    const interval = setInterval(() => {
      setSimulationProgress(p => {
        if (p >= 90) {
          clearInterval(interval);
          return 90;
        }
        return p + 25;
      });
    }, 180);

    try {
      const analysis = await simulateChangeImpact(selectedDocId, newVersionText, newVersionLabel);
      setSimulationProgress(100);
      setTimeout(() => {
        setCurrentAnalysis(analysis);
        setIsSimulating(false);
      }, 400);
    } catch (err: any) {
      alert(err.message || 'Simulation failed');
      setIsSimulating(false);
    } finally {
      clearInterval(interval);
    }
  };

  const handleDecision = async (status: string) => {
    if (!currentAnalysis) return;
    await verifyChangeImpact(currentAnalysis.id, status);
    setCurrentAnalysis(prev => prev ? { ...prev, humanVerificationStatus: status as any, verifiedBy: currentUser.name, verifiedAt: new Date().toISOString() } : null);
  };

  return (
    <div className="space-y-6">
      {/* Header with USP statement */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="p-6 rounded-2xl bg-gradient-to-r from-[#091533] via-[#0b1b44] to-[#020617] border border-cyan-500/30 relative overflow-hidden shadow-xl"
      >
        {/* Animated Background Pulse Orb */}
        <motion.div
          animate={{
            scale: [1, 1.25, 1],
            opacity: [0.15, 0.3, 0.15]
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute right-0 top-0 w-96 h-96 bg-cyan-500/20 rounded-full blur-[90px] pointer-events-none"
        />

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 font-mono text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-[0_0_10px_rgba(6,182,212,0.3)]">
              <Sparkles className="w-3 h-3 text-cyan-300 animate-spin" />
              Primary System USP
            </span>
            <span className="text-slate-400 font-mono text-xs">• Cross-Document Blast Radius Engine</span>
          </div>

          <h1 className="text-2xl lg:text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            Change Impact Simulator
            <motion.span
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="inline-block"
            >
              <Zap className="w-6 h-6 text-cyan-400" />
            </motion.span>
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed font-light">
            <strong className="text-cyan-300 font-medium">&quot;We don&apos;t just detect what changed. We determine what that change can affect.&quot;</strong> When a document changes or an addendum is proposed, our AI evaluates cross-document interface dependencies, cascaded SLA liabilities, and safety compliance protocols.
          </p>
        </div>
      </motion.div>

      {/* Preset Scenario Selector with Staggered Entrance */}
      <div className="space-y-2">
        <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <Radio className="w-3 h-3 text-cyan-400 animate-pulse" />
          Quick Simulation Scenarios (Click to load test variation)
        </span>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {simulationPresets.map((preset, idx) => (
            <motion.button
              key={idx}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.08 }}
              whileHover={{ y: -3, transition: { duration: 0.15 } }}
              whileTap={{ scale: 0.98 }}
              onClick={() => loadPreset(preset)}
              className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-cyan-500/50 text-left transition-all group cursor-pointer relative overflow-hidden"
            >
              <div className={`absolute top-0 left-0 bottom-0 w-1 ${
                preset.severity === 'CRITICAL' ? 'bg-rose-500' : preset.severity === 'HIGH' ? 'bg-orange-500' : 'bg-cyan-500'
              }`} />
              <div className="flex items-center justify-between gap-2 mb-1.5 pl-2">
                <span className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {preset.title}
                </span>
                <Zap className="w-3.5 h-3.5 text-cyan-400 opacity-60 group-hover:opacity-100 group-hover:scale-125 transition-all shrink-0" />
              </div>
              <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed pl-2">
                {preset.desc}
              </p>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Two-Column Simulation Configuration Form */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Base Document Reference */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-4 shadow-sm"
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Files className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white">Step 1: Select Active Base Document</h3>
            </div>
            <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/30">Target Baseline</span>
          </div>

          <div>
            <label className="block text-slate-300 text-xs font-mono mb-1.5">
              Active Repository Document
            </label>
            <select
              value={selectedDocId}
              onChange={e => setSelectedDocId(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs focus:outline-none focus:border-cyan-400 transition-colors"
            >
              {documents.map(d => (
                <option key={d.id} value={d.id}>
                  {d.title} (v{d.version} - {d.department})
                </option>
              ))}
            </select>
          </div>

          {activeDoc && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              key={activeDoc.id}
              className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs space-y-2"
            >
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>Vendor: <strong className="text-slate-200">{activeDoc.metadata.vendor || 'KMRL Internal'}</strong></span>
                <span className="text-cyan-400">Version: v{activeDoc.version}</span>
              </div>
              <div className="text-[11px] text-slate-300 font-mono max-h-36 overflow-y-auto whitespace-pre-wrap leading-relaxed p-2.5 bg-slate-900/70 rounded-lg custom-scrollbar">
                {activeDoc.rawText.slice(0, 480)}...
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Right Column: Proposed Variation / Addendum Input */}
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-4 flex flex-col justify-between shadow-sm"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <GitCompare className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white">Step 2: Input Proposed Variation Text</h3>
              </div>
              <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/30">New Revision Draft</span>
            </div>

            <div>
              <label className="block text-slate-300 text-xs font-mono mb-1.5">
                Revision / Addendum Label
              </label>
              <input
                type="text"
                value={newVersionLabel}
                onChange={e => setNewVersionLabel(e.target.value)}
                placeholder="e.g. v2.2 Proposed Addendum"
                className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs focus:outline-none focus:border-cyan-400 font-mono transition-colors"
              />
            </div>

            <div>
              <label className="block text-slate-300 text-xs font-mono mb-1.5">
                Proposed Clause Changes (Full Text or Addendum Clauses)
              </label>
              <textarea
                rows={5}
                value={newVersionText}
                onChange={e => setNewVersionText(e.target.value)}
                placeholder="Paste the proposed addendum clauses or modified contractual obligations here..."
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-lg text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 font-mono leading-relaxed custom-scrollbar transition-colors"
              />
            </div>
          </div>

          <div className="space-y-2 pt-2">
            {isSimulating && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[10px] font-mono text-cyan-400">
                  <span className="flex items-center gap-1.5">
                    <Activity className="w-3 h-3 animate-spin" />
                    Calculating Blast Radius &amp; Cross-Contract Dependencies...
                  </span>
                  <span>{simulationProgress}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-cyan-500 via-teal-400 to-blue-500"
                    style={{ width: `${simulationProgress}%` }}
                    transition={{ ease: 'easeOut', duration: 0.3 }}
                  />
                </div>
              </div>
            )}

            <motion.button
              whileHover={{ scale: isSimulating ? 1 : 1.01 }}
              whileTap={{ scale: isSimulating ? 1 : 0.98 }}
              onClick={handleRunSimulation}
              disabled={isSimulating || !newVersionText.trim()}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.25)] active:scale-95 disabled:opacity-50 cursor-pointer transition-all"
            >
              {isSimulating ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin text-cyan-200" />
                  <span>Evaluating Cross-Document Interfaces...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  <span>Execute Change Impact Simulation</span>
                </>
              )}
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Simulation Analysis Results Section */}
      <AnimatePresence mode="wait">
        {currentAnalysis && (
          <motion.div
            key={currentAnalysis.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35 }}
            className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-6 shadow-xl relative overflow-hidden"
          >
            {/* Ambient Cyan Glow */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

            {/* Analysis Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono px-2.5 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-bold uppercase">
                    Simulation Report Generated
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    {currentAnalysis.documentTitle} ({currentAnalysis.baseVersion} → {currentAnalysis.targetVersion})
                  </span>
                </div>
                <h2 className="text-lg font-bold text-white mt-1.5">
                  {currentAnalysis.summaryOfChange}
                </h2>
              </div>

              {/* Human Verification Decision Status Badge */}
              <div className="flex items-center gap-2 font-mono text-xs shrink-0">
                <span className={`px-3 py-1.5 rounded-lg font-bold uppercase ${
                  currentAnalysis.humanVerificationStatus === 'VERIFIED_APPROVED'
                    ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
                    : currentAnalysis.humanVerificationStatus === 'VERIFIED_REJECTED'
                    ? 'bg-rose-500/10 text-rose-300 border border-rose-500/30'
                    : 'bg-amber-500/10 text-amber-300 border border-amber-500/30 animate-pulse'
                }`}>
                  {currentAnalysis.humanVerificationStatus.replace(/_/g, ' ')}
                </span>
              </div>
            </div>

            {/* View Filter Tabs with Animated Active Indicator */}
            <div className="flex items-center space-x-2 border-b border-slate-800 pb-2">
              {[
                { id: 'VISUAL', label: 'Blast Radius Visualizer', icon: Activity },
                { id: 'DIFF', label: 'Clause-by-Clause Diff', icon: GitCompare },
                { id: 'IMPACT', label: 'Affected Contracts', icon: Layers },
                { id: 'RISKS', label: 'Risks & Mitigations', icon: ShieldAlert }
              ].map(tab => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`relative px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center space-x-2 transition-all cursor-pointer ${
                      isActive ? 'text-cyan-400 bg-cyan-500/10 border border-cyan-500/30' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Tab 1: Interactive Animated Blast Radius Visualizer */}
            {activeTab === 'VISUAL' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="rounded-xl bg-slate-950/60 border border-slate-800 p-6 min-h-[300px] flex flex-col items-center justify-center relative overflow-hidden"
              >
                {/* Radial Glow Waves */}
                <motion.div
                  animate={{ scale: [0.8, 1.4, 0.8], opacity: [0.1, 0.3, 0.1] }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute w-72 h-72 rounded-full bg-cyan-500/10 blur-2xl pointer-events-none"
                />

                {/* Animated Simulation Graph Hierarchy */}
                <div className="relative z-10 w-full flex flex-col lg:flex-row items-center justify-around gap-8 py-4">
                  {/* Base Node */}
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="flex flex-col items-center text-center space-y-2 max-w-[140px]"
                  >
                    <div className="w-16 h-16 rounded-2xl bg-slate-900 border-2 border-cyan-500 flex items-center justify-center text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.3)]">
                      <Files className="w-7 h-7" />
                    </div>
                    <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider">
                      Base Baseline
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono line-clamp-1">
                      {currentAnalysis.documentTitle}
                    </span>
                  </motion.div>

                  {/* Animated Connecting Beam 1 */}
                  <div className="relative flex items-center justify-center">
                    <div className="w-16 lg:w-24 h-[2px] bg-gradient-to-r from-cyan-500 via-teal-400 to-orange-500 relative">
                      <motion.div
                        animate={{ x: [0, 80, 0] }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
                        className="absolute -top-1 w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_10px_#06b6d4]"
                      />
                    </div>
                  </div>

                  {/* Central Addendum Variation Node */}
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="flex flex-col items-center text-center space-y-2 max-w-[160px]"
                  >
                    <div className="w-16 h-16 rounded-2xl bg-slate-900 border-2 border-orange-500 flex items-center justify-center text-orange-400 shadow-[0_0_20px_rgba(249,115,22,0.3)]">
                      <GitCompare className="w-7 h-7" />
                    </div>
                    <span className="text-[11px] font-bold text-orange-400 uppercase tracking-wider">
                      Proposed Addendum
                    </span>
                    <span className="text-[10px] text-slate-300 font-mono">
                      {currentAnalysis.targetVersion}
                    </span>
                  </motion.div>

                  {/* Animated Connecting Beam 2 */}
                  <div className="relative flex items-center justify-center">
                    <div className="w-16 lg:w-24 h-[2px] bg-gradient-to-r from-orange-500 via-rose-500 to-rose-600 relative">
                      <motion.div
                        animate={{ x: [0, 80, 0] }}
                        transition={{ duration: 2.2, repeat: Infinity, ease: 'linear' }}
                        className="absolute -top-1 w-2.5 h-2.5 rounded-full bg-rose-400 shadow-[0_0_10px_#f43f5e]"
                      />
                    </div>
                  </div>

                  {/* Cascading Blast Nodes */}
                  <div className="flex flex-col space-y-3">
                    <motion.div
                      whileHover={{ scale: 1.03 }}
                      className="flex items-center space-x-3 p-2.5 rounded-xl bg-slate-900 border border-slate-800 border-l-4 border-l-rose-500"
                    >
                      <div className="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-400">
                        <Flame className="w-4 h-4" />
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-bold text-white">SLA Penalties &amp; Liability</p>
                        <p className="text-[10px] text-rose-400">Escalated Risk Triggered</p>
                      </div>
                    </motion.div>

                    <motion.div
                      whileHover={{ scale: 1.03 }}
                      className="flex items-center space-x-3 p-2.5 rounded-xl bg-slate-900 border border-slate-800 border-l-4 border-l-orange-500"
                    >
                      <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-400">
                        <Layers className="w-4 h-4" />
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-bold text-white">{currentAnalysis.affectedDocuments.length} Sibling Contracts</p>
                        <p className="text-[10px] text-slate-400">Maintenance &amp; Grid Schedules</p>
                      </div>
                    </motion.div>
                  </div>
                </div>

                {/* Blast Radius Metrics Footer */}
                <div className="w-full mt-6 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between text-xs text-slate-400 font-mono">
                  <span>Simulated Blast Radius: <strong className="text-white">MODERATE ({currentAnalysis.changedClauses.length} Clauses Modified)</strong></span>
                  <span className="text-emerald-400">AI Confidence: 94.6% Verified Quote Match</span>
                </div>
              </motion.div>
            )}

            {/* Tab 2: Clause-by-Clause Comparative Diff */}
            {activeTab === 'DIFF' && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-3"
              >
                {currentAnalysis.changedClauses.map((clause, idx) => (
                  <motion.div
                    key={clause.id || idx}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white font-mono">{clause.section}</span>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase font-bold ${
                        clause.riskLevel === 'CRITICAL' || clause.riskLevel === 'HIGH'
                          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                          : 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                      }`}>
                        {clause.riskLevel} Risk Impact
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px] font-mono">
                      <div className="p-3 rounded-lg bg-rose-950/20 border border-rose-500/30 text-rose-200">
                        <span className="text-[10px] text-rose-400 block mb-1 font-bold">− ORIGINAL CLAUSE</span>
                        <p className="line-through opacity-80 leading-relaxed">{clause.oldText}</p>
                      </div>

                      <div className="p-3 rounded-lg bg-teal-950/20 border border-teal-500/30 text-teal-200">
                        <span className="text-[10px] text-teal-400 block mb-1 font-bold">+ PROPOSED CLAUSE</span>
                        <p className="leading-relaxed">{clause.newText}</p>
                      </div>
                    </div>

                    <div className="text-[11px] text-slate-300 italic border-l-2 border-cyan-400 pl-3">
                      Impact: {clause.impactDescription}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* Tab 3: Cascading Blast Radius (Affected Documents) */}
            {activeTab === 'IMPACT' && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-3"
              >
                {currentAnalysis.affectedDocuments.map((docAff, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">{docAff.title}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/10 text-rose-300 border border-rose-500/30 uppercase">
                        {docAff.impactSeverity} Severity
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-300">
                      <strong className="text-slate-400 font-mono">Why Affected: </strong>
                      {docAff.impactReason}
                    </div>

                    {docAff.evidence && (
                      <div className="p-2.5 rounded-lg bg-slate-900 text-[10px] font-mono text-cyan-300 italic border-l-2 border-cyan-400">
                        &quot;{docAff.evidence}&quot;
                      </div>
                    )}
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* Tab 4: Risks & Mitigations */}
            {activeTab === 'RISKS' && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                {/* Risks */}
                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3 text-xs">
                  <h4 className="font-bold font-mono text-rose-400 uppercase text-[11px] flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5 text-rose-400" />
                    Triggered Operational &amp; Financial Risks
                  </h4>
                  <div className="space-y-2">
                    {currentAnalysis.potentialRisks.map((rk, idx) => (
                      <div key={idx} className="p-2.5 rounded-lg bg-rose-950/20 border border-rose-500/30">
                        <div className="flex items-center justify-between text-[10px] font-mono text-rose-300 font-bold mb-1">
                          <span>{rk.category}</span>
                          <span>{rk.severity}</span>
                        </div>
                        <p className="text-[11px] text-slate-200">{rk.risk}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3 text-xs">
                  <h4 className="font-bold font-mono text-cyan-400 uppercase text-[11px] flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                    Recommended Actions Prior to Signing
                  </h4>
                  <div className="space-y-2">
                    {currentAnalysis.recommendedActions.map((ac, idx) => (
                      <div key={idx} className="p-2.5 rounded-lg bg-cyan-950/20 border border-cyan-500/30">
                        <div className="flex items-center justify-between text-[10px] font-mono text-cyan-300 font-bold mb-1">
                          <span>Role: {ac.role}</span>
                          <span>Priority: {ac.priority}</span>
                        </div>
                        <p className="text-[11px] text-slate-200">{ac.action}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Mandatory Human Decision Gate with Motion Buttons */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="p-5 rounded-xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4"
            >
              <div>
                <span className="text-xs font-bold text-white block">
                  Human-in-the-Loop Governance Gate
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  Changes will NOT be merged into active baseline without explicit officer authorization.
                </span>
              </div>

              <div className="flex items-center gap-2.5 shrink-0">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleDecision('VERIFIED_REJECTED')}
                  className="px-4 py-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-mono font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Reject Variation</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleDecision('ESCALATED_TO_BOARD')}
                  className="px-4 py-2 rounded-lg bg-orange-500/10 hover:bg-orange-500/20 text-orange-300 border border-orange-500/30 text-xs font-mono font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Escalate to Board</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleDecision('VERIFIED_APPROVED')}
                  className="px-5 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 text-white text-xs font-mono font-bold transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] flex items-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Authorize &amp; Sign</span>
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

