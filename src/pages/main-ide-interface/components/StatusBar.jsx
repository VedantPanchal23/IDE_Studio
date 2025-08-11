import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const StatusBar = ({ activeFile, cursorPosition = { line: 1, column: 1 }, onSettingsClick }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [gitBranch] = useState('main');
  const [gitStatus] = useState('clean');

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const getLanguageIcon = (language) => {
    switch (language?.toLowerCase()) {
      case 'javascript': case'jsx': return 'FileText';
      case 'html': return 'Globe';
      case 'css': return 'Palette';
      case 'json': return 'Braces';
      case 'markdown': return 'FileText';
      default: return 'File';
    }
  };

  const getFileSize = (content) => {
    if (!content) return '0 B';
    const bytes = new Blob([content])?.size;
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024)?.toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024))?.toFixed(1)} MB`;
  };

  return (
    <div className="h-6 bg-surface border-t border-panel-border flex items-center justify-between px-2 text-xs">
      {/* Left Section */}
      <div className="flex items-center space-x-4">
        {/* Git Status */}
        <div className="flex items-center space-x-1 text-muted-foreground hover:text-foreground cursor-pointer">
          <Icon name="GitBranch" size={12} />
          <span>{gitBranch}</span>
          {gitStatus === 'clean' ? (
            <Icon name="Check" size={10} className="text-success" />
          ) : (
            <Icon name="AlertCircle" size={10} className="text-warning" />
          )}
        </div>

        {/* Sync Status */}
        <div className="flex items-center space-x-1 text-muted-foreground hover:text-foreground cursor-pointer">
          <Icon name="RefreshCw" size={12} />
          <span>Sync</span>
        </div>

        {/* Problems */}
        <div className="flex items-center space-x-1 text-muted-foreground hover:text-foreground cursor-pointer">
          <Icon name="AlertTriangle" size={12} />
          <span>0</span>
          <Icon name="XCircle" size={12} />
          <span>0</span>
        </div>
      </div>
      {/* Center Section */}
      <div className="flex items-center space-x-4">
        {activeFile && (
          <>
            {/* File Info */}
            <div className="flex items-center space-x-2 text-muted-foreground">
              <Icon name={getLanguageIcon(activeFile?.language)} size={12} />
              <span>{activeFile?.name}</span>
              <span>•</span>
              <span>{getFileSize(activeFile?.content)}</span>
            </div>

            {/* Cursor Position */}
            <div className="text-muted-foreground hover:text-foreground cursor-pointer">
              Ln {cursorPosition?.line}, Col {cursorPosition?.column}
            </div>

            {/* Selection */}
            <div className="text-muted-foreground">
              UTF-8
            </div>

            {/* Language Mode */}
            <Button
              variant="ghost"
              size="xs"
              className="h-4 px-1 text-muted-foreground hover:text-foreground"
              onClick={() => {/* Handle language selection */}}
            >
              {activeFile?.language || 'Plain Text'}
            </Button>
          </>
        )}
      </div>
      {/* Right Section */}
      <div className="flex items-center space-x-4">
        {/* Indentation */}
        <Button
          variant="ghost"
          size="xs"
          className="h-4 px-1 text-muted-foreground hover:text-foreground"
          onClick={() => {/* Handle indentation settings */}}
        >
          Spaces: 2
        </Button>

        {/* End of Line */}
        <Button
          variant="ghost"
          size="xs"
          className="h-4 px-1 text-muted-foreground hover:text-foreground"
          onClick={() => {/* Handle EOL settings */}}
        >
          LF
        </Button>

        {/* Encoding */}
        <Button
          variant="ghost"
          size="xs"
          className="h-4 px-1 text-muted-foreground hover:text-foreground"
          onClick={() => {/* Handle encoding settings */}}
        >
          UTF-8
        </Button>

        {/* Live Share */}
        <div className="flex items-center space-x-1 text-muted-foreground hover:text-foreground cursor-pointer">
          <Icon name="Users" size={12} />
          <span>Live Share</span>
        </div>

        {/* Notifications */}
        <Button
          variant="ghost"
          size="xs"
          className="h-4 w-4 p-0 text-muted-foreground hover:text-foreground"
          onClick={() => {/* Handle notifications */}}
        >
          <Icon name="Bell" size={12} />
        </Button>

        {/* Settings */}
        <Button
          variant="ghost"
          size="xs"
          className="h-4 w-4 p-0 text-muted-foreground hover:text-foreground"
          onClick={onSettingsClick}
        >
          <Icon name="Settings" size={12} />
        </Button>

        {/* Current Time */}
        <div className="text-muted-foreground">
          {currentTime?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
};

export default StatusBar;