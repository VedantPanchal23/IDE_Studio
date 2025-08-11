import React, { createContext, useContext, useCallback } from 'react';
import { useWorkspace } from './WorkspacePanelManager';

const PanelCoordinatorContext = createContext();

export const PanelStateCoordinator = ({ children }) => {
  const workspace = useWorkspace();

  // File operations coordination
  const handleFileSelect = useCallback((file) => {
    // Update active file in workspace
    workspace?.setActiveFile(file);
    
    // Ensure editor panel is visible
    if (!workspace?.panels?.editor?.visible) {
      workspace?.togglePanel('editor');
    }
    
    // Update AI context with file information
    if (workspace?.panels?.ai?.visible) {
      // AI assistant will receive context through workspace state
    }
    
    // Update terminal working directory if file is in different folder
    const fileDirectory = file?.path?.substring(0, file?.path?.lastIndexOf('/'));
    if (fileDirectory !== workspace?.terminalState?.workingDirectory) {
      workspace?.updateTerminalState({
        workingDirectory: fileDirectory
      });
    }
  }, [workspace]);

  // Panel visibility coordination
  const handlePanelToggle = useCallback((panelName) => {
    workspace?.togglePanel(panelName);
    
    // Coordinate related panels
    switch (panelName) {
      case 'editor':
        // If editor is being closed and no files are open, show explorer
        if (workspace?.panels?.editor?.visible && workspace?.openFiles?.length === 0) {
          if (!workspace?.panels?.explorer?.visible) {
            workspace?.togglePanel('explorer');
          }
        }
        break;
        
      case 'ai':
        // When AI panel opens, share current file context
        if (!workspace?.panels?.ai?.visible && workspace?.activeFile) {
          // AI context is automatically updated through workspace state
        }
        break;
        
      case 'terminal':
        // Ensure terminal has correct working directory
        if (!workspace?.panels?.terminal?.visible && workspace?.activeFile) {
          const fileDirectory = workspace?.activeFile?.path?.substring(0, workspace?.activeFile?.path?.lastIndexOf('/'));
          workspace?.updateTerminalState({
            workingDirectory: fileDirectory
          });
        }
        break;
    }
  }, [workspace]);

  // File tree synchronization
  const handleFileTreeUpdate = useCallback((tree) => {
    workspace?.updateFileTree(tree);
    
    // Check if any open files no longer exist
    const existingPaths = getAllFilePaths(tree);
    const invalidFiles = workspace?.openFiles?.filter(file => 
      !existingPaths?.includes(file?.path)
    );
    
    // Close invalid files
    invalidFiles?.forEach(file => {
      workspace?.closeFile(file?.path);
    });
  }, [workspace]);

  // AI context sharing
  const handleAIContextUpdate = useCallback((context) => {
    // Update AI context based on current editor state
    if (workspace?.activeFile && context) {
      // Context is managed through workspace state
      // AI panel will receive updates automatically
    }
  }, [workspace]);

  // Terminal command coordination
  const handleTerminalCommand = useCallback((command, output) => {
    workspace?.updateTerminalState({
      history: [...workspace?.terminalState?.history, { command, output, timestamp: Date.now() }]
    });
    
    // Handle file system commands that might affect explorer
    if (command?.startsWith('cd ')) {
      const newDirectory = command?.substring(3)?.trim();
      workspace?.updateTerminalState({
        workingDirectory: newDirectory
      });
    }
    
    // Handle file creation/deletion commands
    if (command?.match(/^(touch|mkdir|rm|mv|cp)/)) {
      // Trigger file tree refresh
      // This would typically call a file system API
      setTimeout(() => {
        // Simulated file tree update
        handleFileTreeUpdate(workspace?.fileTree);
      }, 100);
    }
  }, [workspace, handleFileTreeUpdate]);

  // Layout coordination
  const handleLayoutChange = useCallback((layout) => {
    workspace?.setLayout(layout);
    
    // Adjust panel sizes based on layout
    switch (layout) {
      case 'focus':
        // Hide all panels except editor
        Object.keys(workspace?.panels)?.forEach(panel => {
          if (panel !== 'editor' && workspace?.panels?.[panel]?.visible) {
            workspace?.togglePanel(panel);
          }
        });
        break;
        
      case 'development':
        // Show explorer, editor, and terminal
        ['explorer', 'editor', 'terminal']?.forEach(panel => {
          if (!workspace?.panels?.[panel]?.visible) {
            workspace?.togglePanel(panel);
          }
        });
        break;
        
      case 'collaboration':
        // Show all panels for full collaboration experience
        Object.keys(workspace?.panels)?.forEach(panel => {
          if (!workspace?.panels?.[panel]?.visible) {
            workspace?.togglePanel(panel);
          }
        });
        break;
    }
  }, [workspace]);

  // Panel resize coordination
  const handlePanelResize = useCallback((panel, dimension, size) => {
    workspace?.resizePanel(panel, dimension, size);
    
    // Coordinate with adjacent panels
    if (panel === 'explorer' && dimension === 'width') {
      // Adjust editor width accordingly
      // This would be handled by the layout system
    }
    
    if (panel === 'terminal' && dimension === 'height') {
      // Adjust editor height accordingly
      // This would be handled by the layout system
    }
  }, [workspace]);

  const contextValue = {
    ...workspace,
    handleFileSelect,
    handlePanelToggle,
    handleFileTreeUpdate,
    handleAIContextUpdate,
    handleTerminalCommand,
    handleLayoutChange,
    handlePanelResize
  };

  return (
    <PanelCoordinatorContext.Provider value={contextValue}>
      {children}
    </PanelCoordinatorContext.Provider>
  );
};

export const usePanelCoordinator = () => {
  const context = useContext(PanelCoordinatorContext);
  if (!context) {
    throw new Error('usePanelCoordinator must be used within a PanelStateCoordinator');
  }
  return context;
};

// Helper function to extract all file paths from tree structure
const getAllFilePaths = (tree, basePath = '') => {
  const paths = [];
  
  const traverse = (node, currentPath) => {
    if (node?.type === 'file') {
      paths?.push(currentPath);
    } else if (node?.type === 'directory' && node?.children) {
      Object.keys(node?.children)?.forEach(name => {
        traverse(node?.children?.[name], `${currentPath}/${name}`);
      });
    }
  };
  
  if (tree && typeof tree === 'object') {
    Object.keys(tree)?.forEach(name => {
      traverse(tree?.[name], `${basePath}/${name}`);
    });
  }
  
  return paths;
};

export default PanelStateCoordinator;