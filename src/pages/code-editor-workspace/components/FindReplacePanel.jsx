import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const FindReplacePanel = ({ 
  isVisible = false, 
  onClose, 
  onFind, 
  onReplace, 
  onReplaceAll,
  currentMatches = 0,
  totalMatches = 0,
  currentMatchIndex = 0
}) => {
  const [findText, setFindText] = useState('');
  const [replaceText, setReplaceText] = useState('');
  const [isReplaceMode, setIsReplaceMode] = useState(false);
  const [options, setOptions] = useState({
    matchCase: false,
    wholeWord: false,
    useRegex: false
  });

  useEffect(() => {
    if (isVisible && findText) {
      handleFind();
    }
  }, [findText, options, isVisible]);

  const handleFind = () => {
    if (onFind && findText) {
      onFind(findText, options);
    }
  };

  const handleReplace = () => {
    if (onReplace && findText && replaceText) {
      onReplace(findText, replaceText, options);
    }
  };

  const handleReplaceAll = () => {
    if (onReplaceAll && findText && replaceText) {
      onReplaceAll(findText, replaceText, options);
    }
  };

  const handleNext = () => {
    if (onFind) {
      onFind(findText, { ...options, direction: 'next' });
    }
  };

  const handlePrevious = () => {
    if (onFind) {
      onFind(findText, { ...options, direction: 'previous' });
    }
  };

  const handleKeyDown = (e) => {
    if (e?.key === 'Enter') {
      if (e?.shiftKey) {
        handlePrevious();
      } else {
        handleNext();
      }
    } else if (e?.key === 'Escape') {
      handleClose();
    }
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  const toggleOption = (option) => {
    setOptions(prev => ({
      ...prev,
      [option]: !prev?.[option]
    }));
  };

  if (!isVisible) return null;

  return (
    <div className="absolute top-0 right-4 z-40 bg-surface border border-panel-border rounded-md shadow-floating p-4 min-w-80">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Icon name="Search" size={16} className="text-primary" />
          <span className="text-sm font-medium text-foreground">
            {isReplaceMode ? 'Find and Replace' : 'Find'}
          </span>
        </div>
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsReplaceMode(!isReplaceMode)}
            className="h-7 px-2 text-xs"
          >
            <Icon name={isReplaceMode ? "ChevronUp" : "ChevronDown"} size={12} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="h-7 w-7 p-0"
          >
            <Icon name="X" size={12} />
          </Button>
        </div>
      </div>
      {/* Find Input */}
      <div className="space-y-3">
        <div className="relative">
          <Input
            type="text"
            placeholder="Find"
            value={findText}
            onChange={(e) => setFindText(e?.target?.value)}
            onKeyDown={handleKeyDown}
            className="pr-20"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-1">
            {totalMatches > 0 && (
              <span className="text-xs text-muted-foreground">
                {currentMatchIndex + 1}/{totalMatches}
              </span>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={handlePrevious}
              disabled={!findText || totalMatches === 0}
              className="h-6 w-6 p-0"
            >
              <Icon name="ChevronUp" size={12} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleNext}
              disabled={!findText || totalMatches === 0}
              className="h-6 w-6 p-0"
            >
              <Icon name="ChevronDown" size={12} />
            </Button>
          </div>
        </div>

        {/* Replace Input */}
        {isReplaceMode && (
          <div className="relative">
            <Input
              type="text"
              placeholder="Replace"
              value={replaceText}
              onChange={(e) => setReplaceText(e?.target?.value)}
              onKeyDown={handleKeyDown}
              className="pr-20"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleReplace}
                disabled={!findText || !replaceText || totalMatches === 0}
                className="h-6 px-2 text-xs"
              >
                Replace
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleReplaceAll}
                disabled={!findText || !replaceText || totalMatches === 0}
                className="h-6 px-2 text-xs"
              >
                All
              </Button>
            </div>
          </div>
        )}

        {/* Options */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => toggleOption('matchCase')}
            className={`flex items-center space-x-1 text-xs transition-colors ${
              options?.matchCase 
                ? 'text-primary' :'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Icon name="CaseSensitive" size={14} />
            <span>Match Case</span>
          </button>
          
          <button
            onClick={() => toggleOption('wholeWord')}
            className={`flex items-center space-x-1 text-xs transition-colors ${
              options?.wholeWord 
                ? 'text-primary' :'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Icon name="WholeWord" size={14} />
            <span>Whole Word</span>
          </button>
          
          <button
            onClick={() => toggleOption('useRegex')}
            className={`flex items-center space-x-1 text-xs transition-colors ${
              options?.useRegex 
                ? 'text-primary' :'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Icon name="Regex" size={14} />
            <span>Regex</span>
          </button>
        </div>

        {/* Results Summary */}
        {findText && (
          <div className="text-xs text-muted-foreground">
            {totalMatches === 0 ? (
              <span>No results found</span>
            ) : (
              <span>
                {totalMatches} result{totalMatches !== 1 ? 's' : ''} found
                {isReplaceMode && replaceText && (
                  <span> • Ready to replace with "{replaceText}"</span>
                )}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FindReplacePanel;