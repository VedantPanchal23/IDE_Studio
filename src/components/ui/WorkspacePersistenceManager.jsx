import React, { useEffect, useCallback } from 'react';
import { useWorkspace } from './WorkspacePanelManager';

const STORAGE_KEYS = {
  WORKSPACE: 'codestudio-workspace-state',
  PANELS: 'codestudio-panel-config',
  FILES: 'codestudio-open-files',
  EDITOR: 'codestudio-editor-state',
  AI_HISTORY: 'codestudio-ai-history',
  TERMINAL_HISTORY: 'codestudio-terminal-history',
  PREFERENCES: 'codestudio-user-preferences'
};

export const WorkspacePersistenceManager = ({ children }) => {
  const workspace = useWorkspace();

  // Save workspace state to localStorage
  const saveWorkspaceState = useCallback(() => {
    try {
      const workspaceState = {
        panels: workspace?.panels,
        layout: workspace?.layout,
        timestamp: Date.now()
      };
      
      localStorage.setItem(STORAGE_KEYS?.WORKSPACE, JSON.stringify(workspaceState));
    } catch (error) {
      console.warn('Failed to save workspace state:', error);
    }
  }, [workspace?.panels, workspace?.layout]);

  // Save open files and editor state
  const saveEditorState = useCallback(() => {
    try {
      const editorState = {
        openFiles: workspace?.openFiles?.map(file => ({
          ...file,
          // Save cursor position, scroll position, etc.
          editorState: file?.editorState || {}
        })),
        activeFile: workspace?.activeFile,
        timestamp: Date.now()
      };
      
      localStorage.setItem(STORAGE_KEYS?.FILES, JSON.stringify(editorState));
    } catch (error) {
      console.warn('Failed to save editor state:', error);
    }
  }, [workspace?.openFiles, workspace?.activeFile]);

  // Save AI conversation history
  const saveAIHistory = useCallback(() => {
    try {
      if (workspace?.aiContext && workspace?.aiContext?.history) {
        const aiState = {
          history: workspace?.aiContext?.history,
          context: workspace?.aiContext?.context,
          timestamp: Date.now()
        };
        
        localStorage.setItem(STORAGE_KEYS?.AI_HISTORY, JSON.stringify(aiState));
      }
    } catch (error) {
      console.warn('Failed to save AI history:', error);
    }
  }, [workspace?.aiContext]);

  // Save terminal history
  const saveTerminalHistory = useCallback(() => {
    try {
      const terminalState = {
        history: workspace?.terminalState?.history?.slice(-100), // Keep last 100 commands
        workingDirectory: workspace?.terminalState?.workingDirectory,
        timestamp: Date.now()
      };
      
      localStorage.setItem(STORAGE_KEYS?.TERMINAL_HISTORY, JSON.stringify(terminalState));
    } catch (error) {
      console.warn('Failed to save terminal history:', error);
    }
  }, [workspace?.terminalState]);

  // Load workspace state from localStorage
  const loadWorkspaceState = useCallback(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS?.WORKSPACE);
      if (saved) {
        const workspaceState = JSON.parse(saved);
        
        // Check if state is not too old (7 days)
        const isRecent = Date.now() - workspaceState?.timestamp < 7 * 24 * 60 * 60 * 1000;
        
        if (isRecent && workspaceState?.panels) {
          // Restore panel configuration
          Object.keys(workspaceState?.panels)?.forEach(panelName => {
            const panelConfig = workspaceState?.panels?.[panelName];
            if (panelConfig?.visible !== workspace?.panels?.[panelName]?.visible) {
              workspace?.togglePanel(panelName);
            }
            
            // Restore panel dimensions
            if (panelConfig?.width && panelConfig?.width !== workspace?.panels?.[panelName]?.width) {
              workspace?.resizePanel(panelName, 'width', panelConfig?.width);
            }
            if (panelConfig?.height && panelConfig?.height !== workspace?.panels?.[panelName]?.height) {
              workspace?.resizePanel(panelName, 'height', panelConfig?.height);
            }
          });
          
          // Restore layout
          if (workspaceState?.layout) {
            workspace?.setLayout(workspaceState?.layout);
          }
        }
      }
    } catch (error) {
      console.warn('Failed to load workspace state:', error);
    }
  }, [workspace]);

  // Load editor state
  const loadEditorState = useCallback(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS?.FILES);
      if (saved) {
        const editorState = JSON.parse(saved);
        
        // Check if state is recent
        const isRecent = Date.now() - editorState?.timestamp < 24 * 60 * 60 * 1000; // 1 day
        
        if (isRecent && editorState?.openFiles) {
          // Restore open files
          editorState?.openFiles?.forEach(file => {
            workspace?.setActiveFile(file);
          });
          
          // Restore active file
          if (editorState?.activeFile) {
            workspace?.setActiveFile(editorState?.activeFile);
          }
        }
      }
    } catch (error) {
      console.warn('Failed to load editor state:', error);
    }
  }, [workspace]);

  // Load AI history
  const loadAIHistory = useCallback(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS?.AI_HISTORY);
      if (saved) {
        const aiState = JSON.parse(saved);
        
        // Check if state is recent (3 days)
        const isRecent = Date.now() - aiState?.timestamp < 3 * 24 * 60 * 60 * 1000;
        
        if (isRecent && aiState?.history) {
          // Restore AI conversation history
          // This would be handled by the AI component
        }
      }
    } catch (error) {
      console.warn('Failed to load AI history:', error);
    }
  }, []);

  // Load terminal history
  const loadTerminalHistory = useCallback(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS?.TERMINAL_HISTORY);
      if (saved) {
        const terminalState = JSON.parse(saved);
        
        // Check if state is recent (1 day)
        const isRecent = Date.now() - terminalState?.timestamp < 24 * 60 * 60 * 1000;
        
        if (isRecent) {
          workspace?.updateTerminalState({
            history: terminalState?.history || [],
            workingDirectory: terminalState?.workingDirectory || '/'
          });
        }
      }
    } catch (error) {
      console.warn('Failed to load terminal history:', error);
    }
  }, [workspace]);

  // Clear old storage data
  const cleanupStorage = useCallback(() => {
    try {
      Object.values(STORAGE_KEYS)?.forEach(key => {
        const saved = localStorage.getItem(key);
        if (saved) {
          const data = JSON.parse(saved);
          // Remove data older than 30 days
          if (data?.timestamp && Date.now() - data?.timestamp > 30 * 24 * 60 * 60 * 1000) {
            localStorage.removeItem(key);
          }
        }
      });
    } catch (error) {
      console.warn('Failed to cleanup storage:', error);
    }
  }, []);

  // Export workspace state
  const exportWorkspace = useCallback(() => {
    try {
      const exportData = {
        workspace: {
          panels: workspace?.panels,
          layout: workspace?.layout
        },
        files: {
          openFiles: workspace?.openFiles,
          activeFile: workspace?.activeFile
        },
        terminal: workspace?.terminalState,
        timestamp: Date.now(),
        version: '1.0'
      };
      
      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: 'application/json'
      });
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `codestudio-workspace-${new Date()?.toISOString()?.split('T')?.[0]}.json`;
      document.body?.appendChild(a);
      a?.click();
      document.body?.removeChild(a);
      URL.revokeObjectURL(url);
      
      return true;
    } catch (error) {
      console.error('Failed to export workspace:', error);
      return false;
    }
  }, [workspace]);

  // Import workspace state
  const importWorkspace = useCallback((file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const importData = JSON.parse(e.target.result);
          
          if (importData.version && importData.workspace) {
            // Restore workspace configuration
            if (importData.workspace.panels) {
              Object.keys(importData.workspace.panels).forEach(panelName => {
                const panelConfig = importData.workspace.panels[panelName];
                if (panelConfig.visible !== workspace.panels[panelName]?.visible) {
                  workspace.togglePanel(panelName);
                }
              });
            }
            
            if (importData.workspace.layout) {
              workspace.setLayout(importData.workspace.layout);
            }
            
            // Restore files if available
            if (importData.files && importData.files.openFiles) {
              importData.files.openFiles.forEach(file => {
                workspace.setActiveFile(file);
              });
            }
            
            resolve(true);
          } else {
            reject(new Error('Invalid workspace file format'));
          }
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  }, [workspace]);

  // Auto-save effects
  useEffect(() => {
    const saveTimer = setTimeout(saveWorkspaceState, 1000);
    return () => clearTimeout(saveTimer);
  }, [workspace?.panels, workspace?.layout, saveWorkspaceState]);

  useEffect(() => {
    const saveTimer = setTimeout(saveEditorState, 2000);
    return () => clearTimeout(saveTimer);
  }, [workspace?.openFiles, workspace?.activeFile, saveEditorState]);

  useEffect(() => {
    const saveTimer = setTimeout(saveTerminalHistory, 5000);
    return () => clearTimeout(saveTimer);
  }, [workspace?.terminalState, saveTerminalHistory]);

  // Load state on mount
  useEffect(() => {
    loadWorkspaceState();
    loadEditorState();
    loadTerminalHistory();
    loadAIHistory();
    cleanupStorage();
  }, [loadWorkspaceState, loadEditorState, loadTerminalHistory, loadAIHistory, cleanupStorage]);

  // Handle page unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      saveWorkspaceState();
      saveEditorState();
      saveTerminalHistory();
      saveAIHistory();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [saveWorkspaceState, saveEditorState, saveTerminalHistory, saveAIHistory]);

  // Provide persistence methods to children
  const persistenceContext = {
    exportWorkspace,
    importWorkspace,
    saveWorkspaceState,
    loadWorkspaceState,
    cleanupStorage
  };

  return (
    <div data-persistence-manager>
      {React.cloneElement(children, { persistence: persistenceContext })}
    </div>
  );
};

export default WorkspacePersistenceManager;