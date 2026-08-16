import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from 'lucide-react';
import { useData } from '../../context/DataContext.js';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useData();

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map(toast => {
          const isSuccess = toast.type === 'SUCCESS';
          const isWarning = toast.type === 'WARNING';
          const isError = toast.type === 'ERROR';

          const borderColor = isSuccess
            ? 'border-teal-500/40 bg-slate-900/95 text-teal-200'
            : isWarning
            ? 'border-amber-500/40 bg-slate-900/95 text-amber-200'
            : isError
            ? 'border-rose-500/40 bg-slate-900/95 text-rose-200'
            : 'border-cyan-500/40 bg-slate-900/95 text-cyan-200';

          const icon = isSuccess ? (
            <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
          ) : isWarning ? (
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          ) : isError ? (
            <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          ) : (
            <Info className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
          );

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              className={`pointer-events-auto flex items-start justify-between gap-3 p-4 rounded-xl border shadow-xl backdrop-blur-md ${borderColor}`}
            >
              <div className="flex items-start gap-3">
                {icon}
                <div>
                  <h4 className="text-sm font-semibold text-white tracking-wide">
                    {toast.title}
                  </h4>
                  <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                    {toast.message}
                  </p>
                </div>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-slate-400 hover:text-white transition-colors p-1"
                aria-label="Close notification"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
