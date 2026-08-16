import React from 'react';
import { motion } from 'motion/react';
import { Heart, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full mt-auto border-t border-slate-800 bg-[#020617] py-3.5 px-6">
      <motion.div
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400"
      >
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
          <span className="font-mono text-[11px] text-slate-300">
            KMRL IntelliDocs Enterprise AI • Kochi Metro Rail Ltd.
          </span>
        </div>

        <div className="flex items-center gap-1.5 font-medium tracking-wide">
          <span className="text-slate-300">Developed by SC TECH</span>
          <motion.span
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            className="inline-block text-rose-500"
          >
            <Heart className="w-3.5 h-3.5 fill-rose-500" />
          </motion.span>
        </div>
      </motion.div>
    </footer>
  );
};

