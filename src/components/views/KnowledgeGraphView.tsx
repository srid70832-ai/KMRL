import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Network,
  Search,
  Filter,
  Building2,
  Tag,
  ShieldCheck,
  FileText,
  X,
  ExternalLink,
  Layers,
  Sparkles
} from 'lucide-react';
import { useData } from '../../context/DataContext.js';
import { KnowledgeGraphNode, KnowledgeGraphEdge, EntityType } from '../../types.js';

export const KnowledgeGraphView: React.FC = () => {
  const { graphNodes, graphEdges } = useData();
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedNode, setSelectedNode] = useState<KnowledgeGraphNode | null>(null);

  const entityTypes: EntityType[] = [
    'ORGANIZATION',
    'VENDOR',
    'PERSON',
    'ROLE',
    'DEPARTMENT',
    'PROJECT',
    'CONTRACT',
    'LOCATION',
    'MONEY'
  ];

  const filteredNodes = useMemo(() => {
    return graphNodes.filter(node => {
      if (selectedType !== 'ALL' && node.type !== selectedType) return false;
      if (searchQuery && !node.label.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });
  }, [graphNodes, selectedType, searchQuery]);

  // Compute 2D coordinates for visual SVG node-link graph
  const nodePositions = useMemo(() => {
    const map = new Map<string, { x: number; y: number }>();
    const total = filteredNodes.length || 1;
    const centerX = 360;
    const centerY = 240;
    const radius = 170;

    filteredNodes.forEach((node, idx) => {
      const angle = (idx / total) * 2 * Math.PI;
      const x = centerX + radius * Math.cos(angle) + (idx % 2 === 0 ? 20 : -20);
      const y = centerY + radius * Math.sin(angle) + (idx % 3 === 0 ? 15 : -15);
      map.set(node.id, { x, y });
    });

    return map;
  }, [filteredNodes]);

  const getNodeColor = (type: EntityType) => {
    switch (type) {
      case 'VENDOR':
        return { bg: 'fill-cyan-500/20', stroke: 'stroke-cyan-400', text: 'text-cyan-300' };
      case 'PROJECT':
        return { bg: 'fill-teal-500/20', stroke: 'stroke-teal-400', text: 'text-teal-300' };
      case 'CONTRACT':
        return { bg: 'fill-blue-500/20', stroke: 'stroke-blue-400', text: 'text-blue-300' };
      case 'MONEY':
        return { bg: 'fill-emerald-500/20', stroke: 'stroke-emerald-400', text: 'text-emerald-300' };
      case 'LOCATION':
        return { bg: 'fill-purple-500/20', stroke: 'stroke-purple-400', text: 'text-purple-300' };
      default:
        return { bg: 'fill-slate-700/40', stroke: 'stroke-slate-400', text: 'text-slate-200' };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Operational Knowledge Graph
          </h1>
          <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono text-xs">
            {graphNodes.length} Entities • {graphEdges.length} Linked Relationships
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-1 font-light">
          Disambiguated entity-relationship network automatically extracted across contracts, safety protocols, and civil engineering specifications.
        </p>
      </div>

      {/* Filter Toolbar */}
      <div className="p-4 rounded-2xl bg-[#091228] border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        {/* Entity Type Chips */}
        <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto w-full md:w-auto">
          <button
            onClick={() => setSelectedType('ALL')}
            className={`px-2.5 py-1 rounded-lg font-mono transition-all ${
              selectedType === 'ALL'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
            }`}
          >
            All Entities ({graphNodes.length})
          </button>
          {entityTypes.map(type => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-2 py-1 rounded-lg font-mono text-[11px] transition-all ${
                selectedType === type
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                  : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative min-w-[220px]">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search entity name..."
            className="w-full pl-8 pr-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
          />
        </div>
      </div>

      {/* Main Canvas & Detail Drawer Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interactive SVG Graph Canvas */}
        <div className="lg:col-span-2 rounded-3xl bg-[#070e24] border border-cyan-500/30 p-4 relative overflow-hidden flex flex-col justify-between shadow-2xl min-h-[480px]">
          <div className="absolute top-4 left-4 z-10 text-[10px] font-mono text-cyan-400 bg-slate-900/80 px-2.5 py-1 rounded-lg border border-cyan-500/30">
            Interactive Visual Graph • Click Node to Inspect Evidence
          </div>

          <svg className="w-full h-full min-h-[460px]" viewBox="0 0 720 480">
            {/* Ambient Background Grid */}
            <defs>
              <pattern id="graphGrid" width="30" height="30" patternUnits="userSpaceOnUse">
                <circle cx="1" cy="1" r="1" fill="#0e254e" opacity="0.6" />
              </pattern>
            </defs>
            <rect width="720" height="480" fill="url(#graphGrid)" />

            {/* Render Edges */}
            {graphEdges.map(edge => {
              const srcPos = nodePositions.get(edge.source);
              const tgtPos = nodePositions.get(edge.target);
              if (!srcPos || !tgtPos) return null;

              const isEdgeHighlighted =
                selectedNode && (selectedNode.id === edge.source || selectedNode.id === edge.target);

              return (
                <g key={edge.id}>
                  <line
                    x1={srcPos.x}
                    y1={srcPos.y}
                    x2={tgtPos.x}
                    y2={tgtPos.y}
                    stroke={isEdgeHighlighted ? '#06b6d4' : '#1e293b'}
                    strokeWidth={isEdgeHighlighted ? 2.5 : 1.2}
                    strokeDasharray={isEdgeHighlighted ? undefined : '4 4'}
                  />
                  {isEdgeHighlighted && (
                    <text
                      x={(srcPos.x + tgtPos.x) / 2}
                      y={(srcPos.y + tgtPos.y) / 2 - 6}
                      fill="#38bdf8"
                      fontSize="9"
                      fontFamily="monospace"
                      textAnchor="middle"
                    >
                      {edge.label}
                    </text>
                  )}
                </g>
              );
            })}

            {/* Render Nodes */}
            {filteredNodes.map(node => {
              const pos = nodePositions.get(node.id);
              if (!pos) return null;
              const isSelected = selectedNode?.id === node.id;
              const color = getNodeColor(node.type);

              return (
                <g
                  key={node.id}
                  transform={`translate(${pos.x}, ${pos.y})`}
                  onClick={() => setSelectedNode(node)}
                  className="cursor-pointer"
                >
                  <circle
                    r={isSelected ? 20 : 15}
                    className={`${color.bg} ${color.stroke} transition-all`}
                    strokeWidth={isSelected ? 3 : 1.5}
                  />
                  {isSelected && (
                    <circle r="26" fill="none" stroke="#06b6d4" strokeWidth="1" strokeDasharray="3 3" className="animate-spin" />
                  )}
                  <text
                    y={28}
                    fill={isSelected ? '#ffffff' : '#94a3b8'}
                    fontSize="10"
                    fontWeight={isSelected ? 'bold' : 'normal'}
                    fontFamily="sans-serif"
                    textAnchor="middle"
                  >
                    {node.label.length > 16 ? node.label.slice(0, 15) + '…' : node.label}
                  </text>
                </g>
              );
            })}
          </svg>

          <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 pt-2 border-t border-slate-800">
            <span>Graph Vector Layout</span>
            <span>Deterministic Grounding</span>
          </div>
        </div>

        {/* Entity Evidence Inspector Drawer */}
        <div className="rounded-3xl bg-[#091228] border border-slate-800 p-5 flex flex-col justify-between shadow-xl">
          {selectedNode ? (
            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-cyan-400" />
                  <span className="font-bold text-white text-sm">{selectedNode.label}</span>
                </div>
                <span className="px-2 py-0.5 rounded font-mono text-[10px] bg-cyan-500/20 text-cyan-300 uppercase">
                  {selectedNode.type}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-mono text-slate-500 block mb-0.5">Originating Document</span>
                <span className="font-semibold text-white">{selectedNode.documentTitle}</span>
                <span className="text-[10px] font-mono text-cyan-400 block mt-0.5">Page Reference: {selectedNode.pageNumber}</span>
              </div>

              <div>
                <span className="text-[10px] font-mono text-slate-500 block mb-1">Verbatim Grounding Quote</span>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 font-mono text-[11px] leading-relaxed italic border-l-2 border-cyan-400">
                  &quot;{selectedNode.evidence}&quot;
                </div>
              </div>

              {/* Connected Relationships */}
              <div>
                <span className="text-[10px] font-mono text-slate-500 block mb-1">Connected Relationships</span>
                <div className="space-y-1.5 max-h-36 overflow-y-auto">
                  {graphEdges
                    .filter(e => e.source === selectedNode.id || e.target === selectedNode.id)
                    .map(e => (
                      <div key={e.id} className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-mono">
                        <span className="text-cyan-300 font-bold">{e.source}</span>
                        <span className="text-slate-400"> ➔ {e.label} ➔ </span>
                        <span className="text-teal-300 font-bold">{e.target}</span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400 text-xs">
              <Network className="w-10 h-10 text-slate-600 mb-3" />
              <p className="font-semibold text-slate-300">No Entity Selected</p>
              <p className="mt-1 text-[11px]">Click any node in the knowledge graph to view its extracted relationships and exact document page citations.</p>
            </div>
          )}

          <div className="pt-3 border-t border-slate-800 text-[10px] font-mono text-slate-500">
            KMRL Neo4j / Network Topology Interface
          </div>
        </div>
      </div>
    </div>
  );
};
