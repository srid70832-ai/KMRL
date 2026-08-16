import express from 'express';
import path from 'path';
import multer from 'multer';
import { createServer as createViteServer } from 'vite';
import { dbStore, SYSTEM_USERS } from './server/dbStore.js';
import {
  extractDocumentIntelligence,
  askEvidenceGroundedCopilot,
  simulateDocumentChangeImpact
} from './server/aiServices.js';
import { isGeminiAvailable } from './server/geminiClient.js';
import { parsePdfBuffer, parseDocxBuffer, sanitizeDocumentText } from './server/documentParser.js';
import { DocumentRecord, User } from './src/types.js';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 25 * 1024 * 1024 } // 25MB max
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '30mb' }));
  app.use(express.urlencoded({ extended: true, limit: '30mb' }));

  // Helper to extract authenticated user from header
  function getCurrentUser(req: express.Request): User {
    const authHeader = req.headers['x-user-id'] as string;
    const found = dbStore.users.find(u => u.id === authHeader);
    return found || dbStore.users[0] || SYSTEM_USERS[0];
  }

  // --- API Endpoints ---

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'operational',
      geminiConfigured: isGeminiAvailable(),
      documentCount: dbStore.documents.length,
      demoModeActive: dbStore.isDemoActive,
      timestamp: new Date().toISOString()
    });
  });

  // Auth & Users
  app.get('/api/auth/users', (req, res) => {
    res.json({ users: dbStore.users });
  });

  app.get('/api/auth/me', (req, res) => {
    const user = getCurrentUser(req);
    res.json({ user });
  });

  // Demo Dataset Controls
  app.post('/api/demo/toggle', (req, res) => {
    const currentUser = getCurrentUser(req);
    if (dbStore.isDemoActive) {
      dbStore.clearAllData(true);
      dbStore.addAuditLog({
        userId: currentUser.id,
        userName: currentUser.name,
        userRole: currentUser.role,
        action: 'DEMO_DATA_CLEARED',
        resourceType: 'DOCUMENT',
        resourceId: 'all',
        resourceName: 'Synthetic Demo Records',
        decision: 'Switched to clean Real Data state'
      });
    } else {
      dbStore.loadDemoDataset();
      dbStore.addAuditLog({
        userId: currentUser.id,
        userName: currentUser.name,
        userRole: currentUser.role,
        action: 'DEMO_DATA_LOADED',
        resourceType: 'DOCUMENT',
        resourceId: 'all',
        resourceName: 'KMRL Metro Operational Demo Dataset',
        decision: 'Loaded labelled synthetic demo data'
      });
    }
    res.json({
      isDemoActive: dbStore.isDemoActive,
      documentCount: dbStore.documents.length
    });
  });

  app.post('/api/demo/clear', (req, res) => {
    const currentUser = getCurrentUser(req);
    dbStore.clearAllData(true);
    dbStore.addAuditLog({
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: currentUser.role,
      action: 'SYSTEM_DATA_PURGED',
      resourceType: 'DOCUMENT',
      resourceId: 'all',
      resourceName: 'All System Records',
      decision: 'Zeroed system database for clean test'
    });
    res.json({ success: true, isDemoActive: false });
  });

  // Documents
  app.get('/api/documents', (req, res) => {
    const user = getCurrentUser(req);
    let docs = dbStore.documents.filter(d => !d.isArchived);
    if (user.role === 'VIEWER') {
      docs = docs.filter(d => d.metadata.confidentialityLevel !== 'RESTRICTED');
    }
    res.json({
      documents: docs,
      isDemoActive: dbStore.isDemoActive
    });
  });

  app.get('/api/documents/:id', (req, res) => {
    const doc = dbStore.documents.find(d => d.id === req.params.id);
    if (!doc) {
      return res.status(404).json({ error: 'Document not found' });
    }
    const chunks = dbStore.chunks.filter(c => c.documentId === doc.id);
    const entities = dbStore.entities.filter(e => e.documentId === doc.id);
    const risks = dbStore.risks.filter(r => r.documentId === doc.id);
    const actions = dbStore.actions.filter(a => a.documentId === doc.id);
    const compliance = dbStore.compliance.filter(c => c.documentId === doc.id);
    res.json({ doc, chunks, entities, risks, actions, compliance });
  });

  // Upload Document (Supports multipart file upload or JSON payload)
  app.post('/api/documents/upload', upload.single('file'), async (req, res) => {
    try {
      const user = getCurrentUser(req);
      let filename = req.body.filename || 'uploaded_document.txt';
      let title = req.body.title || filename.replace(/\.[^/.]+$/, '');
      let rawText = req.body.text || '';
      let mimeType = 'text/plain';
      let fileSize = rawText.length;
      let department = req.body.department || 'Operations';
      let docType = req.body.type || 'TECHNICAL_SPEC';

      let parsedPages: { pageNumber: number; text: string }[] = [];
      let pageCount = 1;

      if (req.file) {
        filename = req.file.originalname;
        mimeType = req.file.mimetype;
        fileSize = req.file.size;
        title = req.body.title || filename.replace(/\.[^/.]+$/, '');

        if (mimeType === 'application/pdf' || filename.toLowerCase().endsWith('.pdf')) {
          const parsed = await parsePdfBuffer(req.file.buffer, filename);
          rawText = parsed.text;
          pageCount = parsed.pageCount;
          parsedPages = parsed.pages;
        } else if (
          mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
          filename.toLowerCase().endsWith('.docx')
        ) {
          const parsed = await parseDocxBuffer(req.file.buffer);
          rawText = parsed.text;
          pageCount = parsed.pageCount;
          parsedPages = parsed.pages;
        } else {
          // Plain text / Markdown / JSON
          rawText = sanitizeDocumentText(req.file.buffer.toString('utf-8'));
          pageCount = Math.max(1, Math.ceil(rawText.length / 1500));
          parsedPages = [{ pageNumber: 1, text: rawText }];
        }
      } else if (rawText) {
        rawText = sanitizeDocumentText(rawText);
        pageCount = Math.max(1, Math.ceil(rawText.length / 1500));
        parsedPages = [{ pageNumber: 1, text: rawText }];
      }

      const docId = `doc-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;

      const newDoc: DocumentRecord = {
        id: docId,
        title,
        filename,
        fileSize,
        mimeType,
        type: docType,
        department,
        version: req.body.version || '1.0',
        uploadedBy: user.id,
        uploadedByName: user.name,
        uploadedAt: new Date().toISOString(),
        status: 'INGESTING',
        processingProgress: 15,
        isArchived: false,
        isSyntheticDemo: false,
        pageCount,
        pages: parsedPages,
        rawText,
        metadata: {
          vendor: req.body.vendor || undefined,
          contractValue: req.body.contractValue || undefined,
          effectiveDate: req.body.effectiveDate || new Date().toISOString().split('T')[0],
          governingLaw: 'Metro Railways Act 2002 / Applicable Regulations',
          confidentialityLevel: req.body.confidentialityLevel || 'INTERNAL'
        },
        pipelineSteps: [
          { id: '1', label: 'Ingest & File Stream', status: 'COMPLETED', durationMs: 80 },
          { id: '2', label: 'OCR & High-Fidelity Extraction', status: 'IN_PROGRESS' },
          { id: '3', label: 'Semantic Chunking & Parsing', status: 'PENDING' },
          { id: '4', label: 'Vector Embedding Generation', status: 'PENDING' },
          { id: '5', label: 'Taxonomy Classification', status: 'PENDING' },
          { id: '6', label: 'Entity Disambiguation', status: 'PENDING' },
          { id: '7', label: 'Knowledge Graph Relation Linking', status: 'PENDING' },
          { id: '8', label: 'Risk & Conflict Radar Scan', status: 'PENDING' },
          { id: '9', label: 'Operational Indexing Complete', status: 'PENDING' }
        ]
      };

      dbStore.documents.unshift(newDoc);
      dbStore.generateChunksForDocument(newDoc);

      dbStore.addAuditLog({
        userId: user.id,
        userName: user.name,
        userRole: user.role,
        action: 'DOCUMENT_UPLOAD',
        resourceType: 'DOCUMENT',
        resourceId: newDoc.id,
        resourceName: newDoc.title,
        newValue: `Uploaded ${filename} (${fileSize} bytes)`,
        evidenceSource: 'Ingestion Module'
      });

      res.status(201).json({ document: newDoc });
    } catch (err: any) {
      console.error('Error uploading document:', err);
      res.status(500).json({ error: err.message || 'Failed to upload document' });
    }
  });

  // Trigger Real AI Intelligence Pipeline for a Document
  app.post('/api/documents/:id/process', async (req, res) => {
    const doc = dbStore.documents.find(d => d.id === req.params.id);
    const user = getCurrentUser(req);
    if (!doc) {
      return res.status(404).json({ error: 'Document not found' });
    }

    try {
      doc.status = 'OCR_READING';
      doc.processingProgress = 35;
      doc.pipelineSteps[0].status = 'COMPLETED';
      doc.pipelineSteps[1].status = 'IN_PROGRESS';

      // Call Gemini extraction service
      const extracted = await extractDocumentIntelligence(doc);

      // Merge into dbStore
      dbStore.entities.push(...extracted.entities);
      dbStore.relationships.push(...extracted.relationships);
      dbStore.risks.push(...extracted.risks);
      dbStore.actions.push(...extracted.actions);
      dbStore.deadlines.push(...extracted.deadlines);
      dbStore.compliance.push(...extracted.compliance);

      // Mark all pipeline steps completed
      doc.status = 'INDEXED';
      doc.processingProgress = 100;
      doc.pipelineSteps = doc.pipelineSteps.map(step => ({
        ...step,
        status: 'COMPLETED',
        durationMs: step.durationMs || Math.floor(Math.random() * 300 + 100)
      }));

      // Create workflow item
      const workflowId = `wf-${Date.now()}`;
      dbStore.workflows.unshift({
        id: workflowId,
        documentId: doc.id,
        documentTitle: doc.title,
        title: `Ingestion & Policy Review: ${doc.title}`,
        department: doc.department,
        currentStage: 'ACTION',
        priority: extracted.risks.some(r => r.severity === 'CRITICAL') ? 'CRITICAL' : 'HIGH',
        status: 'IN_PROGRESS',
        aiRecommendation: `AI recommendation: Processed ${extracted.actions.length} action items and ${extracted.risks.length} potential risks. Human verification suggested for high priority items.`,
        history: [
          { stage: 'INGEST', timestamp: new Date().toISOString(), actor: user.name, note: 'Document verified & extracted' }
        ],
        createdAt: new Date().toISOString(),
        isSyntheticDemo: doc.isSyntheticDemo
      });

      dbStore.addAuditLog({
        userId: user.id,
        userName: user.name,
        userRole: user.role,
        action: 'DOCUMENT_PROCESSED',
        resourceType: 'EXTRACTION',
        resourceId: doc.id,
        resourceName: doc.title,
        newValue: `Extracted ${extracted.entities.length} entities, ${extracted.risks.length} risks, ${extracted.actions.length} actions`,
        evidenceSource: 'Gemini Pipeline'
      });

      res.json({
        document: doc,
        extracted
      });
    } catch (err: any) {
      doc.status = 'ERROR';
      console.error('Error processing document:', err);
      res.status(500).json({ error: err.message || 'Processing failed' });
    }
  });

  // Archive & Delete Document
  app.patch('/api/documents/:id/archive', (req, res) => {
    const user = getCurrentUser(req);
    const doc = dbStore.documents.find(d => d.id === req.params.id);
    if (!doc) return res.status(404).json({ error: 'Document not found' });
    doc.isArchived = !doc.isArchived;

    dbStore.addAuditLog({
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      action: doc.isArchived ? 'DOCUMENT_ARCHIVED' : 'DOCUMENT_RESTORED',
      resourceType: 'DOCUMENT',
      resourceId: doc.id,
      resourceName: doc.title,
      decision: `Document state toggled to ${doc.isArchived ? 'Archived' : 'Active'}`
    });

    res.json({ document: doc });
  });

  app.delete('/api/documents/:id', (req, res) => {
    const user = getCurrentUser(req);
    if (user.role !== 'ADMIN' && user.role !== 'MANAGER') {
      return res.status(403).json({ error: 'Unauthorized: Only ADMIN and MANAGER roles can delete documents.' });
    }
    const idx = dbStore.documents.findIndex(d => d.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Document not found' });

    const deleted = dbStore.documents.splice(idx, 1)[0];
    dbStore.chunks = dbStore.chunks.filter(c => c.documentId !== deleted.id);
    dbStore.entities = dbStore.entities.filter(e => e.documentId !== deleted.id);
    dbStore.risks = dbStore.risks.filter(r => r.documentId !== deleted.id);
    dbStore.actions = dbStore.actions.filter(a => a.documentId !== deleted.id);

    dbStore.addAuditLog({
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      action: 'DOCUMENT_DELETED',
      resourceType: 'DOCUMENT',
      resourceId: deleted.id,
      resourceName: deleted.title,
      decision: 'Permanently deleted from repository'
    });

    res.json({ success: true, deletedId: deleted.id });
  });

  // Semantic & Vector Search
  app.post('/api/search/semantic', (req, res) => {
    const user = getCurrentUser(req);
    const { query, minScore } = req.body;
    if (!query) return res.json({ results: [] });

    const results = dbStore.searchDocuments(query, user, minScore || 0.15);

    dbStore.addAuditLog({
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      action: 'SEMANTIC_SEARCH',
      resourceType: 'SEARCH',
      resourceId: 'query',
      resourceName: query.slice(0, 40),
      newValue: `Retrieved ${results.length} authorized chunks`
    });

    res.json({ results, query });
  });

  // Evidence-Grounded AI Copilot
  app.post('/api/copilot/ask', async (req, res) => {
    const user = getCurrentUser(req);
    const { question } = req.body;
    if (!question || typeof question !== 'string') {
      return res.status(400).json({ error: 'Question is required' });
    }

    try {
      const response = await askEvidenceGroundedCopilot(question, user);

      dbStore.addAuditLog({
        userId: user.id,
        userName: user.name,
        userRole: user.role,
        action: 'COPILOT_QUERY',
        resourceType: 'COPILOT',
        resourceId: response.id,
        resourceName: question.slice(0, 50),
        decision: response.noEvidenceFound ? 'No Evidence Found' : `Grounded in ${response.citations?.length || 0} citations`
      });

      res.json({ message: response });
    } catch (err: any) {
      console.error('Copilot error:', err);
      res.status(500).json({ error: err.message || 'Copilot answering failed' });
    }
  });

  // Change Impact Simulator (Main USP)
  app.post('/api/impact/simulate', async (req, res) => {
    const user = getCurrentUser(req);
    const { baseDocumentId, newVersionText, newVersionLabel } = req.body;

    if (!baseDocumentId || !newVersionText) {
      return res.status(400).json({ error: 'baseDocumentId and newVersionText are required' });
    }

    try {
      const analysis = await simulateDocumentChangeImpact(baseDocumentId, newVersionText, newVersionLabel);
      dbStore.impactAnalyses.unshift(analysis);

      dbStore.addAuditLog({
        userId: user.id,
        userName: user.name,
        userRole: user.role,
        action: 'CHANGE_IMPACT_SIMULATION',
        resourceType: 'IMPACT_ANALYSIS',
        resourceId: analysis.id,
        resourceName: analysis.documentTitle,
        newValue: `Simulated blast radius: ${analysis.affectedDocuments.length} affected docs, ${analysis.potentialRisks.length} risks`
      });

      res.json({ analysis });
    } catch (err: any) {
      console.error('Impact simulation error:', err);
      res.status(500).json({ error: err.message || 'Failed to simulate change impact' });
    }
  });

  app.post('/api/impact/:id/verify', (req, res) => {
    const user = getCurrentUser(req);
    const analysis = dbStore.impactAnalyses.find(a => a.id === req.params.id);
    if (!analysis) return res.status(404).json({ error: 'Impact analysis not found' });

    const { status } = req.body;
    analysis.humanVerificationStatus = status || 'VERIFIED_APPROVED';
    analysis.verifiedBy = user.name;
    analysis.verifiedAt = new Date().toISOString();

    dbStore.addAuditLog({
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      action: 'IMPACT_VERIFICATION_DECIDED',
      resourceType: 'IMPACT_ANALYSIS',
      resourceId: analysis.id,
      resourceName: analysis.documentTitle,
      decision: `Human decision: ${analysis.humanVerificationStatus}`
    });

    res.json({ analysis });
  });

  // Knowledge Graph
  app.get('/api/knowledge-graph', (req, res) => {
    const nodesMap = new Map<string, any>();
    const edges = dbStore.relationships.map(r => ({
      id: r.id,
      source: r.sourceEntity,
      target: r.targetEntity,
      label: r.relationType.replace(/_/g, ' '),
      type: r.relationType,
      documentId: r.documentId,
      documentTitle: r.documentTitle,
      pageNumber: r.pageNumber,
      evidence: r.evidence,
      confidence: r.confidence
    }));

    // Register all entities as nodes
    for (const ent of dbStore.entities) {
      if (!nodesMap.has(ent.name)) {
        nodesMap.set(ent.name, {
          id: ent.name,
          label: ent.name,
          type: ent.type,
          documentId: ent.documentId,
          documentTitle: ent.documentTitle,
          pageNumber: ent.pageNumber,
          evidence: ent.evidence,
          properties: { confidence: ent.confidence }
        });
      }
    }

    // Ensure edge ends exist as nodes
    for (const edge of edges) {
      if (!nodesMap.has(edge.source)) {
        nodesMap.set(edge.source, {
          id: edge.source,
          label: edge.source,
          type: 'ORGANIZATION',
          documentId: edge.documentId,
          documentTitle: edge.documentTitle,
          pageNumber: edge.pageNumber,
          evidence: edge.evidence,
          properties: {}
        });
      }
      if (!nodesMap.has(edge.target)) {
        nodesMap.set(edge.target, {
          id: edge.target,
          label: edge.target,
          type: 'PROJECT',
          documentId: edge.documentId,
          documentTitle: edge.documentTitle,
          pageNumber: edge.pageNumber,
          evidence: edge.evidence,
          properties: {}
        });
      }
    }

    res.json({
      nodes: Array.from(nodesMap.values()),
      edges
    });
  });

  // Risks
  app.get('/api/risks', (req, res) => {
    res.json({ risks: dbStore.risks });
  });

  app.patch('/api/risks/:id/verify', (req, res) => {
    const user = getCurrentUser(req);
    const risk = dbStore.risks.find(r => r.id === req.params.id);
    if (!risk) return res.status(404).json({ error: 'Risk item not found' });

    risk.isVerified = true;
    risk.verifiedBy = user.name;
    risk.verifiedAt = new Date().toISOString();

    dbStore.addAuditLog({
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      action: 'RISK_VERIFIED',
      resourceType: 'RISK',
      resourceId: risk.id,
      resourceName: risk.title,
      decision: `Verified by ${user.name}`
    });

    res.json({ risk });
  });

  // Conflicts
  app.get('/api/conflicts', (req, res) => {
    res.json({ conflicts: dbStore.conflicts });
  });

  app.patch('/api/conflicts/:id/resolve', (req, res) => {
    const user = getCurrentUser(req);
    const cnf = dbStore.conflicts.find(c => c.id === req.params.id);
    if (!cnf) return res.status(404).json({ error: 'Conflict item not found' });

    const { status, notes } = req.body;
    cnf.status = status || 'RESOLVED';
    cnf.resolutionNotes = notes || 'Resolved via human arbitration.';
    cnf.resolvedBy = user.name;
    cnf.resolvedAt = new Date().toISOString();

    dbStore.addAuditLog({
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      action: 'CONFLICT_RESOLVED',
      resourceType: 'CONFLICT',
      resourceId: cnf.id,
      resourceName: cnf.title,
      decision: `Marked as ${cnf.status}. Notes: ${cnf.resolutionNotes}`
    });

    res.json({ conflict: cnf });
  });

  // Actions
  app.get('/api/actions', (req, res) => {
    res.json({ actions: dbStore.actions });
  });

  app.patch('/api/actions/:id', (req, res) => {
    const user = getCurrentUser(req);
    const action = dbStore.actions.find(a => a.id === req.params.id);
    if (!action) return res.status(404).json({ error: 'Action not found' });

    if (req.body.status) {
      action.status = req.body.status;
      if (req.body.status === 'COMPLETED') {
        action.completedAt = new Date().toISOString();
      }
    }
    if (req.body.assignedTo) {
      action.assignedTo = req.body.assignedTo;
    }

    dbStore.addAuditLog({
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      action: 'ACTION_UPDATED',
      resourceType: 'WORKFLOW',
      resourceId: action.id,
      resourceName: action.action,
      newValue: `Status: ${action.status}, AssignedTo: ${action.assignedTo || 'None'}`
    });

    res.json({ action });
  });

  // Deadlines
  app.get('/api/deadlines', (req, res) => {
    res.json({ deadlines: dbStore.deadlines });
  });

  // Compliance
  app.get('/api/compliance', (req, res) => {
    res.json({ compliance: dbStore.compliance });
  });

  // Workflows & Approvals
  app.get('/api/workflows', (req, res) => {
    res.json({ workflows: dbStore.workflows });
  });

  app.get('/api/approvals', (req, res) => {
    res.json({ approvals: dbStore.approvals });
  });

  app.post('/api/approvals/:id/decision', (req, res) => {
    const user = getCurrentUser(req);
    const appr = dbStore.approvals.find(a => a.id === req.params.id);
    if (!appr) return res.status(404).json({ error: 'Approval request not found' });

    const { decision, note } = req.body;
    appr.status = decision; // 'APPROVED' | 'REJECTED' | 'ESCALATED'
    appr.decisionNote = note || '';
    appr.decidedBy = user.name;
    appr.decidedAt = new Date().toISOString();

    dbStore.addAuditLog({
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      action: 'APPROVAL_DECISION',
      resourceType: 'APPROVAL',
      resourceId: appr.id,
      resourceName: appr.title,
      decision: `Decision: ${appr.status}. Reason: ${note || 'Verified by ' + user.name}`
    });

    res.json({ approval: appr });
  });

  // Audit Logs
  app.get('/api/audit-logs', (req, res) => {
    res.json({ logs: dbStore.auditLogs });
  });

  // Analytics
  app.get('/api/analytics', (req, res) => {
    const totalDocs = dbStore.documents.length;
    const pendingActions = dbStore.actions.filter(a => a.status === 'PENDING' || a.status === 'IN_PROGRESS').length;
    const completedActions = dbStore.actions.filter(a => a.status === 'COMPLETED').length;
    const verifiedRisks = dbStore.risks.filter(r => r.isVerified).length;
    const criticalRisks = dbStore.risks.filter(r => r.severity === 'CRITICAL').length;
    const activeConflicts = dbStore.conflicts.filter(c => c.status === 'ACTIVE').length;
    const overdueDeadlines = dbStore.deadlines.filter(d => d.status === 'OVERDUE').length;
    const complianceItems = dbStore.compliance;
    const compliantCount = complianceItems.filter(c => c.status === 'COMPLIANT').length;
    const complianceRate = complianceItems.length > 0 ? Math.round((compliantCount / complianceItems.length) * 100) : 100;

    res.json({
      metrics: {
        totalDocs,
        pendingActions,
        completedActions,
        verifiedRisks,
        criticalRisks,
        activeConflicts,
        overdueDeadlines,
        complianceRate,
        isDemoActive: dbStore.isDemoActive
      },
      departmentDistribution: [
        { name: 'Signalling & Telecom', count: dbStore.documents.filter(d => d.department.includes('Signalling')).length },
        { name: 'Civil Engineering', count: dbStore.documents.filter(d => d.department.includes('Civil')).length },
        { name: 'Electrical & Safety', count: dbStore.documents.filter(d => d.department.includes('Safety') || d.department.includes('Electrical')).length },
        { name: 'Finance & AFC', count: dbStore.documents.filter(d => d.department.includes('Finance') || d.department.includes('Ticketing')).length },
      ],
      riskByCategory: [
        { category: 'Compliance', count: dbStore.risks.filter(r => r.category === 'COMPLIANCE').length },
        { category: 'Deadline', count: dbStore.risks.filter(r => r.category === 'DEADLINE').length },
        { category: 'SLA', count: dbStore.risks.filter(r => r.category === 'SLA').length },
        { category: 'Contract', count: dbStore.risks.filter(r => r.category === 'CONTRACT').length },
        { category: 'Financial', count: dbStore.risks.filter(r => r.category === 'FINANCIAL').length },
      ]
    });
  });

  // Vite Middleware Setup
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`KMRL IntelliDocs Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
