import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import FileTreeNode from './components/FileTreeNode';
import FileContextMenu from './components/FileContextMenu';
import FileSearchBar from './components/FileSearchBar';
import ProjectHeader from './components/ProjectHeader';
import FileStatusBar from './components/FileStatusBar';
import NewFileDialog from './components/NewFileDialog';

const FileExplorerPanel = () => {
  const navigate = useNavigate();
  
  // State management
  const [fileTree, setFileTree] = useState({});
  const [expandedFolders, setExpandedFolders] = useState(['src', 'src/components', 'src/pages']);
  const [selectedFile, setSelectedFile] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [contextMenu, setContextMenu] = useState({ isOpen: false, position: { x: 0, y: 0 }, targetPath: '', targetNode: null, isFolder: false });
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [newFileDialog, setNewFileDialog] = useState({ isOpen: false, type: 'file', parentPath: '' });
  const [dragState, setDragState] = useState({ isDragging: false, draggedPath: '', dropTarget: '' });

  // Mock file tree data
  const mockFileTree = {
    'src': {
      name: 'src',
      type: 'directory',
      children: {
        'components': {
          name: 'components',
          type: 'directory',
          children: {
            'AppIcon.jsx': {
              name: 'AppIcon.jsx',
              type: 'file',
              size: 2048,
              modified: true,
              gitStatus: 'modified'
            },
            'AppImage.jsx': {
              name: 'AppImage.jsx',
              type: 'file',
              size: 1536,
              gitStatus: 'added'
            },
            'ui': {
              name: 'ui',
              type: 'directory',
              children: {
                'Button.jsx': {
                  name: 'Button.jsx',
                  type: 'file',
                  size: 3072,
                  modified: false
                },
                'Input.jsx': {
                  name: 'Input.jsx',
                  type: 'file',
                  size: 2560,
                  hasErrors: true
                },
                'Header.jsx': {
                  name: 'Header.jsx',
                  type: 'file',
                  size: 4096
                }
              }
            }
          }
        },
        'pages': {
          name: 'pages',
          type: 'directory',
          children: {
            'main-ide-interface': {
              name: 'main-ide-interface',
              type: 'directory',
              children: {
                'index.jsx': {
                  name: 'index.jsx',
                  type: 'file',
                  size: 5120,
                  modified: true
                },
                'components': {
                  name: 'components',
                  type: 'directory',
                  children: {
                    'EditorPanel.jsx': {
                      name: 'EditorPanel.jsx',
                      type: 'file',
                      size: 3584
                    },
                    'SidebarPanel.jsx': {
                      name: 'SidebarPanel.jsx',
                      type: 'file',
                      size: 2048
                    }
                  }
                }
              }
            },
            'file-explorer-panel': {
              name: 'file-explorer-panel',
              type: 'directory',
              children: {
                'index.jsx': {
                  name: 'index.jsx',
                  type: 'file',
                  size: 8192,
                  modified: true,
                  gitStatus: 'modified'
                }
              }
            }
          }
        },
        'styles': {
          name: 'styles',
          type: 'directory',
          children: {
            'index.css': {
              name: 'index.css',
              type: 'file',
              size: 1024
            },
            'tailwind.css': {
              name: 'tailwind.css',
              type: 'file',
              size: 512,
              gitStatus: 'added'
            }
          }
        },
        'utils': {
          name: 'utils',
          type: 'directory',
          children: {
            'index.jsx': {
              name: 'index.jsx',
              type: 'file',
              size: 1536
            },
            'constants.js': {
              name: 'constants.js',
              type: 'file',
              size: 768
            }
          }
        },
        'App.jsx': {
          name: 'App.jsx',
          type: 'file',
          size: 2048,
          modified: true
        },
        'index.jsx': {
          name: 'index.jsx',
          type: 'file',
          size: 512
        }
      }
    },
    'public': {
      name: 'public',
      type: 'directory',
      children: {
        'index.html': {
          name: 'index.html',
          type: 'file',
          size: 1024
        },
        'favicon.ico': {
          name: 'favicon.ico',
          type: 'file',
          size: 256
        },
        'manifest.json': {
          name: 'manifest.json',
          type: 'file',
          size: 512
        }
      }
    },
    'package.json': {
      name: 'package.json',
      type: 'file',
      size: 2048,
      modified: true,
      gitStatus: 'modified'
    },
    'README.md': {
      name: 'README.md',
      type: 'file',
      size: 1536
    },
    'vite.config.js': {
      name: 'vite.config.js',
      type: 'file',
      size: 768
    },
    'tailwind.config.js': {
      name: 'tailwind.config.js',
      type: 'file',
      size: 1024
    }
  };

  // Initialize file tree
  useEffect(() => {
    setFileTree(mockFileTree);
    
    // Load saved state from localStorage
    const savedExpanded = localStorage.getItem('file-explorer-expanded');
    const savedSelected = localStorage.getItem('file-explorer-selected');
    
    if (savedExpanded) {
      try {
        setExpandedFolders(JSON.parse(savedExpanded));
      } catch (error) {
        console.warn('Failed to load expanded folders:', error);
      }
    }
    
    if (savedSelected) {
      setSelectedFile(savedSelected);
    }
  }, []);

  // Save state to localStorage
  useEffect(() => {
    localStorage.setItem('file-explorer-expanded', JSON.stringify(expandedFolders));
  }, [expandedFolders]);

  useEffect(() => {
    if (selectedFile) {
      localStorage.setItem('file-explorer-selected', selectedFile);
    }
  }, [selectedFile]);

  // File tree operations
  const handleToggleFolder = useCallback((folderPath) => {
    setExpandedFolders(prev => {
      if (prev?.includes(folderPath)) {
        return prev?.filter(path => path !== folderPath);
      } else {
        return [...prev, folderPath];
      }
    });
  }, []);

  const handleFileSelect = useCallback((filePath, fileNode) => {
    setSelectedFile(filePath);
  }, []);

  const handleFileOpen = useCallback((filePath, fileNode) => {
    // Navigate to code editor with file context
    navigate('/code-editor-workspace', { 
      state: { 
        file: { path: filePath, ...fileNode },
        openFromExplorer: true 
      } 
    });
  }, [navigate]);

  // Context menu operations
  const handleContextMenu = useCallback((event, targetPath, targetNode, isFolder) => {
    event?.preventDefault();
    setContextMenu({
      isOpen: true,
      position: { x: event?.clientX, y: event?.clientY },
      targetPath,
      targetNode,
      isFolder
    });
  }, []);

  const handleContextMenuClose = useCallback(() => {
    setContextMenu(prev => ({ ...prev, isOpen: false }));
  }, []);

  const handleContextMenuAction = useCallback((action, targetPath, targetNode) => {
    console.log(`Action: ${action} on ${targetPath}`);
    
    switch (action) {
      case 'new-file':
        setNewFileDialog({
          isOpen: true,
          type: 'file',
          parentPath: targetPath
        });
        break;
      case 'new-folder':
        setNewFileDialog({
          isOpen: true,
          type: 'folder',
          parentPath: targetPath
        });
        break;
      case 'open':
        handleFileOpen(targetPath, targetNode);
        break;
      case 'rename':
        // Handle rename
        break;
      case 'delete':
        // Handle delete with confirmation
        if (confirm(`Are you sure you want to delete ${targetNode?.name}?`)) {
          console.log(`Deleting ${targetPath}`);
        }
        break;
      case 'copy':
        // Handle copy
        break;
      case 'cut':
        // Handle cut
        break;
      case 'paste':
        // Handle paste
        break;
      case 'duplicate':
        // Handle duplicate
        break;
      case 'reveal':
        // Handle reveal in file explorer
        break;
      case 'copy-path':
        navigator.clipboard?.writeText(targetPath);
        break;
      case 'copy-relative-path': navigator.clipboard?.writeText(targetPath?.replace(/^\//,''));
        break;
      case 'properties':
        // Handle properties dialog
        break;
    }
  }, [handleFileOpen]);

  // Search functionality
  const handleSearch = useCallback((term) => {
    setSearchTerm(term);
    setIsSearching(true);
    
    // Simulate search delay
    setTimeout(() => {
      const results = searchInFileTree(fileTree, term);
      setSearchResults(results);
      setIsSearching(false);
    }, 300);
  }, [fileTree]);

  const handleSearchClear = useCallback(() => {
    setSearchTerm('');
    setSearchResults([]);
    setIsSearching(false);
  }, []);

  const handleSearchResultSelect = useCallback((result) => {
    setSelectedFile(result?.path);
    
    // Expand parent folders
    const pathParts = result?.path?.split('/');
    const foldersToExpand = [];
    for (let i = 0; i < pathParts?.length - 1; i++) {
      foldersToExpand?.push(pathParts?.slice(0, i + 1)?.join('/'));
    }
    setExpandedFolders(prev => [...new Set([...prev, ...foldersToExpand])]);
    
    if (result?.type === 'file') {
      handleFileOpen(result?.path, result);
    }
  }, [handleFileOpen]);

  // Drag and drop operations
  const handleDragStart = useCallback((filePath, fileNode) => {
    setDragState({
      isDragging: true,
      draggedPath: filePath,
      dropTarget: ''
    });
  }, []);

  const handleDragOver = useCallback((targetPath) => {
    setDragState(prev => ({
      ...prev,
      dropTarget: targetPath
    }));
  }, []);

  const handleDrop = useCallback((draggedPath, targetPath) => {
    console.log(`Move ${draggedPath} to ${targetPath}`);
    setDragState({
      isDragging: false,
      draggedPath: '',
      dropTarget: ''
    });
  }, []);

  // Project operations
  const handleNewFile = useCallback(() => {
    setNewFileDialog({
      isOpen: true,
      type: 'file',
      parentPath: selectedFile ? getParentPath(selectedFile) : ''
    });
  }, [selectedFile]);

  const handleNewFolder = useCallback(() => {
    setNewFileDialog({
      isOpen: true,
      type: 'folder',
      parentPath: selectedFile ? getParentPath(selectedFile) : ''
    });
  }, [selectedFile]);

  const handleRefresh = useCallback(() => {
    // Simulate refresh
    console.log('Refreshing file tree...');
    setFileTree({ ...mockFileTree });
  }, []);

  const handleProjectSettings = useCallback(() => {
    navigate('/project-settings-dashboard');
  }, [navigate]);

  const handleNewFileConfirm = useCallback((fileName, type, parentPath) => {
    console.log(`Creating ${type}: ${fileName} in ${parentPath}`);
    // Here you would update the file tree with the new file/folder
  }, []);

  // Helper functions
  const searchInFileTree = (tree, term) => {
    const results = [];
    const search = (node, path = '') => {
      const currentPath = path ? `${path}/${node?.name}` : node?.name;
      
      if (node?.name?.toLowerCase()?.includes(term?.toLowerCase())) {
        results?.push({
          ...node,
          path: currentPath,
          matches: (node?.name?.match(new RegExp(term, 'gi')) || [])?.length
        });
      }
      
      if (node?.type === 'directory' && node?.children) {
        Object.values(node?.children)?.forEach(child => {
          search(child, currentPath);
        });
      }
    };
    
    Object.values(tree)?.forEach(node => search(node));
    return results?.slice(0, 50); // Limit results
  };

  const getParentPath = (filePath) => {
    const parts = filePath?.split('/');
    return parts?.slice(0, -1)?.join('/');
  };

  const getExistingNames = (parentPath) => {
    // Get existing file/folder names in the parent directory
    // This would be implemented based on your file tree structure
    return [];
  };

  const calculateStats = () => {
    let totalFiles = 0;
    let totalFolders = 0;
    
    const count = (node) => {
      if (node?.type === 'file') {
        totalFiles++;
      } else if (node?.type === 'directory') {
        totalFolders++;
        if (node?.children) {
          Object.values(node?.children)?.forEach(count);
        }
      }
    };
    
    Object.values(fileTree)?.forEach(count);
    return { totalFiles, totalFolders };
  };

  const { totalFiles, totalFolders } = calculateStats();
  const selectedFileNode = selectedFile ? getFileNodeByPath(fileTree, selectedFile) : null;

  function getFileNodeByPath(tree, path) {
    const parts = path?.split('/');
    let current = tree;
    
    for (const part of parts) {
      if (current?.[part]) {
        current = current?.[part];
      } else if (current?.children && current?.children?.[part]) {
        current = current?.children?.[part];
      } else {
        return null;
      }
    }
    
    return current;
  }

  // Navigation handlers
  const handleNavigateToMainIDE = () => navigate('/main-ide-interface');
  const handleNavigateToCodeEditor = () => navigate('/code-editor-workspace');
  const handleNavigateToAIAssistant = () => navigate('/ai-assistant-sidebar');
  const handleNavigateToTerminal = () => navigate('/terminal-integration-panel');

  return (
    <div className="h-screen bg-background text-foreground flex flex-col">
      {/* Navigation Header */}
      <div className="flex items-center justify-between p-4 border-b border-panel-border bg-surface">
        <div className="flex items-center space-x-2">
          <Icon name="FolderOpen" size={20} className="text-primary" />
          <h1 className="text-lg font-semibold">File Explorer Panel</h1>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleNavigateToMainIDE}
            className="text-sm"
          >
            <Icon name="Layout" size={16} className="mr-2" />
            Main IDE
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleNavigateToCodeEditor}
            className="text-sm"
          >
            <Icon name="Code" size={16} className="mr-2" />
            Editor
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleNavigateToAIAssistant}
            className="text-sm"
          >
            <Icon name="Bot" size={16} className="mr-2" />
            AI Assistant
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleNavigateToTerminal}
            className="text-sm"
          >
            <Icon name="Terminal" size={16} className="mr-2" />
            Terminal
          </Button>
        </div>
      </div>
      {/* Main Explorer Panel */}
      <div className={`flex-1 flex transition-all duration-300 ${isCollapsed ? 'w-12' : 'w-80'} min-w-0`}>
        <div className="flex flex-col w-full border-r border-panel-border bg-panel">
          {/* Project Header */}
          <ProjectHeader
            projectName="CodeStudio IDE"
            isCollapsed={isCollapsed}
            onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
            onNewFile={handleNewFile}
            onNewFolder={handleNewFolder}
            onRefresh={handleRefresh}
            onProjectSettings={handleProjectSettings}
          />

          {!isCollapsed && (
            <>
              {/* Search Bar */}
              <div className="p-3 border-b border-panel-border">
                <FileSearchBar
                  onSearch={handleSearch}
                  onClear={handleSearchClear}
                  searchResults={searchResults}
                  onResultSelect={handleSearchResultSelect}
                  isSearching={isSearching}
                />
              </div>

              {/* File Tree */}
              <div className="flex-1 overflow-auto">
                {searchTerm ? (
                  // Search Results View
                  (<div className="p-2">
                    {searchResults?.length > 0 ? (
                      <div className="space-y-1">
                        <div className="text-xs text-muted-foreground px-2 py-1">
                          {searchResults?.length} result{searchResults?.length !== 1 ? 's' : ''} for "{searchTerm}"
                        </div>
                        {searchResults?.map((result, index) => (
                          <div
                            key={result?.path}
                            className={`flex items-center space-x-2 px-2 py-1 cursor-pointer hover:bg-hover rounded ${
                              selectedFile === result?.path ? 'bg-active text-primary' : ''
                            }`}
                            onClick={() => handleSearchResultSelect(result)}
                          >
                            <Icon 
                              name={result?.type === 'directory' ? 'Folder' : 'File'} 
                              size={16} 
                              className={result?.type === 'directory' ? 'text-blue-400' : 'text-gray-300'}
                            />
                            <div className="flex-1 min-w-0">
                              <div className="text-sm truncate">{result?.name}</div>
                              <div className="text-xs text-muted-foreground truncate">{result?.path}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <Icon name="Search" size={24} className="mx-auto mb-2 opacity-50" />
                        <div className="text-sm">No files found</div>
                      </div>
                    )}
                  </div>)
                ) : (
                  // Normal File Tree View
                  (<div className="py-2">
                    {Object.entries(fileTree)?.sort(([, a], [, b]) => {
                        if (a?.type !== b?.type) {
                          return a?.type === 'directory' ? -1 : 1;
                        }
                        return a?.name?.localeCompare(b?.name);
                      })?.map(([name, node]) => (
                        <FileTreeNode
                          key={name}
                          node={node}
                          path=""
                          level={0}
                          onFileSelect={handleFileSelect}
                          onFileOpen={handleFileOpen}
                          onContextMenu={handleContextMenu}
                          selectedFile={selectedFile}
                          expandedFolders={expandedFolders}
                          onToggleFolder={handleToggleFolder}
                          onDragStart={handleDragStart}
                          onDragOver={handleDragOver}
                          onDrop={handleDrop}
                          searchTerm={searchTerm}
                        />
                      ))}
                  </div>)
                )}
              </div>

              {/* Status Bar */}
              <FileStatusBar
                totalFiles={totalFiles}
                totalFolders={totalFolders}
                selectedFile={selectedFileNode}
                filteredCount={searchTerm ? searchResults?.length : null}
                searchTerm={searchTerm}
                gitStatus={{
                  modified: 3,
                  added: 2,
                  deleted: 0,
                  untracked: 1
                }}
              />
            </>
          )}
        </div>

        {/* Demo Content Area */}
        <div className="flex-1 bg-background p-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <Icon name="FolderOpen" size={48} className="mx-auto mb-4 text-primary" />
              <h2 className="text-2xl font-bold text-foreground mb-2">File Explorer Panel</h2>
              <p className="text-muted-foreground">
                Navigate, organize, and manage your project files efficiently
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <div className="bg-surface border border-panel-border rounded-lg p-6">
                <Icon name="Search" size={24} className="text-blue-400 mb-3" />
                <h3 className="font-semibold text-foreground mb-2">Smart Search</h3>
                <p className="text-sm text-muted-foreground">
                  Quickly find files with intelligent search and filtering capabilities
                </p>
              </div>

              <div className="bg-surface border border-panel-border rounded-lg p-6">
                <Icon name="GitBranch" size={24} className="text-green-400 mb-3" />
                <h3 className="font-semibold text-foreground mb-2">Git Integration</h3>
                <p className="text-sm text-muted-foreground">
                  Visual indicators for modified, added, and untracked files
                </p>
              </div>

              <div className="bg-surface border border-panel-border rounded-lg p-6">
                <Icon name="MousePointer" size={24} className="text-purple-400 mb-3" />
                <h3 className="font-semibold text-foreground mb-2">Drag & Drop</h3>
                <p className="text-sm text-muted-foreground">
                  Reorganize files and folders with intuitive drag and drop
                </p>
              </div>
            </div>

            <div className="bg-surface border border-panel-border rounded-lg p-6">
              <h3 className="font-semibold text-foreground mb-4">Key Features</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Icon name="Check" size={16} className="text-success" />
                  <span className="text-foreground">Hierarchical file tree structure</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Icon name="Check" size={16} className="text-success" />
                  <span className="text-foreground">Context menu operations</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Icon name="Check" size={16} className="text-success" />
                  <span className="text-foreground">File type icons and syntax highlighting</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Icon name="Check" size={16} className="text-success" />
                  <span className="text-foreground">Keyboard navigation support</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Icon name="Check" size={16} className="text-success" />
                  <span className="text-foreground">Persistent state management</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Icon name="Check" size={16} className="text-success" />
                  <span className="text-foreground">Responsive design for all devices</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Context Menu */}
      <FileContextMenu
        isOpen={contextMenu?.isOpen}
        position={contextMenu?.position}
        onClose={handleContextMenuClose}
        targetPath={contextMenu?.targetPath}
        targetNode={contextMenu?.targetNode}
        isFolder={contextMenu?.isFolder}
        onAction={handleContextMenuAction}
      />
      {/* New File/Folder Dialog */}
      <NewFileDialog
        isOpen={newFileDialog?.isOpen}
        onClose={() => setNewFileDialog(prev => ({ ...prev, isOpen: false }))}
        onConfirm={handleNewFileConfirm}
        type={newFileDialog?.type}
        parentPath={newFileDialog?.parentPath}
        existingNames={getExistingNames(newFileDialog?.parentPath)}
      />
    </div>
  );
};

export default FileExplorerPanel;