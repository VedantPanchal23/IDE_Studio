import React, { useEffect, useRef, useState } from 'react';


const TerminalEmulator = ({ 
  terminalId, 
  isActive, 
  onCommand, 
  onOutput,
  theme = 'dark'
}) => {
  const terminalRef = useRef(null);
  const [history, setHistory] = useState([]);
  const [currentCommand, setCurrentCommand] = useState('');
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [workingDirectory, setWorkingDirectory] = useState('/workspace');

  // Mock file system for demonstration
  const mockFileSystem = {
    '/workspace': {
      'package.json': `{
  "name": "codestudio-project",
  "version": "1.0.0",
  "scripts": {
    "dev": "vite",
    "build": "vite build"
  }
}`,
      'src': {
        'App.jsx': 'import React from "react";\n\nfunction App() {\n  return <div>Hello World</div>;\n}\n\nexport default App;',
        'index.js': 'import React from "react";\nimport ReactDOM from "react-dom";\nimport App from "../../../App";\n\nReactDOM.render(<App />, document.getElementById("root"));'
      },
      'README.md': '# CodeStudio Project\n\nA modern web-based IDE built with React and Vite.'
    }
  };

  const executeCommand = (command) => {
    const trimmedCommand = command?.trim();
    if (!trimmedCommand) return;

    // Add to history
    const newHistory = [...history, { command: trimmedCommand, timestamp: Date.now() }];
    setHistory(newHistory);
    setHistoryIndex(-1);

    // Mock command execution
    let output = '';
    const parts = trimmedCommand?.split(' ');
    const cmd = parts?.[0];
    const args = parts?.slice(1);

    switch (cmd) {
      case 'ls': 
      case 'dir':
        output = mockListDirectory(workingDirectory);
        break;
      case 'cd':
        output = mockChangeDirectory(args?.[0] || '/workspace');
        break;
      case 'pwd':
        output = workingDirectory;
        break;
      case 'cat': 
      case 'type':
        output = mockReadFile(args?.[0]);
        break;
      case 'mkdir':
        output = `Directory '${args?.[0]}' created`;
        break;
      case 'touch':
        output = `File '${args?.[0]}' created`;
        break;
      case 'rm':
        output = `Removed '${args?.[0]}'`;
        break;
      case 'npm':
        output = mockNpmCommand(args);
        break;
      case 'node':
        if (args?.[0]) {
          output = mockNodeExecution(args?.[0]);
        } else {
          output = 'Node.js REPL - Type .exit to quit';
        }
        break;
      case 'python': case'python3':
        if (args?.[0]) {
          output = mockPythonExecution(args?.[0]);
        } else {
          output = 'Python 3.9.0 - Type exit() to quit';
        }
        break;
      case 'clear':
        // Handle clear in parent component
        onCommand(trimmedCommand, '');
        return;
      case 'help':
        output = `Available commands:
  ls, dir     - List directory contents
  cd          - Change directory
  pwd         - Print working directory
  cat, type   - Display file contents
  mkdir       - Create directory
  touch       - Create file
  rm          - Remove file/directory
  npm         - Node package manager
  node        - Execute JavaScript
  python      - Execute Python
  clear       - Clear terminal
  help        - Show this help`;
        break;
      default:
        output = `Command not found: ${cmd}. Type 'help' for available commands.`;
    }

    onCommand(trimmedCommand, output);
    onOutput(output);
  };

  const mockListDirectory = (path) => {
    // Simplified directory listing
    return `package.json  src/  README.md`;
  };

  const mockChangeDirectory = (path) => {
    if (path === '..' && workingDirectory !== '/workspace') {
      const newPath = workingDirectory?.split('/')?.slice(0, -1)?.join('/') || '/workspace';
      setWorkingDirectory(newPath);
      return '';
    } else if (path && path !== '.') {
      const newPath = path?.startsWith('/') ? path : `${workingDirectory}/${path}`;
      setWorkingDirectory(newPath);
      return '';
    }
    return '';
  };

  const mockReadFile = (filename) => {
    if (filename === 'package.json') {
      return mockFileSystem?.['/workspace']?.['package.json'];
    } else if (filename === 'README.md') {
      return mockFileSystem?.['/workspace']?.['README.md'];
    }
    return `cat: ${filename}: No such file or directory`;
  };

  const mockNpmCommand = (args) => {
    const subcommand = args?.[0];
    switch (subcommand) {
      case 'install': 
      case 'i':
        return `Installing packages...\n✓ Packages installed successfully`;
      case 'start':
        return `Starting development server...\n> Local: http://localhost:3000`;
      case 'build':
        return `Building for production...\n✓ Build completed successfully`;
      case 'test':
        return `Running tests...\n✓ All tests passed`;
      default:
        return `npm ${subcommand} - command executed`;
    }
  };

  const mockNodeExecution = (filename) => {
    if (filename?.endsWith('.js')) {
      return `Executing ${filename}...\nHello World\n✓ Execution completed`;
    }
    return `node: ${filename}: No such file or directory`;
  };

  const mockPythonExecution = (filename) => {
    if (filename?.endsWith('.py')) {
      return `Executing ${filename}...\nHello, World!\n✓ Execution completed`;
    }
    return `python: can't open file '${filename}': [Errno 2] No such file or directory`;
  };

  const handleKeyDown = (e) => {
    if (e?.key === 'Enter') {
      executeCommand(currentCommand);
      setCurrentCommand('');
    } else if (e?.key === 'ArrowUp') {
      e?.preventDefault();
      if (history?.length > 0) {
        const newIndex = historyIndex === -1 ? history?.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setCurrentCommand(history?.[newIndex]?.command);
      }
    } else if (e?.key === 'ArrowDown') {
      e?.preventDefault();
      if (historyIndex !== -1) {
        const newIndex = historyIndex + 1;
        if (newIndex >= history?.length) {
          setHistoryIndex(-1);
          setCurrentCommand('');
        } else {
          setHistoryIndex(newIndex);
          setCurrentCommand(history?.[newIndex]?.command);
        }
      }
    } else if (e?.key === 'Tab') {
      e?.preventDefault();
      // Mock tab completion
      const completions = ['package.json', 'src/', 'README.md', 'npm', 'node', 'python'];
      const matches = completions?.filter(comp => comp?.startsWith(currentCommand));
      if (matches?.length === 1) {
        setCurrentCommand(matches?.[0]);
      }
    }
  };

  useEffect(() => {
    if (isActive && terminalRef?.current) {
      terminalRef?.current?.focus();
    }
  }, [isActive]);

  return (
    <div 
      className={`h-full bg-background text-foreground font-mono text-sm overflow-hidden ${
        !isActive ? 'hidden' : ''
      }`}
    >
      <div className="h-full flex flex-col">
        {/* Terminal Output */}
        <div className="flex-1 overflow-auto p-4 space-y-1">
          <div className="text-muted-foreground text-xs mb-2">
            CodeStudio Terminal - Type 'help' for available commands
          </div>
          
          {history?.map((entry, index) => (
            <div key={index} className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="text-success">user@codestudio</span>
                <span className="text-muted-foreground">:</span>
                <span className="text-primary">{workingDirectory}</span>
                <span className="text-muted-foreground">$</span>
                <span className="text-foreground">{entry?.command}</span>
              </div>
              {entry?.output && (
                <div className="text-muted-foreground whitespace-pre-wrap pl-4">
                  {entry?.output}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Command Input */}
        <div className="border-t border-panel-border p-4">
          <div className="flex items-center space-x-2">
            <span className="text-success">user@codestudio</span>
            <span className="text-muted-foreground">:</span>
            <span className="text-primary">{workingDirectory}</span>
            <span className="text-muted-foreground">$</span>
            <input
              ref={terminalRef}
              type="text"
              value={currentCommand}
              onChange={(e) => setCurrentCommand(e?.target?.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent border-none outline-none text-foreground"
              placeholder="Type a command..."
              autoComplete="off"
              spellCheck="false"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TerminalEmulator;