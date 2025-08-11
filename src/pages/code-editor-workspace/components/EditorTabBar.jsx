import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const EditorTabBar = ({ 
  openFiles = [], 
  activeFile = null, 
  onTabClick, 
  onTabClose, 
  onNewFile 
}) => {
  const handleTabClick = (file) => {
    if (onTabClick) {
      onTabClick(file);
    }
  };

  const handleTabClose = (e, file) => {
    e?.stopPropagation();
    if (onTabClose) {
      onTabClose(file);
    }
  };

  const handleNewFile = () => {
    if (onNewFile) {
      onNewFile();
    }
  };

  const getFileIcon = (fileName) => {
    const extension = fileName?.split('.')?.pop()?.toLowerCase();
    switch (extension) {
      case 'js': case'jsx':
        return 'FileText';
      case 'ts': case'tsx':
        return 'FileCode';
      case 'html':
        return 'Globe';
      case 'css': case'scss':
        return 'Palette';
      case 'json':
        return 'Braces';
      case 'md':
        return 'FileText';
      case 'py':
        return 'Code';
      default:
        return 'File';
    }
  };

  return (
    <div className="flex items-center bg-surface border-b border-panel-border h-10 overflow-x-auto">
      {/* Tab List */}
      <div className="flex items-center flex-1 min-w-0">
        {openFiles?.map((file) => (
          <div
            key={file?.path}
            onClick={() => handleTabClick(file)}
            className={`flex items-center px-3 py-2 border-r border-panel-border cursor-pointer transition-colors min-w-0 max-w-48 group ${
              activeFile?.path === file?.path
                ? 'bg-background text-foreground border-b-2 border-primary'
                : 'bg-surface text-muted-foreground hover:bg-hover hover:text-foreground'
            }`}
          >
            <Icon 
              name={getFileIcon(file?.name)} 
              size={14} 
              className="mr-2 flex-shrink-0" 
            />
            <span className="text-sm truncate flex-1 min-w-0">
              {file?.name}
            </span>
            {file?.hasUnsavedChanges && (
              <div className="w-2 h-2 bg-warning rounded-full ml-2 flex-shrink-0" />
            )}
            <Button
              variant="ghost"
              size="xs"
              onClick={(e) => handleTabClose(e, file)}
              className="ml-1 p-0 w-4 h-4 opacity-0 group-hover:opacity-100 hover:bg-hover-strong flex-shrink-0"
            >
              <Icon name="X" size={12} />
            </Button>
          </div>
        ))}
      </div>
      {/* New File Button */}
      <div className="flex items-center px-2 border-l border-panel-border">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleNewFile}
          className="h-8 w-8 p-0 hover:bg-hover"
        >
          <Icon name="Plus" size={14} />
        </Button>
      </div>
    </div>
  );
};

export default EditorTabBar;