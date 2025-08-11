import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const TerminalHeader = ({ 
  onNewTab, 
  onClear, 
  onSettings, 
  onTogglePanel,
  isCollapsed 
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleNewTab = (type = 'bash') => {
    onNewTab(type);
    setIsDropdownOpen(false);
  };

  return (
    <div className="flex items-center justify-between px-4 py-2 bg-panel border-b border-panel-border">
      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onTogglePanel}
          className="p-1"
        >
          <Icon 
            name={isCollapsed ? "ChevronUp" : "ChevronDown"} 
            size={16} 
          />
        </Button>
        
        <h3 className="text-sm font-medium text-foreground">Terminal</h3>
      </div>

      <div className="flex items-center space-x-1">
        <div className="relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="p-1"
          >
            <Icon name="Plus" size={16} />
          </Button>
          
          {isDropdownOpen && (
            <>
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setIsDropdownOpen(false)}
              />
              <div className="absolute top-full right-0 mt-1 w-48 bg-popover border border-panel-border rounded-md shadow-floating z-50 py-1">
                <button
                  onClick={() => handleNewTab('bash')}
                  className="w-full px-3 py-2 text-left text-sm text-foreground hover:bg-hover transition-colors flex items-center"
                >
                  <Icon name="Terminal" size={16} className="mr-2" />
                  New Bash Terminal
                </button>
                <button
                  onClick={() => handleNewTab('powershell')}
                  className="w-full px-3 py-2 text-left text-sm text-foreground hover:bg-hover transition-colors flex items-center"
                >
                  <Icon name="Square" size={16} className="mr-2" />
                  New PowerShell
                </button>
                <button
                  onClick={() => handleNewTab('node')}
                  className="w-full px-3 py-2 text-left text-sm text-foreground hover:bg-hover transition-colors flex items-center"
                >
                  <Icon name="Code" size={16} className="mr-2" />
                  New Node.js REPL
                </button>
                <button
                  onClick={() => handleNewTab('python')}
                  className="w-full px-3 py-2 text-left text-sm text-foreground hover:bg-hover transition-colors flex items-center"
                >
                  <Icon name="FileCode" size={16} className="mr-2" />
                  New Python REPL
                </button>
              </div>
            </>
          )}
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={onClear}
          className="p-1"
          title="Clear Terminal"
        >
          <Icon name="Trash2" size={16} />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={onSettings}
          className="p-1"
          title="Terminal Settings"
        >
          <Icon name="Settings" size={16} />
        </Button>

        <div className="w-px h-4 bg-panel-border mx-1" />

        <Button
          variant="ghost"
          size="sm"
          onClick={() => onTogglePanel()}
          className="p-1"
          title="Toggle Terminal Panel"
        >
          <Icon name="Minimize2" size={16} />
        </Button>
      </div>
    </div>
  );
};

export default TerminalHeader;