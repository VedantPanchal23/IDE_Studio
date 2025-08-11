import React, { createContext, useContext, useReducer, useEffect } from 'react';

const WorkspaceContext = createContext();

const initialState = {
  panels: {
    explorer: { visible: true, width: 240, position: 'left' },
    editor: { visible: true, width: 'auto', position: 'center' },
    ai: { visible: false, width: 300, position: 'right' },
    terminal: { visible: false, height: 200, position: 'bottom' }
  },
  activeFile: null,
  openFiles: [],
  fileTree: {},
  aiContext: null,
  terminalState: {
    workingDirectory: '/',
    history: []
  },
  layout: 'default'
};

const workspaceReducer = (state, action) => {
  switch (action?.type) {
    case 'TOGGLE_PANEL':
      return {
        ...state,
        panels: {
          ...state?.panels,
          [action?.panel]: {
            ...state?.panels?.[action?.panel],
            visible: !state?.panels?.[action?.panel]?.visible
          }
        }
      };

    case 'RESIZE_PANEL':
      return {
        ...state,
        panels: {
          ...state?.panels,
          [action?.panel]: {
            ...state?.panels?.[action?.panel],
            [action?.dimension]: action?.size
          }
        }
      };

    case 'SET_ACTIVE_FILE':
      return {
        ...state,
        activeFile: action?.file,
        aiContext: action?.file ? { file: action?.file, content: action?.content } : null
      };

    case 'ADD_OPEN_FILE':
      if (state?.openFiles?.find(f => f?.path === action?.file?.path)) {
        return state;
      }
      return {
        ...state,
        openFiles: [...state?.openFiles, action?.file]
      };

    case 'REMOVE_OPEN_FILE':
      return {
        ...state,
        openFiles: state?.openFiles?.filter(f => f?.path !== action?.filePath),
        activeFile: state?.activeFile?.path === action?.filePath ? null : state?.activeFile
      };

    case 'UPDATE_FILE_TREE':
      return {
        ...state,
        fileTree: action?.tree
      };

    case 'UPDATE_TERMINAL_STATE':
      return {
        ...state,
        terminalState: {
          ...state?.terminalState,
          ...action?.updates
        }
      };

    case 'SET_LAYOUT':
      return {
        ...state,
        layout: action?.layout
      };

    case 'RESTORE_WORKSPACE':
      return {
        ...state,
        ...action?.workspace
      };

    default:
      return state;
  }
};

export const WorkspacePanelManager = ({ children }) => {
  const [state, dispatch] = useReducer(workspaceReducer, initialState);

  // Load workspace state from localStorage on mount
  useEffect(() => {
    const savedWorkspace = localStorage.getItem('codestudio-workspace');
    if (savedWorkspace) {
      try {
        const workspace = JSON.parse(savedWorkspace);
        dispatch({ type: 'RESTORE_WORKSPACE', workspace });
      } catch (error) {
        console.warn('Failed to restore workspace state:', error);
      }
    }
  }, []);

  // Save workspace state to localStorage on changes
  useEffect(() => {
    const workspaceToSave = {
      panels: state?.panels,
      openFiles: state?.openFiles,
      activeFile: state?.activeFile,
      layout: state?.layout
    };
    
    localStorage.setItem('codestudio-workspace', JSON.stringify(workspaceToSave));
  }, [state?.panels, state?.openFiles, state?.activeFile, state?.layout]);

  const togglePanel = (panel) => {
    dispatch({ type: 'TOGGLE_PANEL', panel });
  };

  const resizePanel = (panel, dimension, size) => {
    dispatch({ type: 'RESIZE_PANEL', panel, dimension, size });
  };

  const setActiveFile = (file, content = null) => {
    dispatch({ type: 'SET_ACTIVE_FILE', file, content });
    if (file) {
      dispatch({ type: 'ADD_OPEN_FILE', file });
    }
  };

  const closeFile = (filePath) => {
    dispatch({ type: 'REMOVE_OPEN_FILE', filePath });
  };

  const updateFileTree = (tree) => {
    dispatch({ type: 'UPDATE_FILE_TREE', tree });
  };

  const updateTerminalState = (updates) => {
    dispatch({ type: 'UPDATE_TERMINAL_STATE', updates });
  };

  const setLayout = (layout) => {
    dispatch({ type: 'SET_LAYOUT', layout });
  };

  const contextValue = {
    ...state,
    togglePanel,
    resizePanel,
    setActiveFile,
    closeFile,
    updateFileTree,
    updateTerminalState,
    setLayout
  };

  return (
    <WorkspaceContext.Provider value={contextValue}>
      {children}
    </WorkspaceContext.Provider>
  );
};

export const useWorkspace = () => {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error('useWorkspace must be used within a WorkspacePanelManager');
  }
  return context;
};

export default WorkspacePanelManager;