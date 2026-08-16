import {
  User,
  DocumentRecord,
  DocumentChunk,
  ExtractedEntity,
  ExtractedRelationship,
  RiskItem,
  ConflictItem,
  ActionItem,
  DeadlineItem,
  ComplianceItem,
  ChangeImpactAnalysis,
  WorkflowItem,
  ApprovalRequest,
  AuditLogEntry,
  SearchResultChunk
} from '../src/types.js';
import {
  DEMO_DOCUMENTS,
  DEMO_ENTITIES,
  DEMO_RELATIONSHIPS,
  DEMO_RISKS,
  DEMO_CONFLICTS,
  DEMO_ACTIONS,
  DEMO_DEADLINES,
  DEMO_COMPLIANCE,
  DEMO_IMPACT_ANALYSIS,
  DEMO_WORKFLOWS,
  DEMO_APPROVALS,
  DEMO_AUDIT_LOGS
} from './demoData.js';

export const SYSTEM_USERS: User[] = [
  {
    id: 'usr-admin-01',
    email: 'rishi@kmrl.gov.in',
    name: 'RISHI',
    role: 'ADMIN',
    department: 'Administration & Executive Operations',
    assignedProjects: ['Phase 1 Operations', 'Phase 2 Kakkanad Extension', 'Water Metro Integration']
  },
  {
    id: 'usr-mgr-01',
    email: 'sri@kmrl.gov.in',
    name: 'SRI',
    role: 'MANAGER',
    department: 'Project Management & Procurement',
    assignedProjects: ['S&T Maintenance', 'Rolling Stock Spares', 'Ticketing AFC']
  },
  {
    id: 'usr-analyst-01',
    email: 'elayanithish@kmrl.gov.in',
    name: 'ELAYANITHISH',
    role: 'ANALYST',
    department: 'Safety & Compliance Analytics',
    assignedProjects: ['25kV Traction Grid', 'SCADA Network', 'Track Safety']
  },
  {
    id: 'usr-viewer-01',
    email: 'rithika@kmrl.gov.in',
    name: 'RITHIKA',
    role: 'VIEWER',
    department: 'Audit & Inspection Viewer',
    assignedProjects: ['KSPCB Compliance', 'Public Safety Records']
  }
];

class MemoryStore {
  public isDemoActive: boolean = true;
  public users: User[] = [...SYSTEM_USERS];
  public documents: DocumentRecord[] = [];
  public chunks: DocumentChunk[] = [];
  public entities: ExtractedEntity[] = [];
  public relationships: ExtractedRelationship[] = [];
  public risks: RiskItem[] = [];
  public conflicts: ConflictItem[] = [];
  public actions: ActionItem[] = [];
  public deadlines: DeadlineItem[] = [];
  public compliance: ComplianceItem[] = [];
  public impactAnalyses: ChangeImpactAnalysis[] = [];
  public workflows: WorkflowItem[] = [];
  public approvals: ApprovalRequest[] = [];
  public auditLogs: AuditLogEntry[] = [];

  constructor() {
    this.loadDemoDataset();
  }

  public loadDemoDataset() {
    this.isDemoActive = true;
    this.documents = JSON.parse(JSON.stringify(DEMO_DOCUMENTS));
    this.entities = JSON.parse(JSON.stringify(DEMO_ENTITIES));
    this.relationships = JSON.parse(JSON.stringify(DEMO_RELATIONSHIPS));
    this.risks = JSON.parse(JSON.stringify(DEMO_RISKS));
    this.conflicts = JSON.parse(JSON.stringify(DEMO_CONFLICTS));
    this.actions = JSON.parse(JSON.stringify(DEMO_ACTIONS));
    this.deadlines = JSON.parse(JSON.stringify(DEMO_DEADLINES));
    this.compliance = JSON.parse(JSON.stringify(DEMO_COMPLIANCE));
    this.impactAnalyses = [JSON.parse(JSON.stringify(DEMO_IMPACT_ANALYSIS))];
    this.workflows = JSON.parse(JSON.stringify(DEMO_WORKFLOWS));
    this.approvals = JSON.parse(JSON.stringify(DEMO_APPROVALS));
    this.auditLogs = JSON.parse(JSON.stringify(DEMO_AUDIT_LOGS));

    // Generate initial chunks for demo documents
    this.chunks = [];
    for (const doc of this.documents) {
      this.generateChunksForDocument(doc);
    }
  }

