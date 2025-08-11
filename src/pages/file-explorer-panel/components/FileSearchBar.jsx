import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';

const FileSearchBar = ({ 
  onSearch, 
  onClear, 
  searchResults = [], 
  onResultSelect,
  isSearching = false 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedResultIndex, setSelectedResultIndex] = useState(-1);
  const searchInputRef = useRef(null);
  const resultsRef = useRef(null);

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      if (searchTerm?.trim()) {
        onSearch(searchTerm);
        setIsExpanded(true);
      } else {
        onClear();
        setIsExpanded(false);
      }
    }, 300);

    return () => clearTimeout(delayedSearch);
  }, [searchTerm, onSearch, onClear]);

  useEffect(() => {
    if (searchResults?.length > 0) {
      setSelectedResultIndex(0);
    } else {
      setSelectedResultIndex(-1);
    }
  }, [searchResults]);

  const handleKeyDown = (e) => {
    if (!isExpanded || searchResults?.length === 0) return;

    switch (e?.key) {
      case 'ArrowDown':
        e?.preventDefault();
        setSelectedResultIndex(prev => 
          prev < searchResults?.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e?.preventDefault();
        setSelectedResultIndex(prev => 
          prev > 0 ? prev - 1 : searchResults?.length - 1
        );
        break;
      case 'Enter':
        e?.preventDefault();
        if (selectedResultIndex >= 0 && selectedResultIndex < searchResults?.length) {
          handleResultSelect(searchResults?.[selectedResultIndex]);
        }
        break;
      case 'Escape':
        handleClear();
        break;
    }
  };

  const handleResultSelect = (result) => {
    onResultSelect(result);
    setIsExpanded(false);
    setSearchTerm('');
    searchInputRef?.current?.blur();
  };

  const handleClear = () => {
    setSearchTerm('');
    setIsExpanded(false);
    setSelectedResultIndex(-1);
    onClear();
    searchInputRef?.current?.focus();
  };

  const highlightMatch = (text, searchTerm) => {
    if (!searchTerm) return text;
    
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    const parts = text?.split(regex);
    
    return parts?.map((part, index) => 
      regex?.test(part) ? (
        <span key={index} className="bg-yellow-400 text-black px-1 rounded">
          {part}
        </span>
      ) : part
    );
  };

  const getFileIcon = (fileName) => {
    const extension = fileName?.split('.')?.pop()?.toLowerCase();
    const iconMap = {
      'js': 'FileText',
      'jsx': 'FileText',
      'ts': 'FileText',
      'tsx': 'FileText',
      'html': 'Globe',
      'css': 'Palette',
      'scss': 'Palette',
      'json': 'Braces',
      'md': 'FileText',
      'py': 'FileText',
      'java': 'Coffee',
      'cpp': 'FileText',
      'c': 'FileText',
      'php': 'FileText',
      'rb': 'FileText',
      'go': 'FileText',
      'rs': 'FileText',
      'vue': 'FileText',
      'xml': 'Code',
      'yml': 'Settings',
      'yaml': 'Settings',
      'png': 'Image',
      'jpg': 'Image',
      'jpeg': 'Image',
      'gif': 'Image',
      'svg': 'Image',
      'ico': 'Image'
    };
    
    return iconMap?.[extension] || 'File';
  };

  return (
    <div className="relative">
      <div className="relative">
        <Input
          ref={searchInputRef}
          type="search"
          placeholder="Search files..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e?.target?.value)}
          onKeyDown={handleKeyDown}
          className="pl-8 pr-8 text-sm"
        />
        
        <div className="absolute left-2 top-1/2 transform -translate-y-1/2">
          <Icon 
            name={isSearching ? 'Loader2' : 'Search'} 
            size={16} 
            className={`text-muted-foreground ${isSearching ? 'animate-spin' : ''}`}
          />
        </div>
        
        {searchTerm && (
          <button
            onClick={handleClear}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 hover:bg-hover rounded p-1 transition-colors"
          >
            <Icon name="X" size={14} className="text-muted-foreground" />
          </button>
        )}
      </div>
      {/* Search Results Dropdown */}
      {isExpanded && searchResults?.length > 0 && (
        <div 
          ref={resultsRef}
          className="absolute top-full left-0 right-0 mt-1 bg-popover border border-panel-border rounded-md shadow-floating max-h-64 overflow-y-auto z-50"
        >
          <div className="py-1">
            {searchResults?.map((result, index) => (
              <button
                key={result?.path}
                onClick={() => handleResultSelect(result)}
                className={`w-full flex items-center space-x-3 px-3 py-2 text-sm transition-colors ${
                  index === selectedResultIndex 
                    ? 'bg-primary text-primary-foreground' 
                    : 'text-foreground hover:bg-hover'
                }`}
              >
                <Icon 
                  name={getFileIcon(result?.name)} 
                  size={16} 
                  className={result?.type === 'directory' ? 'text-blue-400' : 'text-gray-300'}
                />
                <div className="flex-1 text-left">
                  <div className="font-medium">
                    {highlightMatch(result?.name, searchTerm)}
                  </div>
                  <div className="text-xs text-muted-foreground truncate">
                    {result?.path}
                  </div>
                </div>
                {result?.matches && (
                  <div className="text-xs text-muted-foreground">
                    {result?.matches} match{result?.matches !== 1 ? 'es' : ''}
                  </div>
                )}
              </button>
            ))}
          </div>
          
          {searchResults?.length > 10 && (
            <div className="border-t border-panel-border px-3 py-2 text-xs text-muted-foreground">
              Showing first 10 results. Refine your search for more specific results.
            </div>
          )}
        </div>
      )}
      {/* No Results Message */}
      {isExpanded && searchTerm && searchResults?.length === 0 && !isSearching && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-popover border border-panel-border rounded-md shadow-floating z-50">
          <div className="px-3 py-4 text-center text-sm text-muted-foreground">
            <Icon name="Search" size={24} className="mx-auto mb-2 opacity-50" />
            <div>No files found matching "{searchTerm}"</div>
            <div className="text-xs mt-1">Try a different search term</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileSearchBar;