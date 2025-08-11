import React, { useState } from 'react';
import Icon from '../AppIcon';
import Button from './Button';

const Header = ({ onSettingsClick, onPanelToggle, panelStates = {} }) => {
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);

  const handlePanelToggle = (panelName) => {
    if (onPanelToggle) {
      onPanelToggle(panelName);
    }
  };

  const handleSettingsClick = () => {
    if (onSettingsClick) {
      onSettingsClick();
    }
    setIsMoreMenuOpen(false);
  };

  const toggleMoreMenu = () => {
    setIsMoreMenuOpen(!isMoreMenuOpen);
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-12 bg-surface border-b border-panel-border z-50 flex items-center">
      <div className="flex items-center justify-between w-full">
        {/* Logo Section */}
        <div className="flex items-center h-full">
          <div className="flex items-center px-4 h-full">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-primary rounded-sm flex items-center justify-center">
                <Icon name="Code" size={14} color="white" />
              </div>
              <span className="text-sm font-medium text-foreground">CodeStudio IDE</span>
            </div>
          </div>
        </div>

        {/* Primary Navigation */}
        <div className="flex items-center h-full">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handlePanelToggle('explorer')}
            className={`h-full px-3 rounded-none border-b-2 transition-colors ${
              panelStates?.explorer 
                ? 'border-primary bg-active text-primary' :'border-transparent hover:bg-hover'
            }`}
          >
            <Icon name="FolderOpen" size={16} className="mr-2" />
            Explorer
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => handlePanelToggle('editor')}
            className={`h-full px-3 rounded-none border-b-2 transition-colors ${
              panelStates?.editor 
                ? 'border-primary bg-active text-primary' :'border-transparent hover:bg-hover'
            }`}
          >
            <Icon name="FileText" size={16} className="mr-2" />
            Editor
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => handlePanelToggle('ai')}
            className={`h-full px-3 rounded-none border-b-2 transition-colors ${
              panelStates?.ai 
                ? 'border-primary bg-active text-primary' :'border-transparent hover:bg-hover'
            }`}
          >
            <Icon name="Bot" size={16} className="mr-2" />
            AI Assistant
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => handlePanelToggle('terminal')}
            className={`h-full px-3 rounded-none border-b-2 transition-colors ${
              panelStates?.terminal 
                ? 'border-primary bg-active text-primary' :'border-transparent hover:bg-hover'
            }`}
          >
            <Icon name="Terminal" size={16} className="mr-2" />
            Terminal
          </Button>

          {/* More Menu */}
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMoreMenu}
              className={`h-full px-3 rounded-none border-b-2 transition-colors ${
                isMoreMenuOpen 
                  ? 'border-primary bg-active text-primary' :'border-transparent hover:bg-hover'
              }`}
            >
              <Icon name="MoreHorizontal" size={16} className="mr-2" />
              More
            </Button>

            {isMoreMenuOpen && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setIsMoreMenuOpen(false)}
                />
                <div className="absolute top-full right-0 mt-1 w-48 bg-popover border border-panel-border rounded-md shadow-floating z-50 py-1">
                  <button
                    onClick={handleSettingsClick}
                    className="w-full px-3 py-2 text-left text-sm text-foreground hover:bg-hover transition-colors flex items-center"
                  >
                    <Icon name="Settings" size={16} className="mr-2" />
                    Project Settings
                  </button>
                  <button
                    onClick={() => {
                      // Handle help action
                      setIsMoreMenuOpen(false);
                    }}
                    className="w-full px-3 py-2 text-left text-sm text-foreground hover:bg-hover transition-colors flex items-center"
                  >
                    <Icon name="HelpCircle" size={16} className="mr-2" />
                    Help & Support
                  </button>
                  <div className="border-t border-panel-border my-1" />
                  <button
                    onClick={() => {
                      // Handle keyboard shortcuts
                      setIsMoreMenuOpen(false);
                    }}
                    className="w-full px-3 py-2 text-left text-sm text-foreground hover:bg-hover transition-colors flex items-center"
                  >
                    <Icon name="Keyboard" size={16} className="mr-2" />
                    Keyboard Shortcuts
                    <span className="ml-auto text-xs text-muted-foreground">Ctrl+K</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right Section - User Actions */}
        <div className="flex items-center h-full pr-4">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 hover:bg-hover"
            onClick={() => {
              // Handle theme toggle
            }}
          >
            <Icon name="Sun" size={16} />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 hover:bg-hover ml-2"
            onClick={() => {
              // Handle notifications
            }}
          >
            <Icon name="Bell" size={16} />
          </Button>

          <div className="w-px h-6 bg-panel-border mx-3" />

          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2 hover:bg-hover"
            onClick={() => {
              // Handle user menu
            }}
          >
            <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center mr-2">
              <Icon name="User" size={12} color="white" />
            </div>
            <span className="text-sm">Dev</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;