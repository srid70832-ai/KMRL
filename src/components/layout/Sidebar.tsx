import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  LayoutDashboard,
  Files,
  Search,
  Bot,
  Zap,
  Network,
  ShieldAlert,
  GitCompare,
  ListTodo,
  CalendarClock,
  ShieldCheck,
  Workflow,
  History,
  BarChart3,
  Database,
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-react';
import { useData } from '../../context/DataContext.js';
import { NavigationTab } from '../../types.js';

export interface NavItem {
  id: NavigationTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badgeCount?: number;
  badgeType?: 'danger' | 'warning' | 'info';
  isUSP?: boolean;
}

interface SidebarProps {
  activeTab?: NavigationTab;
  onSelectTab?: (tab: NavigationTab) => void;
  activeModule?: string;
  onSelectModule?: (id: string) => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab = 'DASHBOARD',
  onSelectTab,
  activeModule,
  onSelectModule,
  isCollapsed = false,
  onToggleCollapse,
  mobileOpen = false,
  onCloseMobile = () => {}
}) => {
  const { risks, approvals, conflicts, deadlines, documents } = useData();

  const criticalRisks = risks.filter(r => r.severity === 'CRITICAL').length;
  const activeConflicts = conflicts.filter(c => c.status === 'ACTIVE').length;
  const pendingApprovals = approvals.filter(a => a.status === 'PENDING').length;
  const overdueDeadlines = deadlines.filter(d => d.status === 'OVERDUE').length;

  const navItems: NavItem[] = [
    { id: 'DASHBOARD', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'DOCUMENTS', label: 'Documents', icon: Files, badgeCount: documents.length, badgeType: 'info' },
    { id: 'SEARCH', label: 'Semantic Search', icon: Search },
    { id: 'COPILOT', label: 'AI Copilot', icon: Bot },
    { id: 'IMPACT_SIMULATOR', label: 'Impact Simulator', icon: Zap, isUSP: true },
    { id: 'KNOWLEDGE_GRAPH', label: 'Knowledge Graph', icon: Network },
    { id: 'RISK_RADAR', label: 'Risk Radar', icon: ShieldAlert, badgeCount: criticalRisks > 0 ? criticalRisks : undefined, badgeType: 'danger' },
    { id: 'CONFLICT_RADAR', label: 'Conflict Radar', icon: GitCompare, badgeCount: activeConflicts > 0 ? activeConflicts : undefined, badgeType: 'warning' },
    { id: 'ACTIONS', label: 'Actions', icon: ListTodo },
    { id: 'DEADLINES', label: 'Deadlines', icon: CalendarClock, badgeCount: overdueDeadlines > 0 ? overdueDeadlines : undefined, badgeType: 'danger' },
    { id: 'COMPLIANCE', label: 'Compliance Checker', icon: ShieldCheck },
    { id: 'WORKFLOWS', label: 'Workflows & Approval', icon: Workflow, badgeCount: pendingApprovals > 0 ? pendingApprovals : undefined, badgeType: 'warning' },
    { id: 'AUDIT_TRAIL', label: 'Audit Trail', icon: History },
    { id: 'ANALYTICS', label: 'Analytics', icon: BarChart3 },
    { id: 'ADMIN_SCHEMA', label: 'Admin & Schema', icon: Database }
  ];

  const handleSelect = (id: NavigationTab) => {
    if (onSelectTab) {
      onSelectTab(id);
    } else if (onSelectModule) {
      onSelectModule(id);
    }
    onCloseMobile();
  };

  const currentActive = activeTab || (activeModule as NavigationTab) || 'DASHBOARD';

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#020617]/90 backdrop-blur-xl border-r border-slate-800 select-none">
      {/* Sleek Logo & Brand Header */}
      <div className="p-5 flex items-center justify-between border-b border-slate-800/80">
        <div className="flex items-center space-x-3 overflow-hidden">
          <div className="w-8 h-8 rounded-lg bg-cyan-500 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.5)] shrink-0">
            <div className="w-4 h-4 border-2 border-white rotate-45" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="font-bold text-base tracking-tight text-white uppercase font-sans">
                IntelliDocs
              </span>
              <span className="text-[10px] text-cyan-400 font-mono tracking-wider">
                KMRL METRO AI
              </span>
            </div>
          )}
        </div>

        {/* Collapse toggle */}
        {onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            className="hidden lg:flex p-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-slate-400 hover:text-white transition-all cursor-pointer"
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
          </button>
        )}

        {/* Mobile close */}
        <button
          onClick={onCloseMobile}
          className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white cursor-pointer"
          aria-label="Close menu"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Sleek Navigation Items */}
      <nav className="flex-1 px-3 space-y-1 mt-3 overflow-y-auto custom-scrollbar">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = currentActive === item.id;

          return (
            <button
              key={item.id}
              onClick={() => handleSelect(item.id)}
              title={isCollapsed ? item.label : undefined}
              className={`w-full flex items-center justify-between p-2.5 rounded-lg text-xs transition-colors cursor-pointer group ${
                isActive
                  ? 'bg-cyan-500/10 border-l-2 border-cyan-500 text-cyan-400 font-semibold shadow-[inset_0_0_12px_rgba(6,182,212,0.08)]'
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 border-l-2 border-transparent font-medium'
              }`}
            >
              <div className="flex items-center space-x-3 min-w-0">
                <div className="w-5 h-5 flex items-center justify-center shrink-0">
                  <Icon
                    className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                      isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-200'
                    }`}
                  />
                </div>
                {!isCollapsed && (
                  <span className={`text-xs truncate ${item.isUSP && !isActive ? 'text-cyan-300/90 font-semibold' : ''}`}>
                    {item.label}
                  </span>
                )}
              </div>

              {!isCollapsed && (
                <div className="flex items-center gap-1.5 shrink-0">
                  {item.isUSP && (
                    <span className="text-[9px] px-1.5 py-0.2 rounded font-mono font-bold uppercase bg-cyan-500/20 border border-cyan-500/40 text-cyan-300">
                      CORE
                    </span>
                  )}
                  {item.badgeCount !== undefined && (
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full font-semibold ${
                        item.badgeType === 'danger'
                          ? 'bg-rose-500/20 border border-rose-500/40 text-rose-300 animate-pulse'
                          : item.badgeType === 'warning'
                          ? 'bg-orange-500/20 border border-orange-500/40 text-orange-300'
                          : 'bg-slate-800 border border-slate-700 text-slate-300'
                      }`}
                    >
                      {item.badgeCount}
                    </span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Sleek Bottom System Status & Credit Card */}
      {!isCollapsed && (
        <div className="p-4 border-t border-slate-800 space-y-3">
          <div className="flex items-center space-x-3 px-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">
              System Online
            </span>
          </div>

          <div className="bg-slate-900/90 rounded-lg p-3 border border-slate-800">
            <p className="text-[11px] text-slate-400">Developed by</p>
            <p className="text-xs font-bold text-white flex items-center justify-between mt-0.5">
              <span>SC TECH</span>
              <span className="text-rose-500 text-sm">♥</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside
        className={`hidden lg:block h-screen sticky top-0 transition-all duration-300 ease-in-out shrink-0 ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onCloseMobile}
              className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm lg:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="fixed inset-y-0 left-0 z-50 w-72 lg:hidden shadow-2xl"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

