import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';

const ThemePreferencesPanel = ({ settings, onSettingsChange }) => {
  const [localSettings, setLocalSettings] = useState(settings);
  const [previewTheme, setPreviewTheme] = useState(settings?.theme);

  const themes = [
    {
      id: 'dark-professional',
      name: 'Dark Professional',
      description: 'Optimized for extended coding sessions',
      preview: 'bg-background',
      isDefault: true
    },
    {
      id: 'light-clean',
      name: 'Light Clean',
      description: 'High contrast for bright environments',
      preview: 'bg-white'
    },
    {
      id: 'dark-high-contrast',
      name: 'Dark High Contrast',
      description: 'Enhanced visibility for accessibility',
      preview: 'bg-gray-900'
    },
    {
      id: 'monokai',
      name: 'Monokai',
      description: 'Classic dark theme with vibrant colors',
      preview: 'bg-gray-800'
    }
  ];

  const colorSchemes = [
    { name: 'VS Code Blue', color: '#007ACC', active: true },
    { name: 'GitHub Green', color: '#28a745', active: false },
    { name: 'Atom Purple', color: '#6f42c1', active: false },
    { name: 'Sublime Orange', color: '#ff6b35', active: false }
  ];

  const handleThemeChange = (themeId) => {
    setPreviewTheme(themeId);
    const updated = { ...localSettings, theme: themeId };
    setLocalSettings(updated);
    onSettingsChange(updated);
  };

  const handleSettingChange = (key, value) => {
    const updated = { ...localSettings, [key]: value };
    setLocalSettings(updated);
    onSettingsChange(updated);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Theme Selection</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {themes?.map((theme) => (
            <div
              key={theme?.id}
              className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                previewTheme === theme?.id
                  ? 'border-primary bg-primary/10' :'border-panel-border hover:border-primary/50'
              }`}
              onClick={() => handleThemeChange(theme?.id)}
            >
              <div className="flex items-start space-x-3">
                <div className={`w-12 h-8 rounded ${theme?.preview} border border-panel-border`} />
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-medium text-foreground">{theme?.name}</h4>
                    {theme?.isDefault && (
                      <span className="px-2 py-1 text-xs bg-primary text-primary-foreground rounded">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{theme?.description}</p>
                </div>
                {previewTheme === theme?.id && (
                  <Icon name="Check" size={16} className="text-primary" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-panel-border pt-6">
        <h4 className="text-md font-medium text-foreground mb-4">Color Scheme</h4>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {colorSchemes?.map((scheme, index) => (
            <button
              key={index}
              className={`p-3 border rounded-lg text-left transition-all duration-200 ${
                scheme?.active
                  ? 'border-primary bg-primary/10' :'border-panel-border hover:border-primary/50'
              }`}
              onClick={() => {
                // Handle color scheme change
              }}
            >
              <div className="flex items-center space-x-2">
                <div 
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: scheme?.color }}
                />
                <span className="text-sm font-medium text-foreground">{scheme?.name}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
      <div className="border-t border-panel-border pt-6">
        <h4 className="text-md font-medium text-foreground mb-4">Theme Customization</h4>
        
        <div className="space-y-4">
          <Checkbox
            label="Auto Switch Theme"
            description="Automatically switch between light and dark themes based on system preference"
            checked={localSettings?.autoSwitchTheme}
            onChange={(e) => handleSettingChange('autoSwitchTheme', e?.target?.checked)}
          />
          
          <Checkbox
            label="Smooth Transitions"
            description="Enable smooth animations when switching themes"
            checked={localSettings?.smoothTransitions}
            onChange={(e) => handleSettingChange('smoothTransitions', e?.target?.checked)}
          />
          
          <Checkbox
            label="High Contrast Mode"
            description="Increase contrast for better accessibility"
            checked={localSettings?.highContrast}
            onChange={(e) => handleSettingChange('highContrast', e?.target?.checked)}
          />
        </div>
      </div>
      <div className="border-t border-panel-border pt-6">
        <h4 className="text-md font-medium text-foreground mb-4">Custom Theme Import</h4>
        
        <div className="space-y-4">
          <div className="p-4 border-2 border-dashed border-panel-border rounded-lg">
            <div className="text-center">
              <Icon name="Upload" size={24} className="mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-foreground mb-2">Import Custom Theme</p>
              <p className="text-xs text-muted-foreground mb-4">
                Upload a JSON theme file or paste theme configuration
              </p>
              <div className="flex justify-center space-x-2">
                <Button variant="outline" size="sm">
                  <Icon name="Upload" size={16} className="mr-2" />
                  Upload File
                </Button>
                <Button variant="outline" size="sm">
                  <Icon name="Code" size={16} className="mr-2" />
                  Paste JSON
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-between items-center pt-4">
        <Button
          variant="outline"
          onClick={() => {
            // Export current theme
          }}
        >
          <Icon name="Download" size={16} className="mr-2" />
          Export Theme
        </Button>
        
        <div className="flex space-x-3">
          <Button
            variant="outline"
            onClick={() => {
              const defaults = {
                theme: 'dark-professional',
                autoSwitchTheme: false,
                smoothTransitions: true,
                highContrast: false
              };
              setLocalSettings(defaults);
              setPreviewTheme(defaults?.theme);
              onSettingsChange(defaults);
            }}
          >
            Reset to Defaults
          </Button>
          
          <Button variant="default">
            Apply Theme
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ThemePreferencesPanel;