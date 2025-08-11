import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ConversationHistory = ({ 
  conversations = [], 
  activeConversationId,
  onSelectConversation,
  onDeleteConversation,
  onRenameConversation,
  isCollapsed 
}) => {
  const [isHistoryVisible, setIsHistoryVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editingTitle, setEditingTitle] = useState('');

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays} days ago`;
    return date?.toLocaleDateString();
  };

  const handleRename = (id, newTitle) => {
    if (newTitle?.trim() && onRenameConversation) {
      onRenameConversation(id, newTitle?.trim());
    }
    setEditingId(null);
    setEditingTitle('');
  };

  const startEditing = (conversation) => {
    setEditingId(conversation?.id);
    setEditingTitle(conversation?.title);
  };

  const groupConversationsByDate = (conversations) => {
    const groups = {};
    conversations?.forEach(conv => {
      const dateKey = formatDate(conv?.lastActivity);
      if (!groups?.[dateKey]) {
        groups[dateKey] = [];
      }
      groups?.[dateKey]?.push(conv);
    });
    return groups;
  };

  const groupedConversations = groupConversationsByDate(conversations);

  if (isCollapsed) {
    return null;
  }

  if (!isHistoryVisible) {
    return (
      <div className="p-4 border-t border-panel-border">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsHistoryVisible(true)}
          className="w-full justify-start text-xs h-7"
        >
          <Icon name="History" size={12} className="mr-2" />
          Show History ({conversations?.length})
        </Button>
      </div>
    );
  }

  return (
    <div className="border-t border-panel-border bg-panel max-h-64 overflow-y-auto">
      {/* History Header */}
      <div className="flex items-center justify-between p-3 border-b border-panel-border">
        <div className="flex items-center space-x-2">
          <Icon name="History" size={14} />
          <span className="text-sm font-medium text-foreground">Conversation History</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsHistoryVisible(false)}
          className="h-6 w-6 p-0"
        >
          <Icon name="ChevronUp" size={12} />
        </Button>
      </div>
      {/* Conversations List */}
      <div className="p-2">
        {Object.keys(groupedConversations)?.length === 0 ? (
          <div className="text-center py-6">
            <Icon name="MessageSquare" size={24} className="text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No conversations yet</p>
          </div>
        ) : (
          Object.entries(groupedConversations)?.map(([dateGroup, convs]) => (
            <div key={dateGroup} className="mb-4">
              <div className="text-xs text-muted-foreground font-medium mb-2 px-2">
                {dateGroup}
              </div>
              <div className="space-y-1">
                {convs?.map((conversation) => (
                  <div
                    key={conversation?.id}
                    className={`group relative rounded-md p-2 cursor-pointer transition-colors ${
                      activeConversationId === conversation?.id
                        ? 'bg-active text-primary' :'hover:bg-hover'
                    }`}
                    onClick={() => onSelectConversation(conversation?.id)}
                  >
                    {editingId === conversation?.id ? (
                      <div className="flex items-center space-x-1" onClick={(e) => e?.stopPropagation()}>
                        <input
                          type="text"
                          value={editingTitle}
                          onChange={(e) => setEditingTitle(e?.target?.value)}
                          onBlur={() => handleRename(conversation?.id, editingTitle)}
                          onKeyDown={(e) => {
                            if (e?.key === 'Enter') {
                              handleRename(conversation?.id, editingTitle);
                            } else if (e?.key === 'Escape') {
                              setEditingId(null);
                              setEditingTitle('');
                            }
                          }}
                          className="flex-1 bg-input border border-panel-border rounded px-2 py-1 text-xs text-foreground"
                          autoFocus
                        />
                      </div>
                    ) : (
                      <>
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-foreground truncate">
                              {conversation?.title}
                            </div>
                            <div className="text-xs text-muted-foreground truncate">
                              {conversation?.preview}
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                              {conversation?.messageCount} messages
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e?.stopPropagation();
                                startEditing(conversation);
                              }}
                              className="h-6 w-6 p-0"
                              title="Rename conversation"
                            >
                              <Icon name="Edit2" size={10} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e?.stopPropagation();
                                if (onDeleteConversation) {
                                  onDeleteConversation(conversation?.id);
                                }
                              }}
                              className="h-6 w-6 p-0 text-error hover:bg-error/10"
                              title="Delete conversation"
                            >
                              <Icon name="Trash2" size={10} />
                            </Button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ConversationHistory;