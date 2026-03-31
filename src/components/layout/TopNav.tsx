import React, { useState } from 'react';
import { Search, Bell, Menu, User, Settings, LogOut, Sun, Moon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useAppContext } from '../../context/AppContext';
import { useTheme } from '../../context/ThemeContext';
import { cn } from '../../utils/cn';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';

export const TopNav: React.FC<{ onMenuClick?: () => void }> = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const { notifications, markNotificationRead } = useAppContext();
  const { theme, toggleTheme } = useTheme();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleLogout = () => {
    logout();
    navigate('/landing');
  };

  return (
    <header className="h-16 bg-surface border-b border-border flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30">
      <div className="flex items-center gap-4 flex-1">
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Menu className="w-6 h-6 text-text-secondary" />
        </button>
        
        <div className="relative max-w-md w-full hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
          <input 
            type="text" 
            placeholder="Search tasks, projects..." 
            className="w-full h-10 pl-10 pr-4 bg-gray-100 border-transparent focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 rounded-xl text-sm transition-all outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="flex items-center gap-2 lg:gap-4">
        {/* Theme Toggle */}
        <button 
          onClick={toggleTheme}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors text-text-secondary"
          title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
        >
          {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button 
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative"
          >
            <Bell className="w-5 h-5 text-text-secondary" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-error text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-surface">
                {unreadCount}
              </span>
            )}
          </button>

          <AnimatePresence>
            {isNotifOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsNotifOpen(false)} />
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-80 bg-surface rounded-xl shadow-xl border border-border z-50 overflow-hidden"
                >
                  <div className="p-4 border-b border-border flex items-center justify-between">
                    <h3 className="font-semibold text-sm">Notifications</h3>
                    <span className="text-xs text-primary cursor-pointer hover:underline">Mark all as read</span>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map(notif => (
                        <div 
                          key={notif.id} 
                          className={cn(
                            'p-4 border-b border-border hover:bg-gray-50 transition-colors cursor-pointer',
                            !notif.read && 'bg-primary/5'
                          )}
                          onClick={() => markNotificationRead(notif.id)}
                        >
                          <p className="text-xs text-text-primary leading-relaxed">{notif.message}</p>
                          <span className="text-[10px] text-text-secondary mt-1 block">2 hours ago</span>
                        </div>
                      ))
                    ) : (
                      <div className="p-8 text-center">
                        <p className="text-sm text-text-secondary">No notifications yet</p>
                      </div>
                    )}
                  </div>
                  <div className="p-3 text-center bg-gray-50">
                    <button className="text-xs font-medium text-primary hover:underline">View all notifications</button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* User Menu */}
        <div className="relative">
          <button 
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center gap-2 p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <img 
              src={user?.avatarUrl} 
              alt={user?.fullName} 
              className="w-8 h-8 rounded-full border border-border"
              referrerPolicy="no-referrer"
            />
            <span className="text-sm font-medium text-text-primary hidden sm:block">{user?.fullName.split(' ')[0]}</span>
          </button>

          <AnimatePresence>
            {isUserMenuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsUserMenuOpen(false)} />
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-56 bg-surface rounded-xl shadow-xl border border-border z-50 overflow-hidden"
                >
                  <div className="p-4 border-b border-border">
                    <p className="text-sm font-semibold text-text-primary">{user?.fullName}</p>
                    <p className="text-xs text-text-secondary truncate">{user?.email}</p>
                  </div>
                  <div className="p-2">
                    <Link 
                      to="/settings" 
                      className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 text-sm text-text-primary transition-colors"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <User className="w-4 h-4" /> Profile
                    </Link>
                    <Link 
                      to="/settings" 
                      className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 text-sm text-text-primary transition-colors"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <Settings className="w-4 h-4" /> Settings
                    </Link>
                  </div>
                  <div className="p-2 border-t border-border">
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-50 text-sm text-error transition-colors"
                    >
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};
