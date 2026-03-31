/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { api, clearAuth } from '../lib/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (fullName: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    const token = localStorage.getItem('taskflow_token');
    if (!token) {
      setIsLoading(false);
      return;
    }
    api.get<{ user: User }>('/auth/me')
      .then(({ user }) => setUser(user))
      .catch(() => clearAuth())
      .finally(() => setIsLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    const { user, token } = await api.post<{ user: User; token: string }>('/auth/login', { email, password });
    localStorage.setItem('taskflow_token', token);
    localStorage.setItem('taskflow_user', JSON.stringify(user));
    setUser(user);
  };

  const register = async (fullName: string, email: string, password: string) => {
    const { user, token } = await api.post<{ user: User; token: string }>('/auth/register', { fullName, email, password });
    localStorage.setItem('taskflow_token', token);
    localStorage.setItem('taskflow_user', JSON.stringify(user));
    setUser(user);
  };

  const logout = () => {
    setUser(null);
    clearAuth();
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
