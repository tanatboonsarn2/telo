import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  LayoutGrid, 
  List, 
  MoreVertical, 
  Clock
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Link } from 'react-router-dom';
import { cn } from '../utils/cn';
import { CreateProjectModal } from '../components/dashboard/CreateProjectModal';

const Projects: React.FC = () => {
  const { user } = useAuth();
  const { projects, users } = useAppContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const filteredProjects = projects.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Projects</h1>
          <p className="text-text-secondary text-sm mt-1">Manage and track all your team's projects.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-gray-100 p-1 rounded-lg border border-border">
            <button 
              onClick={() => setViewMode('grid')}
              className={cn(
                'p-1.5 rounded-md transition-all',
                viewMode === 'grid' ? 'bg-white shadow-sm text-primary' : 'text-text-secondary hover:text-text-primary'
              )}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={cn(
                'p-1.5 rounded-md transition-all',
                viewMode === 'list' ? 'bg-white shadow-sm text-primary' : 'text-text-secondary hover:text-text-primary'
              )}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
          {(user?.role === 'admin' || user?.role === 'manager') && (
            <Button className="gap-2" onClick={() => setIsCreateModalOpen(true)}>
              <Plus className="w-4 h-4" /> New Project
            </Button>
          )}
        </div>
      </div>

      {/* Filter Bar */}
      <div className="card p-4 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
          <input 
            type="text" 
            placeholder="Search projects..." 
            className="w-full h-10 pl-10 pr-4 bg-gray-50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3">
          <select className="h-10 px-3 bg-gray-50 border border-border rounded-xl text-sm focus:outline-none">
            <option value="active">Active</option>
            <option value="archived">Archived</option>
          </select>
          <Button variant="secondary" className="gap-2">
            <Filter className="w-4 h-4" /> Filters
          </Button>
        </div>
      </div>

      {/* Projects Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredProjects.map(project => {
            const progress = Math.round((project.taskStats.done / project.taskStats.total) * 100) || 0;

            return (
              <Link 
                key={project.id} 
                to={`/projects/${project.id}`}
                className="card p-6 hover:shadow-md transition-all group flex flex-col h-full"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary font-bold text-xl">
                    {project.name.charAt(0)}
                  </div>
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-text-secondary">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
                
                <h3 className="text-lg font-bold text-text-primary group-hover:text-primary transition-colors mb-2">{project.name}</h3>
                <p className="text-sm text-text-secondary line-clamp-2 mb-6 flex-grow">{project.description}</p>
                
                <div className="space-y-4 pt-4 border-t border-border">
                  <div className="flex items-center justify-between text-xs font-medium">
                    <span className="text-text-secondary">Progress</span>
                    <span className="text-text-primary">{progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary transition-all duration-500" 
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex -space-x-2">
                      {project.memberIds.slice(0, 4).map(id => {
                        const member = users.find(u => u.id === id);
                        return (
                          <img 
                            key={id} 
                            src={member?.avatarUrl} 
                            alt={member?.fullName} 
                            className="w-7 h-7 rounded-full border-2 border-surface"
                            referrerPolicy="no-referrer"
                          />
                        );
                      })}
                      {project.memberIds.length > 4 && (
                        <div className="w-7 h-7 rounded-full bg-gray-100 border-2 border-surface flex items-center justify-center text-[10px] font-bold text-gray-500">
                          +{project.memberIds.length - 4}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-text-secondary">
                      <Clock className="w-3.5 h-3.5" />
                      {new Date(project.dueDate).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-border">
                  <th className="px-6 py-4 text-xs font-bold text-text-secondary uppercase tracking-wider">Project Name</th>
                  <th className="px-6 py-4 text-xs font-bold text-text-secondary uppercase tracking-wider">Owner</th>
                  <th className="px-6 py-4 text-xs font-bold text-text-secondary uppercase tracking-wider">Progress</th>
                  <th className="px-6 py-4 text-xs font-bold text-text-secondary uppercase tracking-wider">Members</th>
                  <th className="px-6 py-4 text-xs font-bold text-text-secondary uppercase tracking-wider">Due Date</th>
                  <th className="px-6 py-4 text-xs font-bold text-text-secondary uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredProjects.map(project => {
                  const progress = Math.round((project.taskStats.done / project.taskStats.total) * 100) || 0;
                  const owner = users.find(u => u.id === project.ownerId);
                  return (
                    <tr 
                      key={project.id} 
                      className="hover:bg-gray-50 transition-colors group cursor-pointer"
                      onClick={() => {}}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary font-bold text-xs">
                            {project.name.charAt(0)}
                          </div>
                          <Link to={`/projects/${project.id}`} className="text-sm font-semibold text-text-primary hover:text-primary transition-colors">
                            {project.name}
                          </Link>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <img 
                            src={owner?.avatarUrl} 
                            alt={owner?.fullName} 
                            className="w-6 h-6 rounded-full"
                            referrerPolicy="no-referrer"
                          />
                          <span className="text-xs text-text-primary">{owner?.fullName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 w-48">
                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-primary" style={{ width: `${progress}%` }} />
                          </div>
                          <span className="text-xs font-medium text-text-primary">{progress}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex -space-x-1.5">
                          {project.memberIds.slice(0, 3).map(id => (
                            <img 
                              key={id} 
                              src={users.find(u => u.id === id)?.avatarUrl} 
                              className="w-6 h-6 rounded-full border-2 border-surface"
                              referrerPolicy="no-referrer"
                            />
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs text-text-secondary">{new Date(project.dueDate).toLocaleDateString()}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="p-1.5 hover:bg-gray-200 rounded-lg text-text-secondary transition-colors">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <CreateProjectModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
      />
    </div>
  );
};

export default Projects;
