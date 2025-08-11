import React, { useState } from 'react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';

const KeyboardShortcutsPanel = ({ settings, onSettingsChange }) => {
  const [localSettings, setLocalSettings] = useState(settings);
  const [editingShortcut, setEditingShortcut] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const defaultShortcuts = [
    { id: 'save', command: 'Save File', shortcut: 'Ctrl+S', category: 'File' },
    { id: 'open', command: 'Open File', shortcut: 'Ctrl+O', category: 'File' },
    { id: 'new', command: 'New File', shortcut: 'Ctrl+N', category: 'File' },
    { id: 'find', command: 'Find', shortcut: 'Ctrl+F', category: 'Edit' },
    { id: 'replace', command: 'Find and Replace', shortcut: 'Ctrl+H', category: 'Edit' },
    { id: 'copy', command: 'Copy', shortcut: 'Ctrl+C', category: 'Edit' },
    { id: 'paste', command: 'Paste', shortcut: 'Ctrl+V', category: 'Edit' },
    { id: 'undo', command: 'Undo', shortcut: 'Ctrl+Z', category: 'Edit' },
    { id: 'redo', command: 'Redo', shortcut: 'Ctrl+Y', category: 'Edit' },
    { id: 'comment', command: 'Toggle Comment', shortcut: 'Ctrl+/', category: 'Edit' },
    { id: 'format', command: 'Format Document', shortcut: 'Shift+Alt+F', category: 'Edit' },
    { id: 'terminal', command: 'Toggle Terminal', shortcut: 'Ctrl+`', category: 'View' },
    { id: 'explorer', command: 'Toggle Explorer', shortcut: 'Ctrl+Shift+E', category: 'View' },
    { id: 'ai', command: 'Toggle AI Assistant', shortcut: 'Ctrl+Shift+A', category: 'View' },
    { id: 'settings', command: 'Open Settings', shortcut: 'Ctrl+,', category: 'View' },
    { id: 'palette', command: 'Command Palette', shortcut: 'Ctrl+Shift+P', category: 'General' },
    { id: 'quickopen', command: 'Quick Open', shortcut: 'Ctrl+P', category: 'General' },
    { id: 'zen', command: 'Zen Mode', shortcut: 'Ctrl+K Z', category: 'General' }
  ];

  const [shortcuts, setShortcuts] = useState(
    localSettings?.shortcuts || defaultShortcuts
  );

  const categories = [...new Set(shortcuts.map(s => s.category))];

  const filteredShortcuts = shortcuts?.filter(shortcut =>
    shortcut?.command?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
    shortcut?.shortcut?.toLowerCase()?.includes(searchTerm?.toLowerCase())
  );

  const handleShortcutChange = (id, newShortcut) => {
    const updated = shortcuts?.map(s => 
      s?.id === id ? { ...s, shortcut: newShortcut } : s
    );
    setShortcuts(updated);
    
    const updatedSettings = { ...localSettings, shortcuts: updated };
    setLocalSettings(updatedSettings);
    onSettingsChange(updatedSettings);
  };

  const handleSettingChange = (key, value) => {
    const updated = { ...localSettings, [key]: value };
    setLocalSettings(updated);
    onSettingsChange(updated);
  };

  const resetToDefaults = () => {
    setShortcuts(defaultShortcuts);
    const updated = { ...localSettings, shortcuts: defaultShortcuts };
    setLocalSettings(updated);
    onSettingsChange(updated);
  };

  const exportShortcuts = () => {
    const data = JSON.stringify(shortcuts, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'keyboard-shortcuts.json';
    a?.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Keyboard Shortcuts</h3>
        
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <Input
              placeholder="Search shortcuts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e?.target?.value)}
              className="w-full"
            />
          </div>
          
          <div className="flex space-x-2">
            <Button variant="outline" onClick={exportShortcuts}>
              <Icon name="Download" size={16} className="mr-2" />
              Export
            </Button>
            
            <Button variant="outline">
              <Icon name="Upload" size={16} className="mr-2" />
              Import
            </Button>
          </div>
        </div>
      </div>
      <div className="border-t border-panel-border pt-6">
        <h4 className="text-md font-medium text-foreground mb-4">Shortcut Preferences</h4>
        
        <div className="space-y-4 mb-6">
          <Checkbox
            label="VS Code Compatibility"
            description="Use VS Code compatible keyboard shortcuts"
            checked={localSettings?.vscodeCompatibility}
            onChange={(e) => handleSettingChange('vscodeCompatibility', e?.target?.checked)}
          />
          
          <Checkbox
            label="Enable Vim Keybindings"
            description="Use Vim-style navigation and editing commands"
            checked={localSettings?.vimKeybindings}
            onChange={(e) => handleSettingChange('vimKeybindings', e?.target?.checked)}
          />
          
          <Checkbox
            label="Show Shortcuts in Tooltips"
            description="Display keyboard shortcuts in button tooltips"
            checked={localSettings?.showTooltips}
            onChange={(e) => handleSettingChange('showTooltips', e?.target?.checked)}
          />
        </div>
      </div>
      <div className="space-y-4">
        {categories?.map(category => {
          const categoryShortcuts = filteredShortcuts?.filter(s => s?.category === category);
          
          if (categoryShortcuts?.length === 0) return null;
          
          return (
            <div key={category} className="border border-panel-border rounded-lg">
              <div className="px-4 py-3 bg-panel border-b border-panel-border">
                <h5 className="font-medium text-foreground">{category}</h5>
              </div>
              <div className="divide-y divide-panel-border">
                {categoryShortcuts?.map(shortcut => (
                  <div key={shortcut?.id} className="px-4 py-3 flex items-center justify-between">
                    <div className="flex-1">
                      <span className="text-foreground font-medium">{shortcut?.command}</span>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      {editingShortcut === shortcut?.id ? (
                        <div className="flex items-center space-x-2">
                          <Input
                            placeholder="Press keys..."
                            className="w-32"
                            onKeyDown={(e) => {
                              e?.preventDefault();
                              const keys = [];
                              if (e?.ctrlKey) keys?.push('Ctrl');
                              if (e?.shiftKey) keys?.push('Shift');
                              if (e?.altKey) keys?.push('Alt');
                              if (e?.metaKey) keys?.push('Cmd');
                              
                              if (e?.key !== 'Control' && e?.key !== 'Shift' && e?.key !== 'Alt' && e?.key !== 'Meta') {
                                keys?.push(e?.key?.toUpperCase());
                              }
                              
                              if (keys?.length > 1) {
                                const newShortcut = keys?.join('+');
                                handleShortcutChange(shortcut?.id, newShortcut);
                                setEditingShortcut(null);
                              }
                            }}
                            autoFocus
                          />
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingShortcut(null)}
                          >
                            <Icon name="X" size={14} />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <kbd className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded border">
                            {shortcut?.shortcut}
                          </kbd>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingShortcut(shortcut?.id)}
                          >
                            <Icon name="Edit" size={14} />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      {filteredShortcuts?.length === 0 && searchTerm && (
        <div className="text-center py-8">
          <Icon name="Search" size={24} className="mx-auto text-muted-foreground mb-2" />
          <p className="text-muted-foreground">No shortcuts found matching "{searchTerm}"</p>
        </div>
      )}
      <div className="flex justify-end space-x-3 pt-4">
        <Button variant="outline" onClick={resetToDefaults}>
          Reset to Defaults
        </Button>
        
        <Button variant="default">
          Apply Changes
        </Button>
      </div>
    </div>
  );
};

export default KeyboardShortcutsPanel;