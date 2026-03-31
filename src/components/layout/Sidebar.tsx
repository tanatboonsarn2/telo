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
        'hidden lg:flex flex-col bg-sidebar-bg text-sidebar-text transition-all duration-300 h-screen sticky top-0 z-40',
        isCollapsed ? 'w-20' : 'w-64'
      )}
    >
      {/* Header */}
      <div className="h-16 flex items-center px-6 border-b border-gray-800">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
            <FolderKanban className="w-5 h-5 text-white" />
          </div>
          {!isCollapsed && (
            <span className="font-bold text-xl text-white tracking-tight">TaskFlow</span>
          )}
        </div>
      </div>

      {/* Workspace Info */}
      <div className="px-4 py-6">
        <div className={cn(
          'bg-gray-800/50 rounded-xl p-3 flex items-center gap-3 overflow-hidden transition-all',
          isCollapsed ? 'justify-center' : ''
        )}>
          <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
            <span className="text-indigo-400 font-bold text-xs">TF</span>
          </div>
          {!isCollapsed && (
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-semibold text-white truncate">TaskFlow HQ</span>
              <span className="text-xs text-gray-400 truncate">Free Plan</span>
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
                : 'hover:bg-gray-800 hover:text-white'
            )}
          >
            <item.icon className={cn('w-5 h-5 flex-shrink-0')} />
            {!isCollapsed && <span className="text-sm font-medium">{item.label}</span>}
            {isCollapsed && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                {item.label}
              </div>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-800">
        <div className={cn(
          'flex items-center gap-3 mb-4 overflow-hidden',
          isCollapsed ? 'justify-center' : ''
        )}>
          <img 
            src={user?.avatarUrl} 
            alt={user?.fullName} 
            className="w-8 h-8 rounded-full border border-gray-700"
            referrerPolicy="no-referrer"
          />
          {!isCollapsed && (
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-medium text-white truncate">{user?.fullName}</span>
              <span className="text-xs text-gray-400 truncate capitalize">{user?.role}</span>
            </div>
          )}
        </div>
        
        <button 
          onClick={handleLogout}
          className={cn(
            'w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-800 hover:text-white transition-all text-gray-400',
            isCollapsed ? 'justify-center' : ''
          )}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!isCollapsed && <span className="text-sm font-medium">Sign Out</span>}
        </button>

        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="mt-4 w-full flex items-center justify-center p-2 rounded-lg hover:bg-gray-800 transition-all text-gray-500"
        >
          {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>
    </aside>
  );
};
