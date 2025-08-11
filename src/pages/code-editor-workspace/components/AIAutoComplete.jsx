import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AIAutoComplete = ({ 
  isVisible = false, 
  position = { x: 0, y: 0 }, 
  suggestions = [], 
  onSuggestionSelect, 
  onClose,
  currentContext = ''
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Mock AI suggestions based on context
  const mockSuggestions = [
    {
      id: 1,
      text: "useState",
      description: "React Hook for state management",
      type: "hook",
      insertText: "useState()",
      detail: "const [state, setState] = useState(initialValue)"
    },
    {
      id: 2,
      text: "useEffect",
      description: "React Hook for side effects",
      type: "hook",
      insertText: "useEffect(() => {\n  // effect\n}, [])",
      detail: "useEffect(effect, dependencies)"
    },
    {
      id: 3,
      text: "console.log",
      description: "Log output to console",
      type: "method",
      insertText: "console.log()",
      detail: "console.log(value)"
    },
    {
      id: 4,
      text: "function",
      description: "Create a new function",
      type: "keyword",
      insertText: "function name() {\n  // function body\n}",
      detail: "function declaration"
    },
    {
      id: 5,
      text: "const",
      description: "Declare a constant variable",
      type: "keyword",
      insertText: "const name = value;",
      detail: "const declaration"
    }
  ];

  const activeSuggestions = suggestions?.length > 0 ? suggestions : mockSuggestions;

  useEffect(() => {
    if (isVisible) {
      setSelectedIndex(0);
      setIsLoading(true);
      // Simulate AI processing time
      const timer = setTimeout(() => setIsLoading(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isVisible, currentContext]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isVisible) return;

      switch (e?.key) {
        case 'ArrowDown':
          e?.preventDefault();
          setSelectedIndex(prev => 
            prev < activeSuggestions?.length - 1 ? prev + 1 : 0
          );
          break;
        case 'ArrowUp':
          e?.preventDefault();
          setSelectedIndex(prev => 
            prev > 0 ? prev - 1 : activeSuggestions?.length - 1
          );
          break;
        case 'Enter': case'Tab':
          e?.preventDefault();
          handleSuggestionSelect(activeSuggestions?.[selectedIndex]);
          break;
        case 'Escape':
          e?.preventDefault();
          handleClose();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isVisible, selectedIndex, activeSuggestions]);

  const handleSuggestionSelect = (suggestion) => {
    if (onSuggestionSelect) {
      onSuggestionSelect(suggestion);
    }
    handleClose();
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'hook':
        return 'Zap';
      case 'method':
        return 'Code';
      case 'keyword':
        return 'Key';
      case 'variable':
        return 'Variable';
      case 'function':
        return 'Function';
      default:
        return 'Code';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'hook':
        return 'text-blue-400';
      case 'method':
        return 'text-green-400';
      case 'keyword':
        return 'text-purple-400';
      case 'variable':
        return 'text-yellow-400';
      case 'function':
        return 'text-orange-400';
      default:
        return 'text-muted-foreground';
    }
  };

  if (!isVisible) return null;

  return (
    <div
      className="fixed z-50 bg-popover border border-panel-border rounded-md shadow-floating min-w-80 max-w-96"
      style={{
        left: position?.x,
        top: position?.y,
        maxHeight: '300px'
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-panel-border">
        <div className="flex items-center space-x-2">
          <Icon name="Bot" size={14} className="text-primary" />
          <span className="text-xs font-medium text-foreground">AI Suggestions</span>
        </div>
        <Button
          variant="ghost"
          size="xs"
          onClick={handleClose}
          className="h-5 w-5 p-0"
        >
          <Icon name="X" size={10} />
        </Button>
      </div>
      {/* Suggestions List */}
      <div className="max-h-64 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Icon name="Loader2" size={16} className="text-primary animate-spin mr-2" />
            <span className="text-xs text-muted-foreground">Generating suggestions...</span>
          </div>
        ) : (
          <div className="py-1">
            {activeSuggestions?.map((suggestion, index) => (
              <div
                key={suggestion?.id}
                onClick={() => handleSuggestionSelect(suggestion)}
                className={`flex items-start px-3 py-2 cursor-pointer transition-colors ${
                  index === selectedIndex
                    ? 'bg-primary/20 text-primary' :'hover:bg-hover text-foreground'
                }`}
              >
                <Icon
                  name={getTypeIcon(suggestion?.type)}
                  size={14}
                  className={`mt-0.5 mr-3 flex-shrink-0 ${
                    index === selectedIndex ? 'text-primary' : getTypeColor(suggestion?.type)
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium truncate">
                      {suggestion?.text}
                    </span>
                    <span className="text-xs text-muted-foreground ml-2 flex-shrink-0">
                      {suggestion?.type}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 truncate">
                    {suggestion?.description}
                  </p>
                  {suggestion?.detail && (
                    <code className="text-xs text-muted-foreground mt-1 block font-mono">
                      {suggestion?.detail}
                    </code>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Footer */}
      <div className="flex items-center justify-between px-3 py-2 border-t border-panel-border bg-surface/50">
        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
          <Icon name="ArrowUp" size={10} />
          <Icon name="ArrowDown" size={10} />
          <span>Navigate</span>
        </div>
        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
          <kbd className="px-1 py-0.5 bg-muted rounded text-xs">Tab</kbd>
          <span>Accept</span>
        </div>
      </div>
    </div>
  );
};

export default AIAutoComplete;