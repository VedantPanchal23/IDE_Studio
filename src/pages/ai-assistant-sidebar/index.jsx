import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import ConversationHeader from './components/ConversationHeader';
import ChatArea from './components/ChatArea';
import InputArea from './components/InputArea';
import ConversationHistory from './components/ConversationHistory';

const AIAssistantSidebar = () => {
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selectedModel, setSelectedModel] = useState('gpt-4');
  const [currentConversationId, setCurrentConversationId] = useState('default');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCode, setSelectedCode] = useState(null);

  // Mock conversations data
  const [conversations, setConversations] = useState([
    {
      id: 'conv-1',
      title: 'React Component Optimization',
      preview: 'How to optimize React components for better performance...',
      messageCount: 8,
      lastActivity: Date.now() - 2 * 60 * 60 * 1000, // 2 hours ago
      messages: [
        {
          id: 'msg-1',
          content: "How can I optimize this React component for better performance?",
          isUser: true,
          timestamp: Date.now() - 2 * 60 * 60 * 1000
        },
        {
          id: 'msg-2',
          content: `Here are several ways to optimize your React component:\n\n1. **Use React.memo()** for preventing unnecessary re-renders:\n\n\`\`\`jsx\nconst MyComponent = React.memo(({ data }) => {\n  return <div>{data.name}</div>;\n});\n\`\`\`\n\n2. **Implement useCallback and useMemo** for expensive operations:\n\n\`\`\`jsx\nconst expensiveValue = useMemo(() => {\n  return heavyCalculation(data);\n}, [data]);\n\nconst handleClick = useCallback(() => {\n  // Handle click logic\n}, [dependency]);\n\`\`\`\n\n3. **Code splitting** with React.lazy() for better bundle size management.`,
          isUser: false,
          timestamp: Date.now() - 2 * 60 * 60 * 1000 + 30000
        }
      ]
    },
    {
      id: 'conv-2',
      title: 'JavaScript Array Methods',
      preview: 'Explaining different array methods and their use cases...',
      messageCount: 12,
      lastActivity: Date.now() - 24 * 60 * 60 * 1000, // 1 day ago
      messages: [
        {
          id: 'msg-3',
          content: "Can you explain the difference between map, filter, and reduce?",
          isUser: true,
          timestamp: Date.now() - 24 * 60 * 60 * 1000
        },
        {
          id: 'msg-4',
          content: `Great question! Here's how these array methods differ:\n\n**map()** - Transforms each element and returns a new array:\n\`\`\`javascript\nconst numbers = [1, 2, 3, 4];\nconst doubled = numbers.map(n => n * 2);\n// Result: [2, 4, 6, 8]\n\`\`\`\n\n**filter()** - Creates a new array with elements that pass a test:\n\`\`\`javascript\nconst numbers = [1, 2, 3, 4, 5];\nconst evens = numbers.filter(n => n % 2 === 0);\n// Result: [2, 4]\n\`\`\`\n\n**reduce()** - Reduces array to a single value:\n\`\`\`javascript\nconst numbers = [1, 2, 3, 4];\nconst sum = numbers.reduce((acc, n) => acc + n, 0);\n// Result: 10\n\`\`\``,
          isUser: false,
          timestamp: Date.now() - 24 * 60 * 60 * 1000 + 45000
        }
      ]
    },
    {
      id: 'conv-3',
      title: 'API Error Handling',
      preview: 'Best practices for handling API errors in JavaScript...',
      messageCount: 6,
      lastActivity: Date.now() - 3 * 24 * 60 * 60 * 1000, // 3 days ago
      messages: [
        {
          id: 'msg-5',
          content: "What's the best way to handle API errors in JavaScript?",
          isUser: true,
          timestamp: Date.now() - 3 * 24 * 60 * 60 * 1000
        },
        {
          id: 'msg-6',
          content: `Here's a comprehensive approach to API error handling:\n\n\`\`\`javascript\nconst apiCall = async (url) => {\n  try {\n    const response = await fetch(url);\n    \n    if (!response.ok) {\n      throw new Error(\`HTTP error! status: \${response.status}\`);\n    }\n    \n    const data = await response.json();\n    return { success: true, data };\n  } catch (error) {\n    console.error('API Error:', error);\n    return { \n      success: false, \n      error: error.message,\n      status: error.status || 'network_error'\n    };\n  }\n};\n\`\`\`\n\nAlways handle both network errors and HTTP status errors separately for better user experience.`,
          isUser: false,
          timestamp: Date.now() - 3 * 24 * 60 * 60 * 1000 + 60000
        }
      ]
    }
  ]);

  const [currentMessages, setCurrentMessages] = useState([]);

  // Load current conversation messages
  useEffect(() => {
    const conversation = conversations?.find(c => c?.id === currentConversationId);
    if (conversation) {
      setCurrentMessages(conversation?.messages || []);
    } else {
      setCurrentMessages([]);
    }
  }, [currentConversationId, conversations]);

  // Simulate selected code from editor
  useEffect(() => {
    // Mock selected code - in real implementation, this would come from Monaco Editor
    const mockSelectedCode = `const handleSubmit = async (formData) => {
  try {
    const response = await fetch('/api/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    return response.json();
  } catch (error) {
    console.error('Submit error:', error);
  }
};`;

    // Randomly set selected code to simulate editor interaction
    const timer = setTimeout(() => {
      if (Math.random() > 0.7) {
        setSelectedCode(mockSelectedCode);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleNewChat = () => {
    const newConversationId = `conv-${Date.now()}`;
    setCurrentConversationId(newConversationId);
    setCurrentMessages([]);
  };

  const handleClearHistory = () => {
    setCurrentMessages([]);
    // Update the current conversation in the conversations array
    setConversations(prev => 
      prev?.map(conv => 
        conv?.id === currentConversationId 
          ? { ...conv, messages: [] }
          : conv
      )
    );
  };

  const handleModelChange = (model) => {
    setSelectedModel(model?.id);
  };

  const handleSendMessage = async (message) => {
    if (!message?.trim()) return;

    const userMessage = {
      id: `msg-${Date.now()}`,
      content: message,
      isUser: true,
      timestamp: Date.now()
    };

    // Add user message immediately
    setCurrentMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: `msg-${Date.now() + 1}`,
        content: generateAIResponse(message, selectedCode),
        isUser: false,
        timestamp: Date.now()
      };

      setCurrentMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);

      // Update conversation in the conversations array
      setConversations(prev => {
        const existingConv = prev?.find(c => c?.id === currentConversationId);
        if (existingConv) {
          return prev?.map(conv =>
            conv?.id === currentConversationId
              ? {
                  ...conv,
                  messages: [...(conv?.messages || []), userMessage, aiResponse],
                  lastActivity: Date.now(),
                  messageCount: (conv?.messageCount || 0) + 2,
                  preview: message?.substring(0, 50) + '...'
                }
              : conv
          );
        } else {
          // Create new conversation
          return [...prev, {
            id: currentConversationId,
            title: message?.substring(0, 30) + (message?.length > 30 ? '...' : ''),
            preview: message?.substring(0, 50) + '...',
            messageCount: 2,
            lastActivity: Date.now(),
            messages: [userMessage, aiResponse]
          }];
        }
      });
    }, 1500 + Math.random() * 1000);
  };

  const generateAIResponse = (userMessage, codeContext) => {
    const responses = {
      explain: `I'll explain this code for you:\n\n\`\`\`javascript\n${codeContext}\n\`\`\`\n\nThis function handles form submission with proper error handling. It:\n1. Makes a POST request to the API endpoint\n2. Includes proper headers for JSON content\n3. Handles both successful responses and errors\n4. Uses async/await for clean asynchronous code\n\nThe try-catch block ensures that network errors are properly caught and logged.`,
      
      optimize: `Here's how you can optimize this code:\n\n\`\`\`javascript\nconst handleSubmit = async (formData) => {\n  const controller = new AbortController();\n  const timeoutId = setTimeout(() => controller.abort(), 10000);\n  \n  try {\n    const response = await fetch('/api/submit', {\n      method: 'POST',\n      headers: { 'Content-Type': 'application/json' },\n      body: JSON.stringify(formData),\n      signal: controller.signal\n    });\n    \n    clearTimeout(timeoutId);\n    \n    if (!response.ok) {\n      throw new Error(\`HTTP \${response.status}: \${response.statusText}\`);\n    }\n    \n    return await response.json();\n  } catch (error) {\n    clearTimeout(timeoutId);\n    if (error.name === 'AbortError') {\n      throw new Error('Request timeout');\n    }\n    throw error;\n  }\n};\n\`\`\`\n\nImprovements:\n• Added request timeout with AbortController\n• Better error handling with HTTP status checks\n• Proper cleanup of timeout\n• More specific error messages`,
      
      test: `Here are unit tests for your function:\n\n\`\`\`javascript\nimport { handleSubmit } from './your-module'
;\n\n// Mock fetch\nglobal.fetch = jest.fn();\n\ndescribe('handleSubmit', () => {\n  beforeEach(() => {\n    fetch.mockClear();\n  });\n\n  it('should submit form data successfully', async () => {\n    const mockResponse = { success: true, id: 123 };\n    fetch.mockResolvedValueOnce({\n      ok: true,\n      json: async () => mockResponse\n    });\n\n    const formData = { name: 'John', email: 'john@example.com' };\n    const result = await handleSubmit(formData);\n\n    expect(fetch).toHaveBeenCalledWith('/api/submit', {\n      method: 'POST',\n      headers: { 'Content-Type': 'application/json' },\n      body: JSON.stringify(formData)\n    });\n    expect(result).toEqual(mockResponse);\n  });\n\n  it('should handle network errors', async () => {\n    fetch.mockRejectedValueOnce(new Error('Network error'));\n    \n    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();\n    \n    const formData = { name: 'John' };\n    await handleSubmit(formData);\n    \n    expect(consoleSpy).toHaveBeenCalledWith('Submit error:', expect.any(Error));\n    consoleSpy.mockRestore();\n  });\n});\n\`\`\``,
      
      default: `I understand you're asking about: "${userMessage}"\n\nI'm here to help with your coding questions! I can:\n\n• **Explain code** - Help you understand how code works\n• **Debug issues** - Identify and fix problems in your code\n• **Optimize performance** - Suggest improvements for better efficiency\n• **Generate tests** - Create unit tests for your functions\n• **Add documentation** - Write clear comments and documentation\n• **Code reviews** - Provide feedback on code quality\n\nFeel free to share your code or ask specific programming questions. I'm particularly good with JavaScript, React, Python, and web development topics.\n\nWhat would you like help with today?`
    };

    if (userMessage?.toLowerCase()?.includes('explain') && codeContext) {
      return responses?.explain;
    } else if (userMessage?.toLowerCase()?.includes('optimize') && codeContext) {
      return responses?.optimize;
    } else if (userMessage?.toLowerCase()?.includes('test') && codeContext) {
      return responses?.test;
    } else {
      return responses?.default;
    }
  };

  const handleQuickAction = (actionId, code) => {
    const actions = {
      explain: `Explain this code:\n\n\`\`\`javascript\n${code}\n\`\`\``,
      optimize: `How can I optimize this code for better performance?\n\n\`\`\`javascript\n${code}\n\`\`\``,
      test: `Generate unit tests for this function:\n\n\`\`\`javascript\n${code}\n\`\`\``,
      document: `Add comprehensive documentation to this code:\n\n\`\`\`javascript\n${code}\n\`\`\``
    };

    if (actions?.[actionId]) {
      handleSendMessage(actions?.[actionId]);
    }
  };

  const handleCopyCode = (code, language) => {
    navigator.clipboard?.writeText(code);
    // In real implementation, show toast notification
  };

  const handleInsertCode = (code, language) => {
    // In real implementation, this would insert code into Monaco Editor
    console.log('Inserting code into editor:', { code, language });
  };

  const handleAttachFile = (file) => {
    // In real implementation, read file content and add to context
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e?.target?.result;
      const message = `I've attached a file (${file?.name}). Here's the content:\n\n\`\`\`${getFileLanguage(file?.name)}\n${content}\n\`\`\`\n\nCan you help me with this code?`;
      handleSendMessage(message);
    };
    reader?.readAsText(file);
  };

  const getFileLanguage = (filename) => {
    const ext = filename?.split('.')?.pop()?.toLowerCase();
    const langMap = {
      js: 'javascript',
      jsx: 'jsx',
      ts: 'typescript',
      tsx: 'tsx',
      py: 'python',
      java: 'java',
      cpp: 'cpp',
      c: 'c',
      html: 'html',
      css: 'css',
      json: 'json',
      md: 'markdown'
    };
    return langMap?.[ext] || 'text';
  };

  const handleSelectConversation = (conversationId) => {
    setCurrentConversationId(conversationId);
  };

  const handleDeleteConversation = (conversationId) => {
    setConversations(prev => prev?.filter(c => c?.id !== conversationId));
    if (currentConversationId === conversationId) {
      setCurrentConversationId('default');
    }
  };

  const handleRenameConversation = (conversationId, newTitle) => {
    setConversations(prev =>
      prev?.map(conv =>
        conv?.id === conversationId
          ? { ...conv, title: newTitle }
          : conv
      )
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Header */}
      <div className="bg-surface border-b border-panel-border p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/main-ide-interface')}
              className="text-muted-foreground hover:text-foreground"
            >
              <Icon name="ArrowLeft" size={16} className="mr-2" />
              Back to IDE
            </Button>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/file-explorer-panel')}
              className="text-muted-foreground hover:text-foreground"
            >
              <Icon name="FolderOpen" size={16} className="mr-1" />
              Explorer
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/code-editor-workspace')}
              className="text-muted-foreground hover:text-foreground"
            >
              <Icon name="FileText" size={16} className="mr-1" />
              Editor
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/terminal-integration-panel')}
              className="text-muted-foreground hover:text-foreground"
            >
              <Icon name="Terminal" size={16} className="mr-1" />
              Terminal
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/project-settings-dashboard')}
              className="text-muted-foreground hover:text-foreground"
            >
              <Icon name="Settings" size={16} className="mr-1" />
              Settings
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-73px)]">
        {/* AI Assistant Sidebar */}
        <div className={`bg-surface border-r border-panel-border flex flex-col transition-all duration-300 ${
          isCollapsed ? 'w-16' : 'w-96'
        }`}>
          <ConversationHeader
            onNewChat={handleNewChat}
            onClearHistory={handleClearHistory}
            onModelChange={handleModelChange}
            selectedModel={selectedModel}
            isCollapsed={isCollapsed}
            onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
          />
          
          <ChatArea
            messages={currentMessages}
            isLoading={isLoading}
            onCopyCode={handleCopyCode}
            onInsertCode={handleInsertCode}
            isCollapsed={isCollapsed}
          />
          
          <ConversationHistory
            conversations={conversations}
            activeConversationId={currentConversationId}
            onSelectConversation={handleSelectConversation}
            onDeleteConversation={handleDeleteConversation}
            onRenameConversation={handleRenameConversation}
            isCollapsed={isCollapsed}
          />
          
          <InputArea
            onSendMessage={handleSendMessage}
            onAttachFile={handleAttachFile}
            onQuickAction={handleQuickAction}
            isLoading={isLoading}
            selectedCode={selectedCode}
            isCollapsed={isCollapsed}
          />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 bg-background p-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="Bot" size={40} className="text-primary" />
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-4">
                AI Assistant Sidebar
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Intelligent coding support through contextual code explanations, programming guidance, 
                and interactive chat functionality integrated seamlessly into your development workflow.
              </p>
            </div>

            {/* Feature Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              <div className="bg-surface border border-panel-border rounded-lg p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Icon name="MessageSquare" size={24} className="text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Interactive Chat</h3>
                <p className="text-muted-foreground text-sm">
                  Chat-style interface with message bubbles, syntax highlighting, and conversation history.
                </p>
              </div>

              <div className="bg-surface border border-panel-border rounded-lg p-6">
                <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center mb-4">
                  <Icon name="Code" size={24} className="text-success" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Code Context</h3>
                <p className="text-muted-foreground text-sm">
                  Automatically populate context from selected code in the editor for targeted assistance.
                </p>
              </div>

              <div className="bg-surface border border-panel-border rounded-lg p-6">
                <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center mb-4">
                  <Icon name="Zap" size={24} className="text-warning" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Quick Actions</h3>
                <p className="text-muted-foreground text-sm">
                  One-click actions for common requests like code explanation, optimization, and testing.
                </p>
              </div>

              <div className="bg-surface border border-panel-border rounded-lg p-6">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                  <Icon name="FileText" size={24} className="text-accent" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">File Attachment</h3>
                <p className="text-muted-foreground text-sm">
                  Attach code files directly to conversations for comprehensive code analysis.
                </p>
              </div>

              <div className="bg-surface border border-panel-border rounded-lg p-6">
                <div className="w-12 h-12 bg-error/10 rounded-lg flex items-center justify-center mb-4">
                  <Icon name="History" size={24} className="text-error" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Conversation History</h3>
                <p className="text-muted-foreground text-sm">
                  Persistent conversation history with search functionality and organization by date.
                </p>
              </div>

              <div className="bg-surface border border-panel-border rounded-lg p-6">
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
                  <Icon name="Cpu" size={24} className="text-secondary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">AI Model Selection</h3>
                <p className="text-muted-foreground text-sm">
                  Choose from different AI models optimized for various coding tasks and complexity levels.
                </p>
              </div>
            </div>

            {/* Usage Instructions */}
            <div className="bg-surface border border-panel-border rounded-lg p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">How to Use</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-foreground mb-2">Getting Started</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Select code in the editor to provide context</li>
                    <li>• Use quick actions for common tasks</li>
                    <li>• Type questions in natural language</li>
                    <li>• Attach files for comprehensive analysis</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium text-foreground mb-2">Pro Tips</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Use specific questions for better responses</li>
                    <li>• Include error messages for debugging help</li>
                    <li>• Ask for code examples and explanations</li>
                    <li>• Request performance optimization suggestions</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistantSidebar;