import React, { useState } from 'react';
import { 
  Shield, 
  Trash2, 
  Plus
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { useAppContext } from '../context/AppContext';
import { cn } from '../utils/cn';

const Settings: React.FC = () => {
  const { user } = useAuth();
  const { users } = useAppContext();
  const [activeTab, setActiveTab] = useState<'profile' | 'workspace'>('profile');
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Settings</h1>
        <p className="text-text-secondary text-sm mt-1">Manage your account and workspace preferences.</p>
      </div>

      <div className="flex border-b border-border">
        <button 
          onClick={() => setActiveTab('profile')}
          className={cn(
            'px-6 py-3 text-sm font-medium transition-all relative',
            activeTab === 'profile' ? 'text-primary' : 'text-text-secondary hover:text-text-primary'
          )}
        >
          Profile
          {activeTab === 'profile' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
        </button>
        {user?.role === 'admin' && (
          <button 
            onClick={() => setActiveTab('workspace')}
            className={cn(
              'px-6 py-3 text-sm font-medium transition-all relative',
              activeTab === 'workspace' ? 'text-primary' : 'text-text-secondary hover:text-text-primary'
            )}
          >
            Workspace
            {activeTab === 'workspace' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
          </button>
        )}
      </div>

      {activeTab === 'profile' ? (
        <div className="space-y-8">
          <div className="card p-6 space-y-6">
            <h3 className="text-lg font-semibold text-text-primary">Personal Information</h3>
            <div className="flex items-center gap-6">
              <div className="relative group">
                <img 
                  src={user?.avatarUrl} 
                  alt={user?.fullName} 
                  className="w-20 h-20 rounded-full border-2 border-border"
                  referrerPolicy="no-referrer"
                />
                <button className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs font-bold">
                  Change
                </button>
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-semibold text-text-primary">{user?.fullName}</h4>
                <p className="text-xs text-text-secondary">JPG, GIF or PNG. Max size of 800K</p>
                <div className="flex gap-2 pt-2">
                  <Button size="sm" variant="secondary">Upload new photo</Button>
                  <Button size="sm" variant="ghost" className="text-error hover:bg-red-50">Remove</Button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Full Name" defaultValue={user?.fullName} />
              <Input label="Email Address" defaultValue={user?.email} />
              <Input label="Job Title" placeholder="e.g. Product Designer" />
              <Input label="Phone Number" placeholder="+1 (555) 000-0000" />
            </div>
            
            <div className="pt-4 flex justify-end">
              <Button onClick={handleSave} isLoading={isLoading}>Save Changes</Button>
            </div>
          </div>

          <div className="card p-6 space-y-6">
            <h3 className="text-lg font-semibold text-text-primary">Security</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-border">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm font-semibold text-text-primary">Two-Factor Authentication</p>
                    <p className="text-xs text-text-secondary">Add an extra layer of security to your account.</p>
                  </div>
                </div>
                <Button size="sm" variant="secondary">Enable</Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input label="Current Password" type="password" />
                <Input label="New Password" type="password" />
              </div>
              <div className="pt-4 flex justify-end">
                <Button variant="secondary">Update Password</Button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="card p-6 space-y-6">
            <h3 className="text-lg font-semibold text-text-primary">Workspace Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Workspace Name" defaultValue="TaskFlow HQ" />
              <Input label="Workspace URL" defaultValue="taskflow.app/hq" disabled />
            </div>
            <div className="pt-4 flex justify-end">
              <Button onClick={handleSave} isLoading={isLoading}>Save Changes</Button>
            </div>
          </div>

          <div className="card overflow-hidden">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h3 className="text-lg font-semibold text-text-primary">Team Members</h3>
              <Button size="sm" className="gap-2">
                <Plus className="w-4 h-4" /> Invite Member
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-border">
                    <th className="px-6 py-4 text-xs font-bold text-text-secondary uppercase tracking-wider">Name</th>
                    <th className="px-6 py-4 text-xs font-bold text-text-secondary uppercase tracking-wider">Role</th>
                    <th className="px-6 py-4 text-xs font-bold text-text-secondary uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-xs font-bold text-text-secondary uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {users.map(member => (
                    <tr key={member.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img 
                            src={member.avatarUrl} 
                            alt={member.fullName} 
                            className="w-8 h-8 rounded-full"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <p className="text-sm font-semibold text-text-primary">{member.fullName}</p>
                            <p className="text-xs text-text-secondary">{member.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <select className="bg-transparent text-xs font-medium text-text-primary focus:outline-none capitalize">
                          <option value="admin" selected={member.role === 'admin'}>Admin</option>
                          <option value="manager" selected={member.role === 'manager'}>Manager</option>
                          <option value="member" selected={member.role === 'member'}>Member</option>
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="success">Active</Badge>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="p-1.5 hover:bg-red-50 rounded-lg text-error transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="card p-6 border-error/20 bg-red-50/30">
            <h3 className="text-lg font-semibold text-error mb-2">Danger Zone</h3>
            <p className="text-sm text-text-secondary mb-6">Once you delete a workspace, there is no going back. Please be certain.</p>
            <Button variant="danger">Delete Workspace</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
