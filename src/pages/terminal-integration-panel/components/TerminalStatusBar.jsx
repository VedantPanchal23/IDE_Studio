import React from 'react';
import Icon from '../../../components/AppIcon';

const TerminalStatusBar = ({ 
  activeTab, 
  isConnected = true, 
  workingDirectory = '/workspace',
  lastCommand,
  executionTime 
}) => {
  const formatExecutionTime = (time) => {
    if (!time) return '';
    return time < 1000 ? `${time}ms` : `${(time / 1000)?.toFixed(2)}s`;
  };

  return (
    <div className="flex items-center justify-between px-4 py-1 bg-panel border-t border-panel-border text-xs">
      {/* Left Section */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${
            isConnected ? 'bg-success' : 'bg-error'
          }`} />
          <span className="text-muted-foreground">
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>

        {activeTab && (
          <div className="flex items-center space-x-2">
            <Icon name="Terminal" size={12} className="text-muted-foreground" />
            <span className="text-foreground">{activeTab?.name}</span>
          </div>
        )}

        <div className="flex items-center space-x-2">
          <Icon name="Folder" size={12} className="text-muted-foreground" />
          <span className="text-foreground font-mono">{workingDirectory}</span>
        </div>
      </div>
      {/* Right Section */}
      <div className="flex items-center space-x-4">
        {lastCommand && (
          <div className="flex items-center space-x-2">
            <Icon name="Clock" size={12} className="text-muted-foreground" />
            <span className="text-muted-foreground">
              Last: <span className="text-foreground font-mono">{lastCommand}</span>
            </span>
            {executionTime && (
              <span className="text-accent">
                ({formatExecutionTime(executionTime)})
              </span>
            )}
          </div>
        )}

        <div className="flex items-center space-x-2">
          <Icon name="Zap" size={12} className="text-muted-foreground" />
          <span className="text-muted-foreground">Ready</span>
        </div>
      </div>
    </div>
  );
};

export default TerminalStatusBar;