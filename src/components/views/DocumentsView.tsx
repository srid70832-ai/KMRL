import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Files,
  Upload,
  Search,
  Eye,
  Trash2,
  Archive,
  Sparkles,
  CheckCircle2,
  Clock,
  Building2,
  FileText,
  Tag,
  Scale,
  Calendar,
  AlertTriangle,
  X,
  RefreshCw,
  Zap,
  ChevronLeft,
  ChevronRight,
  Copy,
  Check,
  Shield,
  Layers,
  FileSearch,
  ExternalLink
} from 'lucide-react';
import { useData } from '../../context/DataContext.js';
import { useAuth } from '../../context/AuthContext.js';
import { DocumentRecord, DocumentType } from '../../types.js';
import { EmptyState } from '../common/EmptyState.js';

interface DocumentsViewProps {
  selectedDocId?: string;
  onNavigate?: (tab: any) => void;
}

export const DocumentsView: React.FC<DocumentsViewProps> = ({ selectedDocId, onNavigate }) => {
  const { currentUser } = useAuth();
  const {
    documents,
    chunks,
    entities,
    risks,
    actions,
    compliance,
    uploadDocument,
    processDocumentAI,
    archiveDocument,
    deleteDocument
  } = useData();

  const [activeTab, setActiveTab] = useState<'ALL' | 'ACTIVE' | 'ARCHIVED'>('ACTIVE');
  const [departmentFilter, setDepartmentFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Document Workspace Modal state
  const [inspectingDoc, setInspectingDoc] = useState<DocumentRecord | null>(() => {
    if (selectedDocId) {
      return documents.find(d => d.id === selectedDocId) || null;
    }
    return null;
  });
  const [workspaceTab, setWorkspaceTab] = useState<'PAGES' | 'TEXT' | 'ENTITIES' | 'EVIDENCE' | 'PIPELINE'>('PAGES');
  const [activePageNum, setActivePageNum] = useState(1);
  const [isCopied, setIsCopied] = useState(false);

  // Upload modal state
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadDept, setUploadDept] = useState('Operations & Signalling');
  const [uploadType, setUploadType] = useState<DocumentType>('TECHNICAL_SPEC');
  const [uploadVendor, setUploadVendor] = useState('');
  const [uploadText, setUploadText] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStage, setUploadStage] = useState<'VALIDATING' | 'UPLOADING' | 'EXTRACTING' | 'INDEXING' | 'READY'>('VALIDATING');
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const departments = Array.from(new Set(documents.map(d => d.department)));
  const docTypes = Array.from(new Set(documents.map(d => d.type)));

  const filteredDocs = documents.filter(doc => {
    if (activeTab === 'ACTIVE' && doc.isArchived) return false;
    if (activeTab === 'ARCHIVED' && !doc.isArchived) return false;
    if (departmentFilter !== 'ALL' && doc.department !== departmentFilter) return false;
    if (typeFilter !== 'ALL' && doc.type !== typeFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        doc.title.toLowerCase().includes(q) ||
        doc.filename.toLowerCase().includes(q) ||
        (doc.metadata.vendor && doc.metadata.vendor.toLowerCase().includes(q))
      );
    }
    return true;
  });

  // Get pages for inspected doc safely
  const getDocumentPages = (doc: DocumentRecord) => {
    if (doc.pages && doc.pages.length > 0) {
      return doc.pages;
    }
    const cleanText = doc.rawText || '';
    if (!cleanText.trim()) {
      return [{ pageNumber: 1, text: 'No text extracted for this document.' }];
    }

    // Split text cleanly across pages without leaking PDF bytes
    const paragraphs = cleanText.split(/\n\s*\n/).filter(p => p.trim());
    if (paragraphs.length <= 3) {
      return [{ pageNumber: 1, text: cleanText }];
    }

    const pagesOut: { pageNumber: number; text: string }[] = [];
    const parasPerPage = Math.max(1, Math.ceil(paragraphs.length / (doc.pageCount || 1)));
    for (let i = 0; i < (doc.pageCount || 1); i++) {
      const slice = paragraphs.slice(i * parasPerPage, (i + 1) * parasPerPage);
      if (slice.length > 0) {
        pagesOut.push({ pageNumber: i + 1, text: slice.join('\n\n') });
      }
    }
    return pagesOut.length > 0 ? pagesOut : [{ pageNumber: 1, text: cleanText }];
  };

  const handleFileUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadTitle.trim() && !uploadFile && !uploadText.trim()) return;

    setIsUploading(true);
    setUploadStage('UPLOADING');
    setUploadProgress(25);

    const formData = new FormData();
    if (uploadFile) {
      formData.append('file', uploadFile);
    }
    formData.append('title', uploadTitle || uploadFile?.name || 'KMRL Document');
    formData.append('department', uploadDept);
    formData.append('type', uploadType);
    if (uploadVendor) formData.append('vendor', uploadVendor);
    if (uploadText) formData.append('text', uploadText);

    setTimeout(() => {
      setUploadStage('EXTRACTING');
      setUploadProgress(65);
    }, 400);

    const created = await uploadDocument(formData);
    
    setUploadStage('INDEXING');
    setUploadProgress(90);

    setTimeout(() => {
      setUploadStage('READY');
      setUploadProgress(100);
      setIsUploading(false);
      setUploadModalOpen(false);
      setUploadFile(null);
      setUploadTitle('');
      setUploadText('');
      setUploadVendor('');
      if (created) {
        setInspectingDoc(created);
        setActivePageNum(1);
      }
    }, 300);
  };

  const handleTriggerAI = async (docId: string) => {
    setProcessingId(docId);
    await processDocumentAI(docId);
    setProcessingId(null);
    const updated = documents.find(d => d.id === docId);
    if (updated) setInspectingDoc(updated);
  };

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Document Repository &amp; Workspace
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono text-xs font-semibold">
              {filteredDocs.length} {filteredDocs.length === 1 ? 'Document' : 'Documents'}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-light">
            Upload authorized PDFs, DOCX specifications, and contracts. Automatic text extraction, page parsing, and evidence indexing.
          </p>
        </div>

        <button
          onClick={() => setUploadModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-xs transition-all shadow-lg shadow-cyan-500/20 active:scale-95 cursor-pointer shrink-0"
        >
          <Upload className="w-4 h-4" />
          <span>Upload Document</span>
        </button>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        {/* Left Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800/80 w-full md:w-auto">
          <button
            onClick={() => setActiveTab('ACTIVE')}
            className={`px-3 py-1.5 rounded-lg transition-all font-medium cursor-pointer ${
              activeTab === 'ACTIVE'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Active Repository
          </button>
          <button
            onClick={() => setActiveTab('ARCHIVED')}
            className={`px-3 py-1.5 rounded-lg transition-all font-medium cursor-pointer ${
              activeTab === 'ARCHIVED'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Archived ({documents.filter(d => d.isArchived).length})
          </button>
          <button
            onClick={() => setActiveTab('ALL')}
            className={`px-3 py-1.5 rounded-lg transition-all font-medium cursor-pointer ${
              activeTab === 'ALL'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All
          </button>
        </div>

        {/* Right Filters */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-end">
          {departments.length > 0 && (
            <select
              value={departmentFilter}
              onChange={e => setDepartmentFilter(e.target.value)}
              className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-300 text-xs focus:outline-none focus:border-cyan-500"
            >
              <option value="ALL">All Departments</option>
              {departments.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          )}

          {docTypes.length > 0 && (
            <select
              value={typeFilter}
              onChange={e => setTypeFilter(e.target.value)}
              className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-300 text-xs focus:outline-none focus:border-cyan-500 font-mono"
            >
              <option value="ALL">All Types</option>
              {docTypes.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          )}

          {/* Search box */}
          <div className="relative min-w-[220px] flex-1 sm:flex-none">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Filter by title or filename..."
              className="w-full pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder:text-slate-500 text-xs focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>
      </div>

      {/* Document List Grid */}
      {filteredDocs.length === 0 ? (
        <EmptyState
          icon={Files}
          title={documents.length === 0 ? "No documents yet" : "No matching documents found"}
          description={documents.length === 0 ? "Upload an authorized document to begin extracting evidence, relationships, risks and actions." : "Try adjusting your search query or department filters."}
          actionLabel="Upload Document"
          onAction={() => setUploadModalOpen(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDocs.map(doc => (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -2 }}
              className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col justify-between group shadow-sm"
            >
              <div>
                {/* Status + Version + Synthetic Badge */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-medium ${
                    doc.status === 'INDEXED'
                      ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
                      : 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 animate-pulse'
                  }`}>
                    {doc.status === 'INDEXED' ? 'READY / INDEXED' : doc.status}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                      v{doc.version}
                    </span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-2 mb-2">
                  {doc.title}
                </h3>

                {/* Clean Metadata tags */}
                <div className="space-y-1.5 text-[11px] text-slate-400 font-mono mb-4">
                  <div className="flex items-center gap-1.5 truncate">
                    <Building2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>{doc.department}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <FileText className="w-3.5 h-3.5 shrink-0" />
                    <span>{doc.pageCount} Pages • {(doc.fileSize / 1024).toFixed(1)} KB • {doc.mimeType.split('/')[1]?.toUpperCase() || 'PDF'}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <Calendar className="w-3.5 h-3.5 shrink-0" />
                    <span>Uploaded: {new Date(doc.uploadedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                <button
                  onClick={() => {
                    setInspectingDoc(doc);
                    setActivePageNum(1);
                  }}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-950 hover:bg-slate-800 text-cyan-300 border border-slate-800 hover:border-cyan-500/40 text-xs font-mono transition-all cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Open Document</span>
                </button>

                {(currentUser?.role === 'ADMIN' || currentUser?.role === 'MANAGER') && (
                  <button
                    onClick={() => deleteDocument(doc.id)}
                    title="Delete Document"
                    className="p-2 rounded-xl bg-slate-950 hover:bg-rose-950/40 text-slate-500 hover:text-rose-400 border border-slate-800 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Upload Document Modal */}
      <AnimatePresence>
        {uploadModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-xl bg-[#091228] border border-cyan-500/30 rounded-2xl p-6 shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                    <Upload className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white">Upload Authorized Document</h2>
                    <p className="text-[11px] text-slate-400 font-mono">Supports PDF, Word DOCX, and TXT specifications</p>
                  </div>
                </div>
                <button
                  onClick={() => setUploadModalOpen(false)}
                  className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleFileUploadSubmit} className="space-y-4 mt-4 text-xs">
                {/* File Dropzone */}
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOver(true);
                  }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragOver(false);
                    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                      const file = e.dataTransfer.files[0];
                      setUploadFile(file);
                      if (!uploadTitle) {
                        setUploadTitle(file.name.replace(/\.[^/.]+$/, ''));
                      }
                    }
                  }}
                  className={`p-6 rounded-2xl border-2 border-dashed transition-all text-center ${
                    dragOver
                      ? 'border-cyan-400 bg-cyan-950/20'
                      : uploadFile
                      ? 'border-emerald-500/50 bg-emerald-950/10'
                      : 'border-slate-700 hover:border-cyan-500/60 bg-slate-950/40'
                  }`}
                >
                  <input
                    type="file"
                    id="docFileInput"
                    accept=".pdf,.docx,.txt"
                    onChange={e => {
                      if (e.target.files && e.target.files[0]) {
                        const file = e.target.files[0];
                        setUploadFile(file);
                        if (!uploadTitle) {
                          setUploadTitle(file.name.replace(/\.[^/.]+$/, ''));
                        }
                      }
                    }}
                    className="hidden"
                  />
                  <label htmlFor="docFileInput" className="cursor-pointer block">
                    <FileText className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
                    <span className="font-semibold text-white block text-sm">
                      {uploadFile ? uploadFile.name : 'Click to select PDF, Word DOCX, or TXT file'}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono mt-1 block">
                      {uploadFile
                        ? `${(uploadFile.size / 1024).toFixed(1)} KB • Ready for extraction`
                        : 'Drag and drop or browse files'}
                    </span>
                  </label>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-slate-300 font-medium mb-1 font-mono">
                    Document Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={uploadTitle}
                    onChange={e => setUploadTitle(e.target.value)}
                    placeholder="e.g. Alstom CBTC Maintenance Agreement 2026"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                {/* Department & Type */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-medium mb-1 font-mono">
                      Department
                    </label>
                    <select
                      value={uploadDept}
                      onChange={e => setUploadDept(e.target.value)}
                      className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-400"
                    >
                      <option value="Operations & Signalling">Operations &amp; Signalling</option>
                      <option value="Civil & Track Infrastructure">Civil &amp; Track Infrastructure</option>
                      <option value="Electrical & Power Safety">Electrical &amp; Power Safety</option>
                      <option value="Finance & Automatic Fare Collection">Finance &amp; AFC</option>
                      <option value="Executive Managing Board">Executive Managing Board</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1 font-mono">
                      Document Type
                    </label>
                    <select
                      value={uploadType}
                      onChange={e => setUploadType(e.target.value as DocumentType)}
                      className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-400 font-mono"
                    >
                      <option value="TECHNICAL_SPEC">Technical Specification</option>
                      <option value="CONTRACT">Contract &amp; Agreement</option>
                      <option value="SLA_AGREEMENT">SLA Agreement</option>
                      <option value="SAFETY_DIRECTIVE">Safety Directive</option>
                      <option value="WORK_ORDER">Work Order</option>
                      <option value="POLICY">Statutory Policy</option>
                      <option value="AUDIT_REPORT">Audit Report</option>
                    </select>
                  </div>
                </div>

                {/* Paste Text Fallback */}
                {!uploadFile && (
                  <div>
                    <label className="block text-slate-300 font-medium mb-1 font-mono">
                      Document Content (Paste text if no file selected)
                    </label>
                    <textarea
                      rows={3}
                      value={uploadText}
                      onChange={e => setUploadText(e.target.value)}
                      placeholder="Paste contract clauses, obligations, or technical terms..."
                      className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 font-mono text-[11px]"
                    />
                  </div>
                )}

                {/* Progress Bar when uploading */}
                {isUploading && (
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="text-cyan-400 flex items-center gap-1.5">
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        Stage: {uploadStage}
                      </span>
                      <span className="text-slate-400">{uploadProgress}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
                        animate={{ width: `${uploadProgress}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                  </div>
                )}

                {/* Submit Buttons */}
                <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setUploadModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isUploading || (!uploadFile && !uploadTitle.trim() && !uploadText.trim())}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 text-white font-semibold flex items-center gap-2 shadow-lg shadow-cyan-500/20 disabled:opacity-50 cursor-pointer"
                  >
                    {isUploading ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Processing Document...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload &amp; Index</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Full Document Workspace Modal */}
      <AnimatePresence>
        {inspectingDoc && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-6xl h-[92vh] bg-[#050b18] border border-cyan-500/40 rounded-2xl flex flex-col shadow-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="p-4 sm:px-6 border-b border-slate-800 bg-[#081226] flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-base font-bold text-white truncate max-w-md">{inspectingDoc.title}</h2>
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] font-mono text-cyan-300 border border-slate-700">
                        v{inspectingDoc.version}
                      </span>
                      {inspectingDoc.isSyntheticDemo && (
                        <span className="px-2 py-0.5 rounded bg-amber-500/10 text-[9px] font-mono text-amber-300 border border-amber-500/30">
                          SYNTHETIC DEMO DATA
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-[11px] text-slate-400 font-mono mt-0.5">
                      <span>{inspectingDoc.department}</span>
                      <span>•</span>
                      <span>{inspectingDoc.pageCount} Pages</span>
                      <span>•</span>
                      <span className="text-emerald-400">{inspectingDoc.status}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleTriggerAI(inspectingDoc.id)}
                    disabled={processingId === inspectingDoc.id}
                    className="px-3.5 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs font-mono flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <Zap className={`w-3.5 h-3.5 ${processingId === inspectingDoc.id ? 'animate-spin' : ''}`} />
                    <span>{processingId === inspectingDoc.id ? 'Extracting...' : 'Re-Run AI Pipeline'}</span>
                  </button>

                  <button
                    onClick={() => setInspectingDoc(null)}
                    className="p-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Workspace Navigation Tabs */}
              <div className="px-6 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between text-xs overflow-x-auto">
                <div className="flex items-center gap-1 py-2">
                  <button
                    onClick={() => setWorkspaceTab('PAGES')}
                    className={`px-3.5 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                      workspaceTab === 'PAGES'
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Readable Pages
                  </button>
                  <button
                    onClick={() => setWorkspaceTab('TEXT')}
                    className={`px-3.5 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                      workspaceTab === 'TEXT'
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Full Extracted Text
                  </button>
                  <button
                    onClick={() => setWorkspaceTab('ENTITIES')}
                    className={`px-3.5 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                      workspaceTab === 'ENTITIES'
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Entities ({entities.filter(e => e.documentId === inspectingDoc.id).length})
                  </button>
                  <button
                    onClick={() => setWorkspaceTab('EVIDENCE')}
                    className={`px-3.5 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                      workspaceTab === 'EVIDENCE'
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Evidence &amp; Citations
                  </button>
                  <button
                    onClick={() => setWorkspaceTab('PIPELINE')}
                    className={`px-3.5 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                      workspaceTab === 'PIPELINE'
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    9-Stage Ingestion Pipeline
                  </button>
                </div>

                <div className="hidden sm:flex items-center gap-2 text-[11px] font-mono text-slate-500">
                  <Shield className="w-3.5 h-3.5 text-teal-400" />
                  <span>Security: {inspectingDoc.metadata.confidentialityLevel || 'INTERNAL'}</span>
                </div>
              </div>

              {/* 3-Column Workspace Content Body */}
              <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
                {/* LEFT: Page Navigation (Col 3) */}
                <div className="hidden lg:flex lg:col-span-3 border-r border-slate-800 bg-[#060e20] p-4 flex-col justify-between overflow-y-auto">
                  <div className="space-y-4">
                    <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider block">
                      DOCUMENT SECTIONS
                    </span>

                    <div className="space-y-1.5">
                      {getDocumentPages(inspectingDoc).map((pg) => (
                        <button
                          key={pg.pageNumber}
                          onClick={() => {
                            setActivePageNum(pg.pageNumber);
                            setWorkspaceTab('PAGES');
                          }}
                          className={`w-full p-2.5 rounded-xl text-left font-mono text-xs transition-all flex items-center justify-between cursor-pointer ${
                            activePageNum === pg.pageNumber && workspaceTab === 'PAGES'
                              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                              : 'bg-slate-900/40 hover:bg-slate-900 text-slate-400 hover:text-white border border-slate-800/80'
                          }`}
                        >
                          <span>PAGE {pg.pageNumber}</span>
                          <span className="text-[10px] text-slate-500">
                            {pg.text.slice(0, 20)}...
                          </span>
                        </button>
                      ))}
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2 text-[11px] font-mono">
                      <span className="text-slate-400 font-bold block">METADATA SUMMARY</span>
                      <div className="text-slate-400">
                        <span className="text-slate-500 block">Filename</span>
                        <span className="text-white truncate block">{inspectingDoc.filename}</span>
                      </div>
                      {inspectingDoc.metadata.vendor && (
                        <div className="text-slate-400">
                          <span className="text-slate-500 block">Vendor</span>
                          <span className="text-cyan-300">{inspectingDoc.metadata.vendor}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* CENTER: Readable Document Content View (Col 6 or Col 9) */}
                <div className="lg:col-span-6 bg-[#040916] p-4 sm:p-6 overflow-y-auto flex flex-col justify-between custom-scrollbar">
                  {workspaceTab === 'PAGES' && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-1 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono text-xs font-bold">
                            PAGE {activePageNum} of {getDocumentPages(inspectingDoc).length}
                          </span>
                          <span className="text-xs text-slate-400 font-mono">Human-Readable Extracted View</span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            disabled={activePageNum <= 1}
                            onClick={() => setActivePageNum(p => Math.max(1, p - 1))}
                            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white disabled:opacity-30 cursor-pointer"
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </button>
                          <button
                            disabled={activePageNum >= getDocumentPages(inspectingDoc).length}
                            onClick={() => setActivePageNum(p => Math.min(getDocumentPages(inspectingDoc).length, p + 1))}
                            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white disabled:opacity-30 cursor-pointer"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Clean Paginated Document Paper View */}
                      <div className="p-6 rounded-2xl bg-[#081226] border border-slate-800 text-slate-200 text-sm leading-relaxed whitespace-pre-wrap font-sans shadow-inner min-h-[450px]">
                        {getDocumentPages(inspectingDoc)[activePageNum - 1]?.text || 'No content on this page.'}
                      </div>
                    </div>
                  )}

                  {workspaceTab === 'TEXT' && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                        <span className="text-xs font-mono text-slate-400">Total Characters: {inspectingDoc.rawText.length}</span>
                        <button
                          onClick={() => handleCopyText(inspectingDoc.rawText)}
                          className="px-3 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-slate-800 text-xs font-mono flex items-center gap-1.5 cursor-pointer"
                        >
                          {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{isCopied ? 'Copied' : 'Copy Clean Text'}</span>
                        </button>
                      </div>
                      <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 text-slate-300 font-mono text-xs leading-relaxed whitespace-pre-wrap max-h-[60vh] overflow-y-auto">
                        {inspectingDoc.rawText || 'No text extracted.'}
                      </div>
                    </div>
                  )}

                  {workspaceTab === 'ENTITIES' && (
                    <div className="space-y-3">
                      <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider block">
                        EXTRACTED ENTITIES FROM SOURCE
                      </span>
                      <div className="space-y-2">
                        {entities.filter(e => e.documentId === inspectingDoc.id).length === 0 ? (
                          <div className="p-6 text-center text-slate-500 font-mono text-xs border border-dashed border-slate-800 rounded-xl">
                            No entities extracted yet. Click 'Re-Run AI Pipeline' above to extract named entities.
                          </div>
                        ) : (
                          entities.filter(e => e.documentId === inspectingDoc.id).map(ent => (
                            <div key={ent.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-white">{ent.name}</span>
                                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                                  {ent.type}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-400 italic">"{ent.evidence}"</p>
                              <span className="text-[10px] font-mono text-slate-500">Page {ent.pageNumber} • Confidence {Math.round(ent.confidence * 100)}%</span>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}

                  {workspaceTab === 'EVIDENCE' && (
                    <div className="space-y-3">
                      <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider block">
                        VERIFIED EVIDENCE CLAUSES &amp; CITATIONS
                      </span>
                      <div className="space-y-2">
                        {chunks.filter(c => c.documentId === inspectingDoc.id).slice(0, 10).map((chk, idx) => (
                          <div key={chk.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                            <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
                              <span>CHUNK #{idx + 1} • PAGE {chk.pageNumber}</span>
                              <span className="text-cyan-400">~{chk.tokenCount} Tokens</span>
                            </div>
                            <p className="text-xs text-slate-200 font-sans leading-relaxed">
                              {chk.text}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {workspaceTab === 'PIPELINE' && (
                    <div className="space-y-3">
                      <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider block">
                        9-STAGE INGESTION &amp; AUDIT PIPELINE
                      </span>
                      {inspectingDoc.pipelineSteps.map((step, idx) => (
                        <div key={step.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="w-6 h-6 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center font-mono text-[10px] text-cyan-400 font-bold">
                              {idx + 1}
                            </span>
                            <span className="text-xs font-medium text-white">{step.label}</span>
                          </div>
                          <div className="flex items-center gap-2 font-mono text-[11px]">
                            {step.status === 'COMPLETED' ? (
                              <span className="inline-flex items-center gap-1 text-emerald-400">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Done ({step.durationMs || 120}ms)</span>
                              </span>
                            ) : step.status === 'IN_PROGRESS' ? (
                              <span className="inline-flex items-center gap-1 text-cyan-400 animate-pulse">
                                <Sparkles className="w-3.5 h-3.5" />
                                <span>Processing...</span>
                              </span>
                            ) : (
                              <span className="text-slate-500">Pending</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* RIGHT: AI Intelligence Insights (Col 3) */}
                <div className="hidden lg:flex lg:col-span-3 border-l border-slate-800 bg-[#060e20] p-4 flex-col justify-between overflow-y-auto">
                  <div className="space-y-4">
                    <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider block">
                      AI INTELLIGENCE EXTRACTS
                    </span>

                    {/* Risks Section */}
                    <div className="space-y-2">
                      <span className="text-[11px] font-bold text-rose-400 flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        Identified Risks ({risks.filter(r => r.documentId === inspectingDoc.id).length})
                      </span>
                      {risks.filter(r => r.documentId === inspectingDoc.id).slice(0, 3).map(r => (
                        <div key={r.id} className="p-2.5 rounded-xl bg-rose-950/20 border border-rose-500/30 text-xs">
                          <span className="font-bold text-white block truncate">{r.title}</span>
                          <span className="text-[10px] text-rose-300 font-mono">{r.severity} • Page {r.pageNumber}</span>
                        </div>
                      ))}
                    </div>

                    {/* Actions Section */}
                    <div className="space-y-2">
                      <span className="text-[11px] font-bold text-cyan-400 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Obligations ({actions.filter(a => a.documentId === inspectingDoc.id).length})
                      </span>
                      {actions.filter(a => a.documentId === inspectingDoc.id).slice(0, 3).map(a => (
                        <div key={a.id} className="p-2.5 rounded-xl bg-cyan-950/20 border border-cyan-500/30 text-xs">
                          <span className="font-bold text-white block truncate">{a.action}</span>
                          <span className="text-[10px] text-slate-400 font-mono">Role: {a.responsibleRole}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800">
                    <button
                      onClick={() => setInspectingDoc(null)}
                      className="w-full py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white font-mono text-xs cursor-pointer"
                    >
                      Close Workspace
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
