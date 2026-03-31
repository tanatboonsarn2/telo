/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Project, Task, Notification, User } from '../types';
import { api } from '../lib/api';
import { useAuth } from './AuthContext';

interface AppContextType {
  projects: Project[];
  tasks: Task[];
  notifications: Notification[];
  users: User[];
  isLoading: boolean;
  addProject: (data: { name: string; description?: string; dueDate?: string; memberIds?: string[] }) => Promise<Project>;
  updateProject: (projectId: string, updates: Partial<Project>) => Promise<void>;
  deleteProject: (projectId: string) => Promise<void>;
  addTask: (data: {
    title: string; description?: string; projectId: string;
    assigneeId?: string; priority?: string; dueDate?: string; status?: string;
  }) => Promise<Task>;
  updateTask: (taskId: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  markNotificationRead: (id: string) => Promise<void>;
  refreshTasks: (projectId?: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      setProjects([]);
      setTasks([]);
      setNotifications([]);
      setUsers([]);
      return;
    }
    setIsLoading(true);
    Promise.all([
      api.get<Project[]>('/projects'),
      api.get<Notification[]>('/notifications'),
      api.get<User[]>('/users'),
      api.get<Task[]>('/tasks'),
    ])
      .then(([projs, notifs, usrs, tsks]) => {
        setProjects(projs);
        setNotifications(notifs);
        setUsers(usrs);
        setTasks(tsks);
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [isAuthenticated]);

  const refreshTasks = useCallback(async (projectId?: string) => {
    const query = projectId ? `?projectId=${projectId}` : '';
    const fetched = await api.get<Task[]>(`/tasks${query}`);
    if (projectId) {
      setTasks(prev => [...prev.filter(t => t.projectId !== projectId), ...fetched]);
    } else {
      setTasks(fetched);
    }
  }, []);

  const addProject = async (data: { name: string; description?: string; dueDate?: string; memberIds?: string[] }) => {
    const project = await api.post<Project>('/projects', data);
    setProjects(prev => [project, ...prev]);
    return project;
  };

  const updateProject = async (projectId: string, updates: Partial<Project>) => {
    const updated = await api.patch<Project>(`/projects/${projectId}`, updates);
    setProjects(prev => prev.map(p => p.id === projectId ? updated : p));
  };

  const deleteProject = async (projectId: string) => {
    await api.delete(`/projects/${projectId}`);
    setProjects(prev => prev.filter(p => p.id !== projectId));
    setTasks(prev => prev.filter(t => t.projectId !== projectId));
  };

  const addTask = async (data: {
    title: string; description?: string; projectId: string;
    assigneeId?: string; priority?: string; dueDate?: string; status?: string;
  }) => {
    const task = await api.post<Task>('/tasks', data);
    setTasks(prev => [task, ...prev]);
    // Refresh project taskStats
    api.get<Project>(`/projects/${data.projectId}`)
      .then(p => setProjects(prev => prev.map(proj => proj.id === p.id ? p : proj)))
      .catch(console.error);
    return task;
  };

  const updateTask = async (taskId: string, updates: Partial<Task>) => {
    const updated = await api.patch<Task>(`/tasks/${taskId}`, updates);
    setTasks(prev => prev.map(t => t.id === taskId ? updated : t));
    // Refresh project taskStats if status changed
    if (updates.status !== undefined) {
      const projectId = updated.projectId;
      api.get<Project>(`/projects/${projectId}`)
        .then(p => setProjects(prev => prev.map(proj => proj.id === p.id ? p : proj)))
        .catch(console.error);
    }
  };

  const deleteTask = async (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    await api.delete(`/tasks/${taskId}`);
    setTasks(prev => prev.filter(t => t.id !== taskId));
    if (task) {
      api.get<Project>(`/projects/${task.projectId}`)
        .then(p => setProjects(prev => prev.map(proj => proj.id === p.id ? p : proj)))
        .catch(console.error);
    }
  };

  const markNotificationRead = async (id: string) => {
    await api.patch(`/notifications/${id}`, { read: true });
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  return (
    <AppContext.Provider value={{
      projects,
      tasks,
      notifications,
      users,
      isLoading,
      addProject,
      updateProject,
      deleteProject,
      addTask,
      updateTask,
      deleteTask,
      markNotificationRead,
      refreshTasks,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
