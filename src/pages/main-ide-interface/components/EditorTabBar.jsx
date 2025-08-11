import React, { useState, useCallback } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const EditorTabBar = ({ openFiles = [], activeFile, onFileSelect, onFileClose, onTabReorder }) => {
  const [draggedTab, setDraggedTab] = useState(null);
  const [dragOverTab, setDragOverTab] = useState(null);

  const getFileIcon = (fileName) => {
    const ext = fileName?.split('.')?.pop()?.toLowerCase();
    switch (ext) {
      case 'jsx': case'js': return 'FileText';
      case 'html': return 'Globe';
      case 'css': return 'Palette';
      case 'json': return 'Braces';
      case 'md': return 'FileText';
      case 'ico': return 'Image';
      default: return 'File';
    }
  };

  const handleTabClick = useCallback((file) => {
    if (onFileSelect) {
      onFileSelect(file);
    }
  }, [onFileSelect]);

  const handleTabClose = useCallback((e, filePath) => {
    e?.stopPropagation();
    if (onFileClose) {
      onFileClose(filePath);
    }
  }, [onFileClose]);

  const handleDragStart = useCallback((e, file) => {
    setDraggedTab(file);
    e.dataTransfer.effectAllowed = 'move';
  }, []);

  const handleDragOver = useCallback((e, file) => {
    e?.preventDefault();
    if (draggedTab && draggedTab?.path !== file?.path) {
      setDragOverTab(file);
    }
  }, [draggedTab]);

  const handleDragLeave = useCallback(() => {
    setDragOverTab(null);
  }, []);

  const handleDrop = useCallback((e, targetFile) => {
    e?.preventDefault();
    if (draggedTab && draggedTab?.path !== targetFile?.path && onTabReorder) {
      onTabReorder(draggedTab, targetFile);
    }
    setDraggedTab(null);
    setDragOverTab(null);
  }, [draggedTab, onTabReorder]);

  const handleDragEnd = useCallback(() => {
    setDraggedTab(null);
    setDragOverTab(null);
  }, []);

  if (!openFiles?.length) {
    return (
      <div className="h-10 bg-surface border-b border-panel-border flex items-center justify-center">
        <span className="text-sm text-muted-foreground">No files open</span>
      </div>
    );
  }

  return (
    <div className="h-10 bg-surface border-b border-panel-border flex items-center overflow-x-auto">
      <div className="flex items-center min-w-0">
        {openFiles?.map((file, index) => {
          const isActive = activeFile?.path === file?.path;
          const isDragging = draggedTab?.path === file?.path;
          const isDragOver = dragOverTab?.path === file?.path;
          const hasUnsavedChanges = file?.unsaved || false;

          return (
            <div
              key={file?.path}
              className={`group relative flex items-center min-w-0 max-w-48 h-full border-r border-panel-border cursor-pointer transition-colors ${
                isActive 
                  ? 'bg-background text-foreground' 
                  : 'bg-surface text-muted-foreground hover:bg-hover hover:text-foreground'
              } ${isDragging ? 'opacity-50' : ''} ${isDragOver ? 'bg-primary/10' : ''}`}
              onClick={() => handleTabClick(file)}
              draggable
              onDragStart={(e) => handleDragStart(e, file)}
              onDragOver={(e) => handleDragOver(e, file)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, file)}
              onDragEnd={handleDragEnd}
            >
              <div className="flex items-center px-3 py-2 min-w-0 flex-1">
                <Icon 
                  name={getFileIcon(file?.name)} 
                  size={14} 
                  className="mr-2 flex-shrink-0" 
                />
                <span className="text-sm truncate flex-1">
                  {file?.name}
                </span>
                {hasUnsavedChanges && (
                  <div className="w-2 h-2 bg-warning rounded-full ml-2 flex-shrink-0" />
                )}
              </div>
              <Button
                variant="ghost"
                size="xs"
                className="h-6 w-6 p-0 mr-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                onClick={(e) => handleTabClose(e, file?.path)}
              >
                <Icon name="X" size={12} />
              </Button>
              {/* Active tab indicator */}
              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
              )}
            </div>
          );
        })}
      </div>
      {/* Tab actions */}
      <div className="flex items-center ml-auto pr-2">
        <Button
          variant="ghost"
          size="xs"
          className="h-6 w-6 p-0"
          onClick={() => {/* Handle split editor */}}
        >
          <Icon name="SplitSquareHorizontal" size={12} />
        </Button>
        <Button
          variant="ghost"
          size="xs"
          className="h-6 w-6 p-0 ml-1"
          onClick={() => {/* Handle more options */}}
        >
          <Icon name="MoreHorizontal" size={12} />
        </Button>
      </div>
    </div>
  );
};

export default EditorTabBar;