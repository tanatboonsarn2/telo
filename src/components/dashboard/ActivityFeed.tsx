import React from 'react';
import { MessageSquare, UserPlus, CheckCircle2, RefreshCw } from 'lucide-react';
import { Notification } from '../../types';
import { formatRelativeTime } from '../../utils/dateUtils';

interface ActivityFeedProps {
  notifications: Notification[];
}

export const ActivityFeed: React.FC<ActivityFeedProps> = ({ notifications }) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'comment': return <MessageSquare className="w-4 h-4 text-blue-500" />;
      case 'taskAssigned': return <UserPlus className="w-4 h-4 text-purple-500" />;
      case 'statusChange': return <CheckCircle2 className="w-4 h-4 text-success" />;
      default: return <RefreshCw className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="card h-full flex flex-col">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <h3 className="font-semibold text-text-primary">Recent Activity</h3>
      </div>
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {notifications.length > 0 ? (
          notifications.map(notif => (
            <div key={notif.id} className="p-4 border-b border-border flex gap-3 items-start hover:bg-gray-50 transition-colors">
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                {getIcon(notif.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-text-primary leading-relaxed">{notif.message}</p>
                <span className="text-[10px] text-text-secondary mt-1 block">{formatRelativeTime(notif.createdAt)}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center">
            <p className="text-sm text-text-secondary">No recent activity</p>
          </div>
        )}
      </div>
    </div>
  );
};
