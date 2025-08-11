import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const NewFileDialog = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  type = 'file', // 'file' or 'folder'
  parentPath = '',
  existingNames = []
}) => {
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setFileName('');
      setError('');
      setTimeout(() => {
        if (inputRef?.current) {
          inputRef?.current?.focus();
        }
      }, 100);
    }
  }, [isOpen]);

  const validateFileName = (name) => {
    if (!name?.trim()) {
      return `${type === 'file' ? 'File' : 'Folder'} name cannot be empty`;
    }
    
    // Check for invalid characters
    const invalidChars = /[<>:"/\\|?*]/;
    if (invalidChars?.test(name)) {
      return 'Name contains invalid characters: < > : " / \\ | ? *';
    }
    
    // Check for reserved names (Windows)
    const reservedNames = ['CON', 'PRN', 'AUX', 'NUL', 'COM1', 'COM2', 'COM3', 'COM4', 'COM5', 'COM6', 'COM7', 'COM8', 'COM9', 'LPT1', 'LPT2', 'LPT3', 'LPT4', 'LPT5', 'LPT6', 'LPT7', 'LPT8', 'LPT9'];
    if (reservedNames?.includes(name?.toUpperCase())) {
      return 'This name is reserved by the system';
    }
    
    // Check if name already exists
    if (existingNames?.includes(name)) {
      return `A ${type} with this name already exists`;
    }
    
    // Check length
    if (name?.length > 255) {
      return 'Name is too long (maximum 255 characters)';
    }
    
    return '';
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    
    const validationError = validateFileName(fileName);
    if (validationError) {
      setError(validationError);
      return;
    }
    
    onConfirm(fileName, type, parentPath);
    onClose();
  };

  const handleCancel = () => {
    setFileName('');
    setError('');
    onClose();
  };

  const handleKeyDown = (e) => {
    if (e?.key === 'Escape') {
      handleCancel();
    }
  };

  const getFileTypeTemplates = () => {
    return [
      { name: 'JavaScript File', extension: '.js', icon: 'FileText' },
      { name: 'TypeScript File', extension: '.ts', icon: 'FileText' },
      { name: 'React Component', extension: '.jsx', icon: 'FileText' },
      { name: 'CSS File', extension: '.css', icon: 'Palette' },
      { name: 'HTML File', extension: '.html', icon: 'Globe' },
      { name: 'JSON File', extension: '.json', icon: 'Braces' },
      { name: 'Markdown File', extension: '.md', icon: 'FileText' },
      { name: 'Python File', extension: '.py', icon: 'FileText' },
      { name: 'Text File', extension: '.txt', icon: 'FileText' }
    ];
  };

  const handleTemplateSelect = (template) => {
    const baseName = fileName?.replace(/\.[^/.]+$/, '') || 'untitled';
    setFileName(baseName + template?.extension);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-surface border border-panel-border rounded-lg shadow-floating w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-panel-border">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
              <Icon 
                name={type === 'file' ? 'FileText' : 'FolderPlus'} 
                size={16} 
                color="white" 
              />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                Create New {type === 'file' ? 'File' : 'Folder'}
              </h2>
              {parentPath && (
                <p className="text-sm text-muted-foreground">
                  in {parentPath}
                </p>
              )}
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCancel}
            className="h-8 w-8 p-0"
          >
            <Icon name="X" size={16} />
          </Button>
        </div>
        
        {/* Content */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <Input
              ref={inputRef}
              label={`${type === 'file' ? 'File' : 'Folder'} Name`}
              type="text"
              value={fileName}
              onChange={(e) => {
                setFileName(e?.target?.value);
                if (error) setError('');
              }}
              onKeyDown={handleKeyDown}
              placeholder={`Enter ${type} name...`}
              error={error}
              required
            />
          </div>
          
          {/* File Templates */}
          {type === 'file' && (
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Quick Templates
              </label>
              <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                {getFileTypeTemplates()?.map((template, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleTemplateSelect(template)}
                    className="flex items-center space-x-2 p-2 text-sm text-foreground hover:bg-hover rounded border border-panel-border transition-colors"
                  >
                    <Icon name={template?.icon} size={14} />
                    <span className="truncate">{template?.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
            >
              Cancel
            </Button>
            
            <Button
              type="submit"
              variant="default"
              disabled={!fileName?.trim() || !!error}
            >
              Create {type === 'file' ? 'File' : 'Folder'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewFileDialog;