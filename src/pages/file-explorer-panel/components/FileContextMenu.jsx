import React, { useEffect, useRef } from 'react';
import Icon from '../../../components/AppIcon';

const FileContextMenu = ({ 
  isOpen, 
  position, 
  onClose, 
  targetPath, 
  targetNode, 
  isFolder,
  onAction 
}) => {
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef?.current && !menuRef?.current?.contains(event?.target)) {
        onClose();
      }
    };

    const handleKeyDown = (event) => {
      if (event?.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handleAction = (action) => {
    onAction(action, targetPath, targetNode);
    onClose();
  };

  if (!isOpen) return null;

  const menuItems = [
    ...(isFolder ? [
      { id: 'new-file', label: 'New File', icon: 'FileText', shortcut: 'Ctrl+N' },
      { id: 'new-folder', label: 'New Folder', icon: 'FolderPlus', shortcut: 'Ctrl+Shift+N' },
      { id: 'separator' }
    ] : [
      { id: 'open', label: 'Open', icon: 'ExternalLink', shortcut: 'Enter' },
      { id: 'open-with', label: 'Open With...', icon: 'MoreHorizontal' },
      { id: 'separator' }
    ]),
    { id: 'cut', label: 'Cut', icon: 'Scissors', shortcut: 'Ctrl+X' },
    { id: 'copy', label: 'Copy', icon: 'Copy', shortcut: 'Ctrl+C' },
    { id: 'paste', label: 'Paste', icon: 'Clipboard', shortcut: 'Ctrl+V', disabled: !hasClipboardContent() },
    { id: 'separator' },
    { id: 'rename', label: 'Rename', icon: 'Edit2', shortcut: 'F2' },
    { id: 'duplicate', label: 'Duplicate', icon: 'Copy' },
    { id: 'separator' },
    { id: 'delete', label: 'Delete', icon: 'Trash2', shortcut: 'Delete', destructive: true },
    { id: 'separator' },
    { id: 'reveal', label: 'Reveal in File Explorer', icon: 'FolderOpen' },
    { id: 'copy-path', label: 'Copy Path', icon: 'Link', shortcut: 'Ctrl+Shift+C' },
    { id: 'copy-relative-path', label: 'Copy Relative Path', icon: 'Link2' },
    { id: 'separator' },
    { id: 'properties', label: 'Properties', icon: 'Info', shortcut: 'Alt+Enter' }
  ];

  // Filter out separators at the beginning, end, or consecutive separators
  const filteredItems = menuItems?.reduce((acc, item, index) => {
    if (item?.id === 'separator') {
      if (acc?.length === 0 || acc?.[acc?.length - 1]?.id === 'separator') {
        return acc; // Skip separator at beginning or consecutive separators
      }
    }
    acc?.push(item);
    return acc;
  }, []);

  // Remove trailing separator
  if (filteredItems?.length > 0 && filteredItems?.[filteredItems?.length - 1]?.id === 'separator') {
    filteredItems?.pop();
  }

  function hasClipboardContent() {
    // Mock clipboard check - in real implementation, check if there's content to paste
    return Math.random() > 0.5;
  }

  return (
    <div
      ref={menuRef}
      className="fixed z-50 bg-popover border border-panel-border rounded-md shadow-floating py-1 min-w-48"
      style={{
        left: position?.x,
        top: position?.y,
        maxHeight: '400px',
        overflowY: 'auto'
      }}
    >
      {filteredItems?.map((item, index) => {
        if (item?.id === 'separator') {
          return (
            <div key={`separator-${index}`} className="border-t border-panel-border my-1" />
          );
        }

        return (
          <button
            key={item?.id}
            onClick={() => handleAction(item?.id)}
            disabled={item?.disabled}
            className={`w-full flex items-center justify-between px-3 py-2 text-sm transition-colors ${
              item?.disabled
                ? 'text-muted-foreground cursor-not-allowed'
                : item?.destructive
                ? 'text-error hover:bg-error/10 hover:text-error' :'text-foreground hover:bg-hover'
            }`}
          >
            <div className="flex items-center space-x-3">
              <Icon name={item?.icon} size={16} />
              <span>{item?.label}</span>
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
  );
};

export default FileContextMenu;