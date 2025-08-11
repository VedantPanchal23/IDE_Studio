import React, { useState } from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';
import Button from '../../../components/ui/Button';

const EditorSettingsPanel = ({ settings, onSettingsChange }) => {
  const [localSettings, setLocalSettings] = useState(settings);

  const fontFamilyOptions = [
    { value: 'JetBrains Mono', label: 'JetBrains Mono' },
    { value: 'Fira Code', label: 'Fira Code' },
    { value: 'Source Code Pro', label: 'Source Code Pro' },
    { value: 'Consolas', label: 'Consolas' },
    { value: 'Monaco', label: 'Monaco' }
  ];

  const tabSizeOptions = [
    { value: '2', label: '2 spaces' },
    { value: '4', label: '4 spaces' },
    { value: '8', label: '8 spaces' }
  ];

  const handleSettingChange = (key, value) => {
    const updated = { ...localSettings, [key]: value };
    setLocalSettings(updated);
    onSettingsChange(updated);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Editor Configuration</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Select
              label="Font Family"
              description="Choose your preferred coding font"
              options={fontFamilyOptions}
              value={localSettings?.fontFamily}
              onChange={(value) => handleSettingChange('fontFamily', value)}
            />
          </div>
          
          <div>
            <Input
              label="Font Size"
              type="number"
              description="Font size in pixels"
              value={localSettings?.fontSize}
              onChange={(e) => handleSettingChange('fontSize', e?.target?.value)}
              min="10"
              max="24"
            />
          </div>
          
          <div>
            <Select
              label="Tab Size"
              description="Number of spaces per tab"
              options={tabSizeOptions}
              value={localSettings?.tabSize}
              onChange={(value) => handleSettingChange('tabSize', value)}
            />
          </div>
          
          <div>
            <Input
              label="Line Height"
              type="number"
              description="Line height multiplier"
              value={localSettings?.lineHeight}
              onChange={(e) => handleSettingChange('lineHeight', e?.target?.value)}
              min="1.0"
              max="2.0"
              step="0.1"
            />
          </div>
        </div>
      </div>
      <div className="border-t border-panel-border pt-6">
        <h4 className="text-md font-medium text-foreground mb-4">Editor Behavior</h4>
        
        <div className="space-y-4">
          <Checkbox
            label="Word Wrap"
            description="Wrap long lines to fit editor width"
            checked={localSettings?.wordWrap}
            onChange={(e) => handleSettingChange('wordWrap', e?.target?.checked)}
          />
          
          <Checkbox
            label="Show Line Numbers"
            description="Display line numbers in the editor"
            checked={localSettings?.lineNumbers}
            onChange={(e) => handleSettingChange('lineNumbers', e?.target?.checked)}
          />
          
          <Checkbox
            label="Show Minimap"
            description="Display code minimap for navigation"
            checked={localSettings?.minimap}
            onChange={(e) => handleSettingChange('minimap', e?.target?.checked)}
          />
          
          <Checkbox
            label="Auto Save"
            description="Automatically save files after changes"
            checked={localSettings?.autoSave}
            onChange={(e) => handleSettingChange('autoSave', e?.target?.checked)}
          />
          
          <Checkbox
            label="Format on Save"
            description="Automatically format code when saving"
            checked={localSettings?.formatOnSave}
            onChange={(e) => handleSettingChange('formatOnSave', e?.target?.checked)}
          />
          
          <Checkbox
            label="Bracket Matching"
            description="Highlight matching brackets"
            checked={localSettings?.bracketMatching}
            onChange={(e) => handleSettingChange('bracketMatching', e?.target?.checked)}
          />
        </div>
      </div>
      <div className="border-t border-panel-border pt-6">
        <h4 className="text-md font-medium text-foreground mb-4">Code Completion</h4>
        
        <div className="space-y-4">
          <Checkbox
            label="Enable IntelliSense"
            description="Show intelligent code suggestions"
            checked={localSettings?.intelliSense}
            onChange={(e) => handleSettingChange('intelliSense', e?.target?.checked)}
          />
          
          <Checkbox
            label="Auto Close Brackets"
            description="Automatically close brackets and quotes"
            checked={localSettings?.autoCloseBrackets}
            onChange={(e) => handleSettingChange('autoCloseBrackets', e?.target?.checked)}
          />
          
          <Checkbox
            label="Quick Suggestions"
            description="Show suggestions while typing"
            checked={localSettings?.quickSuggestions}
            onChange={(e) => handleSettingChange('quickSuggestions', e?.target?.checked)}
          />
        </div>
      </div>
      <div className="flex justify-end space-x-3 pt-4">
        <Button
          variant="outline"
          onClick={() => {
            const defaults = {
              fontFamily: 'JetBrains Mono',
              fontSize: '14',
              tabSize: '4',
              lineHeight: '1.5',
              wordWrap: true,
              lineNumbers: true,
              minimap: true,
              autoSave: true,
              formatOnSave: false,
              bracketMatching: true,
              intelliSense: true,
              autoCloseBrackets: true,
              quickSuggestions: true
            };
            setLocalSettings(defaults);
            onSettingsChange(defaults);
          }}
        >
          Reset to Defaults
        </Button>
        
        <Button variant="default">
          Apply Changes
        </Button>
      </div>
    </div>
  );
};

export default EditorSettingsPanel;