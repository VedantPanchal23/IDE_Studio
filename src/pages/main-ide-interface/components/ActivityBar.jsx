import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ActivityBar = ({ activeView, onNavigate, onSettingsClick }) => {
  const activities = [
    { name: 'explorer', icon: 'FolderOpen' },
    { name: 'search', icon: 'Search' },
    { name: 'git', icon: 'GitCommit' },
    { name: 'debug', icon: 'Bug' },
    { name: 'ai', icon: 'Bot' },
  ];

  return (
    <div className="h-full w-12 bg-surface border-r border-panel-border flex flex-col items-center justify-between py-2">
      {/* Top Activities */}
      <div className="flex flex-col items-center space-y-2">
        {activities.map((activity) => (
          <Button
            key={activity.name}
            variant="ghost"
            size="sm"
            className={`w-10 h-10 p-0 relative ${
              activeView === activity.name ? 'text-primary' : 'text-muted-foreground'
            }`}
            onClick={() => onNavigate(activity.name)}
            title={activity.name.charAt(0).toUpperCase() + activity.name.slice(1)}
          >
            {activeView === activity.name && (
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-full" />
            )}
            <Icon name={activity.icon} size={20} />
          </Button>
        ))}
      </div>

      {/* Bottom Activities */}
      <div className="flex flex-col items-center space-y-2">
        <Button
          variant="ghost"
          size="sm"
          className="w-10 h-10 p-0 text-muted-foreground"
          onClick={onSettingsClick}
          title="Settings"
        >
          <Icon name="Settings" size={20} />
        </Button>
      </div>
    </div>
  );
};

export default ActivityBar;
