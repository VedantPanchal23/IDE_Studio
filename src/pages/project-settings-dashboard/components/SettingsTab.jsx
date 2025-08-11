import React from 'react';
import Icon from '../../../components/AppIcon';

const SettingsTab = ({ 
  id, 
  label, 
  icon, 
  isActive, 
  onClick, 
  hasChanges = false 
}) => {
  return (
    <button
      onClick={() => onClick(id)}
      className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
        isActive 
          ? 'bg-primary text-primary-foreground shadow-sm' 
          : 'text-foreground hover:bg-hover hover:text-foreground'
      }`}
    >
      <Icon name={icon} size={18} />
      <span className="font-medium">{label}</span>
      {hasChanges && (
        <div className="w-2 h-2 bg-warning rounded-full" />
      )}
    </button>
  );
};

export default SettingsTab;