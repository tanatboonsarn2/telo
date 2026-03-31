import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FolderKanban, 
  CheckCircle2, 
  Users, 
  Zap, 
  BarChart3, 
  ArrowRight,
  LayoutGrid,
  Github,
  Twitter,
  Linkedin
} from 'lucide-react';
import { Button } from '../components/ui/Button';

const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <FolderKanban className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900 tracking-tight">TaskFlow</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">Features</a>
              <a href="#solutions" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">Solutions</a>
              <a href="#pricing" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">Pricing</a>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/login">
                <Button variant="ghost" size="sm">Log in</Button>
              </Link>
              <Link to="/register">
                <Button size="sm">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-8 max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
              <Zap className="w-3 h-3" /> New: AI-Powered Task Prioritization
            </div>
            <h1 className="text-5xl lg:text-7xl font-extrabold text-gray-900 tracking-tight leading-[1.1]">
              Manage projects <span className="text-primary">without the chaos.</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              TaskFlow brings all your team's tasks, projects, and files together in one place. Stop jumping between tools and start shipping faster.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link to="/register" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-lg gap-2">
                  Start for free <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Button variant="secondary" size="lg" className="w-full sm:w-auto h-14 px-8 text-lg">
                Book a demo
              </Button>
            </div>
            <div className="pt-12">
              <p className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-8">Trusted by teams at</p>
              <div className="flex flex-wrap justify-center gap-8 lg:gap-16 opacity-50 grayscale">
                <img src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" className="h-6" alt="Google" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg" className="h-6" alt="IBM" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg" className="h-6" alt="Netflix" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/b/b9/Slack_Technologies_Logo.svg" className="h-6" alt="Slack" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* App Preview */}
      <section className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-gray-200 bg-gray-50 p-2">
            <img 
              src="https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=2070" 
              className="rounded-xl w-full" 
              alt="TaskFlow Dashboard" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent pointer-events-none"></div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gray-50 -z-10"></div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">Everything you need to ship faster</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Powerful features to help your team stay organized and focused on what matters.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <LayoutGrid className="w-6 h-6" />,
                title: "Kanban Boards",
                description: "Visualize your workflow and move tasks through stages with ease."
              },
              {
                icon: <Users className="w-6 h-6" />,
                title: "Team Collaboration",
                description: "Assign tasks, share feedback, and keep everyone in the loop."
              },
              {
                icon: <BarChart3 className="w-6 h-6" />,
                title: "Real-time Analytics",
                description: "Track progress and identify bottlenecks before they slow you down."
              },
              {
                icon: <Zap className="w-6 h-6" />,
                title: "Fast Performance",
                description: "Built for speed. No more waiting for pages to load or data to sync."
              },
              {
                icon: <CheckCircle2 className="w-6 h-6" />,
                title: "Task Management",
                description: "Organize tasks with priorities, due dates, and custom labels."
              },
              {
                icon: <FolderKanban className="w-6 h-6" />,
                title: "Project Tracking",
                description: "Manage multiple projects and see the big picture at a glance."
              }
            ].map((feature, i) => (
              <div key={i} className="bg-white p-8 rounded-2xl border border-gray-100 hover:shadow-xl transition-all group">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-2 space-y-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <FolderKanban className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900 tracking-tight">TaskFlow</span>
              </div>
              <p className="text-gray-500 max-w-xs leading-relaxed">
                The modern project management tool for teams that want to ship high-quality products, faster.
              </p>
              <div className="flex items-center gap-4">
                <a href="#" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-primary transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-primary transition-colors">
                  <Github className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-primary transition-colors">
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-6">Product</h4>
              <ul className="space-y-4 text-sm text-gray-500">
                <li><a href="#" className="hover:text-primary transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Integrations</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Changelog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-6">Company</h4>
              <ul className="space-y-4 text-sm text-gray-500">
                <li><a href="#" className="hover:text-primary transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400">© 2026 TaskFlow Inc. All rights reserved.</p>
            <div className="flex items-center gap-8 text-sm text-gray-400">
              <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
