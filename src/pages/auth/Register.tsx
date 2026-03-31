import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FolderKanban } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useToast } from '../../components/ui/Toast';

import { useAuth } from '../../context/AuthContext';

const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await register(fullName, email, password);
      showToast('Account created successfully!', 'success');
      navigate('/onboarding');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Failed to create account', 'error');
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
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">Create your account</h1>
          <p className="text-text-secondary text-sm mt-2">Start organizing your team's work today.</p>
        </div>

        <div className="card p-8 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input 
              label="Full Name" 
              placeholder="Alex Rivera" 
              required 
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
            <Input 
              label="Work Email" 
              type="email" 
              placeholder="name@company.com" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input label="Password" type="password" placeholder="••••••••" required helperText="Minimum 8 characters" value={password} onChange={(e) => setPassword(e.target.value)} />
            
            <div className="flex items-start gap-2">
              <input type="checkbox" className="mt-1 rounded border-border text-primary focus:ring-primary" required id="terms" />
              <label htmlFor="terms" className="text-xs text-text-secondary leading-relaxed">
                I agree to the <Link to="#" className="text-primary hover:underline">Terms of Service</Link> and <Link to="#" className="text-primary hover:underline">Privacy Policy</Link>.
              </label>
            </div>

            <Button type="submit" className="w-full" isLoading={isLoading}>
              Create Account
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
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-primary hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
