import React, { useState, useRef } from 'react';
import Icon from '../../../components/AppIcon';

const FileTreeNode = ({ 
  node, 
  path = '', 
  level = 0, 
  onFileSelect, 
  onFileOpen, 
  onContextMenu,
  selectedFile,
  expandedFolders,
  onToggleFolder,
  onDragStart,
  onDragOver,
  onDrop,
  searchTerm = ''
}) => {
  const [isRenaming, setIsRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState(node?.name);
  const renameInputRef = useRef(null);

  const currentPath = path ? `${path}/${node?.name}` : node?.name;
  const isExpanded = expandedFolders?.includes(currentPath);
  const isSelected = selectedFile === currentPath;
  const isFolder = node?.type === 'directory';

  // File type icons mapping
  const getFileIcon = (fileName, isFolder) => {
    if (isFolder) {
      return isExpanded ? 'FolderOpen' : 'Folder';
    }
    
    const extension = fileName?.split('.')?.pop()?.toLowerCase();
    const iconMap = {
      'js': 'FileText',
      'jsx': 'FileText',
      'ts': 'FileText',
      'tsx': 'FileText',
      'html': 'Globe',
      'css': 'Palette',
      'scss': 'Palette',
      'json': 'Braces',
      'md': 'FileText',
      'py': 'FileText',
      'java': 'Coffee',
      'cpp': 'FileText',
      'c': 'FileText',
      'php': 'FileText',
      'rb': 'FileText',
      'go': 'FileText',
      'rs': 'FileText',
      'vue': 'FileText',
      'xml': 'Code',
      'yml': 'Settings',
      'yaml': 'Settings',
      'png': 'Image',
      'jpg': 'Image',
      'jpeg': 'Image',
      'gif': 'Image',
      'svg': 'Image',
      'ico': 'Image',
      'pdf': 'FileText',
      'txt': 'FileText',
      'log': 'FileText'
    };
    
    return iconMap?.[extension] || 'File';
  };

  const getFileColor = (fileName, isFolder) => {
    if (isFolder) return 'text-blue-400';
    
    const extension = fileName?.split('.')?.pop()?.toLowerCase();
    const colorMap = {
      'js': 'text-yellow-400',
      'jsx': 'text-blue-400',
      'ts': 'text-blue-500',
      'tsx': 'text-blue-500',
      'html': 'text-orange-400',
      'css': 'text-blue-400',
      'scss': 'text-pink-400',
      'json': 'text-yellow-400',
      'md': 'text-gray-300',
      'py': 'text-green-400',
      'java': 'text-red-400',
      'cpp': 'text-blue-400',
      'c': 'text-blue-400',
      'php': 'text-purple-400',
      'rb': 'text-red-400',
      'go': 'text-cyan-400',
      'rs': 'text-orange-400',
      'vue': 'text-green-400',
      'xml': 'text-orange-400',
      'yml': 'text-gray-400',
      'yaml': 'text-gray-400'
    };
    
    return colorMap?.[extension] || 'text-gray-300';
  };

  const handleClick = (e) => {
    e?.stopPropagation();
    
    if (isFolder) {
      onToggleFolder(currentPath);
    } else {
      onFileSelect(currentPath, node);
    }
  };

  const handleDoubleClick = (e) => {
    e?.stopPropagation();
    
    if (!isFolder) {
      onFileOpen(currentPath, node);
    }
  };

  const handleContextMenu = (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    onContextMenu(e, currentPath, node, isFolder);
  };

  const handleRename = () => {
    setIsRenaming(true);
    setTimeout(() => {
      if (renameInputRef?.current) {
        renameInputRef?.current?.focus();
        renameInputRef?.current?.select();
      }
    }, 0);
  };

  const handleRenameSubmit = (e) => {
    e?.preventDefault();
    if (renameValue?.trim() && renameValue !== node?.name) {
      // Handle rename logic here
      console.log(`Rename ${node?.name} to ${renameValue}`);
    }
    setIsRenaming(false);
    setRenameValue(node?.name);
  };

  const handleRenameCancel = () => {
    setIsRenaming(false);
    setRenameValue(node?.name);
  };

  const handleDragStart = (e) => {
    e?.dataTransfer?.setData('text/plain', currentPath);
    onDragStart(currentPath, node);
  };

  const handleDragOver = (e) => {
    if (isFolder) {
      e?.preventDefault();
      onDragOver(currentPath);
    }
  };

  const handleDrop = (e) => {
    if (isFolder) {
      e?.preventDefault();
      const draggedPath = e?.dataTransfer?.getData('text/plain');
      onDrop(draggedPath, currentPath);
    }
  };

  // Highlight search matches
  const highlightMatch = (text, searchTerm) => {
    if (!searchTerm) return text;
    
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    const parts = text?.split(regex);
    
    return parts?.map((part, index) => 
      regex?.test(part) ? (
        <span key={index} className="bg-yellow-400 text-black px-1 rounded">
          {part}
        </span>
      ) : part
    );
  };

  const indentStyle = {
    paddingLeft: `${level * 16 + 8}px`
  };

  return (
    <div>
      <div
        className={`flex items-center py-1 px-2 cursor-pointer hover:bg-hover transition-colors group relative ${
          isSelected ? 'bg-active text-primary' : 'text-foreground'
        }`}
        style={indentStyle}
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
        onContextMenu={handleContextMenu}
        draggable={!isRenaming}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {/* Expand/Collapse Arrow */}
        {isFolder && (
          <div className="w-4 h-4 flex items-center justify-center mr-1">
            <Icon 
              name={isExpanded ? 'ChevronDown' : 'ChevronRight'} 
              size={12} 
              className="text-muted-foreground"
            />
          </div>
        )}
        
        {/* File/Folder Icon */}
        <div className={`w-4 h-4 flex items-center justify-center mr-2 ${getFileColor(node?.name, isFolder)}`}>
          <Icon 
            name={getFileIcon(node?.name, isFolder)} 
            size={14}
          />
        </div>
        
        {/* File/Folder Name */}
        {isRenaming ? (
          <form onSubmit={handleRenameSubmit} className="flex-1">
            <input
              ref={renameInputRef}
              type="text"
              value={renameValue}
              onChange={(e) => setRenameValue(e?.target?.value)}
              onBlur={handleRenameCancel}
              onKeyDown={(e) => {
                if (e?.key === 'Escape') {
                  handleRenameCancel();
                }
              }}
              className="bg-input border border-panel-border rounded px-1 py-0 text-sm text-foreground w-full"
            />
          </form>
        ) : (
          <span className="text-sm truncate flex-1">
            {highlightMatch(node?.name, searchTerm)}
          </span>
        )}
        
        {/* File Status Indicators */}
        {!isFolder && (
          <div className="flex items-center space-x-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
            {node?.modified && (
              <div className="w-2 h-2 bg-warning rounded-full" title="Modified" />
            )}
            {node?.hasErrors && (
              <Icon name="AlertCircle" size={12} className="text-error" title="Has Errors" />
            )}
            {node?.gitStatus === 'modified' && (
              <div className="w-2 h-2 bg-blue-400 rounded-full" title="Git Modified" />
            )}
            {node?.gitStatus === 'added' && (
              <div className="w-2 h-2 bg-green-400 rounded-full" title="Git Added" />
            )}
          </div>
        )}
      </div>
      {/* Render Children */}
      {isFolder && isExpanded && node?.children && (
        <div>
          {Object.entries(node?.children)?.sort(([, a], [, b]) => {
              // Folders first, then files
              if (a?.type !== b?.type) {
                return a?.type === 'directory' ? -1 : 1;
              }
              return a?.name?.localeCompare(b?.name);
            })?.map(([name, childNode]) => (
              <FileTreeNode
                key={`${currentPath}/${name}`}
                node={childNode}
                path={currentPath}
                level={level + 1}
                onFileSelect={onFileSelect}
                onFileOpen={onFileOpen}
                onContextMenu={onContextMenu}
                selectedFile={selectedFile}
                expandedFolders={expandedFolders}
                onToggleFolder={onToggleFolder}
                onDragStart={onDragStart}
                onDragOver={onDragOver}
                onDrop={onDrop}
                searchTerm={searchTerm}
              />
            ))}
        </div>
      )}
    </div>
  );
};

export default FileTreeNode;