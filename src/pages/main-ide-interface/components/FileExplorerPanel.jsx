import React, { useState, useCallback } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const FileExplorerPanel = ({ isVisible, onToggle, onFileSelect, activeFile }) => {
  const [expandedFolders, setExpandedFolders] = useState(new Set(['src', 'public']));
  const [contextMenu, setContextMenu] = useState(null);

  // Mock file tree structure
  const fileTree = {
    'src': {
      type: 'folder',
      children: {
        'components': {
          type: 'folder',
          children: {
            'Header.jsx': { type: 'file', language: 'javascript' },
            'Sidebar.jsx': { type: 'file', language: 'javascript' },
            'Button.jsx': { type: 'file', language: 'javascript' }
          }
        },
        'pages': {
          type: 'folder',
          children: {
            'Home.jsx': { type: 'file', language: 'javascript' },
            'About.jsx': { type: 'file', language: 'javascript' }
          }
        },
        'utils': {
          type: 'folder',
          children: {
            'helpers.js': { type: 'file', language: 'javascript' },
            'constants.js': { type: 'file', language: 'javascript' }
          }
        },
        'App.jsx': { type: 'file', language: 'javascript' },
        'main.jsx': { type: 'file', language: 'javascript' }
      }
    },
    'public': {
      type: 'folder',
      children: {
        'index.html': { type: 'file', language: 'html' },
        'favicon.ico': { type: 'file', language: 'image' },
        'manifest.json': { type: 'file', language: 'json' }
      }
    },
    'package.json': { type: 'file', language: 'json' },
    'vite.config.js': { type: 'file', language: 'javascript' },
    'README.md': { type: 'file', language: 'markdown' }
  };

  const getFileIcon = (fileName, type, language) => {
    if (type === 'folder') return 'Folder';
    
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

  const toggleFolder = useCallback((path) => {
    setExpandedFolders(prev => {
      const newSet = new Set(prev);
      if (newSet?.has(path)) {
        newSet?.delete(path);
      } else {
        newSet?.add(path);
      }
      return newSet;
    });
  }, []);

  const handleFileClick = useCallback((filePath, fileName, language) => {
    if (onFileSelect) {
      onFileSelect({
        path: filePath,
        name: fileName,
        language: language || 'javascript',
        content: `// ${fileName}\n// This is a sample file content\n\nfunction example() {\n  console.log('Hello from ${fileName}');\n}\n\nexport default example;`
      });
    }
  }, [onFileSelect]);

  const handleContextMenu = useCallback((e, path, type) => {
    e?.preventDefault();
    setContextMenu({
      x: e?.clientX,
      y: e?.clientY,
      path,
      type
    });
  }, []);

  const closeContextMenu = useCallback(() => {
    setContextMenu(null);
  }, []);

  const renderFileTree = (tree, basePath = '') => {
    return Object.entries(tree)?.map(([name, item]) => {
      const fullPath = basePath ? `${basePath}/${name}` : name;
      const isExpanded = expandedFolders?.has(fullPath);
      const isActive = activeFile?.path === fullPath;

      if (item?.type === 'folder') {
        return (
          <div key={fullPath} className="select-none">
            <div
              className={`flex items-center px-2 py-1 hover:bg-hover cursor-pointer group ${
                isActive ? 'bg-active text-primary' : ''
              }`}
              onClick={() => toggleFolder(fullPath)}
              onContextMenu={(e) => handleContextMenu(e, fullPath, 'folder')}
            >
              <Icon 
                name={isExpanded ? 'ChevronDown' : 'ChevronRight'} 
                size={14} 
                className="mr-1 text-muted-foreground" 
              />
              <Icon 
                name={isExpanded ? 'FolderOpen' : 'Folder'} 
                size={16} 
                className="mr-2 text-accent" 
              />
              <span className="text-sm text-foreground">{name}</span>
            </div>
            {isExpanded && item?.children && (
              <div className="ml-4 border-l border-panel-border">
                {renderFileTree(item?.children, fullPath)}
              </div>
            )}
          </div>
        );
      } else {
        return (
          <div
            key={fullPath}
            className={`flex items-center px-2 py-1 ml-4 hover:bg-hover cursor-pointer group ${
              isActive ? 'bg-active text-primary' : ''
            }`}
            onClick={() => handleFileClick(fullPath, name, item?.language)}
            onContextMenu={(e) => handleContextMenu(e, fullPath, 'file')}
          >
            <Icon 
              name={getFileIcon(name, item?.type, item?.language)} 
              size={16} 
              className="mr-2 text-muted-foreground" 
            />
            <span className="text-sm text-foreground">{name}</span>
          </div>
        );
      }
    });
  };

  if (!isVisible) return null;

  return (
    <>
      <div className="w-80 bg-panel border-r border-panel-border flex flex-col h-full">
        {/* Explorer Header */}
        <div className="flex items-center justify-between p-3 border-b border-panel-border">
          <div className="flex items-center space-x-2">
            <Icon name="FolderOpen" size={16} className="text-primary" />
            <span className="text-sm font-medium text-foreground">Explorer</span>
          </div>
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="xs"
              className="h-6 w-6 p-0"
              onClick={() => {/* Handle new file */}}
            >
              <Icon name="FilePlus" size={12} />
            </Button>
            <Button
              variant="ghost"
              size="xs"
              className="h-6 w-6 p-0"
              onClick={() => {/* Handle new folder */}}
            >
              <Icon name="FolderPlus" size={12} />
            </Button>
            <Button
              variant="ghost"
              size="xs"
              className="h-6 w-6 p-0"
              onClick={() => {/* Handle refresh */}}
            >
              <Icon name="RefreshCw" size={12} />
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

        {/* File Tree */}
        <div className="flex-1 overflow-auto p-2">
          <div className="space-y-1">
            {renderFileTree(fileTree)}
          </div>
        </div>

        {/* Explorer Footer */}
        <div className="p-2 border-t border-panel-border">
          <div className="text-xs text-muted-foreground">
            Project: CodeStudio IDE
          </div>
        </div>
      </div>
      {/* Context Menu */}
      {contextMenu && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={closeContextMenu}
          />
          <div 
            className="fixed z-50 bg-popover border border-panel-border rounded-md shadow-floating py-1 min-w-32"
            style={{ 
              left: contextMenu?.x, 
              top: contextMenu?.y 
            }}
          >
            {contextMenu?.type === 'folder' ? (
              <>
                <button className="w-full px-3 py-1.5 text-left text-sm hover:bg-hover flex items-center">
                  <Icon name="FilePlus" size={14} className="mr-2" />
                  New File
                </button>
                <button className="w-full px-3 py-1.5 text-left text-sm hover:bg-hover flex items-center">
                  <Icon name="FolderPlus" size={14} className="mr-2" />
                  New Folder
                </button>
                <div className="border-t border-panel-border my-1" />
                <button className="w-full px-3 py-1.5 text-left text-sm hover:bg-hover flex items-center text-destructive">
                  <Icon name="Trash2" size={14} className="mr-2" />
                  Delete
                </button>
              </>
            ) : (
              <>
                <button className="w-full px-3 py-1.5 text-left text-sm hover:bg-hover flex items-center">
                  <Icon name="Eye" size={14} className="mr-2" />
                  Open
                </button>
                <button className="w-full px-3 py-1.5 text-left text-sm hover:bg-hover flex items-center">
                  <Icon name="Edit" size={14} className="mr-2" />
                  Rename
                </button>
                <button className="w-full px-3 py-1.5 text-left text-sm hover:bg-hover flex items-center">
                  <Icon name="Copy" size={14} className="mr-2" />
                  Copy Path
                </button>
                <div className="border-t border-panel-border my-1" />
                <button className="w-full px-3 py-1.5 text-left text-sm hover:bg-hover flex items-center text-destructive">
                  <Icon name="Trash2" size={14} className="mr-2" />
                  Delete
                </button>
              </>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default FileExplorerPanel;