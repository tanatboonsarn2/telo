import React, { useState } from 'react';
import { Users as UsersIcon, Search, Check } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { mockUsers } from '../../data/mockData';
import { useAppContext } from '../../context/AppContext';
import { Project } from '../../types';
import { cn } from '../../utils/cn';

interface AddMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
}

export const AddMemberModal: React.FC<AddMemberModalProps> = ({ isOpen, onClose, project }) => {
  const { updateProject } = useAppContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>(project.memberIds);

  const filteredUsers = mockUsers.filter(u => 
    u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleMember = (userId: string) => {
    setSelectedIds(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId) 
        : [...prev, userId]
    );
  };

  const handleSave = () => {
    updateProject(project.id, {
      memberIds: selectedIds
    });
    onClose();
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Manage Project Members"
      maxWidth="max-w-md"
    >
      <div className="space-y-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
          <input 
            type="text" 
            placeholder="Search team members..." 
            className="w-full h-10 pl-10 pr-4 bg-gray-50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 scrollbar-hide">
          {filteredUsers.map(u => {
            const isSelected = selectedIds.includes(u.id);
            return (
              <button
                key={u.id}
                onClick={() => toggleMember(u.id)}
                className={cn(
                  "w-full flex items-center justify-between p-3 rounded-xl border transition-all",
                  isSelected 
                    ? "bg-primary/5 border-primary/30" 
                    : "bg-white border-transparent hover:bg-gray-50"
                )}
              >
                <div className="flex items-center gap-3">
                  <img src={u.avatarUrl} className="w-8 h-8 rounded-full" referrerPolicy="no-referrer" />
                  <div className="text-left">
                    <p className="text-sm font-semibold text-text-primary">{u.fullName}</p>
                    <p className="text-xs text-text-secondary">{u.email}</p>
                  </div>
                </div>
                <div className={cn(
                  "w-5 h-5 rounded-full border flex items-center justify-center transition-all",
                  isSelected ? "bg-primary border-primary text-white" : "border-border"
                )}>
                  {isSelected && <Check className="w-3 h-3" />}
                </div>
              </button>
            );
          })}
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-border">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} className="gap-2">
            <UsersIcon className="w-4 h-4" /> Update Members
          </Button>
        </div>
      </div>
    </Modal>
  );
};
