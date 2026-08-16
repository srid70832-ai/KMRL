import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, FileText, ArrowRight, ShieldCheck, X, Sparkles } from 'lucide-react';
import { useData } from '../../context/DataContext.js';
import { SearchResultChunk } from '../../types.js';

interface GlobalSearchModalProps {
  onSelectDocument?: (docId: string) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ onSelectDocument }) => {
  const { searchModalOpen, setSearchModalOpen, runSemanticSearch } = useData();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResultChunk[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setSearchModalOpen(true);
      }
      if (e.key === 'Escape' && searchModalOpen) {
        setSearchModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [searchModalOpen, setSearchModalOpen]);

  useEffect(() => {
    if (searchModalOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setResults([]);
    }
  }, [searchModalOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      setIsSearching(true);
      const res = await runSemanticSearch(query, 0.1);
      setResults(res);
      setIsSearching(false);
    }, 200);

    return () => clearTimeout(timer);
  }, [query, runSemanticSearch]);

  if (!searchModalOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/60 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          className="w-full max-w-2xl bg-[#0c142b] border border-cyan-500/30 rounded-2xl shadow-[0_0_50px_rgba(6,182,212,0.15)] overflow-hidden"
        >
          {/* Search Header */}
          <div className="flex items-center px-4 py-3.5 border-b border-slate-800 bg-slate-900/50">
            <Search className="w-5 h-5 text-cyan-400 mr-3 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search across authorized documents, clauses, and obligations... (e.g. 'ATO zone controller', '99.98% SLA')"
              className="w-full bg-transparent text-white placeholder:text-slate-500 text-sm focus:outline-none"
            />
            {query && (
              <button onClick={() => setQuery('')} className="text-slate-400 hover:text-white p-1">
                <X className="w-4 h-4" />
              </button>
            )}
            <div className="flex items-center gap-1.5 ml-3 pl-3 border-l border-slate-800 text-[10px] font-mono text-slate-400">
              <span className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700">ESC</span>
            </div>
          </div>

          {/* Results Area */}
          <div className="max-h-[60vh] overflow-y-auto p-4 space-y-2.5">
            {isSearching && (
              <div className="flex items-center justify-center py-8 text-xs text-cyan-400 font-mono gap-2">
                <Sparkles className="w-4 h-4 animate-spin" />
                <span>Vectorizing query & ranking evidence...</span>
              </div>
            )}

            {!isSearching && query && results.length === 0 && (
              <div className="text-center py-10 text-slate-400 text-sm">
                <p>No verified evidence chunks matched &quot;{query}&quot;</p>
                <p className="text-xs text-slate-500 mt-1">Try querying specific contract clauses, equipment terms, or safety standards.</p>
              </div>
            )}

            {!isSearching && !query && (
              <div className="py-6 px-4 text-center">
                <p className="text-xs font-mono text-cyan-400 uppercase tracking-wider mb-2">
                  Semantic Vector Retrieval
                </p>
                <p className="text-xs text-slate-400">
                  Search through all authorized KMRL metro operations documents, CBTC specifications, civil works milestones, and traction directives.
                </p>
              </div>
            )}

            {!isSearching && results.map(result => (
              <motion.div
                key={result.chunkId}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => {
                  if (onSelectDocument) onSelectDocument(result.documentId);
                  setSearchModalOpen(false);
                }}
                className="group p-3.5 rounded-xl border border-slate-800 bg-slate-900/60 hover:border-cyan-500/50 hover:bg-slate-800/60 cursor-pointer transition-all"
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span className="text-xs font-semibold text-white group-hover:text-cyan-300 transition-colors">
                      {result.documentTitle}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                      Page {result.pageNumber}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] font-mono text-cyan-400">
                    <ShieldCheck className="w-3 h-3 text-cyan-400" />
                    <span>{Math.round(result.similarityScore * 100)}% Match</span>
                  </div>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed line-clamp-2 italic border-l-2 border-cyan-500/40 pl-2.5 my-1">
                  &quot;{result.text}&quot;
                </p>
                <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2">
                  <span className="font-mono text-slate-500">{result.department}</span>
                  <span className="inline-flex items-center gap-1 text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    Inspect Evidence <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Footer */}
          <div className="px-4 py-2.5 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>Role-Based Retrieval Active</span>
            <span>Ctrl + K</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
