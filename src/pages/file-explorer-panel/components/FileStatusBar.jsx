import React from 'react';
import Icon from '../../../components/AppIcon';

const FileStatusBar = ({ 
  totalFiles = 0,
  totalFolders = 0,
  selectedFile = null,
  filteredCount = null,
  searchTerm = '',
  gitStatus = null
}) => {
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i))?.toFixed(1)) + ' ' + sizes?.[i];
  };

  const getGitStatusInfo = () => {
    if (!gitStatus) return null;
    
    const { modified = 0, added = 0, deleted = 0, untracked = 0 } = gitStatus;
    const total = modified + added + deleted + untracked;
    
    if (total === 0) return null;
    
    return {
      total,
      modified,
      added,
      deleted,
      untracked
    };
  };

  const gitInfo = getGitStatusInfo();

  return (
    <div className="flex items-center justify-between px-3 py-2 border-t border-panel-border bg-panel text-xs text-muted-foreground">
      {/* Left Side - File Count Info */}
      <div className="flex items-center space-x-4">
        {/* File/Folder Count */}
        <div className="flex items-center space-x-1">
          <Icon name="Folder" size={12} />
          <span>{totalFolders}</span>
          <Icon name="File" size={12} className="ml-2" />
          <span>{totalFiles}</span>
        </div>
        
        {/* Search Results */}
        {filteredCount !== null && searchTerm && (
          <div className="flex items-center space-x-1 text-primary">
            <Icon name="Search" size={12} />
            <span>{filteredCount} found</span>
          </div>
        )}
        
        {/* Selected File Info */}
        {selectedFile && (
          <div className="flex items-center space-x-1">
            <Icon name="MousePointer" size={12} />
            <span className="truncate max-w-32" title={selectedFile?.name}>
              {selectedFile?.name}
            </span>
            {selectedFile?.size && (
              <span className="text-muted-foreground">
                ({formatFileSize(selectedFile?.size)})
              </span>
            )}
          </div>
        )}
      </div>
      {/* Right Side - Git Status */}
      {gitInfo && (
        <div className="flex items-center space-x-3">
          {gitInfo?.modified > 0 && (
            <div className="flex items-center space-x-1 text-blue-400">
              <div className="w-2 h-2 bg-blue-400 rounded-full" />
              <span>{gitInfo?.modified}M</span>
            </div>
          )}
          
          {gitInfo?.added > 0 && (
            <div className="flex items-center space-x-1 text-green-400">
              <div className="w-2 h-2 bg-green-400 rounded-full" />
              <span>{gitInfo?.added}A</span>
            </div>
          )}
          
          {gitInfo?.deleted > 0 && (
            <div className="flex items-center space-x-1 text-red-400">
              <div className="w-2 h-2 bg-red-400 rounded-full" />
              <span>{gitInfo?.deleted}D</span>
            </div>
          )}
          
          {gitInfo?.untracked > 0 && (
            <div className="flex items-center space-x-1 text-yellow-400">
              <div className="w-2 h-2 bg-yellow-400 rounded-full" />
              <span>{gitInfo?.untracked}U</span>
            </div>
          )}
          
          <div className="flex items-center space-x-1">
            <Icon name="GitBranch" size={12} />
            <span>main</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileStatusBar;