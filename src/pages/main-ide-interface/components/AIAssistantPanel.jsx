import React, { useState, useRef, useEffect, useCallback } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const AIAssistantPanel = ({ onToggle, activeFile }) => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Mock AI responses
  const aiResponses = [
    "I can help you with that! Let me analyze your code and provide suggestions.",
    "Based on your current file, I notice you're working with React components. Here are some best practices you might consider:",
    "That\'s a great question! Here\'s how you can implement that functionality:",
    "I see you\'re trying to optimize performance. Here are some React optimization techniques:",
    "Let me help you debug this issue. Can you share more details about the error you\'re encountering?"
  ];

  const scrollToBottom = useCallback(() => {
    messagesEndRef?.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    // The panel is now controlled by the parent, so we can focus the input when the component mounts
    // if it's intended to be visible. A more robust solution might involve a prop.
    if (inputRef?.current) {
      inputRef?.current?.focus();
    }
  }, []);

  const handleSendMessage = useCallback(async () => {
    if (!inputValue?.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: aiResponses?.[Math.floor(Math.random() * aiResponses?.length)],
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  }, [inputValue]);

  const handleKeyPress = useCallback((e) => {
    if (e?.key === 'Enter' && !e?.shiftKey) {
      e?.preventDefault();
      handleSendMessage();
    }
  }, [handleSendMessage]);

  const handleClearChat = useCallback(() => {
    setMessages([]);
  }, []);

  const handleExplainCode = useCallback(() => {
    if (!activeFile) return;

    const explainMessage = {
      id: Date.now(),
      type: 'user',
      content: `Can you explain this code from ${activeFile?.name}?`,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, explainMessage]);
    setIsTyping(true);

    setTimeout(() => {
      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: `This ${activeFile?.name} file appears to be a ${activeFile?.language} file. Based on the filename and extension, it likely contains component logic or utility functions. The code structure follows modern JavaScript/React patterns with proper imports and exports.`,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 2000);
  }, [activeFile]);

  return (
    <div className="w-96 bg-panel border-l border-panel-border flex flex-col h-full">
      {/* AI Assistant Header */}
      <div className="flex items-center justify-between p-3 border-b border-panel-border">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
            <Icon name="Bot" size={14} color="white" />
          </div>
          <span className="text-sm font-medium text-foreground">AI Assistant</span>
        </div>
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="xs"
            className="h-6 w-6 p-0"
            onClick={handleClearChat}
          >
            <Icon name="Trash2" size={12} />
          </Button>
          <Button
            variant="ghost"
            size="xs"
            className="h-6 w-6 p-0"
            onClick={onToggle}
          >
            <Icon name="X" size={12} />
          </Button>
        </div>
      </div>
      {/* Quick Actions */}
      {activeFile && (
        <div className="p-3 border-b border-panel-border">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="FileText" size={14} className="text-primary" />
            <span className="text-xs text-muted-foreground">Current file: {activeFile?.name}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="xs"
              onClick={handleExplainCode}
            >
              <Icon name="MessageCircle" size={12} className="mr-1" />
              Explain Code
            </Button>
            <Button
              variant="outline"
              size="xs"
              onClick={() => {/* Handle optimize */}}
            >
              <Icon name="Zap" size={12} className="mr-1" />
              Optimize
            </Button>
            <Button
              variant="outline"
              size="xs"
              onClick={() => {/* Handle debug */}}
            >
              <Icon name="Bug" size={12} className="mr-1" />
              Debug
            </Button>
          </div>
        </div>
      )}
      {/* Chat Messages */}
      <div className="flex-1 overflow-auto p-3 space-y-4">
        {messages?.length === 0 ? (
          <div className="text-center py-8">
            <Icon name="Bot" size={32} className="text-muted-foreground mx-auto mb-3" />
            <h3 className="text-sm font-medium text-foreground mb-2">AI Assistant Ready</h3>
            <p className="text-xs text-muted-foreground mb-4">
              Ask me anything about your code, get explanations, or request optimizations.
            </p>
            <div className="space-y-2 text-xs text-muted-foreground">
              <div>• "Explain this function"</div>
              <div>• "How can I optimize this?"</div>
              <div>• "Find bugs in my code"</div>
              <div>• "Suggest improvements"</div>
            </div>
          </div>
        ) : (
          <>
            {messages?.map((message) => (
              <div
                key={message?.id}
                className={`flex ${message?.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-3 py-2 ${
                    message?.type === 'user' ?'bg-primary text-primary-foreground' :'bg-surface border border-panel-border text-foreground'
                  }`}
                >
                  <div className="text-sm whitespace-pre-wrap">{message?.content}</div>
                  <div className={`text-xs mt-1 ${
                    message?.type === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground'
                  }`}>
                    {message?.timestamp?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-surface border border-panel-border rounded-lg px-3 py-2">
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                </div>
              </div>
            )}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>
      {/* Chat Input */}
      <div className="p-3 border-t border-panel-border">
        <div className="flex items-end space-x-2">
          <div className="flex-1">
            <Input
              ref={inputRef}
              type="text"
              placeholder="Ask AI assistant..."
              value={inputValue}
              onChange={(e) => setInputValue(e?.target?.value)}
              onKeyPress={handleKeyPress}
              disabled={isTyping}
              className="text-sm"
            />
          </div>
          <Button
            variant="default"
            size="sm"
            onClick={handleSendMessage}
            disabled={!inputValue?.trim() || isTyping}
            className="px-3"
          >
            <Icon name="Send" size={14} />
          </Button>
        </div>
        <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
          <span>Press Enter to send, Shift+Enter for new line</span>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-success rounded-full" />
            <span>AI Online</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistantPanel;