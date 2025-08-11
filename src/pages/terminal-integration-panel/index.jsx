import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import TerminalTab from './components/TerminalTab';
import TerminalHeader from './components/TerminalHeader';
import TerminalEmulator from './components/TerminalEmulator';
import TerminalSettings from './components/TerminalSettings';
import TerminalStatusBar from './components/TerminalStatusBar';
import TerminalResizeHandle from './components/TerminalResizeHandle';

const TerminalIntegrationPanel = () => {
  const [terminals, setTerminals] = useState([
    {
      id: 'terminal-1',
      name: 'bash',
      type: 'bash',
      hasActivity: false,
      history: [],
      workingDirectory: '/workspace'
    }
  ]);
  
  const [activeTerminalId, setActiveTerminalId] = useState('terminal-1');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [panelHeight, setPanelHeight] = useState(300);
  const [lastCommand, setLastCommand] = useState('');
  const [executionTime, setExecutionTime] = useState(null);
  
  const [terminalSettings, setTerminalSettings] = useState({
    fontSize: 14,
    fontFamily: 'JetBrains Mono',
    theme: 'dark',
    cursorStyle: 'block',
    scrollback: 1000,
    bellSound: false,
    copyOnSelect: false,
    rightClickPaste: true
  });

  // Load settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('codestudio-terminal-settings');
    if (savedSettings) {
      try {
        setTerminalSettings(JSON.parse(savedSettings));
      } catch (error) {
        console.warn('Failed to load terminal settings:', error);
      }
    }

    const savedHeight = localStorage.getItem('codestudio-terminal-height');
    if (savedHeight) {
      setPanelHeight(parseInt(savedHeight));
    }
  }, []);

  // Save settings to localStorage
  const handleSettingsChange = useCallback((newSettings) => {
    setTerminalSettings(newSettings);
    localStorage.setItem('codestudio-terminal-settings', JSON.stringify(newSettings));
  }, []);

  // Handle panel height changes
  const handleResize = useCallback((newHeight) => {
    setPanelHeight(newHeight);
    localStorage.setItem('codestudio-terminal-height', newHeight?.toString());
  }, []);

  // Create new terminal tab
  const handleNewTab = useCallback((type = 'bash') => {
    const newId = `terminal-${Date.now()}`;
    const typeNames = {
      bash: 'bash',
      powershell: 'PowerShell',
      node: 'Node.js',
      python: 'Python'
    };
    
    const newTerminal = {
      id: newId,
      name: typeNames?.[type] || type,
      type,
      hasActivity: false,
      history: [],
      workingDirectory: '/workspace'
    };
    
    setTerminals(prev => [...prev, newTerminal]);
    setActiveTerminalId(newId);
  }, []);

  // Close terminal tab
  const handleCloseTab = useCallback((terminalId) => {
    setTerminals(prev => {
      const filtered = prev?.filter(t => t?.id !== terminalId);
      if (filtered?.length === 0) {
        // Create a new default terminal if all are closed
        const defaultTerminal = {
          id: 'terminal-default',
          name: 'bash',
          type: 'bash',
          hasActivity: false,
          history: [],
          workingDirectory: '/workspace'
        };
        setActiveTerminalId('terminal-default');
        return [defaultTerminal];
      }
      
      // Switch to first available terminal if active one is closed
      if (terminalId === activeTerminalId) {
        setActiveTerminalId(filtered?.[0]?.id);
      }
      
      return filtered;
    });
  }, [activeTerminalId]);

  // Rename terminal tab
  const handleRenameTab = useCallback((terminalId, newName) => {
    setTerminals(prev => prev?.map(t => 
      t?.id === terminalId ? { ...t, name: newName } : t
    ));
  }, []);

  // Handle command execution
  const handleCommand = useCallback((command, output) => {
    const startTime = Date.now();
    
    if (command === 'clear') {
      setTerminals(prev => prev?.map(t => 
        t?.id === activeTerminalId 
          ? { ...t, history: [] }
          : t
      ));
      return;
    }

    setTerminals(prev => prev?.map(t => 
      t?.id === activeTerminalId 
        ? { 
            ...t, 
            history: [...t?.history, { command, output, timestamp: startTime }],
            hasActivity: t?.id !== activeTerminalId
          }
        : t
    ));
    
    setLastCommand(command);
    setExecutionTime(Date.now() - startTime);
  }, [activeTerminalId]);

  // Handle terminal output
  const handleOutput = useCallback((output) => {
    // Additional output handling if needed
  }, []);

  // Clear active terminal
  const handleClear = useCallback(() => {
    setTerminals(prev => prev?.map(t => 
      t?.id === activeTerminalId 
        ? { ...t, history: [] }
        : t
    ));
  }, [activeTerminalId]);

  // Toggle panel collapse
  const handleTogglePanel = useCallback(() => {
    setIsCollapsed(prev => !prev);
  }, []);

  const activeTerminal = terminals?.find(t => t?.id === activeTerminalId);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation Header */}
      <div className="bg-surface border-b border-panel-border p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
                <Icon name="Terminal" size={16} color="white" />
              </div>
              <h1 className="text-xl font-semibold text-foreground">Terminal Integration Panel</h1>
            </div>
          </div>
          
          <nav className="flex items-center space-x-2">
            <Link to="/main-ide-interface">
              <Button variant="ghost" size="sm">
                <Icon name="Layout" size={16} className="mr-2" />
                Main IDE
              </Button>
            </Link>
            <Link to="/file-explorer-panel">
              <Button variant="ghost" size="sm">
                <Icon name="FolderOpen" size={16} className="mr-2" />
                Explorer
              </Button>
            </Link>
            <Link to="/code-editor-workspace">
              <Button variant="ghost" size="sm">
                <Icon name="FileText" size={16} className="mr-2" />
                Editor
              </Button>
            </Link>
            <Link to="/ai-assistant-sidebar">
              <Button variant="ghost" size="sm">
                <Icon name="Bot" size={16} className="mr-2" />
                AI Assistant
              </Button>
            </Link>
            <Link to="/project-settings-dashboard">
              <Button variant="ghost" size="sm">
                <Icon name="Settings" size={16} className="mr-2" />
                Settings
              </Button>
            </Link>
          </nav>
        </div>
      </div>
      {/* Main Terminal Interface */}
      <div className="flex flex-col h-screen">
        {/* Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Demo Info */}
          <div className="bg-panel border-b border-panel-border p-4">
            <div className="max-w-4xl">
              <h2 className="text-lg font-semibold text-foreground mb-2">
                Browser-Based Terminal Environment
              </h2>
              <p className="text-muted-foreground text-sm mb-4">
                Full-featured terminal emulator with command execution, file system operations, 
                and development tool integration. Supports multiple terminal sessions with 
                customizable themes and settings.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Icon name="Zap" size={16} className="text-success" />
                  <span className="text-foreground">Real-time command execution</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Icon name="Layers" size={16} className="text-primary" />
                  <span className="text-foreground">Multiple terminal sessions</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Icon name="Palette" size={16} className="text-accent" />
                  <span className="text-foreground">Customizable themes</span>
                </div>
              </div>
            </div>
          </div>

          {/* Terminal Panel */}
          <div className="flex-1 flex flex-col">
            {/* Resize Handle */}
            <TerminalResizeHandle
              onResize={handleResize}
              initialHeight={panelHeight}
              minHeight={150}
              maxHeight={600}
            />

            {/* Terminal Container */}
            <div 
              className="bg-surface border border-panel-border rounded-lg mx-4 mb-4 flex flex-col overflow-hidden"
              style={{ height: isCollapsed ? 'auto' : `${panelHeight}px` }}
            >
              {/* Terminal Header */}
              <TerminalHeader
                onNewTab={handleNewTab}
                onClear={handleClear}
                onSettings={() => setIsSettingsOpen(true)}
                onTogglePanel={handleTogglePanel}
                isCollapsed={isCollapsed}
              />

              {!isCollapsed && (
                <>
                  {/* Terminal Tabs */}
                  <div className="flex bg-panel border-b border-panel-border overflow-x-auto">
                    {terminals?.map(terminal => (
                      <TerminalTab
                        key={terminal?.id}
                        tab={terminal}
                        isActive={terminal?.id === activeTerminalId}
                        onSelect={setActiveTerminalId}
                        onClose={handleCloseTab}
                        onRename={handleRenameTab}
                      />
                    ))}
                  </div>

                  {/* Terminal Content */}
                  <div className="flex-1 relative">
                    {terminals?.map(terminal => (
                      <TerminalEmulator
                        key={terminal?.id}
                        terminalId={terminal?.id}
                        isActive={terminal?.id === activeTerminalId}
                        onCommand={handleCommand}
                        onOutput={handleOutput}
                        theme={terminalSettings?.theme}
                      />
                    ))}
                  </div>

                  {/* Terminal Status Bar */}
                  <TerminalStatusBar
                    activeTab={activeTerminal}
                    isConnected={true}
                    workingDirectory={activeTerminal?.workingDirectory}
                    lastCommand={lastCommand}
                    executionTime={executionTime}
                  />
                </>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-panel border-t border-panel-border p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-sm text-muted-foreground">
                Quick Actions:
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleNewTab('node')}
                >
                  <Icon name="Code" size={14} className="mr-1" />
                  Node.js
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleNewTab('python')}
                >
                  <Icon name="FileCode" size={14} className="mr-1" />
                  Python
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClear}
                >
                  <Icon name="Trash2" size={14} className="mr-1" />
                  Clear
                </Button>
              </div>
            </div>
            
            <div className="text-xs text-muted-foreground">
              Press Ctrl+` to toggle terminal • Tab for autocomplete • ↑↓ for history
            </div>
          </div>
        </div>
      </div>
      {/* Terminal Settings Modal */}
      <TerminalSettings
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={terminalSettings}
        onSettingsChange={handleSettingsChange}
      />
    </div>
  );
};

export default TerminalIntegrationPanel;