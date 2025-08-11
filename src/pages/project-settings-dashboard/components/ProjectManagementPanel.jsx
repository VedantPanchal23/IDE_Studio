import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';

const ProjectManagementPanel = ({ settings, onSettingsChange }) => {
  const [localSettings, setLocalSettings] = useState(settings);
  const [exportProgress, setExportProgress] = useState(null);
  const [storageUsage, setStorageUsage] = useState({
    used: 2.4,
    total: 10,
    files: 15,
    projects: 3
  });

  const handleSettingChange = (key, value) => {
    const updated = { ...localSettings, [key]: value };
    setLocalSettings(updated);
    onSettingsChange(updated);
  };

  const exportProject = async () => {
    setExportProgress(0);
    
    // Simulate export progress
    const interval = setInterval(() => {
      setExportProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setExportProgress(null), 1000);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    // Create export data
    const exportData = {
      project: {
        name: localSettings?.projectName || 'My Project',
        version: '1.0.0',
        created: new Date()?.toISOString(),
        settings: localSettings
      },
      files: [
        { path: '/src/main.js', content: 'console.log("Hello World");' },
        { path: '/src/utils.js', content: 'export const helper = () => {};' },
        { path: '/package.json', content: '{"name": "project", "version": "1.0.0"}' }
      ],
      metadata: {
        exportedAt: new Date()?.toISOString(),
        exportedBy: 'CodeStudio IDE'
      }
    };

    setTimeout(() => {
      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: 'application/json'
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${localSettings?.projectName || 'project'}-export.json`;
      a?.click();
      URL.revokeObjectURL(url);
    }, 2000);
  };

  const clearStorage = () => {
    if (confirm('Are you sure you want to clear all stored data? This action cannot be undone.')) {
      localStorage.clear();
      setStorageUsage({ used: 0, total: 10, files: 0, projects: 0 });
    }
  };

  const backupSettings = () => {
    const backup = {
      settings: localSettings,
      timestamp: new Date()?.toISOString(),
      version: '1.0'
    };
    
    const blob = new Blob([JSON.stringify(backup, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `codestudio-settings-backup-${new Date()?.toISOString()?.split('T')?.[0]}.json`;
    a?.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Project Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Input
              label="Project Name"
              description="Name for your current project"
              value={localSettings?.projectName || ''}
              onChange={(e) => handleSettingChange('projectName', e?.target?.value)}
              placeholder="My Awesome Project"
            />
          </div>
          
          <div>
            <Input
              label="Project Description"
              description="Brief description of your project"
              value={localSettings?.projectDescription || ''}
              onChange={(e) => handleSettingChange('projectDescription', e?.target?.value)}
              placeholder="A web application built with React"
            />
          </div>
        </div>
      </div>
      <div className="border-t border-panel-border pt-6">
        <h4 className="text-md font-medium text-foreground mb-4">Storage Management</h4>
        
        <div className="bg-panel border border-panel-border rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-foreground">Storage Usage</span>
            <span className="text-sm text-muted-foreground">
              {storageUsage?.used} MB / {storageUsage?.total} MB
            </span>
          </div>
          
          <div className="w-full bg-muted rounded-full h-2 mb-3">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${(storageUsage?.used / storageUsage?.total) * 100}%` }}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Files: </span>
              <span className="text-foreground font-medium">{storageUsage?.files}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Projects: </span>
              <span className="text-foreground font-medium">{storageUsage?.projects}</span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" onClick={clearStorage}>
            <Icon name="Trash2" size={16} className="mr-2" />
            Clear All Data
          </Button>
          
          <Button variant="outline">
            <Icon name="RefreshCw" size={16} className="mr-2" />
            Refresh Usage
          </Button>
        </div>
      </div>
      <div className="border-t border-panel-border pt-6">
        <h4 className="text-md font-medium text-foreground mb-4">Import & Export</h4>
        
        <div className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <Button 
              variant="default" 
              onClick={exportProject}
              disabled={exportProgress !== null}
            >
              {exportProgress !== null ? (
                <>
                  <Icon name="Loader2" size={16} className="mr-2 animate-spin" />
                  Exporting... {exportProgress}%
                </>
              ) : (
                <>
                  <Icon name="Download" size={16} className="mr-2" />
                  Export Project
                </>
              )}
            </Button>
            
            <Button variant="outline">
              <Icon name="Upload" size={16} className="mr-2" />
              Import Project
            </Button>
            
            <Button variant="outline" onClick={backupSettings}>
              <Icon name="Save" size={16} className="mr-2" />
              Backup Settings
            </Button>
          </div>
          
          {exportProgress !== null && (
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${exportProgress}%` }}
              />
            </div>
          )}
        </div>
      </div>
      <div className="border-t border-panel-border pt-6">
        <h4 className="text-md font-medium text-foreground mb-4">Collaboration Settings</h4>
        
        <div className="space-y-4">
          <Checkbox
            label="Enable Real-time Collaboration"
            description="Allow multiple users to edit files simultaneously"
            checked={localSettings?.collaboration}
            onChange={(e) => handleSettingChange('collaboration', e?.target?.checked)}
          />
          
          <Checkbox
            label="Share Project Publicly"
            description="Make this project accessible via public link"
            checked={localSettings?.publicSharing}
            onChange={(e) => handleSettingChange('publicSharing', e?.target?.checked)}
          />
          
          <Checkbox
            label="Version Control Integration"
            description="Enable Git integration for version tracking"
            checked={localSettings?.versionControl}
            onChange={(e) => handleSettingChange('versionControl', e?.target?.checked)}
          />
          
          <Checkbox
            label="Auto-sync Changes"
            description="Automatically sync changes across devices"
            checked={localSettings?.autoSync}
            onChange={(e) => handleSettingChange('autoSync', e?.target?.checked)}
          />
        </div>
      </div>
      <div className="border-t border-panel-border pt-6">
        <h4 className="text-md font-medium text-foreground mb-4">Advanced Options</h4>
        
        <div className="space-y-4">
          <Checkbox
            label="Enable Debug Mode"
            description="Show additional debugging information in console"
            checked={localSettings?.debugMode}
            onChange={(e) => handleSettingChange('debugMode', e?.target?.checked)}
          />
          
          <Checkbox
            label="Performance Monitoring"
            description="Track and log performance metrics"
            checked={localSettings?.performanceMonitoring}
            onChange={(e) => handleSettingChange('performanceMonitoring', e?.target?.checked)}
          />
          
          <Checkbox
            label="Experimental Features"
            description="Enable experimental and beta features"
            checked={localSettings?.experimentalFeatures}
            onChange={(e) => handleSettingChange('experimentalFeatures', e?.target?.checked)}
          />
        </div>
      </div>
      <div className="border-t border-panel-border pt-6">
        <div className="bg-error/10 border border-error/20 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Icon name="AlertTriangle" size={16} className="text-error mt-0.5" />
            <div>
              <h5 className="font-medium text-foreground">Data Management Notice</h5>
              <p className="text-sm text-muted-foreground mt-1">
                All project data is stored locally in your browser. Clearing browser data or using 
                incognito mode will result in data loss. Regular backups are recommended.
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
              projectName: '',
              projectDescription: '',
              collaboration: false,
              publicSharing: false,
              versionControl: true,
              autoSync: false,
              debugMode: false,
              performanceMonitoring: false,
              experimentalFeatures: false
            };
            setLocalSettings(defaults);
            onSettingsChange(defaults);
          }}
        >
          Reset to Defaults
        </Button>
        
        <Button variant="default">
          Save Project Settings
        </Button>
      </div>
    </div>
  );
};

export default ProjectManagementPanel;