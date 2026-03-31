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
import { mockProjects } from '../data/mockData';
import { formatDueDate } from '../utils/dateUtils';
import { cn } from '../utils/cn';

const MyTasks: React.FC = () => {
  const { user } = useAuth();
  const { tasks, updateTask, deleteTask } = useAppContext();
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'error';
      case 'high': return 'warning';
      case 'medium': return 'primary';
      default: return 'default';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'done': return <Badge variant="success">Done</Badge>;
      case 'inReview': return <Badge variant="warning">In Review</Badge>;
      case 'inProgress': return <Badge variant="primary">In Progress</Badge>;
      default: return <Badge>To Do</Badge>;
    }
  };

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">My Tasks</h1>
          <p className="text-text-secondary text-sm mt-1">Manage all your assigned work across projects.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" className="gap-2 hidden sm:flex">
            <CheckCircle2 className="w-4 h-4" /> Mark All Complete
          </Button>
          <Button className="gap-2" onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="w-4 h-4" /> Add Task
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="card p-4 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
          <input 
            type="text" 
            placeholder="Search tasks..." 
            className="w-full h-10 pl-10 pr-4 bg-gray-50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3">
          <select 
            className="h-10 px-3 bg-gray-50 border border-border rounded-xl text-sm focus:outline-none"
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
            className="h-10 px-3 bg-gray-50 border border-border rounded-xl text-sm focus:outline-none"
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
      </div>

      {/* Task List */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-border">
                <th className="px-6 py-4 text-xs font-bold text-text-secondary uppercase tracking-wider">Task Name</th>
                <th className="px-6 py-4 text-xs font-bold text-text-secondary uppercase tracking-wider">Project</th>
                <th className="px-6 py-4 text-xs font-bold text-text-secondary uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-text-secondary uppercase tracking-wider">Priority</th>
                <th className="px-6 py-4 text-xs font-bold text-text-secondary uppercase tracking-wider">Due Date</th>
                <th className="px-6 py-4 text-xs font-bold text-text-secondary uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredTasks.length > 0 ? (
                filteredTasks.map(task => {
                  const project = mockProjects.find(p => p.id === task.projectId);
                  return (
                    <tr 
                      key={task.id} 
                      className="hover:bg-gray-50 transition-colors group cursor-pointer"
                      onClick={() => setSelectedTask(task)}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              updateTask(task.id, { status: task.status === 'done' ? 'todo' : 'done' });
                            }}
                            className={cn(
                              'w-5 h-5 rounded-full border flex items-center justify-center transition-all',
                              task.status === 'done' ? 'bg-success border-success text-white' : 'border-border hover:border-primary'
                            )}
                          >
                            {task.status === 'done' && <CheckCircle2 className="w-3 h-3" />}
                          </button>
                          <span className={cn(
                            'text-sm font-medium text-text-primary',
                            task.status === 'done' && 'line-through text-text-secondary'
                          )}>
                            {task.title}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-medium text-text-secondary bg-gray-100 px-2 py-1 rounded-lg">
                          {project?.name}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(task.status)}
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={getPriorityColor(task.priority)}>
                          {task.priority}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-xs text-text-secondary">
                          <Calendar className="w-3 h-3" />
                          {formatDueDate(task.dueDate)}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-1.5 hover:bg-gray-200 rounded-lg text-text-secondary transition-colors">
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              if (window.confirm('Delete this task?')) deleteTask(task.id);
                            }}
                            className="p-1.5 hover:bg-red-100 rounded-lg text-error transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                        <CheckCircle2 className="w-8 h-8 text-gray-300" />
                      </div>
                      <p className="text-sm text-text-secondary font-medium">No tasks found matching your filters.</p>
                      <Button variant="ghost" size="sm" onClick={() => {
                        setSearchQuery('');
                        setStatusFilter('all');
                        setPriorityFilter('all');
                      }}>Clear all filters</Button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
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
