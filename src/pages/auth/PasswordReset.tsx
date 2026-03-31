import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FolderKanban, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useToast } from '../../components/ui/Toast';

const PasswordReset: React.FC = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      if (step === 1) setStep(2);
      else {
        showToast('Password reset successfully!', 'success');
        navigate('/login');
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-primary rounded-xl mb-4 shadow-lg shadow-primary/20">
            <FolderKanban className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">
            {step === 1 ? 'Reset your password' : 'Check your email'}
          </h1>
          <p className="text-text-secondary text-sm mt-2">
            {step === 1 
              ? "Enter your email and we'll send you a reset link." 
              : `We've sent a password reset link to ${email}`}
          </p>
        </div>

        <div className="card p-8 space-y-6">
          {step === 1 ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              <Input 
                label="Work Email" 
                type="email" 
                placeholder="name@company.com" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button type="submit" className="w-full" isLoading={isLoading}>
                Send Reset Link
              </Button>
            </form>
          ) : (
            <div className="text-center space-y-6">
              <div className="w-16 h-16 bg-success/10 text-success rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">
                Didn't receive the email? Check your spam folder or{' '}
                <button onClick={() => setStep(1)} className="text-primary font-bold hover:underline">try again</button>.
              </p>
              <Button variant="secondary" className="w-full" onClick={() => navigate('/login')}>
                Back to Sign In
              </Button>
            </div>
          )}
        </div>

        {step === 1 && (
          <p className="text-center text-sm">
            <Link to="/login" className="inline-flex items-center gap-2 font-semibold text-primary hover:underline">
              <ArrowLeft className="w-4 h-4" /> Back to Sign In
            </Link>
          </p>
        )}
      </div>
    </div>
  );
};

export default PasswordReset;
