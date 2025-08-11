import React, { useState } from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const AIConfigurationPanel = ({ settings, onSettingsChange }) => {
  const [localSettings, setLocalSettings] = useState(settings);
  const [testingConnection, setTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState(null);

  const aiModels = [
    { value: 'gpt-4', label: 'GPT-4 (Recommended)' },
    { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo' },
    { value: 'claude-3', label: 'Claude 3' },
    { value: 'codellama', label: 'Code Llama' },
    { value: 'local-model', label: 'Local Model' }
  ];

  const sensitivityOptions = [
    { value: 'low', label: 'Low - Minimal suggestions' },
    { value: 'medium', label: 'Medium - Balanced suggestions' },
    { value: 'high', label: 'High - Frequent suggestions' },
    { value: 'aggressive', label: 'Aggressive - Maximum suggestions' }
  ];

  const handleSettingChange = (key, value) => {
    const updated = { ...localSettings, [key]: value };
    setLocalSettings(updated);
    onSettingsChange(updated);
  };

  const testConnection = async () => {
    setTestingConnection(true);
    setConnectionStatus(null);
    
    // Simulate API test
    setTimeout(() => {
      const isValid = localSettings?.apiKey && localSettings?.apiKey?.length > 10;
      setConnectionStatus(isValid ? 'success' : 'error');
      setTestingConnection(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">AI Model Configuration</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Select
              label="AI Model"
              description="Choose your preferred AI model for assistance"
              options={aiModels}
              value={localSettings?.model}
              onChange={(value) => handleSettingChange('model', value)}
            />
          </div>
          
          <div>
            <Select
              label="Suggestion Sensitivity"
              description="How frequently AI suggestions appear"
              options={sensitivityOptions}
              value={localSettings?.sensitivity}
              onChange={(value) => handleSettingChange('sensitivity', value)}
            />
          </div>
        </div>
      </div>
      <div className="border-t border-panel-border pt-6">
        <h4 className="text-md font-medium text-foreground mb-4">API Configuration</h4>
        
        <div className="space-y-4">
          <div>
            <Input
              label="API Key"
              type="password"
              description="Your AI service API key (stored locally)"
              placeholder="sk-..."
              value={localSettings?.apiKey}
              onChange={(e) => handleSettingChange('apiKey', e?.target?.value)}
            />
          </div>
          
          <div>
            <Input
              label="API Endpoint"
              type="url"
              description="Custom API endpoint (optional)"
              placeholder="https://api.openai.com/v1"
              value={localSettings?.apiEndpoint}
              onChange={(e) => handleSettingChange('apiEndpoint', e?.target?.value)}
            />
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              onClick={testConnection}
              loading={testingConnection}
              disabled={!localSettings?.apiKey}
            >
              <Icon name="Zap" size={16} className="mr-2" />
              Test Connection
            </Button>
            
            {connectionStatus && (
              <div className={`flex items-center space-x-2 ${
                connectionStatus === 'success' ? 'text-success' : 'text-error'
              }`}>
                <Icon 
                  name={connectionStatus === 'success' ? 'CheckCircle' : 'XCircle'} 
                  size={16} 
                />
                <span className="text-sm">
                  {connectionStatus === 'success' ? 'Connection successful' : 'Connection failed'}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="border-t border-panel-border pt-6">
        <h4 className="text-md font-medium text-foreground mb-4">AI Features</h4>
        
        <div className="space-y-4">
          <Checkbox
            label="Code Completion"
            description="Enable AI-powered code completion suggestions"
            checked={localSettings?.codeCompletion}
            onChange={(e) => handleSettingChange('codeCompletion', e?.target?.checked)}
          />
          
          <Checkbox
            label="Code Explanation"
            description="Allow AI to explain selected code blocks"
            checked={localSettings?.codeExplanation}
            onChange={(e) => handleSettingChange('codeExplanation', e?.target?.checked)}
          />
          
          <Checkbox
            label="Error Detection"
            description="Use AI to detect and suggest fixes for errors"
            checked={localSettings?.errorDetection}
            onChange={(e) => handleSettingChange('errorDetection', e?.target?.checked)}
          />
          
          <Checkbox
            label="Code Refactoring"
            description="Enable AI suggestions for code improvements"
            checked={localSettings?.codeRefactoring}
            onChange={(e) => handleSettingChange('codeRefactoring', e?.target?.checked)}
          />
          
          <Checkbox
            label="Documentation Generation"
            description="Auto-generate documentation for functions and classes"
            checked={localSettings?.docGeneration}
            onChange={(e) => handleSettingChange('docGeneration', e?.target?.checked)}
          />
        </div>
      </div>
      <div className="border-t border-panel-border pt-6">
        <h4 className="text-md font-medium text-foreground mb-4">Privacy & Security</h4>
        
        <div className="space-y-4">
          <Checkbox
            label="Local Processing Only"
            description="Process code locally when possible (requires local model)"
            checked={localSettings?.localProcessing}
            onChange={(e) => handleSettingChange('localProcessing', e?.target?.checked)}
          />
          
          <Checkbox
            label="Anonymize Code"
            description="Remove sensitive information before sending to AI"
            checked={localSettings?.anonymizeCode}
            onChange={(e) => handleSettingChange('anonymizeCode', e?.target?.checked)}
          />
          
          <Checkbox
            label="Cache Responses"
            description="Cache AI responses locally for faster performance"
            checked={localSettings?.cacheResponses}
            onChange={(e) => handleSettingChange('cacheResponses', e?.target?.checked)}
          />
        </div>
      </div>
      <div className="border-t border-panel-border pt-6">
        <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Icon name="AlertTriangle" size={16} className="text-warning mt-0.5" />
            <div>
              <h5 className="font-medium text-foreground">Security Notice</h5>
              <p className="text-sm text-muted-foreground mt-1">
                API keys are stored locally in your browser and never transmitted to our servers. 
                Always use environment variables or secure key management in production.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-end space-x-3 pt-4">
        <Button
          variant="outline"
          onClick={() => {
            const defaults = {
              model: 'gpt-4',
              sensitivity: 'medium',
              apiKey: '',
              apiEndpoint: '',
              codeCompletion: true,
              codeExplanation: true,
              errorDetection: true,
              codeRefactoring: false,
              docGeneration: false,
              localProcessing: false,
              anonymizeCode: true,
              cacheResponses: true
            };
            setLocalSettings(defaults);
            onSettingsChange(defaults);
            setConnectionStatus(null);
          }}
        >
          Reset to Defaults
        </Button>
        
        <Button variant="default">
          Save Configuration
        </Button>
      </div>
    </div>
  );
};

export default AIConfigurationPanel;