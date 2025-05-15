
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { IAMProvider } from "./contexts/IAMContext";
import ProtectedLayout from "./components/Layout/ProtectedLayout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AccessRequests from "./pages/AccessRequests";
import Approvals from "./pages/Approvals";
import AccessReviews from "./pages/AccessReviews";
import Users from "./pages/Users";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import JobFunctions from "./pages/JobFunctions";
import Reports from "./pages/Reports";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <IAMProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              
              <Route path="/" element={<ProtectedLayout />}>
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="requests" element={<AccessRequests />} />
                <Route path="approvals" element={<Approvals />} />
                <Route path="access-reviews" element={<AccessReviews />} />
                <Route path="reports" element={<Reports />} />
                <Route path="users" element={<Users />} />
                <Route path="profile" element={<Profile />} />
                <Route path="job-functions" element={<JobFunctions />} />
                {/* Add other protected routes here */}
              </Route>
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </IAMProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
