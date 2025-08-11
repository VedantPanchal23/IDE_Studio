import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const MenuBar = ({ onFileAction, onViewAction, onSettingsClick }) => {
  const [activeMenu, setActiveMenu] = useState(null);

  const menuItems = {
    file: [
      { label: 'New File', shortcut: 'Ctrl+N', action: () => onFileAction('new'), icon: 'FilePlus' },
      { label: 'New Folder', shortcut: 'Ctrl+Shift+N', action: () => onFileAction('newFolder'), icon: 'FolderPlus' },
      { type: 'separator' },
      { label: 'Open File', shortcut: 'Ctrl+O', action: () => onFileAction('open'), icon: 'FolderOpen' },
      { label: 'Open Folder', shortcut: 'Ctrl+K Ctrl+O', action: () => onFileAction('openFolder'), icon: 'Folder' },
      { type: 'separator' },
      { label: 'Save', shortcut: 'Ctrl+S', action: () => onFileAction('save'), icon: 'Save' },
      { label: 'Save As', shortcut: 'Ctrl+Shift+S', action: () => onFileAction('saveAs'), icon: 'Save' },
      { label: 'Save All', shortcut: 'Ctrl+K S', action: () => onFileAction('saveAll'), icon: 'SaveAll' },
      { type: 'separator' },
      { label: 'Close File', shortcut: 'Ctrl+W', action: () => onFileAction('close'), icon: 'X' },
      { label: 'Close All', shortcut: 'Ctrl+K Ctrl+W', action: () => onFileAction('closeAll'), icon: 'X' }
    ],
    edit: [
      { label: 'Undo', shortcut: 'Ctrl+Z', action: () => {}, icon: 'Undo' },
      { label: 'Redo', shortcut: 'Ctrl+Y', action: () => {}, icon: 'Redo' },
      { type: 'separator' },
      { label: 'Cut', shortcut: 'Ctrl+X', action: () => {}, icon: 'Scissors' },
      { label: 'Copy', shortcut: 'Ctrl+C', action: () => {}, icon: 'Copy' },
      { label: 'Paste', shortcut: 'Ctrl+V', action: () => {}, icon: 'Clipboard' },
      { type: 'separator' },
      { label: 'Find', shortcut: 'Ctrl+F', action: () => {}, icon: 'Search' },
      { label: 'Replace', shortcut: 'Ctrl+H', action: () => {}, icon: 'Replace' },
      { label: 'Find in Files', shortcut: 'Ctrl+Shift+F', action: () => {}, icon: 'Search' }
    ],
    view: [
      { label: 'Explorer', shortcut: 'Ctrl+Shift+E', action: () => onViewAction('explorer'), icon: 'FolderOpen' },
      { label: 'Search', shortcut: 'Ctrl+Shift+F', action: () => onViewAction('search'), icon: 'Search' },
      { label: 'Source Control', shortcut: 'Ctrl+Shift+G', action: () => onViewAction('git'), icon: 'GitBranch' },
      { label: 'Extensions', shortcut: 'Ctrl+Shift+X', action: () => onViewAction('extensions'), icon: 'Puzzle' },
      { type: 'separator' },
      { label: 'Terminal', shortcut: 'Ctrl+`', action: () => onViewAction('terminal'), icon: 'Terminal' },
      { label: 'AI Assistant', shortcut: 'Ctrl+Shift+A', action: () => onViewAction('ai'), icon: 'Bot' },
      { type: 'separator' },
      { label: 'Split Editor', shortcut: 'Ctrl+\\', action: () => onViewAction('split'), icon: 'SplitSquareHorizontal' },
      { label: 'Toggle Sidebar', shortcut: 'Ctrl+B', action: () => onViewAction('sidebar'), icon: 'Sidebar' }
    ],
    help: [
      { label: 'Welcome', action: () => {}, icon: 'Home' },
      { label: 'Documentation', action: () => {}, icon: 'Book' },
      { label: 'Keyboard Shortcuts', shortcut: 'Ctrl+K Ctrl+S', action: () => {}, icon: 'Keyboard' },
      { type: 'separator' },
      { label: 'Report Issue', action: () => {}, icon: 'Bug' },
      { label: 'About', action: () => {}, icon: 'Info' }
    ]
  };

  const handleMenuClick = (menuName) => {
    setActiveMenu(activeMenu === menuName ? null : menuName);
  };

  const handleMenuItemClick = (item) => {
    if (item?.action) {
      item?.action();
    }
    setActiveMenu(null);
  };

  const closeMenu = () => {
    setActiveMenu(null);
  };

  return (
    <>
      <div className="h-8 bg-surface border-b border-panel-border flex items-center px-2">
        {/* Menu Items */}
        <div className="flex items-center">
          {Object.keys(menuItems)?.map((menuName) => (
            <div key={menuName} className="relative">
              <Button
                variant="ghost"
                size="xs"
                className={`px-3 py-1 text-sm capitalize rounded-none ${
                  activeMenu === menuName ? 'bg-active text-primary' : 'hover:bg-hover'
                }`}
                onClick={() => handleMenuClick(menuName)}
              >
                {menuName}
              </Button>

              {/* Dropdown Menu */}
              {activeMenu === menuName && (
                <div className="absolute top-full left-0 z-50 bg-popover border border-panel-border rounded-md shadow-floating py-1 min-w-48">
                  {menuItems?.[menuName]?.map((item, index) => {
                    if (item?.type === 'separator') {
                      return (
                        <div key={index} className="border-t border-panel-border my-1" />
                      );
                    }

                    return (
                      <button
                        key={index}
                        className="w-full px-3 py-1.5 text-left text-sm hover:bg-hover flex items-center justify-between group"
                        onClick={() => handleMenuItemClick(item)}
                      >
                        <div className="flex items-center">
                          {item?.icon && (
                            <Icon name={item?.icon} size={14} className="mr-2 text-muted-foreground" />
                          )}
                          <span className="text-foreground">{item?.label}</span>
                        </div>
                        {item?.shortcut && (
                          <span className="text-xs text-muted-foreground ml-4">
                            {item?.shortcut}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Right Side Actions */}
        <div className="ml-auto flex items-center space-x-1">
          <Button
            variant="ghost"
            size="xs"
            className="h-6 w-6 p-0"
            onClick={() => onViewAction('search')}
          >
            <Icon name="Search" size={12} />
          </Button>
          
          <Button
            variant="ghost"
            size="xs"
            className="h-6 w-6 p-0"
            onClick={onSettingsClick}
          >
            <Icon name="Settings" size={12} />
          </Button>

          <Button
            variant="ghost"
            size="xs"
            className="h-6 w-6 p-0"
            onClick={() => {/* Handle minimize */}}
          >
            <Icon name="Minus" size={12} />
          </Button>

          <Button
            variant="ghost"
            size="xs"
            className="h-6 w-6 p-0"
            onClick={() => {/* Handle maximize */}}
          >
            <Icon name="Square" size={12} />
          </Button>

          <Button
            variant="ghost"
            size="xs"
            className="h-6 w-6 p-0 hover:bg-destructive hover:text-destructive-foreground"
            onClick={() => {/* Handle close */}}
          >
            <Icon name="X" size={12} />
          </Button>
        </div>
      </div>
      {/* Backdrop to close menu */}
      {activeMenu && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={closeMenu}
        />
      )}
    </>
  );
};

export default MenuBar;