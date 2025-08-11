import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';
import Button from './Button';

const SettingsAccessController = ({ 
  isOpen = false, 
  onClose, 
  workspaceState,
  onWorkspaceRestore 
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [savedWorkspace, setSavedWorkspace] = useState(null);

  useEffect(() => {
    if (isOpen) {
      // Save current workspace state when opening settings
      setSavedWorkspace(workspaceState);
      setIsAnimating(true);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, workspaceState]);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      if (onClose) {
        onClose();
      }
      // Restore workspace state when closing settings
      if (savedWorkspace && onWorkspaceRestore) {
        onWorkspaceRestore(savedWorkspace);
      }
    }, 200);
  };

  const handleBackdropClick = (e) => {
    if (e?.target === e?.currentTarget) {
      handleClose();
    }
  };

  const handleKeyDown = (e) => {
    if (e?.key === 'Escape') {
      handleClose();
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div 
      className={`fixed inset-0 z-100 bg-background/80 backdrop-blur-sm transition-opacity duration-200 ${
        isAnimating ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={handleBackdropClick}
    >
      <div 
        className={`fixed inset-4 bg-surface border border-panel-border rounded-lg shadow-floating transition-all duration-300 ${
          isAnimating ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
        onClick={(e) => e?.stopPropagation()}
      >
        {/* Settings Header */}
        <div className="flex items-center justify-between p-4 border-b border-panel-border">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
              <Icon name="Settings" size={16} color="white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-foreground">Project Settings</h1>
              <p className="text-sm text-muted-foreground">Configure your development environment</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                // Handle save settings
              }}
              className="text-success hover:bg-success/10"
            >
              <Icon name="Save" size={16} className="mr-2" />
              Save Changes
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="hover:bg-hover"
            >
              <Icon name="X" size={16} />
            </Button>
          </div>
        </div>

        {/* Settings Content */}
        <div className="flex h-full">
          {/* Settings Sidebar */}
          <div className="w-64 border-r border-panel-border bg-panel">
            <div className="p-4">
              <nav className="space-y-1">
                <SettingsNavItem 
                  icon="Palette" 
                  label="Appearance" 
                  active={true}
                />
                <SettingsNavItem 
                  icon="Code" 
                  label="Editor" 
                />
                <SettingsNavItem 
                  icon="Keyboard" 
                  label="Keyboard Shortcuts" 
                />
                <SettingsNavItem 
                  icon="Puzzle" 
                  label="Extensions" 
                />
                <SettingsNavItem 
                  icon="Terminal" 
                  label="Terminal" 
                />
                <SettingsNavItem 
                  icon="Bot" 
                  label="AI Assistant" 
                />
                <div className="border-t border-panel-border my-2 pt-2">
                  <SettingsNavItem 
                    icon="FolderOpen" 
                    label="Workspace" 
                  />
                  <SettingsNavItem 
                    icon="Users" 
                    label="Collaboration" 
                  />
                  <SettingsNavItem 
                    icon="Shield" 
                    label="Security" 
                  />
                </div>
              </nav>
            </div>
          </div>

          {/* Settings Main Content */}
          <div className="flex-1 overflow-auto">
            <div className="p-6">
              <div className="max-w-2xl">
                <h2 className="text-xl font-semibold text-foreground mb-6">Appearance Settings</h2>
                
                {/* Theme Selection */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium text-foreground mb-3">Color Theme</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <ThemeOption 
                        name="Dark Professional" 
                        description="Optimized for extended coding sessions"
                        active={true}
                      />
                      <ThemeOption 
                        name="Light Clean" 
                        description="High contrast for bright environments"
                      />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-foreground mb-3">Font Settings</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm text-muted-foreground">Editor Font Family</label>
                        <select className="w-full mt-1 px-3 py-2 bg-input border border-panel-border rounded-md text-foreground">
                          <option>JetBrains Mono</option>
                          <option>Fira Code</option>
                          <option>Source Code Pro</option>
                          <option>Consolas</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-sm text-muted-foreground">Font Size</label>
                        <input 
                          type="range" 
                          min="10" 
                          max="20" 
                          defaultValue="14"
                          className="w-full mt-1"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground mt-1">
                          <span>10px</span>
                          <span>14px</span>
                          <span>20px</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-foreground mb-3">Layout Preferences</h3>
                    <div className="space-y-3">
                      <label className="flex items-center space-x-3">
                        <input type="checkbox" defaultChecked className="rounded" />
                        <span className="text-sm text-foreground">Show minimap in editor</span>
                      </label>
                      <label className="flex items-center space-x-3">
                        <input type="checkbox" defaultChecked className="rounded" />
                        <span className="text-sm text-foreground">Enable breadcrumbs</span>
                      </label>
                      <label className="flex items-center space-x-3">
                        <input type="checkbox" className="rounded" />
                        <span className="text-sm text-foreground">Compact panel headers</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Workspace State Indicator */}
        {savedWorkspace && (
          <div className="absolute bottom-4 left-4 flex items-center space-x-2 text-xs text-muted-foreground">
            <Icon name="Save" size={12} />
            <span>Workspace state preserved</span>
          </div>
        )}
      </div>
    </div>
  );
};

const SettingsNavItem = ({ icon, label, active = false }) => (
  <button
    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-sm transition-colors ${
      active 
        ? 'bg-primary text-primary-foreground' 
        : 'text-foreground hover:bg-hover'
    }`}
  >
    <Icon name={icon} size={16} />
    <span>{label}</span>
  </button>
);

const ThemeOption = ({ name, description, active = false }) => (
  <button
    className={`p-4 border rounded-lg text-left transition-colors ${
      active 
        ? 'border-primary bg-primary/10' :'border-panel-border hover:border-primary/50'
    }`}
  >
    <div className="font-medium text-foreground">{name}</div>
    <div className="text-xs text-muted-foreground mt-1">{description}</div>
  </button>
);

export default SettingsAccessController;