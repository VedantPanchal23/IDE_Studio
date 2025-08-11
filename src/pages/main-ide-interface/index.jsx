import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

// Import all components
import FileExplorerPanel from './components/FileExplorerPanel';
import EditorTabBar from './components/EditorTabBar';
import MonacoEditorWrapper from './components/MonacoEditorWrapper';
import AIAssistantPanel from './components/AIAssistantPanel';
import TerminalPanel from './components/TerminalPanel';
import StatusBar from './components/StatusBar';
import MenuBar from './components/MenuBar';
import ActivityBar from './components/ActivityBar';

const MainIDEInterface = () => {
  const navigate = useNavigate();
  
  // View states
  const [activeView, setActiveView] = useState('explorer'); // 'explorer', 'ai', etc. or null
  const [isTerminalVisible, setTerminalVisible] = useState(false);

  // File management states
  const [openFiles, setOpenFiles] = useState([]);
  const [activeFile, setActiveFile] = useState(null);
  const [cursorPosition, setCursorPosition] = useState({ line: 1, column: 1 });

  // Layout states
  // These are now managed by the resizable panel library
  // const [terminalHeight, setTerminalHeight] = useState(200);
  // const [explorerWidth, setExplorerWidth] = useState(320);
  // const [aiPanelWidth, setAiPanelWidth] = useState(384);

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

  // View toggle handlers
  const handleViewChange = useCallback((view) => {
    setActiveView(prev => (prev === view ? null : view));
  }, []);

  const toggleTerminal = useCallback(() => {
    setTerminalVisible(prev => !prev);
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
      case 'explorer':
        handleViewChange('explorer');
        break;
      case 'terminal':
        toggleTerminal();
        break;
      case 'ai':
        handleViewChange('ai');
        break;
      default:
        console.log(`View action: ${action}`);
    }
  }, [handleViewChange, toggleTerminal]);

  const handleSettingsClick = useCallback(() => {
    navigate('/project-settings-dashboard');
  }, [navigate]);

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
        <ActivityBar
          activeView={activeView}
          onNavigate={handleViewChange}
          onSettingsClick={handleSettingsClick}
        />
        <PanelGroup direction="horizontal">
          {activeView && (
            <Panel defaultSize={20} minSize={15} maxSize={40}>
              <div className="h-full overflow-y-auto">
                {activeView === 'explorer' && (
                  <FileExplorerPanel
                    onFileSelect={handleFileSelect}
                    activeFile={activeFile}
                    onToggle={() => handleViewChange('explorer')}
                  />
                )}
                {activeView === 'ai' && (
                  <AIAssistantPanel
                    activeFile={activeFile}
                    onToggle={() => handleViewChange('ai')}
                  />
                )}
              </div>
            </Panel>
          )}
          {activeView && <PanelResizeHandle className="w-1 bg-panel-border hover:bg-primary transition-colors" />}
          <Panel>
            <PanelGroup direction="vertical">
              <Panel>
                <div className="h-full flex flex-col">
                  <EditorTabBar
                    openFiles={openFiles}
                    activeFile={activeFile}
                    onFileSelect={setActiveFile}
                    onFileClose={handleFileClose}
                    onTabReorder={handleTabReorder}
                  />
                  <div className="flex-1 overflow-hidden">
                    <MonacoEditorWrapper
                      activeFile={activeFile}
                      onContentChange={handleContentChange}
                      theme="vs-dark"
                    />
                  </div>
                </div>
              </Panel>
              {isTerminalVisible && <PanelResizeHandle className="h-1 bg-panel-border hover:bg-primary transition-colors" />}
              {isTerminalVisible && (
                <Panel defaultSize={25} minSize={10}>
                  <TerminalPanel
                    onToggle={toggleTerminal}
                  />
                </Panel>
              )}
            </PanelGroup>
          </Panel>
        </PanelGroup>
      </div>
      {/* Status Bar */}
      <StatusBar
        activeFile={activeFile}
        cursorPosition={cursorPosition}
        onSettingsClick={handleSettingsClick}
      />
    </div>
  );
};

export default MainIDEInterface;