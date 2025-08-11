import React, { useState, useRef, useEffect, useCallback } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const TerminalPanel = ({ isVisible, onToggle, height = 200 }) => {
  const [terminalHistory, setTerminalHistory] = useState([]);
  const [currentCommand, setCurrentCommand] = useState('');
  const [workingDirectory, setWorkingDirectory] = useState('/project');
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const terminalRef = useRef(null);
  const inputRef = useRef(null);

  // Mock file system
  const mockFileSystem = {
    '/project': {
      'src': {
        'components': ['Header.jsx', 'Sidebar.jsx', 'Button.jsx'],
        'pages': ['Home.jsx', 'About.jsx'],
        'utils': ['helpers.js', 'constants.js']
      },
      'public': ['index.html', 'favicon.ico', 'manifest.json'],
      'package.json': null,
      'vite.config.js': null,
      'README.md': null
    }
  };

  const scrollToBottom = useCallback(() => {
    if (terminalRef?.current) {
      terminalRef.current.scrollTop = terminalRef?.current?.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [terminalHistory, scrollToBottom]);

  useEffect(() => {
    if (isVisible && inputRef?.current) {
      inputRef?.current?.focus();
    }
  }, [isVisible]);

  const addToHistory = useCallback((command, output, type = 'success') => {
    const entry = {
      id: Date.now(),
      command,
      output,
      type,
      timestamp: new Date(),
      directory: workingDirectory
    };
    
    setTerminalHistory(prev => [...prev, entry]);
  }, [workingDirectory]);

  const executeCommand = useCallback((command) => {
    const cmd = command?.trim();
    if (!cmd) return;

    // Add to command history
    setCommandHistory(prev => {
      const newHistory = [cmd, ...prev?.filter(c => c !== cmd)]?.slice(0, 50);
      return newHistory;
    });
    setHistoryIndex(-1);

    // Parse command
    const parts = cmd?.split(' ');
    const baseCommand = parts?.[0];
    const args = parts?.slice(1);

    let output = '';
    let type = 'success';

    switch (baseCommand) {
      case 'ls': case'dir':
        const currentDir = mockFileSystem?.[workingDirectory];
        if (currentDir) {
          const items = Object.keys(currentDir)?.map(item => {
            const isDir = typeof currentDir?.[item] === 'object';
            return isDir ? `📁 ${item}/` : `📄 ${item}`;
          });
          output = items?.join('\n') || 'Directory is empty';
        } else {
          output = 'Directory not found';
          type = 'error';
        }
        break;

      case 'cd':
        if (args?.length === 0) {
          setWorkingDirectory('/project');
          output = 'Changed to /project';
        } else {
          const targetDir = args?.[0];
          if (targetDir === '..') {
            const parentDir = workingDirectory?.split('/')?.slice(0, -1)?.join('/') || '/';
            setWorkingDirectory(parentDir);
            output = `Changed to ${parentDir}`;
          } else {
            const newPath = workingDirectory === '/' ? `/${targetDir}` : `${workingDirectory}/${targetDir}`;
            if (mockFileSystem?.[newPath]) {
              setWorkingDirectory(newPath);
              output = `Changed to ${newPath}`;
            } else {
              output = `Directory not found: ${targetDir}`;
              type = 'error';
            }
          }
        }
        break;

      case 'pwd':
        output = workingDirectory;
        break;

      case 'clear':
        setTerminalHistory([]);
        return;

      case 'help':
        output = `Available commands:
ls, dir     - List directory contents
cd <dir>    - Change directory
pwd         - Print working directory
clear       - Clear terminal
help        - Show this help
npm <cmd>   - Run npm commands
git <cmd>   - Run git commands
echo <text> - Print text`;
        break;

      case 'npm':
        if (args?.[0] === 'install' || args?.[0] === 'i') {
          output = `Installing dependencies...\n✓ Dependencies installed successfully`;
        } else if (args?.[0] === 'run') {
          const script = args?.[1] || 'dev';
          output = `Running script: ${script}\n🚀 Development server started on http://localhost:5173`;
        } else if (args?.[0] === 'build') {
          output = `Building for production...\n✓ Build completed successfully`;
        } else {
          output = `npm ${args?.join(' ')}\nCommand executed`;
        }
        break;

      case 'git':
        if (args?.[0] === 'status') {
          output = `On branch main\nYour branch is up to date with 'origin/main'.\n\nnothing to commit, working tree clean`;
        } else if (args?.[0] === 'add') {
          output = `Added files to staging area`;
        } else if (args?.[0] === 'commit') {
          output = `[main ${Math.random()?.toString(36)?.substr(2, 7)}] ${args?.slice(2)?.join(' ')}\n 1 file changed, 5 insertions(+)`;
        } else {
          output = `git ${args?.join(' ')}\nCommand executed`;
        }
        break;

      case 'echo':
        output = args?.join(' ');
        break;

      default:
        output = `Command not found: ${baseCommand}\nType 'help' for available commands`;
        type = 'error';
    }

    addToHistory(cmd, output, type);
  }, [workingDirectory, addToHistory]);

  const handleKeyDown = useCallback((e) => {
    if (e?.key === 'Enter') {
      e?.preventDefault();
      executeCommand(currentCommand);
      setCurrentCommand('');
    } else if (e?.key === 'ArrowUp') {
      e?.preventDefault();
      if (commandHistory?.length > 0) {
        const newIndex = Math.min(historyIndex + 1, commandHistory?.length - 1);
        setHistoryIndex(newIndex);
        setCurrentCommand(commandHistory?.[newIndex] || '');
      }
    } else if (e?.key === 'ArrowDown') {
      e?.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setCurrentCommand(commandHistory?.[newIndex] || '');
      } else {
        setHistoryIndex(-1);
        setCurrentCommand('');
      }
    } else if (e?.key === 'Tab') {
      e?.preventDefault();
      // Simple tab completion for common commands
      const commands = ['ls', 'cd', 'pwd', 'clear', 'help', 'npm', 'git', 'echo'];
      const matches = commands?.filter(cmd => cmd?.startsWith(currentCommand));
      if (matches?.length === 1) {
        setCurrentCommand(matches?.[0] + ' ');
      }
    }
  }, [currentCommand, commandHistory, historyIndex, executeCommand]);

  if (!isVisible) return null;

  return (
    <div 
      className="bg-background border-t border-panel-border flex flex-col"
      style={{ height: `${height}px` }}
    >
      {/* Terminal Header */}
      <div className="flex items-center justify-between px-3 py-2 bg-surface border-b border-panel-border">
        <div className="flex items-center space-x-2">
          <Icon name="Terminal" size={16} className="text-primary" />
          <span className="text-sm font-medium text-foreground">Terminal</span>
          <span className="text-xs text-muted-foreground">bash</span>
        </div>
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="xs"
            className="h-6 w-6 p-0"
            onClick={() => setTerminalHistory([])}
          >
            <Icon name="Trash2" size={12} />
          </Button>
          <Button
            variant="ghost"
            size="xs"
            className="h-6 w-6 p-0"
            onClick={() => {/* Handle split terminal */}}
          >
            <Icon name="SplitSquareHorizontal" size={12} />
          </Button>
          <Button
            variant="ghost"
            size="xs"
            className="h-6 w-6 p-0"
            onClick={onToggle}
          >
            <Icon name="X" size={12} />
          </Button>
        </div>
      </div>
      {/* Terminal Content */}
      <div 
        ref={terminalRef}
        className="flex-1 overflow-auto p-3 font-mono text-sm bg-background"
      >
        {/* Welcome Message */}
        {terminalHistory?.length === 0 && (
          <div className="text-muted-foreground mb-4">
            <div>CodeStudio IDE Terminal</div>
            <div>Type 'help' for available commands</div>
            <div className="mt-2" />
          </div>
        )}

        {/* Command History */}
        {terminalHistory?.map((entry) => (
          <div key={entry?.id} className="mb-2">
            <div className="flex items-center text-primary">
              <span className="text-success">user@codestudio</span>
              <span className="text-muted-foreground">:</span>
              <span className="text-accent">{entry?.directory}</span>
              <span className="text-muted-foreground">$ </span>
              <span className="text-foreground">{entry?.command}</span>
            </div>
            {entry?.output && (
              <div className={`mt-1 whitespace-pre-wrap ${
                entry?.type === 'error' ? 'text-destructive' : 'text-foreground'
              }`}>
                {entry?.output}
              </div>
            )}
          </div>
        ))}

        {/* Current Command Line */}
        <div className="flex items-center">
          <span className="text-success">user@codestudio</span>
          <span className="text-muted-foreground">:</span>
          <span className="text-accent">{workingDirectory}</span>
          <span className="text-muted-foreground">$ </span>
          <input
            ref={inputRef}
            type="text"
            value={currentCommand}
            onChange={(e) => setCurrentCommand(e?.target?.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent text-foreground outline-none border-none"
            placeholder=""
            autoComplete="off"
            spellCheck="false"
          />
        </div>
      </div>
      {/* Terminal Footer */}
      <div className="flex items-center justify-between px-3 py-1 bg-surface border-t border-panel-border text-xs">
        <div className="flex items-center space-x-4 text-muted-foreground">
          <span>bash 5.1.16</span>
          <span>{workingDirectory}</span>
        </div>
        <div className="flex items-center space-x-2 text-muted-foreground">
          <span>↑↓ History</span>
          <span>Tab Complete</span>
          <span>Ctrl+C Cancel</span>
        </div>
      </div>
    </div>
  );
};

export default TerminalPanel;