  public clearAllData(preserveUsers: boolean = true) {
    this.isDemoActive = false;
    this.documents = [];
    this.chunks = [];
    this.entities = [];
    this.relationships = [];
    this.risks = [];
    this.conflicts = [];
    this.actions = [];
    this.deadlines = [];
    this.compliance = [];
    this.impactAnalyses = [];
    this.workflows = [];
    this.approvals = [];
    this.auditLogs = [];
    if (!preserveUsers) {
      this.users = [...SYSTEM_USERS];
    }
  }

  public generateChunksForDocument(doc: DocumentRecord) {
    let chunkIdx = 0;

    if (doc.pages && doc.pages.length > 0) {
      for (const page of doc.pages) {
        const paragraphs = page.text.split(/\n\s*\n/).filter(p => p.trim().length > 0);
        if (paragraphs.length === 0 && page.text.trim()) {
          this.chunks.push({
            id: `chk-${doc.id}-${chunkIdx++}`,
            documentId: doc.id,
            documentTitle: doc.title,
            chunkIndex: chunkIdx,
            pageNumber: page.pageNumber,
            text: page.text.trim(),
            tokenCount: Math.round(page.text.length / 4)
          });
        } else {
          for (const p of paragraphs) {
            this.chunks.push({
              id: `chk-${doc.id}-${chunkIdx++}`,
              documentId: doc.id,
              documentTitle: doc.title,
              chunkIndex: chunkIdx,
              pageNumber: page.pageNumber,
              text: p.trim(),
              tokenCount: Math.round(p.length / 4)
            });
          }
        }
      }
      return;
    }

    const text = doc.rawText || '';
    const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0);
    
    if (paragraphs.length === 0 && text.trim().length > 0) {
      this.chunks.push({
        id: `chk-${doc.id}-${chunkIdx}`,
        documentId: doc.id,
        documentTitle: doc.title,
        chunkIndex: 0,
        pageNumber: 1,
        text: text.trim(),
        tokenCount: Math.round(text.length / 4)
      });
      return;
    }

    for (let i = 0; i < paragraphs.length; i++) {
      const p = paragraphs[i].trim();
      if (!p) continue;
      this.chunks.push({
        id: `chk-${doc.id}-${chunkIdx++}`,
        documentId: doc.id,
        documentTitle: doc.title,
        chunkIndex: i,
        pageNumber: Math.min(Math.floor(i / 2) + 1, doc.pageCount || 1),
        text: p,
        tokenCount: Math.round(p.length / 4)
      });
    }
  }

  public addAuditLog(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>) {
    const newLog: AuditLogEntry = {
      ...entry,
      id: `aud-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toISOString(),
      isSyntheticDemo: this.isDemoActive
    };
    this.auditLogs.unshift(newLog);
    return newLog;
  }

  // Vector / Semantic & Keyword Search
  public searchDocuments(query: string, user: User, minScore: number = 0.2): SearchResultChunk[] {
    const terms = query.toLowerCase().split(/\s+/).filter(t => t.length > 2);
    const results: SearchResultChunk[] = [];

    // Filter documents by role authorization (VIEWER cannot see CONFIDENTIAL / RESTRICTED unless assigned)
    const accessibleDocIds = new Set(
      this.documents
        .filter(doc => {
          if (user.role === 'ADMIN' || user.role === 'MANAGER') return true;
          if (doc.metadata.confidentialityLevel === 'RESTRICTED' && user.role === 'VIEWER') return false;
          return true;
        })
        .map(d => d.id)
    );

    for (const chunk of this.chunks) {
      if (!accessibleDocIds.has(chunk.documentId)) continue;
      const chunkTextLower = chunk.text.toLowerCase();
      const doc = this.documents.find(d => d.id === chunk.documentId);
      if (!doc) continue;

      let matchCount = 0;
      const matchedKeywords: string[] = [];

      for (const term of terms) {
        if (chunkTextLower.includes(term)) {
          matchCount++;
          matchedKeywords.push(term);
        }
      }

      // Calculate pseudo-similarity
      let score = 0;
      if (terms.length > 0) {
        score = (matchCount / terms.length) * 0.7;
        if (chunkTextLower.includes(query.toLowerCase())) {
          score += 0.3;
        }
      }

      if (score >= minScore || terms.length === 0) {
        results.push({
          chunkId: chunk.id,
          documentId: chunk.documentId,
          documentTitle: chunk.documentTitle,
          documentType: doc.type,
          department: doc.department,
          pageNumber: chunk.pageNumber,
          text: chunk.text,
          similarityScore: Math.min(Number(score.toFixed(3)), 0.99),
          matchedKeywords,
          evidenceQuote: chunk.text.slice(0, 220) + (chunk.text.length > 220 ? '...' : '')
        });
      }
    }

    return results.sort((a, b) => b.similarityScore - a.similarityScore);
  }
}

export const dbStore = new MemoryStore();
