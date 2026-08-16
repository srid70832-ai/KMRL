import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Bot,
  User as UserIcon,
  Send,
  Sparkles,
  ShieldCheck,
  FileText,
  AlertCircle,
  Clock,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { useData } from '../../context/DataContext.js';
import { useAuth } from '../../context/AuthContext.js';
import { CopilotMessage, CitationItem } from '../../types.js';

export const AiCopilotView: React.FC = () => {
  const { currentUser } = useAuth();
  const { askCopilot } = useData();

  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<CopilotMessage[]>([
    {
      id: 'welcome-msg',
      sender: 'assistant',
      content: `Hello **${currentUser.name}**. I am the evidence-grounded AI Copilot for Kochi Metro Rail Limited (IntelliDocs).

### Operational Protocol:
1. **NO EVIDENCE → NO CLAIM**: Every factual sentence I generate is backed by authorized repository clauses.
2. **Deterministic Citations**: All quotes cite exact Document Names and Page Numbers.
3. **Role Enforcement**: I only retrieve records accessible to your **${currentUser.role}** role.

How can I assist your operational review today?`,
      timestamp: new Date().toISOString(),
      citations: [],
      confidenceScore: 1.0
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCitation, setSelectedCitation] = useState<CitationItem | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestedQuestions = [
    'What is Alstom’s required CBTC availability SLA and penalty structure?',
    'What are the mandatory traction power substation inspection intervals?',
    'What happens if the Kakkanad Phase 2 viaduct pier milestone is delayed?',
    'Does the safety manual require human presence during night track possession?'
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async (questionText?: string) => {
    const q = questionText || input;
    if (!q.trim() || isLoading) return;

    const userMsg: CopilotMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      content: q,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await askCopilot(q);
      setMessages(prev => [...prev, response]);
    } catch {
      setMessages(prev => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'assistant',
          content: 'An error occurred while retrieving evidence from the knowledge base. Please try again.',
          timestamp: new Date().toISOString(),
          noEvidenceFound: true,
          confidenceScore: 0
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col lg:flex-row gap-6">
      {/* Main Chat Panel */}
      <div className="flex-1 flex flex-col bg-[#091228] border border-cyan-500/30 rounded-3xl shadow-2xl overflow-hidden">
        {/* Chat Header */}
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-900/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-white tracking-wide">
                  KMRL Operational Copilot
                </h2>
                <span className="text-[9px] font-mono uppercase px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                  Evidence-Grounded
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">
                No Hallucination Architecture • Page Level Citations
              </span>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 font-mono text-[11px] text-slate-400">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>Strict Evidence Rule Active</span>
          </div>
        </div>

        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 custom-scrollbar">
          {messages.map((msg) => {
            const isBot = msg.sender === 'assistant';

            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3.5 ${isBot ? 'items-start' : 'items-start flex-row-reverse'}`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                    isBot
                      ? 'bg-cyan-500/20 border border-cyan-500/40 text-cyan-300'
                      : 'bg-blue-600/30 border border-blue-500/40 text-blue-300'
                  }`}
                >
                  {isBot ? <Bot className="w-4 h-4" /> : <UserIcon className="w-4 h-4" />}
                </div>

                {/* Content Bubble */}
                <div
                  className={`max-w-2xl rounded-2xl p-4 text-xs leading-relaxed space-y-3 ${
                    isBot
                      ? 'bg-slate-900/90 border border-slate-800 text-slate-200'
                      : 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg'
                  }`}
                >
                  {/* Markdown formatted text */}
                  <div className="whitespace-pre-wrap font-sans text-xs space-y-2">
                    {msg.content}
                  </div>

                  {/* If no evidence found */}
                  {msg.noEvidenceFound && (
                    <div className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-950/40 border border-amber-500/30 text-amber-300 text-[11px] font-mono">
                      <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
                      <span>The requested fact is not stated in any authorized organizational document.</span>
                    </div>
                  )}

                  {/* Citations Badges if assistant has citations */}
                  {isBot && msg.citations && msg.citations.length > 0 && (
                    <div className="pt-2 border-t border-slate-800/80">
                      <div className="flex items-center gap-1.5 text-[10px] font-mono text-cyan-400 mb-2">
                        <FileText className="w-3 h-3" />
                        <span>VERIFIED CITATIONS ({msg.citations.length})</span>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {msg.citations.map((cite, idx) => (
                          <button
                            key={idx}
                            onClick={() => setSelectedCitation(cite)}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-950 border border-cyan-500/30 hover:border-cyan-400 text-cyan-300 text-[10px] font-mono transition-all group"
                          >
                            <span className="truncate max-w-[150px]">{cite.documentTitle}</span>
                            <span className="px-1 py-0.2 rounded bg-slate-900 text-slate-300">P.{cite.pageNumber}</span>
                            <ExternalLink className="w-3 h-3 text-cyan-400 opacity-60 group-hover:opacity-100" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Latency & Confidence Footer */}
                  {isBot && msg.confidenceScore !== undefined && (
                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-1">
                      <span>Confidence: {Math.round(msg.confidenceScore * 100)}%</span>
                      {msg.processingTimeMs && (
                        <span>Response Time: {msg.processingTimeMs}ms</span>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}

          {/* Loading Indicator */}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-3 text-xs text-cyan-400 font-mono p-4"
            >
              <Sparkles className="w-4 h-4 animate-spin" />
              <span>Vectorizing documents, extracting clauses &amp; verifying evidence...</span>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-slate-950/80 border-t border-slate-800 space-y-3">
          {/* Preset Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] font-mono custom-scrollbar">
            <span className="text-slate-500 shrink-0">Quick Prompt:</span>
            {suggestedQuestions.map((q, i) => (
              <button
                key={i}
                onClick={() => handleSend(q)}
                className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-300 whitespace-nowrap transition-colors"
              >
                {q}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') handleSend();
              }}
              placeholder="Ask an evidence-grounded question based on active documents..."
              className="flex-1 px-4 py-3 bg-slate-900 border border-slate-700 rounded-2xl text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 transition-all font-sans"
            />
            <button
              onClick={() => handleSend()}
              disabled={isLoading || !input.trim()}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 text-white text-xs font-semibold uppercase flex items-center gap-2 shadow-lg shadow-cyan-500/20 active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Ask AI</span>
            </button>
          </div>
        </div>
      </div>

      {/* Right Drawer: Citation Inspector */}
      {selectedCitation && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full lg:w-80 bg-[#091228] border border-cyan-500/30 rounded-3xl p-5 shadow-2xl flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-cyan-400" />
                <h3 className="text-xs font-bold text-white">Citation Inspector</h3>
              </div>
              <button
                onClick={() => setSelectedCitation(null)}
                className="text-slate-400 hover:text-white text-xs"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs">
              <div>
                <span className="text-[10px] font-mono text-slate-500 block">Document</span>
                <span className="font-semibold text-white">{selectedCitation.documentTitle}</span>
              </div>

              <div>
                <span className="text-[10px] font-mono text-slate-500 block">Page Reference</span>
                <span className="font-mono text-cyan-300">Page {selectedCitation.pageNumber}</span>
              </div>

              <div>
                <span className="text-[10px] font-mono text-slate-500 block mb-1">Verbatim Grounding Quote</span>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 font-mono text-[11px] leading-relaxed italic border-l-2 border-cyan-400">
                  &quot;{selectedCitation.quote}&quot;
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 text-[10px] font-mono text-slate-500">
            Confidence: {Math.round(selectedCitation.confidence * 100)}% • Grounded Fact
          </div>
        </motion.div>
      )}
    </div>
  );
};
