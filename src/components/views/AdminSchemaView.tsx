import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Database,
  Table,
  Layers,
  Key,
  ShieldCheck,
  Server,
  RefreshCw,
  Search,
  ExternalLink
} from 'lucide-react';
import { useData } from '../../context/DataContext.js';

interface SchemaTableDef {
  name: string;
  description: string;
  count: number;
  primaryKey: string;
  foreignKeys: string[];
  columns: { name: string; type: string; isRequired: boolean }[];
}

export const AdminSchemaView: React.FC = () => {
  const {
    documents,
    chunks,
    entities,
    graphNodes,
    graphEdges,
    actions,
    deadlines,
    risks,
    conflicts,
    impactAnalyses,
    workflows,
    approvals,
    auditLogs
  } = useData();

  const [selectedTable, setSelectedTable] = useState<string>('documents');

  const schemaTables: SchemaTableDef[] = [
    {
      name: 'documents',
      description: 'Core metadata and physical file references for all uploaded KMRL contracts, manuals, and drawings.',
      count: documents.length,
      primaryKey: 'id',
      foreignKeys: ['uploadedBy (users.id)'],
      columns: [
        { name: 'id', type: 'VARCHAR(64)', isRequired: true },
        { name: 'title', type: 'VARCHAR(255)', isRequired: true },
        { name: 'department', type: 'VARCHAR(64)', isRequired: true },
        { name: 'documentType', type: 'VARCHAR(64)', isRequired: true },
        { name: 'status', type: 'VARCHAR(32)', isRequired: true },
        { name: 'version', type: 'VARCHAR(16)', isRequired: true },
        { name: 'pageCount', type: 'INTEGER', isRequired: true },
        { name: 'rawText', type: 'TEXT', isRequired: true },
        { name: 'createdAt', type: 'TIMESTAMPTZ', isRequired: true }
      ]
    },
    {
      name: 'document_chunks',
      description: 'Indexed paragraphs and clauses with 768-dim embeddings for vector similarity search.',
      count: chunks.length,
      primaryKey: 'id',
      foreignKeys: ['documentId (documents.id)'],
      columns: [
        { name: 'id', type: 'VARCHAR(64)', isRequired: true },
        { name: 'documentId', type: 'VARCHAR(64)', isRequired: true },
        { name: 'pageNumber', type: 'INTEGER', isRequired: true },
        { name: 'text', type: 'TEXT', isRequired: true },
        { name: 'embedding', type: 'FLOAT8[]', isRequired: false },
        { name: 'chunkIndex', type: 'INTEGER', isRequired: true }
      ]
    },
    {
      name: 'extracted_entities',
      description: 'Named entities (Vendors, Projects, SLAs, Currencies, Locations) extracted with page grounding.',
      count: entities.length || graphNodes.length,
      primaryKey: 'id',
      foreignKeys: ['documentId (documents.id)'],
      columns: [
        { name: 'id', type: 'VARCHAR(64)', isRequired: true },
        { name: 'documentId', type: 'VARCHAR(64)', isRequired: true },
        { name: 'type', type: 'VARCHAR(32)', isRequired: true },
        { name: 'label', type: 'VARCHAR(255)', isRequired: true },
        { name: 'pageNumber', type: 'INTEGER', isRequired: true },
        { name: 'evidence', type: 'TEXT', isRequired: true }
      ]
    },
    {
      name: 'extracted_relationships',
      description: 'Directional relationships between entities forming the Operational Knowledge Graph.',
      count: graphEdges.length,
      primaryKey: 'id',
      foreignKeys: ['sourceId (extracted_entities.id)', 'targetId (extracted_entities.id)'],
      columns: [
        { name: 'id', type: 'VARCHAR(64)', isRequired: true },
        { name: 'source', type: 'VARCHAR(64)', isRequired: true },
        { name: 'target', type: 'VARCHAR(64)', isRequired: true },
        { name: 'label', type: 'VARCHAR(64)', isRequired: true },
        { name: 'documentId', type: 'VARCHAR(64)', isRequired: true }
      ]
    },
    {
      name: 'change_impact_analyses',
      description: 'Primary USP: Multi-document blast radius simulations and comparative clause diffs.',
      count: impactAnalyses.length,
      primaryKey: 'id',
      foreignKeys: ['baseDocumentId (documents.id)'],
      columns: [
        { name: 'id', type: 'VARCHAR(64)', isRequired: true },
        { name: 'baseDocumentId', type: 'VARCHAR(64)', isRequired: true },
        { name: 'baseVersion', type: 'VARCHAR(16)', isRequired: true },
        { name: 'targetVersion', type: 'VARCHAR(16)', isRequired: true },
        { name: 'changedClauses', type: 'JSONB', isRequired: true },
        { name: 'affectedDocuments', type: 'JSONB', isRequired: true },
        { name: 'humanVerificationStatus', type: 'VARCHAR(32)', isRequired: true }
      ]
    },
    {
      name: 'risks',
      description: 'Identified contractual liabilities, downtime penalties, and safety risks.',
      count: risks.length,
      primaryKey: 'id',
      foreignKeys: ['documentId (documents.id)'],
      columns: [
        { name: 'id', type: 'VARCHAR(64)', isRequired: true },
        { name: 'documentId', type: 'VARCHAR(64)', isRequired: true },
        { name: 'title', type: 'VARCHAR(255)', isRequired: true },
        { name: 'severity', type: 'VARCHAR(16)', isRequired: true },
        { name: 'category', type: 'VARCHAR(32)', isRequired: true },
        { name: 'evidence', type: 'TEXT', isRequired: true },
        { name: 'isVerified', type: 'BOOLEAN', isRequired: true }
      ]
    },
    {
      name: 'conflicts',
      description: 'Cross-document discrepancies between contractual terms and operational protocols.',
      count: conflicts.length,
      primaryKey: 'id',
      foreignKeys: ['document1Id (documents.id)', 'document2Id (documents.id)'],
      columns: [
        { name: 'id', type: 'VARCHAR(64)', isRequired: true },
        { name: 'title', type: 'VARCHAR(255)', isRequired: true },
        { name: 'severity', type: 'VARCHAR(16)', isRequired: true },
        { name: 'status', type: 'VARCHAR(16)', isRequired: true },
        { name: 'document1Quote', type: 'TEXT', isRequired: true },
        { name: 'document2Quote', type: 'TEXT', isRequired: true }
      ]
    },
    {
      name: 'actions',
      description: 'Operational obligations, inspection mandates, and maintenance tasks.',
      count: actions.length,
      primaryKey: 'id',
      foreignKeys: ['documentId (documents.id)'],
      columns: [
        { name: 'id', type: 'VARCHAR(64)', isRequired: true },
        { name: 'action', type: 'TEXT', isRequired: true },
        { name: 'priority', type: 'VARCHAR(16)', isRequired: true },
        { name: 'status', type: 'VARCHAR(16)', isRequired: true },
        { name: 'responsibleRole', type: 'VARCHAR(64)', isRequired: true },
        { name: 'evidence', type: 'TEXT', isRequired: true }
      ]
    },
    {
      name: 'deadlines',
      description: 'Contract delivery milestones, license expirations, and regulatory audit dates.',
      count: deadlines.length,
      primaryKey: 'id',
      foreignKeys: ['documentId (documents.id)'],
      columns: [
        { name: 'id', type: 'VARCHAR(64)', isRequired: true },
        { name: 'title', type: 'VARCHAR(255)', isRequired: true },
        { name: 'dueDate', type: 'DATE', isRequired: true },
        { name: 'status', type: 'VARCHAR(16)', isRequired: true },
        { name: 'evidence', type: 'TEXT', isRequired: true }
      ]
    },
    {
      name: 'approvals',
      description: 'Human-in-the-loop governance sign-offs before operational rollout.',
      count: approvals.length,
      primaryKey: 'id',
      foreignKeys: ['documentId (documents.id)'],
      columns: [
        { name: 'id', type: 'VARCHAR(64)', isRequired: true },
        { name: 'title', type: 'VARCHAR(255)', isRequired: true },
        { name: 'targetRole', type: 'VARCHAR(32)', isRequired: true },
        { name: 'status', type: 'VARCHAR(16)', isRequired: true },
        { name: 'decisionNote', type: 'TEXT', isRequired: false }
      ]
    },
    {
      name: 'audit_logs',
      description: 'Immutable ledger of every user action, AI extraction, and authorization event.',
      count: auditLogs.length,
      primaryKey: 'id',
      foreignKeys: ['userId (users.id)'],
      columns: [
        { name: 'id', type: 'VARCHAR(64)', isRequired: true },
        { name: 'action', type: 'VARCHAR(64)', isRequired: true },
        { name: 'userName', type: 'VARCHAR(128)', isRequired: true },
        { name: 'userRole', type: 'VARCHAR(32)', isRequired: true },
        { name: 'resourceType', type: 'VARCHAR(64)', isRequired: true },
        { name: 'timestamp', type: 'TIMESTAMPTZ', isRequired: true }
      ]
    }
  ];

  const currentTableDef = schemaTables.find(t => t.name === selectedTable) || schemaTables[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Relational Database Schema &amp; Storage Architecture
          </h1>
          <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono text-xs">
            {schemaTables.length} Normalized Tables
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-1 font-light">
          Full enterprise relational data model linking OCR text chunks, embeddings, disambiguated entities, and human audit signatures.
        </p>
      </div>

      {/* Two Column Schema Explorer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Table Navigator */}
        <div className="p-4 rounded-3xl bg-[#091228] border border-slate-800 space-y-2">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs font-mono text-slate-400">
            <span>Database Tables</span>
            <span>Live Records</span>
          </div>

          <div className="space-y-1 max-h-[500px] overflow-y-auto custom-scrollbar">
            {schemaTables.map(tbl => (
              <button
                key={tbl.name}
                onClick={() => setSelectedTable(tbl.name)}
                className={`w-full p-2.5 rounded-xl text-left font-mono text-xs flex items-center justify-between transition-all ${
                  selectedTable === tbl.name
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                    : 'text-slate-400 hover:text-white bg-slate-900/60 border border-transparent hover:border-slate-800'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Table className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{tbl.name}</span>
                </div>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-950 text-slate-300">
                  {tbl.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Right: Table Detail & Column Specification */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-[#091228] border border-slate-800 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-cyan-400" />
                <h2 className="text-base font-bold text-white font-mono">{currentTableDef.name}</h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                  {currentTableDef.count} rows stored
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 font-light">
                {currentTableDef.description}
              </p>
            </div>

            <div className="text-xs font-mono text-slate-400">
              <span className="text-cyan-400 font-bold">PK: </span>
              {currentTableDef.primaryKey}
            </div>
          </div>

          {/* Foreign Keys Badge */}
          {currentTableDef.foreignKeys.length > 0 && (
            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 flex items-center gap-2">
              <Key className="w-4 h-4 text-teal-400 shrink-0" />
              <span>
                <strong className="text-teal-300">Foreign Keys: </strong>
                {currentTableDef.foreignKeys.join(', ')}
              </span>
            </div>
          )}

          {/* Column Specifications */}
          <div className="rounded-2xl border border-slate-800 overflow-hidden">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-950 border-b border-slate-800 text-[11px] text-slate-400">
                <tr>
                  <th className="py-2.5 px-3.5">Column Name</th>
                  <th className="py-2.5 px-3.5">Data Type</th>
                  <th className="py-2.5 px-3.5">Nullability</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-[11px]">
                {currentTableDef.columns.map(col => (
                  <tr key={col.name} className="hover:bg-slate-900/40">
                    <td className="py-2.5 px-3.5 text-white font-bold flex items-center gap-1.5">
                      {col.name === currentTableDef.primaryKey && (
                        <span className="text-cyan-400 text-[9px] font-bold">PK</span>
                      )}
                      <span>{col.name}</span>
                    </td>
                    <td className="py-2.5 px-3.5 text-cyan-300">{col.type}</td>
                    <td className="py-2.5 px-3.5">
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded ${
                          col.isRequired
                            ? 'bg-rose-950 text-rose-300'
                            : 'bg-slate-900 text-slate-400'
                        }`}
                      >
                        {col.isRequired ? 'NOT NULL' : 'NULLABLE'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
