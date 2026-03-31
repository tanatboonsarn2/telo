import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FolderKanban, Eye, EyeOff } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/ui/Toast';

const Login: React.FC = () => {
  const [email, setEmail] = useState('alex@taskflow.app');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(email);
      showToast(`Welcome back!`, 'success');
      navigate('/');
    } catch {
      showToast('Invalid credentials', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-primary rounded-xl mb-4 shadow-lg shadow-primary/20">
            <FolderKanban className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">Welcome to TaskFlow</h1>
          <p className="text-text-secondary text-sm mt-2">Sign in to manage your team's projects.</p>
        </div>

        <div className="card p-8 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input 
              label="Work Email" 
              type="email" 
              placeholder="name@company.com" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-text-primary">Password</label>
                <Link to="/password-reset" className="text-xs font-medium text-primary hover:underline">Forgot password?</Link>
              </div>
              <div className="relative">
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  className="w-full h-10 pl-3 pr-10 bg-white border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full" isLoading={isLoading}>
              Sign In
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-surface px-2 text-text-secondary">Or continue with</span>
            </div>
          </div>

          <Button variant="secondary" className="w-full gap-2">
            <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="Google" />
            Google
          </Button>
        </div>

        <p className="text-center text-sm text-text-secondary">
          Don't have an account?{' '}
          <Link to="/register" className="font-semibold text-primary hover:underline">Sign up for free</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
