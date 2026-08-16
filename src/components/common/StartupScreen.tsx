import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, Cpu, Database, Network } from 'lucide-react';

interface StartupScreenProps {
  onComplete: () => void;
}

export const StartupScreen: React.FC<StartupScreenProps> = ({ onComplete }) => {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setStage(1), 600);
    const t2 = setTimeout(() => setStage(2), 1400);
    const t3 = setTimeout(() => onComplete(), 2300);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#070d1e] text-slate-100 overflow-hidden"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0, scale: 0.98 }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
      >
        {/* Background Subtle Grid & Ambient Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(#0e244d_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />
        <div className="absolute w-96 h-96 rounded-full bg-cyan-500/10 blur-[120px] pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-md">
          {/* Logo Mark */}
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500/20 via-blue-600/20 to-slate-900 border border-cyan-500/40 flex items-center justify-center shadow-[0_0_40px_rgba(6,182,212,0.25)] mb-6"
          >
            <ShieldCheck className="w-10 h-10 text-cyan-400" />
          </motion.div>

          {/* Title & Brand */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <span className="text-xs uppercase tracking-[0.25em] text-cyan-400 font-mono font-medium">
              Kochi Metro Rail Limited
            </span>
            <h1 className="text-3xl font-bold tracking-tight text-white mt-1">
              KMRL IntelliDocs
            </h1>
            <p className="text-sm text-slate-400 mt-2 font-light">
              Enterprise Document Intelligence & Operational Automation
            </p>
          </motion.div>

          {/* Mini Pipeline Animation Indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="flex items-center gap-3 mt-8 text-xs text-slate-400 font-mono"
          >
            <div className="flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>Evidence Engine</span>
            </div>
            <span className="text-slate-600">•</span>
            <div className="flex items-center gap-1.5">
              <Network className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
              <span>Knowledge Graph</span>
            </div>
            <span className="text-slate-600">•</span>
            <div className="flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-teal-400 animate-pulse" />
              <span>Impact Simulator</span>
            </div>
          </motion.div>

          {/* Progress Bar */}
          <div className="w-48 h-1 bg-slate-800 rounded-full mt-6 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
              initial={{ width: '0%' }}
              animate={{ width: stage === 0 ? '30%' : stage === 1 ? '75%' : '100%' }}
              transition={{ duration: 0.6, ease: 'easeInOut' }}
            />
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
