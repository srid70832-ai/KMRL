import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AuthProvider, useAuth } from './context/AuthContext.js';
import { DataProvider, useData } from './context/DataContext.js';
import { NavigationTab } from './types.js';
import { Header } from './components/layout/Header.js';
import { Sidebar } from './components/layout/Sidebar.js';
import { Footer } from './components/layout/Footer.js';
import { ToastContainer } from './components/common/ToastContainer.js';
import { GlobalSearchModal } from './components/common/GlobalSearchModal.js';
import { SignInView } from './components/auth/SignInView.js';
import { DashboardView } from './components/views/DashboardView.js';
import { DocumentsView } from './components/views/DocumentsView.js';
import { SemanticSearchView } from './components/views/SemanticSearchView.js';
import { AiCopilotView } from './components/views/AiCopilotView.js';
import { ChangeImpactSimulatorView } from './components/views/ChangeImpactSimulatorView.js';
import { KnowledgeGraphView } from './components/views/KnowledgeGraphView.js';
import { RiskRadarView } from './components/views/RiskRadarView.js';
import { ConflictRadarView } from './components/views/ConflictRadarView.js';
import { ActionsView } from './components/views/ActionsView.js';
import { DeadlinesView } from './components/views/DeadlinesView.js';
import { ComplianceCheckerView } from './components/views/ComplianceCheckerView.js';
import { WorkflowsView } from './components/views/WorkflowsView.js';
import { AuditTrailView } from './components/views/AuditTrailView.js';
import { AnalyticsView } from './components/views/AnalyticsView.js';
import { AdminSchemaView } from './components/views/AdminSchemaView.js';

const MainAppContent: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<NavigationTab>('DASHBOARD');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // If not signed in, show Sign In View
  if (!isAuthenticated) {
    return <SignInView />;
  }

  const renderActiveView = () => {
    switch (activeTab) {
      case 'DASHBOARD':
        return <DashboardView onNavigate={(tab) => setActiveTab(tab)} />;
      case 'DOCUMENTS':
        return <DocumentsView />;
      case 'SEARCH':
        return <SemanticSearchView />;
      case 'COPILOT':
        return <AiCopilotView />;
      case 'IMPACT_SIMULATOR':
        return <ChangeImpactSimulatorView />;
      case 'KNOWLEDGE_GRAPH':
        return <KnowledgeGraphView />;
      case 'RISK_RADAR':
        return <RiskRadarView />;
      case 'CONFLICT_RADAR':
        return <ConflictRadarView />;
      case 'ACTIONS':
        return <ActionsView />;
      case 'DEADLINES':
        return <DeadlinesView />;
      case 'COMPLIANCE':
        return <ComplianceCheckerView />;
      case 'WORKFLOWS':
        return <WorkflowsView />;
      case 'AUDIT_TRAIL':
        return <AuditTrailView />;
      case 'ANALYTICS':
        return <AnalyticsView />;
      case 'ADMIN_SCHEMA':
        return <AdminSchemaView />;
      default:
        return <DashboardView onNavigate={(tab) => setActiveTab(tab)} />;
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#020617] text-slate-100 font-sans overflow-hidden flex-col selection:bg-cyan-500 selection:text-white">
      {/* Top Header */}
      <Header
        onOpenSearch={() => setIsSearchOpen(true)}
        onToggleSidebar={() => {
          if (window.innerWidth < 1024) {
            setIsMobileDrawerOpen(prev => !prev);
          } else {
            setIsSidebarCollapsed(prev => !prev);
          }
        }}
        activeTab={activeTab}
        onNavigate={(tab) => setActiveTab(tab)}
      />

      {/* Main Body Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Navigation Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={(tab) => setActiveTab(tab)}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(prev => !prev)}
          mobileOpen={isMobileDrawerOpen}
          onCloseMobile={() => setIsMobileDrawerOpen(false)}
        />

        {/* Dynamic Main Viewport */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 custom-scrollbar bg-[#020617]">
          <div className="max-w-7xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.15, ease: 'easeOut' }}
              >
                {renderActiveView()}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>

      {/* Persistent Operational Footer */}
      <Footer />

      {/* Global Interactive Modals & Notification Containers */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectResult={(_tab) => {
          setActiveTab(_tab);
          setIsSearchOpen(false);
        }}
      />
      <ToastContainer />
    </div>
  );

};

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <MainAppContent />
      </DataProvider>
    </AuthProvider>
  );
}
