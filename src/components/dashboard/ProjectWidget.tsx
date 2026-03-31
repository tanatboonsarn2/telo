import React from 'react';
import { Project } from '../../types';
import { mockUsers } from '../../data/mockData';
import { Link } from 'react-router-dom';

interface ProjectWidgetProps {
  projects: Project[];
}

export const ProjectWidget: React.FC<ProjectWidgetProps> = ({ projects }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {projects.map(project => {
        const progress = Math.round((project.taskStats.done / project.taskStats.total) * 100) || 0;

        return (
          <Link 
            key={project.id} 
            to={`/projects/${project.id}`}
            className="card p-5 hover:bg-hover transition-all group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary font-bold">
                {project.name.charAt(0)}
              </div>
              <div className="flex -space-x-2">
                {project.memberIds.slice(0, 3).map(id => {
                  const member = mockUsers.find(u => u.id === id);
                  return (
                    <img 
                      key={id} 
                      src={member?.avatarUrl} 
                      alt={member?.fullName} 
                      className="w-6 h-6 rounded-full border-2 border-surface"
                      referrerPolicy="no-referrer"
                    />
                  );
                })}
                {project.memberIds.length > 3 && (
                  <div className="w-6 h-6 rounded-full bg-gray-100 border-2 border-surface flex items-center justify-center text-[10px] font-bold text-gray-500">
                    +{project.memberIds.length - 3}
                  </div>
                )}
              </div>
            </div>
            
            <h4 className="font-semibold text-text-primary group-hover:text-primary transition-colors mb-1">{project.name}</h4>
            <p className="text-xs text-text-secondary line-clamp-2 mb-4 h-8">{project.description}</p>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[10px] font-medium">
                <span className="text-text-secondary">Progress</span>
                <span className="text-text-primary">{progress}%</span>
              </div>
              <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-500" 
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[10px] text-text-secondary pt-1">
                <span>{project.taskStats.total} Tasks</span>
                <span>Due {new Date(project.dueDate).toLocaleDateString()}</span>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
};
