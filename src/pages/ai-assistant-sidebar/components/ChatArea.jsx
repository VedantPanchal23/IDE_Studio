import React, { useRef, useEffect, useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import MessageBubble from './MessageBubble';

const ChatArea = ({ 
  messages = [], 
  isLoading = false,
  onCopyCode,
  onInsertCode,
  isCollapsed 
}) => {
  const messagesEndRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [filteredMessages, setFilteredMessages] = useState(messages);

  const scrollToBottom = () => {
    messagesEndRef?.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (searchQuery?.trim()) {
      const filtered = messages?.filter(message =>
        message?.content?.toLowerCase()?.includes(searchQuery?.toLowerCase())
      );
      setFilteredMessages(filtered);
    } else {
      setFilteredMessages(messages);
    }
  }, [searchQuery, messages]);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setIsSearchVisible(false);
  };

  if (isCollapsed) {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
            <Icon name="MessageSquare" size={24} className="text-primary" />
          </div>
          <p className="text-xs text-muted-foreground">Expand to chat</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Search Bar */}
      {isSearchVisible && (
        <div className="p-3 border-b border-panel-border bg-panel">
          <div className="relative">
            <Input
              type="search"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => handleSearch(e?.target?.value)}
              className="pr-8"
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={clearSearch}
              className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
            >
              <Icon name="X" size={12} />
            </Button>
          </div>
        </div>
      )}
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-1">
        {filteredMessages?.length === 0 && !isLoading ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-8">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Icon name="Bot" size={32} className="text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              AI Assistant Ready
            </h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-xs">
              Ask me anything about your code, get explanations, or request help with programming tasks.
            </p>
            <div className="space-y-2 w-full max-w-xs">
              <div className="text-xs text-muted-foreground text-left mb-2">Try asking:</div>
              <div className="bg-surface border border-panel-border rounded-md p-3 text-left">
                <div className="text-xs text-muted-foreground mb-1">💡 Quick suggestions:</div>
                <div className="text-sm text-foreground space-y-1">
                  <div>• "Explain this function"</div>
                  <div>• "Generate unit tests"</div>
                  <div>• "Optimize this code"</div>
                  <div>• "Add error handling"</div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            {filteredMessages?.map((message, index) => (
              <MessageBubble
                key={`${message?.id}-${index}`}
                message={message?.content}
                isUser={message?.isUser}
                timestamp={message?.timestamp}
                onCopyCode={onCopyCode}
                onInsertCode={onInsertCode}
              />
            ))}
            
            {isLoading && (
              <div className="flex justify-start mb-4">
                <div className="flex items-end space-x-2">
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                    <Icon name="Bot" size={12} color="white" />
                  </div>
                  <div className="bg-surface border border-panel-border rounded-lg px-3 py-2">
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                      <span className="text-sm text-muted-foreground">AI is thinking...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>
      {/* Search Toggle */}
      {messages?.length > 0 && (
        <div className="px-4 pb-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsSearchVisible(!isSearchVisible)}
            className="w-full justify-start text-xs h-7"
          >
            <Icon name="Search" size={12} className="mr-2" />
            {isSearchVisible ? 'Hide Search' : 'Search Conversations'}
          </Button>
        </div>
      )}
    </div>
  );
};

export default ChatArea;