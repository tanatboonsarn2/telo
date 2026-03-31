import React, { useState } from 'react';
import { Plus, Filter, ArrowRight, FolderKanban } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAppContext } from '../context/AppContext';
import { TaskWidget } from '../components/dashboard/TaskWidget';
import { ProjectWidget } from '../components/dashboard/ProjectWidget';
import { ActivityFeed } from '../components/dashboard/ActivityFeed';
import { Button } from '../components/ui/Button';
import { Task } from '../types';
import { TaskDetailModal } from '../components/tasks/TaskDetailModal';
import { CreateTaskModal } from '../components/tasks/CreateTaskModal';
import { CreateProjectModal } from '../components/dashboard/CreateProjectModal';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { projects, tasks, notifications } = useAppContext();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCreateProjectModalOpen, setIsCreateProjectModalOpen] = useState(false);

  const myTasks = tasks.filter(t => t.assigneeId === user?.id && t.status !== 'done');
  const activeProjects = projects.filter(p => p.status === 'active').slice(0, 3);

  return (
    <div className="space-y-8 pb-10">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Welcome back, {user?.fullName.split(' ')[0]}!</h1>
          <p className="text-text-secondary text-sm mt-1">Here's what's happening in your workspace today.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" className="hidden sm:flex gap-2">
            <Filter className="w-4 h-4" /> Filters
          </Button>
          <Button className="gap-2" onClick={() => setIsCreateProjectModalOpen(true)}>
            <Plus className="w-4 h-4" /> New Project
          </Button>
        </div>
      </div>

      {/* Top Stats/Widgets Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: My Tasks */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TaskWidget tasks={myTasks} onTaskClick={setSelectedTask} />
            <ActivityFeed notifications={notifications} />
          </div>

          {/* Projects Summary */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-text-primary">Active Projects</h2>
              <Button variant="ghost" size="sm" className="gap-1">
                View All <ArrowRight className="w-3 h-3" />
              </Button>
            </div>
            <ProjectWidget projects={activeProjects} />
          </div>
        </div>

        {/* Right Column: Quick Stats & Actions */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-6">
          <div className="card p-6 bg-primary text-white">
            <h3 className="font-semibold mb-2">Project Progress</h3>
            <p className="text-xs text-white/80 mb-6">You have completed 12 tasks this week. Keep it up!</p>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span>Website Redesign</span>
                  <span>65%</span>
                </div>
                <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-white w-[65%]" />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span>Product Launch</span>
                  <span>42%</span>
                </div>
                <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-white w-[42%]" />
                </div>
              </div>
            </div>
            
            <Button variant="secondary" className="w-full mt-8 bg-white/10 border-white/20 text-white hover:bg-white/20">
              View Analytics
            </Button>
          </div>

          <div className="card p-6">
            <h3 className="font-semibold text-text-primary mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => setIsCreateModalOpen(true)}
                className="flex flex-col items-center justify-center p-4 rounded-xl border border-border hover:border-primary hover:bg-primary/5 transition-all group"
              >
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mb-2 group-hover:bg-blue-200 transition-colors">
                  <Plus className="w-5 h-5 text-blue-600" />
                </div>
                <span className="text-xs font-medium text-text-primary">Add Task</span>
              </button>
              <button 
                onClick={() => setIsCreateProjectModalOpen(true)}
                className="flex flex-col items-center justify-center p-4 rounded-xl border border-border hover:border-primary hover:bg-primary/5 transition-all group"
              >
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mb-2 group-hover:bg-purple-200 transition-colors">
                  <FolderKanban className="w-5 h-5 text-purple-600" />
                </div>
                <span className="text-xs font-medium text-text-primary">New Project</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
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

      <CreateProjectModal 
        isOpen={isCreateProjectModalOpen} 
        onClose={() => setIsCreateProjectModalOpen(false)} 
      />
    </div>
  );
};

export default Dashboard;
