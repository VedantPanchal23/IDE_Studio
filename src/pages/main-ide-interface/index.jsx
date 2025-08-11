import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

// Import all components
import FileExplorerPanel from './components/FileExplorerPanel';
import EditorTabBar from './components/EditorTabBar';
import MonacoEditorWrapper from './components/MonacoEditorWrapper';
import AIAssistantPanel from './components/AIAssistantPanel';
import TerminalPanel from './components/TerminalPanel';
import StatusBar from './components/StatusBar';
import MenuBar from './components/MenuBar';

const MainIDEInterface = () => {
  const navigate = useNavigate();
  
  // Panel visibility states
  const [panels, setPanels] = useState({
    explorer: true,
    ai: false,
    terminal: false
  });

  // File management states
  const [openFiles, setOpenFiles] = useState([]);
  const [activeFile, setActiveFile] = useState(null);
  const [cursorPosition, setCursorPosition] = useState({ line: 1, column: 1 });

  // Layout states
  const [terminalHeight, setTerminalHeight] = useState(200);
  const [explorerWidth, setExplorerWidth] = useState(320);
  const [aiPanelWidth, setAiPanelWidth] = useState(384);

  // Initialize with welcome file
  useEffect(() => {
    const welcomeFile = {
      path: 'welcome.md',
      name: 'welcome.md',
      language: 'markdown',
      content: `# Welcome to CodeStudio IDE

## Getting Started
CodeStudio IDE is a powerful web-based development environment that brings the familiar VS Code experience to your browser.

### Features
- 🎯 **Monaco Editor Integration** - Full syntax highlighting and IntelliSense
- 📁 **File Explorer** - Organize and manage your project files
- 🤖 **AI Assistant** - Get coding help and explanations
- 💻 **Integrated Terminal** - Run commands directly in the browser
- 🔄 **Multi-tab Interface** - Work with multiple files simultaneously

### Quick Start
1. Use the file explorer on the left to navigate your project
2. Click on any file to open it in the editor
3. Enable the AI assistant for coding help
4. Use the terminal for running commands

### Keyboard Shortcuts
- \`Ctrl+N\` - New file
- \`Ctrl+O\` - Open file
- \`Ctrl+S\` - Save file
- \`Ctrl+F\` - Find in file
- \`Ctrl+\\\` - Split editor
- \`Ctrl+\`\` - Toggle terminal

Happy coding! 🚀`,
      unsaved: false
    };

    setOpenFiles([welcomeFile]);
    setActiveFile(welcomeFile);
  }, []);

  // Panel toggle handlers
  const togglePanel = useCallback((panelName) => {
    setPanels(prev => ({
      ...prev,
      [panelName]: !prev?.[panelName]
    }));
  }, []);

  // File management handlers
  const handleFileSelect = useCallback((file) => {
    // Add to open files if not already open
    setOpenFiles(prev => {
      const exists = prev?.find(f => f?.path === file?.path);
      if (!exists) {
        return [...prev, { ...file, unsaved: false }];
      }
      return prev;
    });
    
    // Set as active file
    setActiveFile(file);
  }, []);

  const handleFileClose = useCallback((filePath) => {
    setOpenFiles(prev => {
      const newFiles = prev?.filter(f => f?.path !== filePath);
      
      // If closing active file, switch to another file
      if (activeFile?.path === filePath) {
        const remainingFiles = newFiles;
        setActiveFile(remainingFiles?.length > 0 ? remainingFiles?.[remainingFiles?.length - 1] : null);
      }
      
      return newFiles;
    });
  }, [activeFile]);

  const handleTabReorder = useCallback((draggedFile, targetFile) => {
    setOpenFiles(prev => {
      const newFiles = [...prev];
      const draggedIndex = newFiles?.findIndex(f => f?.path === draggedFile?.path);
      const targetIndex = newFiles?.findIndex(f => f?.path === targetFile?.path);
      
      if (draggedIndex !== -1 && targetIndex !== -1) {
        const [removed] = newFiles?.splice(draggedIndex, 1);
        newFiles?.splice(targetIndex, 0, removed);
      }
      
      return newFiles;
    });
  }, []);

  const handleContentChange = useCallback((content) => {
    if (activeFile) {
      // Mark file as unsaved
      setOpenFiles(prev => prev?.map(file => 
        file?.path === activeFile?.path 
          ? { ...file, content, unsaved: true }
          : file
      ));
      
      // Update active file
      setActiveFile(prev => prev ? { ...prev, content, unsaved: true } : null);
    }
  }, [activeFile]);

  // Menu action handlers
  const handleFileAction = useCallback((action) => {
    switch (action) {
      case 'new':
        const newFile = {
          path: `untitled-${Date.now()}.js`,
          name: `untitled-${Date.now()}.js`,
          language: 'javascript',
          content: '// New file\n',
          unsaved: true
        };
        setOpenFiles(prev => [...prev, newFile]);
        setActiveFile(newFile);
        break;
      case 'save':
        if (activeFile && activeFile?.unsaved) {
          setOpenFiles(prev => prev?.map(file => 
            file?.path === activeFile?.path 
              ? { ...file, unsaved: false }
              : file
          ));
          setActiveFile(prev => prev ? { ...prev, unsaved: false } : null);
        }
        break;
      case 'close':
        if (activeFile) {
          handleFileClose(activeFile?.path);
        }
        break;
      case 'closeAll':
        setOpenFiles([]);
        setActiveFile(null);
        break;
      default:
        console.log(`File action: ${action}`);
    }
  }, [activeFile, handleFileClose]);

  const handleViewAction = useCallback((action) => {
    switch (action) {
      case 'explorer': togglePanel('explorer');
        break;
      case 'terminal': togglePanel('terminal');
        break;
      case 'ai': togglePanel('ai');
        break;
      case 'sidebar':
        setPanels(prev => ({
          ...prev,
          explorer: !prev?.explorer,
          ai: false
        }));
        break;
      default:
        console.log(`View action: ${action}`);
    }
  }, [togglePanel]);

  const handleSettingsClick = useCallback(() => {
    navigate('/project-settings-dashboard');
  }, [navigate]);

  // Navigation handlers
  const handleNavigateToExplorer = () => navigate('/file-explorer-panel');
  const handleNavigateToEditor = () => navigate('/code-editor-workspace');
  const handleNavigateToAI = () => navigate('/ai-assistant-sidebar');
  const handleNavigateToTerminal = () => navigate('/terminal-integration-panel');

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      {/* Menu Bar */}
      <MenuBar 
        onFileAction={handleFileAction}
        onViewAction={handleViewAction}
        onSettingsClick={handleSettingsClick}
      />
      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - File Explorer */}
        <FileExplorerPanel
          isVisible={panels?.explorer}
          onToggle={() => togglePanel('explorer')}
          onFileSelect={handleFileSelect}
          activeFile={activeFile}
        />

        {/* Center Area - Editor */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Tab Bar */}
          <EditorTabBar
            openFiles={openFiles}
            activeFile={activeFile}
            onFileSelect={setActiveFile}
            onFileClose={handleFileClose}
            onTabReorder={handleTabReorder}
          />

          {/* Editor */}
          <div className="flex-1 flex flex-col">
            <MonacoEditorWrapper
              activeFile={activeFile}
              onContentChange={handleContentChange}
              theme="vs-dark"
            />
          </div>

          {/* Terminal Panel */}
          <TerminalPanel
            isVisible={panels?.terminal}
            onToggle={() => togglePanel('terminal')}
            height={terminalHeight}
          />
        </div>

        {/* Right Sidebar - AI Assistant */}
        <AIAssistantPanel
          isVisible={panels?.ai}
          onToggle={() => togglePanel('ai')}
          activeFile={activeFile}
        />
      </div>
      {/* Status Bar */}
      <StatusBar
        activeFile={activeFile}
        cursorPosition={cursorPosition}
        onSettingsClick={handleSettingsClick}
      />
      {/* Quick Navigation Panel - Mobile/Tablet */}
      <div className="lg:hidden fixed bottom-4 right-4 z-50">
        <div className="bg-surface border border-panel-border rounded-lg shadow-floating p-2">
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleNavigateToExplorer}
              className="flex flex-col items-center p-2"
            >
              <Icon name="FolderOpen" size={16} />
              <span className="text-xs mt-1">Explorer</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleNavigateToEditor}
              className="flex flex-col items-center p-2"
            >
              <Icon name="FileText" size={16} />
              <span className="text-xs mt-1">Editor</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleNavigateToAI}
              className="flex flex-col items-center p-2"
            >
              <Icon name="Bot" size={16} />
              <span className="text-xs mt-1">AI</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleNavigateToTerminal}
              className="flex flex-col items-center p-2"
            >
              <Icon name="Terminal" size={16} />
              <span className="text-xs mt-1">Terminal</span>
            </Button>
          </div>
        </div>
      </div>
      {/* Responsive Panel Toggles */}
      <div className="md:hidden fixed top-16 left-4 z-40 flex flex-col space-y-2">
        <Button
          variant={panels?.explorer ? "default" : "outline"}
          size="sm"
          onClick={() => togglePanel('explorer')}
          className="w-10 h-10 p-0"
        >
          <Icon name="FolderOpen" size={16} />
        </Button>
        
        <Button
          variant={panels?.ai ? "default" : "outline"}
          size="sm"
          onClick={() => togglePanel('ai')}
          className="w-10 h-10 p-0"
        >
          <Icon name="Bot" size={16} />
        </Button>
        
        <Button
          variant={panels?.terminal ? "default" : "outline"}
          size="sm"
          onClick={() => togglePanel('terminal')}
          className="w-10 h-10 p-0"
        >
          <Icon name="Terminal" size={16} />
        </Button>
      </div>
      {/* Mobile Overlay for Panels */}
      {(panels?.explorer || panels?.ai) && (
        <div className="md:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-30" />
      )}
    </div>
  );
};

export default MainIDEInterface;