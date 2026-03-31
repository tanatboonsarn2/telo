import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  CheckSquare, 
  FolderKanban, 
  Settings, 
  LogOut, 
  ChevronLeft, 
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../utils/cn';

export const Sidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: CheckSquare, label: 'My Tasks', path: '/my-tasks' },
    { icon: FolderKanban, label: 'Projects', path: '/projects' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside 
      className={cn(
        'hidden lg:flex flex-col bg-sidebar-bg text-sidebar-text transition-all duration-300 h-screen sticky top-0 z-40 border-r border-border',
        isCollapsed ? 'w-20' : 'w-64'
      )}
    >
      {/* Header */}
      <div className="h-16 flex items-center px-6 border-b border-border">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
            <FolderKanban className="w-5 h-5 text-white" />
          </div>
          {!isCollapsed && (
            <span className="font-bold text-xl text-text-primary tracking-tight">TaskFlow</span>
          )}
        </div>
      </div>

      {/* Workspace Info */}
      <div className="px-4 py-6">
        <div className={cn(
          'bg-background rounded-xl p-3 flex items-center gap-3 overflow-hidden transition-all',
          isCollapsed ? 'justify-center' : ''
        )}>
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            <span className="text-primary font-bold text-xs">TF</span>
          </div>
          {!isCollapsed && (
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-semibold text-text-primary truncate">TaskFlow HQ</span>
              <span className="text-xs text-text-secondary truncate">Free Plan</span>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-grow px-3 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group relative',
              isActive 
                ? 'bg-primary text-white' 
                : 'hover:bg-background hover:text-text-primary'
            )}
          >
            <item.icon className={cn('w-5 h-5 flex-shrink-0')} />
            {!isCollapsed && <span className="text-sm font-medium">{item.label}</span>}
            {isCollapsed && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-text-primary text-background text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                {item.label}
              </div>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <div className={cn(
          'flex items-center gap-3 mb-4 overflow-hidden',
          isCollapsed ? 'justify-center' : ''
        )}>
          <img 
            src={user?.avatarUrl} 
            alt={user?.fullName} 
            className="w-8 h-8 rounded-full border border-border"
            referrerPolicy="no-referrer"
          />
          {!isCollapsed && (
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-medium text-text-primary truncate">{user?.fullName}</span>
              <span className="text-xs text-text-secondary truncate capitalize">{user?.role}</span>
            </div>
          )}
        </div>
        
        <button 
          onClick={handleLogout}
          className={cn(
            'w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-background hover:text-text-primary transition-all text-text-secondary',
            isCollapsed ? 'justify-center' : ''
          )}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!isCollapsed && <span className="text-sm font-medium">Sign Out</span>}
        </button>

        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="mt-4 w-full flex items-center justify-center p-2 rounded-lg hover:bg-background transition-all text-text-secondary"
        >
          {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>
    </aside>
  );
};
