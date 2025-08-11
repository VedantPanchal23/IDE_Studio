import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const TerminalSettings = ({ 
  isOpen, 
  onClose, 
  settings, 
  onSettingsChange 
}) => {
  const [localSettings, setLocalSettings] = useState({
    fontSize: settings?.fontSize || 14,
    fontFamily: settings?.fontFamily || 'JetBrains Mono',
    theme: settings?.theme || 'dark',
    cursorStyle: settings?.cursorStyle || 'block',
    scrollback: settings?.scrollback || 1000,
    bellSound: settings?.bellSound || false,
    copyOnSelect: settings?.copyOnSelect || false,
    rightClickPaste: settings?.rightClickPaste || true,
    ...settings
  });

  const handleSettingChange = (key, value) => {
    const newSettings = { ...localSettings, [key]: value };
    setLocalSettings(newSettings);
  };

  const handleSave = () => {
    onSettingsChange(localSettings);
    onClose();
  };

  const handleReset = () => {
    const defaultSettings = {
      fontSize: 14,
      fontFamily: 'JetBrains Mono',
      theme: 'dark',
      cursorStyle: 'block',
      scrollback: 1000,
      bellSound: false,
      copyOnSelect: false,
      rightClickPaste: true
    };
    setLocalSettings(defaultSettings);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-surface border border-panel-border rounded-lg shadow-floating w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-panel-border">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
              <Icon name="Settings" size={16} color="white" />
            </div>
            <h2 className="text-lg font-semibold text-foreground">Terminal Settings</h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="p-1"
          >
            <Icon name="X" size={16} />
          </Button>
        </div>

        {/* Settings Content */}
        <div className="p-4 space-y-4 max-h-96 overflow-auto">
          {/* Appearance */}
          <div>
            <h3 className="text-sm font-medium text-foreground mb-3">Appearance</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Font Size</label>
                <input
                  type="range"
                  min="10"
                  max="24"
                  value={localSettings?.fontSize}
                  onChange={(e) => handleSettingChange('fontSize', parseInt(e?.target?.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>10px</span>
                  <span>{localSettings?.fontSize}px</span>
                  <span>24px</span>
                </div>
              </div>

              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Font Family</label>
                <select
                  value={localSettings?.fontFamily}
                  onChange={(e) => handleSettingChange('fontFamily', e?.target?.value)}
                  className="w-full px-3 py-2 bg-input border border-panel-border rounded-md text-foreground"
                >
                  <option value="JetBrains Mono">JetBrains Mono</option>
                  <option value="Fira Code">Fira Code</option>
                  <option value="Source Code Pro">Source Code Pro</option>
                  <option value="Consolas">Consolas</option>
                  <option value="Monaco">Monaco</option>
                </select>
              </div>

              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Theme</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleSettingChange('theme', 'dark')}
                    className={`p-3 border rounded-md text-left transition-colors ${
                      localSettings?.theme === 'dark' ?'border-primary bg-primary/10' :'border-panel-border hover:border-primary/50'
                    }`}
                  >
                    <div className="font-medium text-foreground">Dark</div>
                    <div className="text-xs text-muted-foreground">Default dark theme</div>
                  </button>
                  <button
                    onClick={() => handleSettingChange('theme', 'light')}
                    className={`p-3 border rounded-md text-left transition-colors ${
                      localSettings?.theme === 'light' ?'border-primary bg-primary/10' :'border-panel-border hover:border-primary/50'
                    }`}
                  >
                    <div className="font-medium text-foreground">Light</div>
                    <div className="text-xs text-muted-foreground">High contrast light</div>
                  </button>
                </div>
              </div>

              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Cursor Style</label>
                <select
                  value={localSettings?.cursorStyle}
                  onChange={(e) => handleSettingChange('cursorStyle', e?.target?.value)}
                  className="w-full px-3 py-2 bg-input border border-panel-border rounded-md text-foreground"
                >
                  <option value="block">Block</option>
                  <option value="underline">Underline</option>
                  <option value="bar">Bar</option>
                </select>
              </div>
            </div>
          </div>

          {/* Behavior */}
          <div>
            <h3 className="text-sm font-medium text-foreground mb-3">Behavior</h3>
            <div className="space-y-3">
              <Input
                label="Scrollback Lines"
                type="number"
                min="100"
                max="10000"
                value={localSettings?.scrollback}
                onChange={(e) => handleSettingChange('scrollback', parseInt(e?.target?.value))}
                description="Number of lines to keep in history"
              />

              <div className="space-y-2">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={localSettings?.bellSound}
                    onChange={(e) => handleSettingChange('bellSound', e?.target?.checked)}
                    className="rounded"
                  />
                  <span className="text-sm text-foreground">Enable bell sound</span>
                </label>

                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={localSettings?.copyOnSelect}
                    onChange={(e) => handleSettingChange('copyOnSelect', e?.target?.checked)}
                    className="rounded"
                  />
                  <span className="text-sm text-foreground">Copy on select</span>
                </label>

                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={localSettings?.rightClickPaste}
                    onChange={(e) => handleSettingChange('rightClickPaste', e?.target?.checked)}
                    className="rounded"
                  />
                  <span className="text-sm text-foreground">Right-click to paste</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-panel-border">
          <Button
            variant="outline"
            onClick={handleReset}
          >
            Reset to Defaults
          </Button>
          
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              variant="default"
              onClick={handleSave}
            >
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TerminalSettings;