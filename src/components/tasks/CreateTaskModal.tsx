import React, { useState } from 'react';
import { Calendar, Flag, User as UserIcon, FolderKanban } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useAppContext } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { Task } from '../../types';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultProjectId?: string;
  defaultStatus?: string;
}

export const CreateTaskModal: React.FC<CreateTaskModalProps> = ({ isOpen, onClose, defaultProjectId, defaultStatus }) => {
  const { addTask, projects, users } = useAppContext();
  const { user } = useAuth();

  const firstProjectId = projects[0]?.id ?? '';
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [projectId, setProjectId] = useState(defaultProjectId || firstProjectId);
  const [assigneeId, setAssigneeId] = useState(user?.id || '');
  const [priority, setPriority] = useState<Task['priority']>('medium');
  const [dueDate, setDueDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const project = projects.find(p => p.id === projectId);
    const status = defaultStatus || project?.columns[0]?.id || 'todo';

    setIsSubmitting(true);
    try {
      await addTask({
        title,
        description,
        status,
        priority,
        dueDate,
        assigneeId,
        projectId,
      });
      resetForm();
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setProjectId(defaultProjectId || firstProjectId);
    setAssigneeId(user?.id || '');
    setPriority('medium');
    setDueDate(new Date().toISOString().split('T')[0]);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Task"
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Task Title"
          placeholder="What needs to be done?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          autoFocus
        />

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-text-primary">Description</label>
          <textarea
            placeholder="Add more details..."
            className="w-full p-3 bg-white border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all min-h-[100px] resize-none"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-text-primary flex items-center gap-2">
              <FolderKanban className="w-4 h-4 text-text-secondary" /> Project
            </label>
            <select
              className="w-full p-2.5 bg-white border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
            >
              {projects.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-text-primary flex items-center gap-2">
              <UserIcon className="w-4 h-4 text-text-secondary" /> Assignee
            </label>
            <select
              className="w-full p-2.5 bg-white border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              value={assigneeId}
              onChange={(e) => setAssigneeId(e.target.value)}
            >
              {users.map(u => (
                <option key={u.id} value={u.id}>{u.fullName}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-text-primary flex items-center gap-2">
              <Flag className="w-4 h-4 text-text-secondary" /> Priority
            </label>
            <select
              className="w-full p-2.5 bg-white border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              value={priority}
              onChange={(e) => setPriority(e.target.value as Task['priority'])}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-text-primary flex items-center gap-2">
              <Calendar className="w-4 h-4 text-text-secondary" /> Due Date
            </label>
            <input
              type="date"
              className="w-full p-2.5 bg-white border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-border">
          <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit" disabled={!title.trim()} isLoading={isSubmitting}>Create Task</Button>
        </div>
      </form>
    </Modal>
  );
};
