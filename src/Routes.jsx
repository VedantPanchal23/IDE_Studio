import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import ProjectSettingsDashboard from './pages/project-settings-dashboard';
import App from './pages/code-editor-workspace';
import TerminalIntegrationPanel from './pages/terminal-integration-panel';
import MainIDEInterface from './pages/main-ide-interface';
import AIAssistantSidebar from './pages/ai-assistant-sidebar';
import FileExplorerPanel from './pages/file-explorer-panel';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<AIAssistantSidebar />} />
        <Route path="/project-settings-dashboard" element={<ProjectSettingsDashboard />} />
        <Route path="/code-editor-workspace" element={<App />} />
        <Route path="/terminal-integration-panel" element={<TerminalIntegrationPanel />} />
        <Route path="/main-ide-interface" element={<MainIDEInterface />} />
        <Route path="/ai-assistant-sidebar" element={<AIAssistantSidebar />} />
        <Route path="/file-explorer-panel" element={<FileExplorerPanel />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
