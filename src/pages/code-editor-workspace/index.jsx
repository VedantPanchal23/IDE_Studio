import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Header from '../../components/ui/Header';
import EditorTabBar from './components/EditorTabBar';
import MonacoEditorContainer from './components/MonacoEditorContainer';
import AIAutoComplete from './components/AIAutoComplete';
import SplitEditorView from './components/SplitEditorView';
import EditorContextMenu from './components/EditorContextMenu';
import FindReplacePanel from './components/FindReplacePanel';

const CodeEditorWorkspace = () => {
  const navigate = useNavigate();
  
  // Editor state
  const [openFiles, setOpenFiles] = useState([]);
  const [activeFile, setActiveFile] = useState(null);
  const [isSplitView, setIsSplitView] = useState(false);
  const [splitFiles, setSplitFiles] = useState({ left: null, right: null });
  
  // AI and context menu state
  const [aiSuggestions, setAiSuggestions] = useState({
    isVisible: false,
    position: { x: 0, y: 0 },
    suggestions: []
  });
  const [contextMenu, setContextMenu] = useState({
    isVisible: false,
    position: { x: 0, y: 0 },
    selectedText: ''
  });
  const [findReplace, setFindReplace] = useState({
    isVisible: false,
    currentMatches: 0,
    totalMatches: 0,
    currentMatchIndex: 0
  });

  // Panel states for header
  const [panelStates, setPanelStates] = useState({
    explorer: true,
    editor: true,
    ai: false,
    terminal: false
  });

  // Mock files data
  const mockFiles = [
    {
      id: 1,
      name: 'App.jsx',
      path: '/src/App.jsx',
      type: 'file',
      hasUnsavedChanges: false,
      content: `import React from 'react'
;\nimport { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
;\nimport Header from '../../components/ui/Header'
;\nimport Home from './pages/Home'
;\n\nfunction App() {\n  return (\n    <Router>\n      <div className="App">\n        <Header />\n        <Routes>\n          <Route path="/" element={<Home />} />\n        </Routes>\n      </div>\n    </Router>\n  );\n}\n\nexport default App;`
    },
    {
      id: 2,
      name: 'index.js',
      path: '/src/index.js',
      type: 'file',
      hasUnsavedChanges: true,
      content: `import React from 'react'
;\nimport ReactDOM from 'react-dom/client'
;\nimport './index.css';\nimport App from '../../App'
;\n\nconst root = ReactDOM.createRoot(document.getElementById('root'));\nroot.render(\n  <React.StrictMode>\n    <App />\n  </React.StrictMode>\n);`
    },
    {
      id: 3,
      name: 'styles.css',
      path: '/src/styles.css',
      type: 'file',
      hasUnsavedChanges: false,
      content: `/* Global Styles */\n* {\n  margin: 0;\n  padding: 0;\n  box-sizing: border-box;\n}\n\nbody {\n  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;\n  background-color: #1e1e1e;\n  color: #cccccc;\n}\n\n.container {\n  max-width: 1200px;\n  margin: 0 auto;\n  padding: 20px;\n}`
    }
  ];

  // Initialize with some open files
  useEffect(() => {
    setOpenFiles([mockFiles?.[0], mockFiles?.[1]]);
    setActiveFile(mockFiles?.[0]);
  }, []);

  // Handle panel toggle
  const handlePanelToggle = (panelName) => {
    setPanelStates(prev => ({
      ...prev,
      [panelName]: !prev?.[panelName]
    }));

    // Navigate to specific panels
    switch (panelName) {
      case 'explorer': navigate('/file-explorer-panel');
        break;
      case 'ai': navigate('/ai-assistant-sidebar');
        break;
      case 'terminal': navigate('/terminal-integration-panel');
        break;
      default:
        break;
    }
  };

  // Handle settings click
  const handleSettingsClick = () => {
    navigate('/project-settings-dashboard');
  };

  // Tab management
  const handleTabClick = (file) => {
    setActiveFile(file);
    if (isSplitView && !splitFiles?.left) {
      setSplitFiles(prev => ({ ...prev, left: file }));
    }
  };

  const handleTabClose = (file) => {
    const updatedFiles = openFiles?.filter(f => f?.id !== file?.id);
    setOpenFiles(updatedFiles);
    
    if (activeFile?.id === file?.id) {
      setActiveFile(updatedFiles?.length > 0 ? updatedFiles?.[0] : null);
    }
    
    // Handle split view
    if (isSplitView) {
      if (splitFiles?.left?.id === file?.id) {
        setSplitFiles(prev => ({ ...prev, left: null }));
      }
      if (splitFiles?.right?.id === file?.id) {
        setSplitFiles(prev => ({ ...prev, right: null }));
      }
    }
  };

  const handleNewFile = () => {
    const newFile = {
      id: Date.now(),
      name: 'untitled.js',
      path: '/untitled.js',
      type: 'file',
      hasUnsavedChanges: false,
      content: '// New file\n'
    };
    
    setOpenFiles(prev => [...prev, newFile]);
    setActiveFile(newFile);
  };

  // File content changes
  const handleFileChange = (file, newContent) => {
    const updatedFiles = openFiles?.map(f => 
      f?.id === file?.id 
        ? { ...f, content: newContent, hasUnsavedChanges: true }
        : f
    );
    setOpenFiles(updatedFiles);
    
    if (activeFile?.id === file?.id) {
      setActiveFile({ ...file, content: newContent, hasUnsavedChanges: true });
    }
  };

  // AI suggestions
  const handleShowAISuggestions = (position) => {
    setAiSuggestions({
      isVisible: true,
      position,
      suggestions: []
    });
  };

  const handleAISuggestionSelect = (suggestion) => {
    console.log('Selected suggestion:', suggestion);
    setAiSuggestions(prev => ({ ...prev, isVisible: false }));
  };

  const handleCloseAISuggestions = () => {
    setAiSuggestions(prev => ({ ...prev, isVisible: false }));
  };

  // Context menu
  const handleContextMenu = (e, selectedText = '') => {
    e?.preventDefault();
    setContextMenu({
      isVisible: true,
      position: { x: e?.clientX, y: e?.clientY },
      selectedText
    });
  };

  const handleContextMenuAction = (action, text) => {
    console.log('Context menu action:', action, text);
    
    switch (action) {
      case 'explainCode':
        // Navigate to AI assistant with context
        navigate('/ai-assistant-sidebar', { state: { context: text, action: 'explain' } });
        break;
      case 'refactor':
        // Navigate to AI assistant with refactor request
        navigate('/ai-assistant-sidebar', { state: { context: text, action: 'refactor' } });
        break;
      case 'generateTests':
        // Navigate to AI assistant with test generation request
        navigate('/ai-assistant-sidebar', { state: { context: text, action: 'generateTests' } });
        break;
      default:
        break;
    }
  };

  const handleCloseContextMenu = () => {
    setContextMenu(prev => ({ ...prev, isVisible: false }));
  };

  // Split view
  const handleToggleSplitView = () => {
    setIsSplitView(!isSplitView);
    if (!isSplitView && activeFile) {
      setSplitFiles({ left: activeFile, right: null });
    }
  };

  const handleCloseSplitView = () => {
    setIsSplitView(false);
    setSplitFiles({ left: null, right: null });
  };

  // Find and replace
  const handleToggleFindReplace = () => {
    setFindReplace(prev => ({ ...prev, isVisible: !prev?.isVisible }));
  };

  const handleFind = (text, options) => {
    console.log('Find:', text, options);
    // Mock search results
    setFindReplace(prev => ({
      ...prev,
      totalMatches: 5,
      currentMatchIndex: 0
    }));
  };

  const handleReplace = (findText, replaceText, options) => {
    console.log('Replace:', findText, replaceText, options);
  };

  const handleReplaceAll = (findText, replaceText, options) => {
    console.log('Replace All:', findText, replaceText, options);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e?.ctrlKey || e?.metaKey) {
        switch (e?.key) {
          case 's':
            e?.preventDefault();
            // Save current file
            if (activeFile) {
              const updatedFiles = openFiles?.map(f => 
                f?.id === activeFile?.id 
                  ? { ...f, hasUnsavedChanges: false }
                  : f
              );
              setOpenFiles(updatedFiles);
              setActiveFile({ ...activeFile, hasUnsavedChanges: false });
            }
            break;
          case 'n':
            e?.preventDefault();
            handleNewFile();
            break;
          case 'f':
            e?.preventDefault();
            handleToggleFindReplace();
            break;
          case '\\':
            e?.preventDefault();
            handleToggleSplitView();
            break;
          case ' ':
            e?.preventDefault();
            // Trigger AI suggestions
            handleShowAISuggestions({ x: 300, y: 200 });
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [activeFile, openFiles]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <Header 
        onSettingsClick={handleSettingsClick}
        onPanelToggle={handlePanelToggle}
        panelStates={panelStates}
      />
      {/* Main Content */}
      <div className="pt-12 h-screen flex flex-col">
        {/* Editor Toolbar */}
        <div className="flex items-center justify-between px-4 py-2 bg-surface border-b border-panel-border">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Icon name="Code" size={16} className="text-primary" />
              <span className="text-sm font-medium text-foreground">Code Editor</span>
            </div>
            
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleToggleSplitView}
                className={`h-7 px-2 text-xs ${isSplitView ? 'bg-primary/20 text-primary' : ''}`}
              >
                <Icon name="Columns" size={12} className="mr-1" />
                Split
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleToggleFindReplace}
                className="h-7 px-2 text-xs"
              >
                <Icon name="Search" size={12} className="mr-1" />
                Find
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleShowAISuggestions({ x: 400, y: 100 })}
                className="h-7 px-2 text-xs"
              >
                <Icon name="Bot" size={12} className="mr-1" />
                AI Assist
              </Button>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            <span>Ln 1, Col 1</span>
            <span>•</span>
            <span>UTF-8</span>
            <span>•</span>
            <span>JavaScript</span>
          </div>
        </div>

        {/* Tab Bar */}
        <EditorTabBar
          openFiles={openFiles}
          activeFile={activeFile}
          onTabClick={handleTabClick}
          onTabClose={handleTabClose}
          onNewFile={handleNewFile}
        />

        {/* Editor Content */}
        <div className="flex-1 relative" onContextMenu={handleContextMenu}>
          {isSplitView ? (
            <SplitEditorView
              leftFile={splitFiles?.left}
              rightFile={splitFiles?.right}
              onFileChange={handleFileChange}
              onCloseSplit={handleCloseSplitView}
            />
          ) : (
            <MonacoEditorContainer
              activeFile={activeFile}
              onFileChange={handleFileChange}
            />
          )}
          
          {/* Find and Replace Panel */}
          <FindReplacePanel
            isVisible={findReplace?.isVisible}
            onClose={() => setFindReplace(prev => ({ ...prev, isVisible: false }))}
            onFind={handleFind}
            onReplace={handleReplace}
            onReplaceAll={handleReplaceAll}
            currentMatches={findReplace?.currentMatches}
            totalMatches={findReplace?.totalMatches}
            currentMatchIndex={findReplace?.currentMatchIndex}
          />
        </div>

        {/* AI Autocomplete */}
        <AIAutoComplete
          isVisible={aiSuggestions?.isVisible}
          position={aiSuggestions?.position}
          suggestions={aiSuggestions?.suggestions}
          onSuggestionSelect={handleAISuggestionSelect}
          onClose={handleCloseAISuggestions}
          currentContext={activeFile?.content || ''}
        />

        {/* Context Menu */}
        <EditorContextMenu
          isVisible={contextMenu?.isVisible}
          position={contextMenu?.position}
          selectedText={contextMenu?.selectedText}
          onClose={handleCloseContextMenu}
          onAction={handleContextMenuAction}
        />
      </div>
      {/* Mobile Navigation */}
      <div className="fixed bottom-4 right-4 md:hidden">
        <div className="flex flex-col space-y-2">
          <Button
            variant="default"
            size="sm"
            onClick={() => navigate('/main-ide-interface')}
            className="shadow-floating"
          >
            <Icon name="Home" size={16} className="mr-2" />
            IDE
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/file-explorer-panel')}
            className="shadow-floating"
          >
            <Icon name="FolderOpen" size={16} className="mr-2" />
            Files
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CodeEditorWorkspace;