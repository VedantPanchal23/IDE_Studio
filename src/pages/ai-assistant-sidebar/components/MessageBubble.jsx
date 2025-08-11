import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const MessageBubble = ({ 
  message, 
  isUser = false, 
  timestamp, 
  onCopyCode,
  onInsertCode 
}) => {
  const [copiedIndex, setCopiedIndex] = useState(null);

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date?.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  const extractCodeBlocks = (content) => {
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    const blocks = [];
    let match;
    
    while ((match = codeBlockRegex?.exec(content)) !== null) {
      blocks?.push({
        language: match?.[1] || 'text',
        code: match?.[2]?.trim(),
        fullMatch: match?.[0]
      });
    }
    
    return blocks;
  };

  const renderContent = (content) => {
    const codeBlocks = extractCodeBlocks(content);
    
    if (codeBlocks?.length === 0) {
      return (
        <div className="whitespace-pre-wrap text-sm leading-relaxed">
          {content}
        </div>
      );
    }

    let processedContent = content;
    
    return (
      <div className="space-y-3">
        {codeBlocks?.map((block, index) => {
          const beforeCode = processedContent?.split(block?.fullMatch)?.[0];
          processedContent = processedContent?.replace(beforeCode + block?.fullMatch, '');
          
          return (
            <div key={index}>
              {beforeCode && (
                <div className="whitespace-pre-wrap text-sm leading-relaxed mb-3">
                  {beforeCode}
                </div>
              )}
              <div className="relative bg-surface border border-panel-border rounded-md overflow-hidden">
                <div className="flex items-center justify-between px-3 py-2 bg-muted border-b border-panel-border">
                  <span className="text-xs text-muted-foreground font-mono">
                    {block?.language}
                  </span>
                  <div className="flex items-center space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        navigator.clipboard?.writeText(block?.code);
                        setCopiedIndex(index);
                        setTimeout(() => setCopiedIndex(null), 2000);
                        if (onCopyCode) onCopyCode(block?.code, block?.language);
                      }}
                      className="h-6 px-2 text-xs"
                    >
                      <Icon 
                        name={copiedIndex === index ? "Check" : "Copy"} 
                        size={12} 
                        className="mr-1" 
                      />
                      {copiedIndex === index ? "Copied" : "Copy"}
                    </Button>
                    {onInsertCode && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onInsertCode(block?.code, block?.language)}
                        className="h-6 px-2 text-xs"
                      >
                        <Icon name="FileText" size={12} className="mr-1" />
                        Insert
                      </Button>
                    )}
                  </div>
                </div>
                <pre className="p-3 text-sm font-mono overflow-x-auto">
                  <code className="text-foreground">{block?.code}</code>
                </pre>
              </div>
            </div>
          );
        })}
        {processedContent && (
          <div className="whitespace-pre-wrap text-sm leading-relaxed">
            {processedContent}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-[85%] ${isUser ? 'order-2' : 'order-1'}`}>
        <div className="flex items-end space-x-2">
          {!isUser && (
            <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
              <Icon name="Bot" size={12} color="white" />
            </div>
          )}
          
          <div className={`rounded-lg px-3 py-2 ${
            isUser 
              ? 'bg-primary text-primary-foreground ml-auto' 
              : 'bg-surface border border-panel-border'
          }`}>
            {renderContent(message)}
          </div>
          
          {isUser && (
            <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center flex-shrink-0">
              <Icon name="User" size={12} color="white" />
            </div>
          )}
        </div>
        
        <div className={`text-xs text-muted-foreground mt-1 ${
          isUser ? 'text-right mr-8' : 'text-left ml-8'
        }`}>
          {formatTimestamp(timestamp)}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;