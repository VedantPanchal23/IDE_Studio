import React, { useRef, useEffect, useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const MonacoEditorContainer = ({ 
  activeFile = null, 
  onFileChange, 
  theme = 'vs-dark',
  fontSize = 14,
  minimap = true,
  wordWrap = 'on'
}) => {
  const editorRef = useRef(null);
  const containerRef = useRef(null);
  const [isEditorReady, setIsEditorReady] = useState(false);
  const [editorContent, setEditorContent] = useState('');
  const [cursorPosition, setCursorPosition] = useState({ line: 1, column: 1 });

  // Mock Monaco Editor implementation
  useEffect(() => {
    if (containerRef?.current && activeFile) {
      // Simulate Monaco Editor initialization
      setIsEditorReady(true);
      setEditorContent(activeFile?.content || getDefaultContent(activeFile?.name));
    }
  }, [activeFile]);

  const getDefaultContent = (fileName) => {
    const extension = fileName?.split('.')?.pop()?.toLowerCase();
    switch (extension) {
      case 'js': case'jsx':
        return `// Welcome to ${fileName}
import React from 'react';

const Component = () => {
  return (
    <div>
      <h1>Hello World!</h1>
    </div>
  );
};

export default Component;`;
      case 'ts': case'tsx':
        return `// TypeScript file: ${fileName}
interface Props {
  title: string;
  count: number;
}

const Component: React.FC<Props> = ({ title, count }) => {
  return <div>{title}: {count}</div>;
};

export default Component;`;
      case 'html':
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <h1>Hello World!</h1>
</body>
</html>`;
      case 'css':
        return `/* Styles for ${fileName} */
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

.title {
  font-size: 2rem;
  color: #333;
}`;
      case 'py':
        return `# Python file: ${fileName}
def hello_world():
    print("Hello, World!")
    return "Welcome to Python!"

if __name__ == "__main__":
    message = hello_world()
    print(message)`;
      case 'json':
        return `{
  "name": "project",
  "version": "1.0.0",
  "description": "A sample project",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "test": "echo \\"Error: no test specified\\" && exit 1"
  },
  "dependencies": {}
}`;
      default:
        return `// Welcome to ${fileName}
// Start coding here...

console.log("Hello from ${fileName}!");`;
    }
  };

  const handleContentChange = (newContent) => {
    setEditorContent(newContent);
    if (onFileChange && activeFile) {
      onFileChange(activeFile, newContent);
    }
  };

  const handleFormat = () => {
    // Simulate code formatting
    const formatted = editorContent?.replace(/\s+/g, ' ')?.trim();
    setEditorContent(formatted);
  };

  const handleFind = () => {
    // Simulate find functionality
    console.log('Find triggered');
  };

  const handleReplace = () => {
    // Simulate replace functionality
    console.log('Replace triggered');
  };

  if (!activeFile) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background">
        <div className="text-center">
          <Icon name="FileText" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No File Open</h3>
          <p className="text-muted-foreground mb-4">Select a file from the explorer to start editing</p>
          <Button variant="outline" onClick={() => {}}>
            <Icon name="Plus" size={16} className="mr-2" />
            Create New File
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-background">
      {/* Editor Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-surface border-b border-panel-border">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">
            {activeFile?.name}
          </span>
          {activeFile?.hasUnsavedChanges && (
            <div className="w-2 h-2 bg-warning rounded-full" />
          )}
        </div>
        
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleFind}
            className="h-8 px-2"
          >
            <Icon name="Search" size={14} className="mr-1" />
            Find
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReplace}
            className="h-8 px-2"
          >
            <Icon name="Replace" size={14} className="mr-1" />
            Replace
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleFormat}
            className="h-8 px-2"
          >
            <Icon name="Code" size={14} className="mr-1" />
            Format
          </Button>
        </div>
      </div>
      {/* Monaco Editor Container */}
      <div className="flex-1 relative">
        <div
          ref={containerRef}
          className="absolute inset-0 bg-background"
        >
          {isEditorReady ? (
            <div className="h-full flex">
              {/* Line Numbers */}
              <div className="w-12 bg-surface border-r border-panel-border flex flex-col text-xs text-muted-foreground">
                {editorContent?.split('\n')?.map((_, index) => (
                  <div key={index} className="px-2 py-0.5 text-right">
                    {index + 1}
                  </div>
                ))}
              </div>
              
              {/* Editor Content */}
              <div className="flex-1 relative">
                <textarea
                  value={editorContent}
                  onChange={(e) => handleContentChange(e?.target?.value)}
                  className="w-full h-full p-4 bg-transparent text-foreground font-mono text-sm resize-none outline-none"
                  style={{ fontSize: `${fontSize}px` }}
                  spellCheck={false}
                  onSelect={(e) => {
                    const textarea = e?.target;
                    const lines = textarea?.value?.substr(0, textarea?.selectionStart)?.split('\n');
                    setCursorPosition({
                      line: lines?.length,
                      column: lines?.[lines?.length - 1]?.length + 1
                    });
                  }}
                />
                
                {/* Minimap */}
                {minimap && (
                  <div className="absolute top-0 right-0 w-20 h-full bg-surface/50 border-l border-panel-border overflow-hidden">
                    <div className="text-xs text-muted-foreground p-1">
                      {editorContent?.split('\n')?.slice(0, 50)?.map((line, index) => (
                        <div key={index} className="truncate opacity-60">
                          {line || ' '}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Icon name="Loader2" size={32} className="text-primary animate-spin mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Loading editor...</p>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Status Bar */}
      <div className="flex items-center justify-between px-4 py-1 bg-surface border-t border-panel-border text-xs text-muted-foreground">
        <div className="flex items-center space-x-4">
          <span>Ln {cursorPosition?.line}, Col {cursorPosition?.column}</span>
          <span>{editorContent?.length} characters</span>
          <span>{editorContent?.split('\n')?.length} lines</span>
        </div>
        
        <div className="flex items-center space-x-4">
          <span>UTF-8</span>
          <span>LF</span>
          <span className="capitalize">{activeFile?.name?.split('.')?.pop()}</span>
        </div>
      </div>
    </div>
  );
};

export default MonacoEditorContainer;