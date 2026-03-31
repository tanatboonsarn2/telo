import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Users, CheckCircle2, ArrowRight, ChevronRight } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../utils/cn';

const Onboarding: React.FC = () => {
  const [step, setStep] = useState(1);
  const [workspaceName, setWorkspaceName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const nextStep = () => {
    if (step < 3) setStep(step + 1);
    else {
      setIsLoading(true);
      setTimeout(() => navigate('/'), 1000);
    }
  };

  const steps = [
    { id: 1, title: 'Workspace', icon: Building2 },
    { id: 2, title: 'Team', icon: Users },
    { id: 3, title: 'Done', icon: CheckCircle2 },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-xl">
        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-4 mb-12">
          {steps.map((s, i) => (
            <React.Fragment key={s.id}>
              <div className="flex flex-col items-center gap-2">
                <div className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300',
                  step >= s.id ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-gray-200 text-gray-400'
                )}>
                  <s.icon className="w-5 h-5" />
                </div>
                <span className={cn('text-[10px] font-bold uppercase tracking-widest', step >= s.id ? 'text-primary' : 'text-gray-400')}>
                  {s.title}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className={cn('w-12 h-0.5 rounded-full transition-all duration-300', step > s.id ? 'bg-primary' : 'bg-gray-200')} />
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="card p-10 relative overflow-hidden">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-text-primary">Name your workspace</h2>
                  <p className="text-sm text-text-secondary">This is usually your company or team name.</p>
                </div>
                <Input 
                  label="Workspace Name" 
                  placeholder="e.g. Acme Corp" 
                  autoFocus
                  value={workspaceName}
                  onChange={(e) => setWorkspaceName(e.target.value)}
                />
                <div className="pt-4">
                  <Button className="w-full gap-2" onClick={nextStep} disabled={!workspaceName}>
                    Continue <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-text-primary">Invite your team</h2>
                  <p className="text-sm text-text-secondary">TaskFlow is better with teammates.</p>
                </div>
                <div className="space-y-3">
                  <Input placeholder="email@company.com" />
                  <Input placeholder="email@company.com" />
                  <Input placeholder="email@company.com" />
                </div>
                <div className="pt-4 flex gap-3">
                  <Button variant="ghost" className="flex-1" onClick={nextStep}>Skip for now</Button>
                  <Button className="flex-1 gap-2" onClick={nextStep}>
                    Send Invites <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div 
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="text-center space-y-6"
              >
                <div className="w-20 h-20 bg-success/10 text-success rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-text-primary">You're all set!</h2>
                  <p className="text-sm text-text-secondary">Your workspace is ready. Let's get to work.</p>
                </div>
                <div className="pt-4">
                  <Button className="w-full gap-2" onClick={nextStep} isLoading={isLoading}>
                    Go to Dashboard <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
