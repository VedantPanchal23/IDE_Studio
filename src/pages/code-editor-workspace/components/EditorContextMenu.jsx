import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const EditorContextMenu = ({ 
  isVisible = false, 
  position = { x: 0, y: 0 }, 
  onClose, 
  selectedText = '',
  onAction
}) => {
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    const items = [
      {
        id: 'cut',
        label: 'Cut',
        icon: 'Scissors',
        shortcut: 'Ctrl+X',
        disabled: !selectedText,
        action: () => handleAction('cut')
      },
      {
        id: 'copy',
        label: 'Copy',
        icon: 'Copy',
        shortcut: 'Ctrl+C',
        disabled: !selectedText,
        action: () => handleAction('copy')
      },
      {
        id: 'paste',
        label: 'Paste',
        icon: 'Clipboard',
        shortcut: 'Ctrl+V',
        action: () => handleAction('paste')
      },
      { type: 'separator' },
      {
        id: 'selectAll',
        label: 'Select All',
        icon: 'MousePointer',
        shortcut: 'Ctrl+A',
        action: () => handleAction('selectAll')
      },
      { type: 'separator' },
      {
        id: 'format',
        label: 'Format Document',
        icon: 'Code',
        shortcut: 'Shift+Alt+F',
        action: () => handleAction('format')
      },
      {
        id: 'comment',
        label: selectedText ? 'Toggle Comment' : 'Comment Line',
        icon: 'MessageSquare',
        shortcut: 'Ctrl+/',
        action: () => handleAction('comment')
      },
      { type: 'separator' },
      {
        id: 'findReplace',
        label: 'Find and Replace',
        icon: 'Search',
        shortcut: 'Ctrl+H',
        action: () => handleAction('findReplace')
      },
      {
        id: 'goToLine',
        label: 'Go to Line',
        icon: 'Hash',
        shortcut: 'Ctrl+G',
        action: () => handleAction('goToLine')
      }
    ];

    // Add AI-specific actions if text is selected
    if (selectedText) {
      items?.push(
        { type: 'separator' },
        {
          id: 'explainCode',
          label: 'Explain Code',
          icon: 'Bot',
          action: () => handleAction('explainCode')
        },
        {
          id: 'refactor',
          label: 'Refactor Code',
          icon: 'Wrench',
          action: () => handleAction('refactor')
        },
        {
          id: 'generateTests',
          label: 'Generate Tests',
          icon: 'TestTube',
          action: () => handleAction('generateTests')
        }
      );
    }

    setMenuItems(items);
  }, [selectedText]);

  const handleAction = (actionType) => {
    if (onAction) {
      onAction(actionType, selectedText);
    }
    handleClose();
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isVisible) {
        handleClose();
      }
    };

    const handleKeyDown = (e) => {
      if (e?.key === 'Escape' && isVisible) {
        handleClose();
      }
    };

    if (isVisible) {
      document.addEventListener('click', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div
      className="fixed z-50 bg-popover border border-panel-border rounded-md shadow-floating py-1 min-w-48"
      style={{
        left: position?.x,
        top: position?.y
      }}
      onClick={(e) => e?.stopPropagation()}
    >
      {menuItems?.map((item, index) => {
        if (item?.type === 'separator') {
          return (
            <div key={index} className="border-t border-panel-border my-1" />
          );
        }

        return (
          <button
            key={item?.id}
            onClick={item?.action}
            disabled={item?.disabled}
            className={`w-full flex items-center justify-between px-3 py-2 text-sm transition-colors ${
              item?.disabled
                ? 'text-muted-foreground cursor-not-allowed'
                : 'text-foreground hover:bg-hover cursor-pointer'
            }`}
          >
            <div className="flex items-center space-x-3">
              <Icon 
                name={item?.icon} 
                size={14} 
                className={item?.disabled ? 'text-muted-foreground' : ''} 
              />
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

export default EditorContextMenu;