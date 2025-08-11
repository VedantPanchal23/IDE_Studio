import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import MonacoEditorContainer from './MonacoEditorContainer';

const SplitEditorView = ({ 
  leftFile = null, 
  rightFile = null, 
  onFileChange, 
  onCloseSplit,
  splitOrientation = 'horizontal' // 'horizontal' or 'vertical'
}) => {
  const [splitRatio, setSplitRatio] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    e?.preventDefault();
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;

    const container = e?.currentTarget?.parentElement;
    const rect = container?.getBoundingClientRect();
    
    let newRatio;
    if (splitOrientation === 'horizontal') {
      newRatio = ((e?.clientX - rect?.left) / rect?.width) * 100;
    } else {
      newRatio = ((e?.clientY - rect?.top) / rect?.height) * 100;
    }
    
    // Constrain ratio between 20% and 80%
    newRatio = Math.max(20, Math.min(80, newRatio));
    setSplitRatio(newRatio);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging]);

  const handleCloseSplit = () => {
    if (onCloseSplit) {
      onCloseSplit();
    }
  };

  const handleSwapPanes = () => {
    // This would swap the left and right files
    console.log('Swap panes');
  };

  if (!leftFile && !rightFile) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background">
        <div className="text-center">
          <Icon name="Columns" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">Split Editor</h3>
          <p className="text-muted-foreground mb-4">Open files to compare side by side</p>
          <Button variant="outline" onClick={handleCloseSplit}>
            <Icon name="X" size={16} className="mr-2" />
            Close Split View
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-background">
      {/* Split Editor Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-surface border-b border-panel-border">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Icon name="Columns" size={16} className="text-primary" />
            <span className="text-sm font-medium text-foreground">Split Editor</span>
          </div>
          
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSplitRatio(50)}
              className="h-7 px-2 text-xs"
            >
              Reset Split
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSwapPanes}
              className="h-7 px-2 text-xs"
            >
              <Icon name="ArrowLeftRight" size={12} className="mr-1" />
              Swap
            </Button>
          </div>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCloseSplit}
          className="h-7 px-2"
        >
          <Icon name="X" size={14} />
        </Button>
      </div>
      {/* Split Editor Content */}
      <div className="flex-1 flex relative" style={{ 
        flexDirection: splitOrientation === 'horizontal' ? 'row' : 'column' 
      }}>
        {/* Left/Top Pane */}
        <div 
          className="bg-background border-r border-panel-border"
          style={{ 
            [splitOrientation === 'horizontal' ? 'width' : 'height']: `${splitRatio}%` 
          }}
        >
          {leftFile ? (
            <div className="h-full flex flex-col">
              <div className="flex items-center px-3 py-2 bg-surface/50 border-b border-panel-border">
                <Icon name="FileText" size={14} className="mr-2" />
                <span className="text-sm text-foreground">{leftFile?.name}</span>
                {leftFile?.hasUnsavedChanges && (
                  <div className="w-2 h-2 bg-warning rounded-full ml-2" />
                )}
              </div>
              <MonacoEditorContainer
                activeFile={leftFile}
                onFileChange={onFileChange}
                minimap={false}
              />
            </div>
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <Icon name="FileText" size={32} className="text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No file selected</p>
              </div>
            </div>
          )}
        </div>

        {/* Resize Handle */}
        <div
          className={`bg-panel-border hover:bg-primary transition-colors cursor-${
            splitOrientation === 'horizontal' ? 'col' : 'row'
          }-resize flex items-center justify-center group ${
            splitOrientation === 'horizontal' ? 'w-1' : 'h-1'
          }`}
          onMouseDown={handleMouseDown}
        >
          <div className={`bg-muted-foreground group-hover:bg-primary transition-colors ${
            splitOrientation === 'horizontal' ?'w-0.5 h-8' :'h-0.5 w-8'
          }`} />
        </div>

        {/* Right/Bottom Pane */}
        <div 
          className="bg-background"
          style={{ 
            [splitOrientation === 'horizontal' ? 'width' : 'height']: `${100 - splitRatio}%` 
          }}
        >
          {rightFile ? (
            <div className="h-full flex flex-col">
              <div className="flex items-center px-3 py-2 bg-surface/50 border-b border-panel-border">
                <Icon name="FileText" size={14} className="mr-2" />
                <span className="text-sm text-foreground">{rightFile?.name}</span>
                {rightFile?.hasUnsavedChanges && (
                  <div className="w-2 h-2 bg-warning rounded-full ml-2" />
                )}
              </div>
              <MonacoEditorContainer
                activeFile={rightFile}
                onFileChange={onFileChange}
                minimap={false}
              />
            </div>
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <Icon name="FileText" size={32} className="text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No file selected</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SplitEditorView;