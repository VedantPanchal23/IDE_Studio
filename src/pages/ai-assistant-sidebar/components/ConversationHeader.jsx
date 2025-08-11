import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ConversationHeader = ({ 
  onNewChat, 
  onClearHistory, 
  onModelChange, 
  selectedModel = 'gpt-4',
  isCollapsed,
  onToggleCollapse 
}) => {
  const [isModelMenuOpen, setIsModelMenuOpen] = useState(false);

  const aiModels = [
    { id: 'gpt-4', name: 'GPT-4', description: 'Most capable model for complex coding tasks' },
    { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', description: 'Fast and efficient for general coding help' },
    { id: 'claude-3', name: 'Claude 3', description: 'Excellent for code analysis and documentation' },
    { id: 'codellama', name: 'Code Llama', description: 'Specialized for code generation and completion' }
  ];

  const handleModelSelect = (model) => {
    onModelChange(model);
    setIsModelMenuOpen(false);
  };

  const currentModel = aiModels?.find(model => model?.id === selectedModel);

  return (
    <div className="flex items-center justify-between p-4 border-b border-panel-border bg-panel">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
          <Icon name="Bot" size={16} color="white" />
        </div>
        {!isCollapsed && (
          <div>
            <h2 className="text-sm font-semibold text-foreground">AI Assistant</h2>
            <p className="text-xs text-muted-foreground">Coding companion</p>
          </div>
        )}
      </div>
      <div className="flex items-center space-x-1">
        {!isCollapsed && (
          <>
            {/* Model Selection */}
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsModelMenuOpen(!isModelMenuOpen)}
                className="text-xs px-2 py-1 h-7"
              >
                <Icon name="Cpu" size={12} className="mr-1" />
                {currentModel?.name}
                <Icon name="ChevronDown" size={12} className="ml-1" />
              </Button>

              {isModelMenuOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setIsModelMenuOpen(false)}
                  />
                  <div className="absolute top-full right-0 mt-1 w-64 bg-popover border border-panel-border rounded-md shadow-floating z-50 py-1">
                    {aiModels?.map((model) => (
                      <button
                        key={model?.id}
                        onClick={() => handleModelSelect(model)}
                        className={`w-full px-3 py-2 text-left hover:bg-hover transition-colors ${
                          selectedModel === model?.id ? 'bg-active text-primary' : 'text-foreground'
                        }`}
                      >
                        <div className="font-medium text-sm">{model?.name}</div>
                        <div className="text-xs text-muted-foreground">{model?.description}</div>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* New Chat */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onNewChat}
              className="h-7 w-7 p-0"
              title="New conversation"
            >
              <Icon name="Plus" size={14} />
            </Button>

            {/* Clear History */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearHistory}
              className="h-7 w-7 p-0"
              title="Clear conversation"
            >
              <Icon name="Trash2" size={14} />
            </Button>
          </>
        )}

        {/* Collapse Toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleCollapse}
          className="h-7 w-7 p-0"
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <Icon name={isCollapsed ? "ChevronLeft" : "ChevronRight"} size={14} />
        </Button>
      </div>
    </div>
  );
};

export default ConversationHeader;