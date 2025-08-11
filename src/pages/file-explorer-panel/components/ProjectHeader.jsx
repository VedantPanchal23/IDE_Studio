import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ProjectHeader = ({ 
  projectName = "My Project",
  isCollapsed = false,
  onToggleCollapse,
  onNewFile,
  onNewFolder,
  onRefresh,
  onProjectSettings
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleToggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleDropdownAction = (action) => {
    setIsDropdownOpen(false);
    
    switch (action) {
      case 'new-file':
        onNewFile();
        break;
      case 'new-folder':
        onNewFolder();
        break;
      case 'refresh':
        onRefresh();
        break;
      case 'settings':
        onProjectSettings();
        break;
      case 'import':
        // Handle import project
        console.log('Import project');
        break;
      case 'export':
        // Handle export project
        console.log('Export project');
        break;
      case 'clone':
        // Handle clone repository
        console.log('Clone repository');
        break;
    }
  };

  return (
    <div className="flex items-center justify-between p-3 border-b border-panel-border bg-panel">
      {/* Project Name and Collapse Toggle */}
      <div className="flex items-center space-x-2 flex-1 min-w-0">
        <button
          onClick={onToggleCollapse}
          className="p-1 hover:bg-hover rounded transition-colors"
          title={isCollapsed ? 'Expand Explorer' : 'Collapse Explorer'}
        >
          <Icon 
            name={isCollapsed ? 'ChevronRight' : 'ChevronDown'} 
            size={16} 
            className="text-muted-foreground"
          />
        </button>
        
        <div className="flex items-center space-x-2 min-w-0 flex-1">
          <Icon name="FolderOpen" size={16} className="text-blue-400 flex-shrink-0" />
          <span className="font-medium text-foreground truncate" title={projectName}>
            {projectName}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      {!isCollapsed && (
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={onNewFile}
            className="h-7 w-7 p-0"
            title="New File (Ctrl+N)"
          >
            <Icon name="FileText" size={14} />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onNewFolder}
            className="h-7 w-7 p-0"
            title="New Folder (Ctrl+Shift+N)"
          >
            <Icon name="FolderPlus" size={14} />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onRefresh}
            className="h-7 w-7 p-0"
            title="Refresh Explorer (F5)"
          >
            <Icon name="RefreshCw" size={14} />
          </Button>
          
          {/* More Actions Dropdown */}
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleToggleDropdown}
              className="h-7 w-7 p-0"
              title="More Actions"
            >
              <Icon name="MoreHorizontal" size={14} />
            </Button>
            
            {isDropdownOpen && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setIsDropdownOpen(false)}
                />
                <div className="absolute top-full right-0 mt-1 w-48 bg-popover border border-panel-border rounded-md shadow-floating z-50 py-1">
                  <button
                    onClick={() => handleDropdownAction('import')}
                    className="w-full px-3 py-2 text-left text-sm text-foreground hover:bg-hover transition-colors flex items-center"
                  >
                    <Icon name="Download" size={16} className="mr-2" />
                    Import Project
                  </button>
                  
                  <button
                    onClick={() => handleDropdownAction('export')}
                    className="w-full px-3 py-2 text-left text-sm text-foreground hover:bg-hover transition-colors flex items-center"
                  >
                    <Icon name="Upload" size={16} className="mr-2" />
                    Export Project
                  </button>
                  
                  <button
                    onClick={() => handleDropdownAction('clone')}
                    className="w-full px-3 py-2 text-left text-sm text-foreground hover:bg-hover transition-colors flex items-center"
                  >
                    <Icon name="GitBranch" size={16} className="mr-2" />
                    Clone Repository
                  </button>
                  
                  <div className="border-t border-panel-border my-1" />
                  
                  <button
                    onClick={() => handleDropdownAction('settings')}
                    className="w-full px-3 py-2 text-left text-sm text-foreground hover:bg-hover transition-colors flex items-center"
                  >
                    <Icon name="Settings" size={16} className="mr-2" />
                    Project Settings
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectHeader;