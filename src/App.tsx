
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from 'next-themes';
import { AuthProvider } from './contexts/AuthContext';
import { IAMProvider } from './contexts/IAMContext';
import { Toaster } from './components/ui/toaster';
import Layout from './components/Layout/ProtectedLayout';
import Index from './pages/Index';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import AccessRequests from './pages/AccessRequests';
import AccessReviews from './pages/AccessReviews';
import Approvals from './pages/Approvals';
import Reports from './pages/Reports';
import JobFunctions from './pages/JobFunctions';
import AuditLogs from './pages/AuditLogs';
import Profile from './pages/Profile';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import { Toaster as SonnerToaster } from 'sonner';

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthProvider>
        <IAMProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              
              <Route path="/" element={<Layout />}>
                <Route index element={<Index />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="users" element={<Users />} />
                <Route path="requests" element={<AccessRequests />} />
                <Route path="reviews" element={<AccessReviews />} />
                <Route path="approvals" element={<Approvals />} />
                <Route path="reports" element={<Reports />} />
                <Route path="job-functions" element={<JobFunctions />} />
                <Route path="audit-logs" element={<AuditLogs />} />
                <Route path="profile" element={<Profile />} />
              </Route>
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
          <Toaster />
          <SonnerToaster position="top-right" />
        </IAMProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
