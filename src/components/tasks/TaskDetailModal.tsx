import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Calendar, 
  MessageSquare, 
  Trash2, 
  Paperclip,
  Plus
} from 'lucide-react';
import { Task } from '../../types';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { mockUsers, mockProjects } from '../../data/mockData';
import { formatDueDate, formatRelativeTime } from '../../utils/dateUtils';
import { cn } from '../../utils/cn';
import { useAppContext } from '../../context/AppContext';

interface TaskDetailModalProps {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
}

export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({ task, isOpen, onClose }) => {
  const { updateTask, deleteTask } = useAppContext();
  const [commentText, setCommentText] = useState('');
  
  const assignee = mockUsers.find(u => u.id === task.assigneeId);
  const project = mockProjects.find(p => p.id === task.projectId);

  const handleStatusChange = (status: Task['status']) => {
    updateTask(task.id, { status });
  };

  const handlePriorityChange = (priority: Task['priority']) => {
    updateTask(task.id, { priority });
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      deleteTask(task.id);
      onClose();
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      maxWidth="max-w-3xl"
      title={project?.name}
    >
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Column: Content */}
        <div className="flex-1 space-y-6">
          <div>
            <h2 className="text-xl font-bold text-text-primary mb-2">{task.title}</h2>
            <p className="text-sm text-text-secondary leading-relaxed">{task.description}</p>
          </div>

          {/* Subtasks */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-text-primary">Subtasks</h3>
              <span className="text-[10px] font-medium text-text-secondary">
                {task.subtasks.filter(s => s.completed).length}/{task.subtasks.length} Done
              </span>
            </div>
            <div className="space-y-2">
              {task.subtasks.map(sub => (
                <div key={sub.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors group">
                  <button className={cn(
                    'w-4 h-4 rounded border flex items-center justify-center transition-colors',
                    sub.completed ? 'bg-success border-success text-white' : 'border-border'
                  )}>
                    {sub.completed && <CheckCircle2 className="w-3 h-3" />}
                  </button>
                  <span className={cn('text-xs text-text-primary', sub.completed && 'line-through text-text-secondary')}>
                    {sub.title}
                  </span>
                </div>
              ))}
              <button className="flex items-center gap-2 text-xs font-medium text-primary hover:underline p-2">
                <Plus className="w-3 h-3" /> Add subtask
              </button>
            </div>
          </div>

          {/* Comments */}
          <div className="space-y-4 pt-4 border-t border-border">
            <h3 className="text-sm font-semibold text-text-primary flex items-center gap-2">
              <MessageSquare className="w-4 h-4" /> Comments
            </h3>
            
            <div className="space-y-4">
              {task.comments.map(comment => {
                const commentUser = mockUsers.find(u => u.id === comment.userId);
                return (
                  <div key={comment.id} className="flex gap-3">
                    <img 
                      src={commentUser?.avatarUrl} 
                      alt={commentUser?.fullName} 
                      className="w-8 h-8 rounded-full flex-shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1 bg-gray-50 rounded-xl p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-semibold text-text-primary">{commentUser?.fullName}</span>
                        <span className="text-[10px] text-text-secondary">{formatRelativeTime(comment.createdAt)}</span>
                      </div>
                      <p className="text-xs text-text-primary leading-relaxed">{comment.text}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex gap-3 pt-2">
              <img 
                src={mockUsers[0].avatarUrl} 
                alt="Me" 
                className="w-8 h-8 rounded-full flex-shrink-0"
                referrerPolicy="no-referrer"
              />
              <div className="flex-1 space-y-2">
                <textarea 
                  placeholder="Write a comment..." 
                  className="w-full p-3 bg-white border border-border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all min-h-[80px] resize-none"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                />
                <div className="flex justify-between items-center">
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-text-secondary">
                    <Paperclip className="w-4 h-4" />
                  </button>
                  <Button size="sm" disabled={!commentText.trim()}>Post Comment</Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Meta */}
        <div className="w-full lg:w-64 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-2 block">Status</label>
              <select 
                className="w-full p-2 bg-gray-50 border border-border rounded-lg text-xs font-medium focus:outline-none"
                value={task.status}
                onChange={(e) => handleStatusChange(e.target.value)}
              >
                {project?.columns.map(col => (
                  <option key={col.id} value={col.id}>{col.title}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-2 block">Priority</label>
              <select 
                className="w-full p-2 bg-gray-50 border border-border rounded-lg text-xs font-medium focus:outline-none"
                value={task.priority}
                onChange={(e) => handlePriorityChange(e.target.value as Task['priority'])}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-2 block">Assignee</label>
              <div className="flex items-center gap-3 p-2 bg-gray-50 border border-border rounded-lg">
                <img 
                  src={assignee?.avatarUrl} 
                  alt={assignee?.fullName} 
                  className="w-6 h-6 rounded-full"
                  referrerPolicy="no-referrer"
                />
                <span className="text-xs font-medium text-text-primary truncate">{assignee?.fullName}</span>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-2 block">Due Date</label>
              <div className="flex items-center gap-2 p-2 bg-gray-50 border border-border rounded-lg text-xs font-medium text-text-primary">
                <Calendar className="w-4 h-4 text-text-secondary" />
                {formatDueDate(task.dueDate)}
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-border">
            <button 
              onClick={handleDelete}
              className="flex items-center gap-2 text-xs font-medium text-error hover:bg-red-50 w-full p-2 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" /> Delete Task
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
