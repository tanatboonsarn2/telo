import React, { useState } from 'react';
import {
  CheckCircle2,
  Calendar,
  Search,
  Pencil,
  Trash2,
  Plus
} from 'lucide-react';
import { Task } from '../types';
import { useAppContext } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { TaskDetailModal } from '../components/tasks/TaskDetailModal';
import { CreateTaskModal } from '../components/tasks/CreateTaskModal';
import { formatDueDate } from '../utils/dateUtils';
import { cn } from '../utils/cn';

const MyTasks: React.FC = () => {
  const { user } = useAuth();
  const { tasks, projects, updateTask, deleteTask } = useAppContext();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  const myTasks = tasks.filter(t => t.assigneeId === user?.id);

  const filteredTasks = myTasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const priorityConfig = {
    low: { label: 'Low', variant: 'default' as const },
    medium: { label: 'Medium', variant: 'warning' as const },
    high: { label: 'High', variant: 'error' as const },
    urgent: { label: 'Urgent', variant: 'error' as const },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">My Tasks</h1>
          <p className="text-text-secondary text-sm mt-1">{myTasks.length} tasks assigned to you</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)} className="gap-2 self-start sm:self-auto">
          <Plus className="w-4 h-4" /> New Task
        </Button>
      </div>

      {/* Filters */}
      <div className="card p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
          <input
            type="text"
            placeholder="Search tasks..."
            className="w-full h-9 pl-10 pr-4 bg-gray-50 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <select
          className="h-9 px-3 bg-gray-50 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="todo">To Do</option>
          <option value="inProgress">In Progress</option>
          <option value="inReview">In Review</option>
          <option value="done">Done</option>
        </select>
        <select
          className="h-9 px-3 bg-gray-50 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
        >
          <option value="all">All Priority</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="urgent">Urgent</option>
        </select>
      </div>

      {/* Task List */}
      <div className="card overflow-hidden">
        {filteredTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <CheckCircle2 className="w-12 h-12 text-gray-300" />
            <p className="text-text-secondary font-medium">No tasks found</p>
            <p className="text-text-secondary text-sm">
              {myTasks.length === 0 ? "You have no tasks assigned to you." : "Try adjusting your filters."}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filteredTasks.map(task => {
              const project = projects.find(p => p.id === task.projectId);
              return (
                <div
                  key={task.id}
                  className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors group cursor-pointer"
                  onClick={() => setSelectedTask(task)}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      updateTask(task.id, { status: task.status === 'done' ? 'todo' : 'done' });
                    }}
                    className={cn(
                      'w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all',
                      task.status === 'done'
                        ? 'bg-success border-success text-white'
                        : 'border-border hover:border-success'
                    )}
                  >
                    {task.status === 'done' && <CheckCircle2 className="w-3 h-3" />}
                  </button>

                  <div className="flex-1 min-w-0">
                    <p className={cn(
                      'text-sm font-medium text-text-primary truncate',
                      task.status === 'done' && 'line-through text-text-secondary'
                    )}>
                      {task.title}
                    </p>
                    {project && (
                      <p className="text-xs text-text-secondary mt-0.5">{project.name}</p>
                    )}
                  </div>

                  <div className="hidden sm:flex items-center gap-3 flex-shrink-0">
                    <Badge variant={priorityConfig[task.priority]?.variant ?? 'default'}>
                      {priorityConfig[task.priority]?.label ?? task.priority}
                    </Badge>

                    {task.dueDate && (
                      <div className="flex items-center gap-1.5 text-xs text-text-secondary">
                        <Calendar className="w-3.5 h-3.5" />
                        {formatDueDate(task.dueDate)}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => { e.stopPropagation(); setSelectedTask(task); }}
                      className="p-1.5 rounded-lg hover:bg-gray-200 transition-colors text-text-secondary"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm('Delete this task?')) deleteTask(task.id);
                      }}
                      className="p-1.5 rounded-lg hover:bg-red-100 transition-colors text-text-secondary hover:text-error"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          isOpen={!!selectedTask}
          onClose={() => setSelectedTask(null)}
        />
      )}

      <CreateTaskModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
};

export default MyTasks;
