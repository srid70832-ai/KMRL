import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Search, Sparkles, FileText, ShieldCheck, ArrowRight, Sliders, Database } from 'lucide-react';
import { useData } from '../../context/DataContext.js';
import { SearchResultChunk } from '../../types.js';

export const SemanticSearchView: React.FC = () => {
  const { runSemanticSearch } = useData();
  const [query, setQuery] = useState('');
  const [minScore, setMinScore] = useState(0.2);
  const [results, setResults] = useState<SearchResultChunk[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const sampleQueries = [
    'What is the CBTC availability SLA target and financial penalty rate?',
    'What are the night maintenance track possession shutdown rules?',
    'What are the 25kV AC traction substation emergency backup obligations?',
    'Kakkanad extension Phase 2 civil milestone completion dates'
  ];

  const handleSearch = async (queryToRun?: string) => {
    const q = queryToRun || query;
    if (!q.trim()) return;
    setIsSearching(true);
    setHasSearched(true);
    const chunks = await runSemanticSearch(q, minScore);
    setResults(chunks);
    setIsSearching(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Semantic Vector Search
          </h1>
          <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono text-xs">
            Evidence-Grounded Retrieval
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-1 font-light">
          Search across thousands of chunked document paragraphs by meaning rather than exact keywords. Every match displays exact source citations and similarity rankings.
        </p>
      </div>

      {/* Search Input Box */}
      <div className="p-6 rounded-2xl bg-[#091228] border border-cyan-500/30 shadow-lg space-y-4">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-cyan-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') handleSearch();
              }}
              placeholder="Enter complex operational question or clause query... (e.g. 'liquidated damages for signal failures')"
              className="w-full pl-12 pr-4 py-3.5 bg-slate-950/80 border border-slate-700/80 rounded-2xl text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 transition-all font-sans shadow-inner"
            />
          </div>

          <button
            onClick={() => handleSearch()}
            disabled={isSearching || !query.trim()}
            className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-lg shadow-cyan-500/20 active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            {isSearching ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin text-cyan-200" />
                <span>Searching Vectors...</span>
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>Execute Search</span>
              </>
            )}
          </button>
        </div>

        {/* Filter Controls & Presets */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 text-xs">
          {/* Quick Query Presets */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-mono text-slate-400 mr-1">Suggested:</span>
            {sampleQueries.map((sq, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setQuery(sq);
                  handleSearch(sq);
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-300 transition-colors text-[11px] truncate max-w-[280px]"
              >
                {sq}
              </button>
            ))}
          </div>

          {/* Similarity Threshold */}
          <div className="flex items-center gap-2 font-mono text-[11px] text-slate-400 shrink-0">
            <Sliders className="w-3.5 h-3.5 text-cyan-400" />
            <span>Similarity Threshold:</span>
            <input
              type="range"
              min="0.05"
              max="0.8"
              step="0.05"
              value={minScore}
              onChange={e => setMinScore(parseFloat(e.target.value))}
              className="w-20 accent-cyan-400 cursor-pointer"
            />
            <span className="text-cyan-300 font-bold">{Math.round(minScore * 100)}%</span>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-mono text-slate-400 px-1">
          <span>{hasSearched ? `${results.length} Evidence Chunks Retrieved` : 'Awaiting Query'}</span>
          <span className="text-cyan-400">Strict Evidence Grounding Active</span>
        </div>

        {hasSearched && results.length === 0 && !isSearching && (
          <div className="p-12 text-center rounded-2xl bg-[#091228] border border-slate-800 text-slate-400 text-xs">
            <Database className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p className="font-semibold text-slate-300">No verified evidence chunks exceeded the {Math.round(minScore * 100)}% similarity threshold.</p>
            <p className="mt-1">Try lowering the similarity threshold slider or refining your operational terms.</p>
          </div>
        )}

        <div className="grid grid-cols-1 gap-3">
          {results.map((item, idx) => (
            <motion.div
              key={item.chunkId || idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="p-5 rounded-2xl bg-[#091228] border border-slate-800 hover:border-cyan-500/40 transition-all shadow-sm"
            >
              <div className="flex items-center justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span className="text-sm font-bold text-white">{item.documentTitle}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
                    Page {item.pageNumber}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-xs font-mono text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 px-2.5 py-0.5 rounded-full">
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{Math.round(item.similarityScore * 100)}% Confidence Match</span>
                </div>
              </div>

              {/* Exact Verbatim Evidence Text */}
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-200 leading-relaxed font-mono">
                <p className="italic border-l-2 border-cyan-400 pl-3">
                  &quot;{item.text}&quot;
                </p>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono mt-3 pt-2 border-t border-slate-800/60">
                <span>Department: {item.department}</span>
                <span className="text-cyan-400">Chunk Ref: {item.chunkId}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
