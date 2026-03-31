import React from 'react';
import { CheckCircle2, Circle, Clock } from 'lucide-react';
import { Task } from '../../types';
import { Badge } from '../ui/Badge';
import { formatDueDate } from '../../utils/dateUtils';
import { cn } from '../../utils/cn';

interface TaskWidgetProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
}

export const TaskWidget: React.FC<TaskWidgetProps> = ({ tasks, onTaskClick }) => {
  const sortedTasks = [...tasks].sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

  return (
    <div className="card h-full flex flex-col">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <h3 className="font-semibold text-text-primary">My Tasks</h3>
        <button className="text-xs font-medium text-primary hover:underline">View All</button>
      </div>
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {sortedTasks.length > 0 ? (
          sortedTasks.map(task => (
            <div 
              key={task.id} 
              className="p-4 border-b border-border hover:bg-hover transition-colors cursor-pointer group"
              onClick={() => onTaskClick(task)}
            >
              <div className="flex items-start gap-3">
                <button className="mt-0.5 text-text-secondary hover:text-primary transition-colors">
                  {task.status === 'done' ? <CheckCircle2 className="w-5 h-5 text-success" /> : <Circle className="w-5 h-5" />}
                </button>
                <div className="flex-1 min-w-0">
                  <p className={cn(
                    'text-sm font-medium text-text-primary truncate',
                    task.status === 'done' && 'line-through text-text-secondary'
                  )}>
                    {task.title}
                  </p>
                  <div className="flex items-center gap-3 mt-1">
                    <div className="flex items-center gap-1 text-[10px] text-text-secondary">
                      <Clock className="w-3 h-3" />
                      {formatDueDate(task.dueDate)}
                    </div>
                    <Badge variant={task.priority === 'urgent' ? 'error' : task.priority === 'high' ? 'warning' : 'default'} className="text-[10px] px-1.5 py-0">
                      {task.priority}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center">
            <p className="text-sm text-text-secondary">No tasks assigned to you</p>
          </div>
        )}
      </div>
    </div>
  );
};
