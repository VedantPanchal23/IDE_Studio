import React, { useState, useCallback, useEffect } from 'react';

const TerminalResizeHandle = ({ 
  onResize, 
  minHeight = 150, 
  maxHeight = 600,
  initialHeight = 300 
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [startHeight, setStartHeight] = useState(initialHeight);

  const handleMouseDown = useCallback((e) => {
    setIsDragging(true);
    setStartY(e?.clientY);
    setStartHeight(initialHeight);
    document.body.style.cursor = 'ns-resize';
    document.body.style.userSelect = 'none';
  }, [initialHeight]);

  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return;

    const deltaY = startY - e?.clientY;
    const newHeight = Math.min(maxHeight, Math.max(minHeight, startHeight + deltaY));
    
    if (onResize) {
      onResize(newHeight);
    }
  }, [isDragging, startY, startHeight, minHeight, maxHeight, onResize]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  }, []);

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return (
    <div
      className={`h-1 bg-panel-border hover:bg-primary cursor-ns-resize transition-colors ${
        isDragging ? 'bg-primary' : ''
      }`}
      onMouseDown={handleMouseDown}
      style={{ 
        position: 'relative',
        zIndex: 10
      }}
    >
      <div className="absolute inset-x-0 -top-1 -bottom-1" />
    </div>
  );
};

export default TerminalResizeHandle;