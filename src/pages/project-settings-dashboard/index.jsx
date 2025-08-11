import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import SettingsTab from './components/SettingsTab';
import EditorSettingsPanel from './components/EditorSettingsPanel';
import ThemePreferencesPanel from './components/ThemePreferencesPanel';
import AIConfigurationPanel from './components/AIConfigurationPanel';
import KeyboardShortcutsPanel from './components/KeyboardShortcutsPanel';
import ProjectManagementPanel from './components/ProjectManagementPanel';

const ProjectSettingsDashboard = () => {
  const [activeTab, setActiveTab] = useState('editor');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [expandedAccordion, setExpandedAccordion] = useState('editor');

  // Settings state
  const [editorSettings, setEditorSettings] = useState({
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
  });

  const [themeSettings, setThemeSettings] = useState({
    theme: 'dark-professional',
    autoSwitchTheme: false,
    smoothTransitions: true,
    highContrast: false
  });

  const [aiSettings, setAISettings] = useState({
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
  });

  const [keyboardSettings, setKeyboardSettings] = useState({
    vscodeCompatibility: true,
    vimKeybindings: false,
    showTooltips: true,
    shortcuts: []
  });

  const [projectSettings, setProjectSettings] = useState({
    projectName: '',
    projectDescription: '',
    collaboration: false,
    publicSharing: false,
    versionControl: true,
    autoSync: false,
    debugMode: false,
    performanceMonitoring: false,
    experimentalFeatures: false
  });

  const tabs = [
    {
      id: 'editor',
      label: 'Editor Settings',
      icon: 'Code',
      hasChanges: false
    },
    {
      id: 'theme',
      label: 'Theme Preferences',
      icon: 'Palette',
      hasChanges: false
    },
    {
      id: 'ai',
      label: 'AI Configuration',
      icon: 'Bot',
      hasChanges: false
    },
    {
      id: 'keyboard',
      label: 'Keyboard Shortcuts',
      icon: 'Keyboard',
      hasChanges: false
    },
    {
      id: 'project',
      label: 'Project Management',
      icon: 'FolderOpen',
      hasChanges: false
    }
  ];

  // Check for mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Load settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('codestudio-project-settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        if (parsed?.editor) setEditorSettings(parsed?.editor);
        if (parsed?.theme) setThemeSettings(parsed?.theme);
        if (parsed?.ai) setAISettings(parsed?.ai);
        if (parsed?.keyboard) setKeyboardSettings(parsed?.keyboard);
        if (parsed?.project) setProjectSettings(parsed?.project);
      } catch (error) {
        console.warn('Failed to load saved settings:', error);
      }
    }
  }, []);

  // Save settings to localStorage
  const saveAllSettings = () => {
    const allSettings = {
      editor: editorSettings,
      theme: themeSettings,
      ai: aiSettings,
      keyboard: keyboardSettings,
      project: projectSettings,
      lastUpdated: new Date()?.toISOString()
    };
    
    localStorage.setItem('codestudio-project-settings', JSON.stringify(allSettings));
    setHasUnsavedChanges(false);
  };

  const handleSettingsChange = (category, newSettings) => {
    setHasUnsavedChanges(true);
    
    switch (category) {
      case 'editor':
        setEditorSettings(newSettings);
        break;
      case 'theme':
        setThemeSettings(newSettings);
        break;
      case 'ai':
        setAISettings(newSettings);
        break;
      case 'keyboard':
        setKeyboardSettings(newSettings);
        break;
      case 'project':
        setProjectSettings(newSettings);
        break;
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'editor':
        return (
          <EditorSettingsPanel
            settings={editorSettings}
            onSettingsChange={(settings) => handleSettingsChange('editor', settings)}
          />
        );
      case 'theme':
        return (
          <ThemePreferencesPanel
            settings={themeSettings}
            onSettingsChange={(settings) => handleSettingsChange('theme', settings)}
          />
        );
      case 'ai':
        return (
          <AIConfigurationPanel
            settings={aiSettings}
            onSettingsChange={(settings) => handleSettingsChange('ai', settings)}
          />
        );
      case 'keyboard':
        return (
          <KeyboardShortcutsPanel
            settings={keyboardSettings}
            onSettingsChange={(settings) => handleSettingsChange('keyboard', settings)}
          />
        );
      case 'project':
        return (
          <ProjectManagementPanel
            settings={projectSettings}
            onSettingsChange={(settings) => handleSettingsChange('project', settings)}
          />
        );
      default:
        return null;
    }
  };

  const renderMobileAccordion = () => {
    return (
      <div className="space-y-2">
        {tabs?.map((tab) => (
          <div key={tab?.id} className="border border-panel-border rounded-lg">
            <button
              onClick={() => setExpandedAccordion(expandedAccordion === tab?.id ? null : tab?.id)}
              className="w-full flex items-center justify-between p-4 text-left hover:bg-hover transition-colors"
            >
              <div className="flex items-center space-x-3">
                <Icon name={tab?.icon} size={18} />
                <span className="font-medium text-foreground">{tab?.label}</span>
                {tab?.hasChanges && (
                  <div className="w-2 h-2 bg-warning rounded-full" />
                )}
              </div>
              <Icon 
                name="ChevronDown" 
                size={16} 
                className={`transition-transform ${
                  expandedAccordion === tab?.id ? 'rotate-180' : ''
                }`}
              />
            </button>
            
            {expandedAccordion === tab?.id && (
              <div className="border-t border-panel-border p-4">
                {tab?.id === 'editor' && (
                  <EditorSettingsPanel
                    settings={editorSettings}
                    onSettingsChange={(settings) => handleSettingsChange('editor', settings)}
                  />
                )}
                {tab?.id === 'theme' && (
                  <ThemePreferencesPanel
                    settings={themeSettings}
                    onSettingsChange={(settings) => handleSettingsChange('theme', settings)}
                  />
                )}
                {tab?.id === 'ai' && (
                  <AIConfigurationPanel
                    settings={aiSettings}
                    onSettingsChange={(settings) => handleSettingsChange('ai', settings)}
                  />
                )}
                {tab?.id === 'keyboard' && (
                  <KeyboardShortcutsPanel
                    settings={keyboardSettings}
                    onSettingsChange={(settings) => handleSettingsChange('keyboard', settings)}
                  />
                )}
                {tab?.id === 'project' && (
                  <ProjectManagementPanel
                    settings={projectSettings}
                    onSettingsChange={(settings) => handleSettingsChange('project', settings)}
                  />
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-surface border-b border-panel-border">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-4">
            <Link 
              to="/main-ide-interface"
              className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Icon name="ArrowLeft" size={20} />
              <span className="text-sm">Back to IDE</span>
            </Link>
            
            <div className="w-px h-6 bg-panel-border" />
            
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
                <Icon name="Settings" size={16} color="white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-foreground">Project Settings</h1>
                <p className="text-sm text-muted-foreground">Configure your development environment</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            {hasUnsavedChanges && (
              <div className="flex items-center space-x-2 text-warning">
                <Icon name="AlertCircle" size={16} />
                <span className="text-sm">Unsaved changes</span>
              </div>
            )}
            
            <Button
              variant="outline"
              onClick={() => {
                // Reset all settings
                const confirmReset = confirm('Are you sure you want to reset all settings to defaults?');
                if (confirmReset) {
                  localStorage.removeItem('codestudio-project-settings');
                  window.location?.reload();
                }
              }}
            >
              Reset All
            </Button>
            
            <Button
              variant="default"
              onClick={saveAllSettings}
              disabled={!hasUnsavedChanges}
            >
              <Icon name="Save" size={16} className="mr-2" />
              Save Changes
            </Button>
          </div>
        </div>
      </div>
      {/* Main Content */}
      <div className="flex h-[calc(100vh-73px)]">
        {!isMobile ? (
          <>
            {/* Desktop Sidebar */}
            <div className="w-64 bg-panel border-r border-panel-border overflow-y-auto">
              <div className="p-4">
                <nav className="space-y-2">
                  {tabs?.map((tab) => (
                    <SettingsTab
                      key={tab?.id}
                      id={tab?.id}
                      label={tab?.label}
                      icon={tab?.icon}
                      isActive={activeTab === tab?.id}
                      onClick={setActiveTab}
                      hasChanges={tab?.hasChanges}
                    />
                  ))}
                </nav>
              </div>
              
              {/* Quick Navigation */}
              <div className="border-t border-panel-border p-4 mt-4">
                <h4 className="text-sm font-medium text-muted-foreground mb-3">Quick Access</h4>
                <div className="space-y-2">
                  <Link
                    to="/file-explorer-panel"
                    className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Icon name="FolderOpen" size={14} />
                    <span>File Explorer</span>
                  </Link>
                  <Link
                    to="/code-editor-workspace"
                    className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Icon name="FileText" size={14} />
                    <span>Code Editor</span>
                  </Link>
                  <Link
                    to="/ai-assistant-sidebar"
                    className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Icon name="Bot" size={14} />
                    <span>AI Assistant</span>
                  </Link>
                  <Link
                    to="/terminal-integration-panel"
                    className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Icon name="Terminal" size={14} />
                    <span>Terminal</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Desktop Content */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-6">
                {renderTabContent()}
              </div>
            </div>
          </>
        ) : (
          /* Mobile Accordion Layout */
          (<div className="flex-1 overflow-y-auto p-4">
            {renderMobileAccordion()}
          </div>)
        )}
      </div>
      {/* Mobile Save Bar */}
      {isMobile && hasUnsavedChanges && (
        <div className="fixed bottom-0 left-0 right-0 bg-surface border-t border-panel-border p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-warning">
              <Icon name="AlertCircle" size={16} />
              <span className="text-sm">You have unsaved changes</span>
            </div>
            
            <Button variant="default" onClick={saveAllSettings}>
              <Icon name="Save" size={16} className="mr-2" />
              Save All
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectSettingsDashboard;