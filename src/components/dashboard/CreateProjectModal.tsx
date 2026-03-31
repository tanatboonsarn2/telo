import React, { useState } from 'react';
import { Calendar, Users as UsersIcon } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useAppContext } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../utils/cn';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateProjectModal: React.FC<CreateProjectModalProps> = ({ isOpen, onClose }) => {
  const { addProject, users } = useAppContext();
  const { user } = useAuth();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState(() => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([user?.id || '']);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setIsSubmitting(true);
    try {
      await addProject({
        name,
        description,
        dueDate,
        memberIds: selectedMembers.filter(Boolean),
      });
      resetForm();
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setName('');
    setDescription('');
    setDueDate(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
    setSelectedMembers([user?.id || '']);
  };

  const toggleMember = (userId: string) => {
    setSelectedMembers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Project"
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Project Name"
          placeholder="e.g. Website Redesign"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          autoFocus
        />

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-text-primary">Description</label>
          <textarea
            placeholder="What is this project about?"
            className="w-full p-3 bg-white border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all min-h-[100px] resize-none"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-text-primary flex items-center gap-2">
            <Calendar className="w-4 h-4 text-text-secondary" /> Target Due Date
          </label>
          <input
            type="date"
            className="w-full p-2.5 bg-white border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium text-text-primary flex items-center gap-2">
            <UsersIcon className="w-4 h-4 text-text-secondary" /> Add Team Members
          </label>
          <div className="grid grid-cols-2 gap-2 max-h-[150px] overflow-y-auto p-1 scrollbar-hide">
            {users.map(u => (
              <button
                key={u.id}
                type="button"
                onClick={() => toggleMember(u.id)}
                className={cn(
                  "flex items-center gap-2 p-2 rounded-lg border transition-all text-left",
                  selectedMembers.includes(u.id)
                    ? "bg-primary/5 border-primary text-primary"
                    : "bg-white border-border text-text-secondary hover:border-gray-300"
                )}
              >
                <img src={u.avatarUrl ?? undefined} className="w-6 h-6 rounded-full" referrerPolicy="no-referrer" />
                <span className="text-xs font-medium truncate">{u.fullName}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-border">
          <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit" disabled={!name.trim()} isLoading={isSubmitting}>Create Project</Button>
        </div>
      </form>
    </Modal>
  );
};
