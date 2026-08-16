import React, { useState } from 'react';
import {
  Search,
  Bell,
  ChevronDown,
  ShieldAlert,
  LogOut,
  Check,
  Flame,
  Menu,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.js';
import { useData } from '../../context/DataContext.js';
import { NavigationTab } from '../../types.js';

interface HeaderProps {
  onOpenSearch: () => void;
  onToggleSidebar?: () => void;
  activeTab?: NavigationTab;
  onNavigate?: (tab: NavigationTab) => void;
  onNavigateToModule?: (moduleKey: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSearch,
  onToggleSidebar,
  onNavigate,
  onNavigateToModule
}) => {
  const { currentUser, availableUsers, switchUser, logout } = useAuth();
  const { risks, approvals, deadlines } = useData();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);

  const pendingApprovalsCount = approvals.filter(a => a.status === 'PENDING').length;
  const criticalRisksCount = risks.filter(r => r.severity === 'CRITICAL').length;
  const overdueDeadlinesCount = deadlines.filter(d => d.status === 'OVERDUE').length;
  const totalAlerts = pendingApprovalsCount + criticalRisksCount + overdueDeadlinesCount;

  return (
    <header className="sticky top-0 z-30 flex flex-col w-full border-b border-slate-800 bg-[#020617]/80 backdrop-blur-md">
      {/* Main Sleek Navigation Bar */}
      <div className="h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 gap-4">
        {/* Mobile menu trigger */}
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-md bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
            aria-label="Toggle menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        {/* Center/Left: Global Search Input */}
        <div className="flex items-center flex-1 max-w-xl">
          <div className="relative w-full">
            <button
              onClick={onOpenSearch}
              className="w-full flex items-center justify-between pl-10 pr-3 py-2 border border-slate-700 rounded-md bg-slate-900/50 text-slate-300 hover:border-cyan-500/50 hover:bg-slate-900 text-sm transition-all group cursor-pointer text-left"
            >
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 group-hover:text-cyan-400 transition-colors">
                <Search className="h-4 w-4" />
              </span>
              <span className="text-slate-400 text-xs sm:text-sm truncate">
                Search authorized documents...
              </span>
              <kbd className="hidden sm:inline-flex items-center font-mono text-[10px] text-slate-500 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700">
                Ctrl + K
              </kbd>
            </button>
          </div>
        </div>

        {/* Right Side: Operational Status, Notifications, User Profile */}
        <div className="flex items-center space-x-4 sm:space-x-6">
          {/* Operational Status Indicator */}
          <div className="hidden sm:flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-tighter">
              Active Intelligence
            </span>
          </div>

          {/* Notifications Drawer */}
          <div className="relative">
            <button
              onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
              className="relative p-2 rounded-md bg-slate-900/50 border border-slate-700 hover:border-slate-600 text-slate-300 hover:text-white transition-all cursor-pointer"
              aria-label="Alerts"
            >
              <Bell className="w-4 h-4" />
              {totalAlerts > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white animate-pulse">
                  {totalAlerts}
                </span>
              )}
            </button>

            {notifDropdownOpen && (
              <div className="absolute right-0 mt-2 w-80 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl p-4 z-50 text-xs">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <span className="font-bold text-white uppercase tracking-wider text-xs">Operational Alerts</span>
                  <span className="text-[10px] font-mono text-cyan-400">{totalAlerts} Actionable</span>
                </div>

                <div className="mt-3 space-y-2 max-h-64 overflow-y-auto custom-scrollbar">
                  {criticalRisksCount > 0 && (
                    <div
                      onClick={() => {
                        setNotifDropdownOpen(false);
                        if (onNavigate) onNavigate('RISK_RADAR');
                        else if (onNavigateToModule) onNavigateToModule('risk-radar');
                      }}
                      className="p-3 rounded-lg bg-slate-800/40 border border-slate-700 hover:border-rose-500/50 cursor-pointer transition-all relative overflow-hidden"
                    >
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-rose-500" />
                      <div className="flex items-center gap-1.5 text-rose-400 font-semibold text-xs">
                        <Flame className="w-3.5 h-3.5 text-rose-400" />
                        <span>{criticalRisksCount} Critical Operational Risks</span>
                      </div>
                      <p className="text-[11px] text-slate-300 mt-1">SCADA traction emergency testing overdue verification required.</p>
                    </div>
                  )}

                  {pendingApprovalsCount > 0 && (
                    <div
                      onClick={() => {
                        setNotifDropdownOpen(false);
                        if (onNavigate) onNavigate('WORKFLOWS');
                        else if (onNavigateToModule) onNavigateToModule('approvals');
                      }}
                      className="p-3 rounded-lg bg-slate-800/40 border border-slate-700 hover:border-cyan-500/50 cursor-pointer transition-all relative overflow-hidden"
                    >
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-500" />
                      <div className="flex items-center gap-1.5 text-cyan-400 font-semibold text-xs">
                        <ShieldAlert className="w-3.5 h-3.5 text-cyan-400" />
                        <span>{pendingApprovalsCount} Pending Human Approvals</span>
                      </div>
                      <p className="text-[11px] text-slate-300 mt-1">Signalling SLA and night shutdown authorizations awaiting sign-off.</p>
                    </div>
                  )}

                  {overdueDeadlinesCount > 0 && (
                    <div
                      onClick={() => {
                        setNotifDropdownOpen(false);
                        if (onNavigate) onNavigate('DEADLINES');
                        else if (onNavigateToModule) onNavigateToModule('deadlines');
                      }}
                      className="p-3 rounded-lg bg-slate-800/40 border border-slate-700 hover:border-orange-500/50 cursor-pointer transition-all relative overflow-hidden"
                    >
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-500" />
                      <div className="flex items-center gap-1.5 text-orange-400 font-semibold text-xs">
                        <Flame className="w-3.5 h-3.5 text-orange-400" />
                        <span>{overdueDeadlinesCount} Overdue Milestones</span>
                      </div>
                      <p className="text-[11px] text-slate-300 mt-1">Immediate intervention required to avoid contractual penalty.</p>
                    </div>
                  )}

                  {totalAlerts === 0 && (
                    <div className="py-6 text-center text-slate-400 text-xs">
                      All operational items and SLA obligations are within normal limits.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sleek User Profile Block with Left Border */}
          <div className="flex items-center space-x-3 sm:space-x-4 border-l border-slate-800 pl-4 sm:pl-6 relative">
            <button
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="flex items-center space-x-3 text-left cursor-pointer group"
            >
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {currentUser.name}
                </p>
                <p className="text-[10px] text-cyan-500 uppercase tracking-wider font-mono">
                  {currentUser.role}
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 border border-slate-700 shadow-lg flex items-center justify-center text-white font-bold text-sm">
                {currentUser.name.charAt(0)}
              </div>
            </button>

            {/* User Dropdown */}
            {userDropdownOpen && (
              <div className="absolute right-0 top-12 mt-2 w-72 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl p-3 z-50 text-xs">
                <div className="px-2 py-1.5 border-b border-slate-800">
                  <div className="font-semibold text-white">{currentUser.name}</div>
                  <div className="text-[11px] text-slate-400 font-mono">{currentUser.email}</div>
                  <div className="text-[10px] text-cyan-400 mt-0.5">{currentUser.department}</div>
                </div>

                <div className="mt-2.5">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider px-2 block mb-1">
                    Switch Active Persona (RBAC Testing)
                  </span>
                  <div className="space-y-1">
                    {availableUsers.map(user => (
                      <button
                        key={user.id}
                        onClick={() => {
                          switchUser(user);
                          setUserDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition-colors cursor-pointer ${
                          user.id === currentUser.id
                            ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30'
                            : 'hover:bg-slate-800 text-slate-300'
                        }`}
                      >
                        <div>
                          <div className="font-medium text-white">{user.name}</div>
                          <div className="text-[10px] text-slate-400 font-mono">{user.role} • {user.department.split('&')[0]}</div>
                        </div>
                        {user.id === currentUser.id && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between">
                  <button
                    onClick={logout}
                    className="flex items-center gap-1.5 text-rose-400 hover:text-rose-300 p-1 font-medium transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

