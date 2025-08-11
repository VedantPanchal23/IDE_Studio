import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const InputArea = ({ 
  onSendMessage, 
  onAttachFile, 
  onQuickAction,
  isLoading = false,
  selectedCode = null,
  isCollapsed 
}) => {
  const [message, setMessage] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const textareaRef = useRef(null);

  const quickActions = [
    { id: 'explain', label: 'Explain Code', icon: 'HelpCircle', disabled: !selectedCode },
    { id: 'optimize', label: 'Optimize', icon: 'Zap', disabled: !selectedCode },
    { id: 'test', label: 'Generate Tests', icon: 'TestTube', disabled: !selectedCode },
    { id: 'document', label: 'Add Docs', icon: 'FileText', disabled: !selectedCode }
  ];

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (message?.trim() && !isLoading) {
      onSendMessage(message?.trim());
      setMessage('');
      setIsExpanded(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e?.key === 'Enter' && !e?.shiftKey) {
      e?.preventDefault();
      handleSubmit(e);
    }
  };

  const handleQuickAction = (actionId) => {
    if (onQuickAction) {
      onQuickAction(actionId, selectedCode);
    }
  };

  const adjustTextareaHeight = () => {
    const textarea = textareaRef?.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = Math.min(textarea?.scrollHeight, 120) + 'px';
    }
  };

  React.useEffect(() => {
    adjustTextareaHeight();
  }, [message]);

  if (isCollapsed) {
    return (
      <div className="p-4 border-t border-panel-border">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {}}
          className="w-full justify-center"
          disabled={isLoading}
        >
          <Icon name="MessageSquare" size={16} />
        </Button>
      </div>
    );
  }

  return (
    <div className="border-t border-panel-border bg-panel">
      {/* Quick Actions */}
      {selectedCode && (
        <div className="px-4 py-2 border-b border-panel-border">
          <div className="text-xs text-muted-foreground mb-2">Quick actions for selected code:</div>
          <div className="flex flex-wrap gap-1">
            {quickActions?.map((action) => (
              <Button
                key={action?.id}
                variant="ghost"
                size="sm"
                onClick={() => handleQuickAction(action?.id)}
                disabled={action?.disabled || isLoading}
                className="h-7 px-2 text-xs"
              >
                <Icon name={action?.icon} size={12} className="mr-1" />
                {action?.label}
              </Button>
            ))}
          </div>
        </div>
      )}
      {/* Context Indicator */}
      {selectedCode && (
        <div className="px-4 py-2 bg-active/50 border-b border-panel-border">
          <div className="flex items-center space-x-2">
            <Icon name="Code" size={12} className="text-primary" />
            <span className="text-xs text-foreground">
              Code selected ({selectedCode?.split('\n')?.length} lines)
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {}}
              className="h-5 w-5 p-0 ml-auto"
            >
              <Icon name="X" size={10} />
            </Button>
          </div>
        </div>
      )}
      {/* Input Form */}
      <form onSubmit={handleSubmit} className="p-4">
        <div className="relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e?.target?.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsExpanded(true)}
            onBlur={() => {
              if (!message?.trim()) setIsExpanded(false);
            }}
            placeholder={selectedCode ? "Ask about the selected code..." : "Ask AI assistant anything..."}
            disabled={isLoading}
            className={`w-full bg-input border border-panel-border rounded-md px-3 py-2 pr-20 text-sm text-foreground placeholder-muted-foreground resize-none transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
              isExpanded ? 'min-h-[80px]' : 'h-10'
            }`}
            style={{ maxHeight: '120px' }}
          />
          
          {/* Input Actions */}
          <div className="absolute right-2 top-2 flex items-center space-x-1">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = '.js,.jsx,.ts,.tsx,.py,.java,.cpp,.c,.html,.css,.json,.md';
                input.onchange = (e) => {
                  const file = e?.target?.files?.[0];
                  if (file && onAttachFile) {
                    onAttachFile(file);
                  }
                };
                input?.click();
              }}
              className="h-6 w-6 p-0"
              title="Attach file"
              disabled={isLoading}
            >
              <Icon name="Paperclip" size={12} />
            </Button>
            
            <Button
              type="submit"
              variant="ghost"
              size="sm"
              disabled={!message?.trim() || isLoading}
              className="h-6 w-6 p-0"
              title="Send message"
            >
              {isLoading ? (
                <div className="w-3 h-3 border border-primary border-t-transparent rounded-full animate-spin" />
              ) : (
                <Icon name="Send" size={12} />
              )}
            </Button>
          </div>
        </div>
        
        {/* Input Hints */}
        {isExpanded && (
          <div className="mt-2 text-xs text-muted-foreground">
            <div className="flex items-center justify-between">
              <span>Press Enter to send, Shift+Enter for new line</span>
              <span>{message?.length}/2000</span>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default InputArea;