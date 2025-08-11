import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const TerminalTab = ({ 
  tab, 
  isActive, 
  onSelect, 
  onClose, 
  onRename 
}) => {
  const handleClose = (e) => {
    e?.stopPropagation();
    onClose(tab?.id);
  };

  const handleRename = (e) => {
    e?.stopPropagation();
    const newName = prompt('Enter new terminal name:', tab?.name);
    if (newName && newName?.trim()) {
      onRename(tab?.id, newName?.trim());
    }
  };

  return (
    <div
      className={`flex items-center px-3 py-2 border-r border-panel-border cursor-pointer transition-colors group ${
        isActive 
          ? 'bg-active text-primary border-b-2 border-primary' :'hover:bg-hover text-foreground'
      }`}
      onClick={() => onSelect(tab?.id)}
    >
      <Icon 
        name="Terminal" 
        size={14} 
        className={`mr-2 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} 
      />
      <span 
        className="text-sm font-medium truncate max-w-24"
        onDoubleClick={handleRename}
        title={tab?.name}
      >
        {tab?.name}
      </span>
      {tab?.hasActivity && !isActive && (
        <div className="w-2 h-2 bg-accent rounded-full ml-2 flex-shrink-0" />
      )}
      <Button
        variant="ghost"
        size="xs"
        onClick={handleClose}
        className={`ml-2 p-0 w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity ${
          isActive ? 'opacity-100' : ''
        }`}
      >
        <Icon name="X" size={12} />
      </Button>
    </div>
  );
};

export default TerminalTab;