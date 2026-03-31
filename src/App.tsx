import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import { ToastProvider } from './components/ui/Toast';
import { AppLayout } from './components/layout/AppLayout';

// Pages
import Dashboard from './pages/Dashboard';
import MyTasks from './pages/MyTasks';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import Settings from './pages/Settings';
import Onboarding from './pages/Onboarding';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import PasswordReset from './pages/auth/PasswordReset';

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <AppProvider>
          <ToastProvider>
            <Routes>
              {/* Auth Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/password-reset" element={<PasswordReset />} />
              <Route path="/onboarding" element={<Onboarding />} />

              {/* App Routes */}
              <Route path="/" element={<AppLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="my-tasks" element={<MyTasks />} />
                <Route path="projects" element={<Projects />} />
                <Route path="projects/:id" element={<ProjectDetail />} />
                <Route path="settings" element={<Settings />} />
              </Route>

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </ToastProvider>
        </AppProvider>
      </AuthProvider>
    </Router>
  );
}
