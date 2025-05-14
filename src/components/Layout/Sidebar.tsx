
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useIAM } from '../../contexts/IAMContext';
import { cn } from '@/lib/utils';
import { 
  User, 
  Users, 
  Shield, 
  ListCheck, 
  FileText, 
  Settings,
  BarChart4
} from 'lucide-react';

const SidebarItem: React.FC<{
  to: string;
  icon: React.ReactNode;
  label: string;
}> = ({ to, icon, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      cn(
        'flex items-center gap-3 rounded-lg px-3 py-2 text-gray-900 transition-all hover:text-iam-primary',
        isActive ? 'bg-iam-primary/10 text-iam-primary font-medium' : 'hover:bg-gray-100'
      )
    }
  >
    {icon}
    <span>{label}</span>
  </NavLink>
);

const Sidebar: React.FC = () => {
  const { currentUser } = useAuth();
  const { hasPermission } = useIAM();
  
  if (!currentUser) return null;
  
  const canManageUsers = hasPermission(currentUser.id, 'users', 'read');
  const canManageJobFunctions = hasPermission(currentUser.id, 'roles', 'read');
  const canViewReports = hasPermission(currentUser.id, 'reports', 'read');
  const canRunAudits = hasPermission(currentUser.id, 'audits', 'create');
  const canApproveRequests = hasPermission(currentUser.id, 'access_requests', 'approve');

  return (
    <div className="flex flex-col h-full border-r bg-white p-3 w-64">
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Dashboard
          </h2>
          <div className="space-y-1">
            <SidebarItem 
              to="/dashboard" 
              icon={<BarChart4 className="h-5 w-5" />} 
              label="Overview" 
            />
            <SidebarItem 
              to="/profile" 
              icon={<User className="h-5 w-5" />} 
              label="My Profile" 
            />
          </div>
        </div>
        
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Access Management
          </h2>
          <div className="space-y-1">
            <SidebarItem 
              to="/requests" 
              icon={<ListCheck className="h-5 w-5" />} 
              label="Access Requests" 
            />
            {canApproveRequests && (
              <SidebarItem 
                to="/approvals" 
                icon={<Shield className="h-5 w-5" />} 
                label="Approvals" 
              />
            )}
            <SidebarItem 
              to="/access-reviews" 
              icon={<Shield className="h-5 w-5" />} 
              label="User Access Reviews & Validation" 
            />
          </div>
        </div>
        
        {(canManageUsers || canManageJobFunctions) && (
          <div className="px-3 py-2">
            <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
              Administration
            </h2>
            <div className="space-y-1">
              {canManageUsers && (
                <SidebarItem 
                  to="/users" 
                  icon={<Users className="h-5 w-5" />} 
                  label="Users" 
                />
              )}
              {canManageJobFunctions && (
                <SidebarItem 
                  to="/job-functions" 
                  icon={<Shield className="h-5 w-5" />} 
                  label="Job Functions" 
                />
              )}
              {(canViewReports || canRunAudits) && (
                <SidebarItem 
                  to="/reports" 
                  icon={<FileText className="h-5 w-5" />} 
                  label="Reports" 
                />
              )}
              <SidebarItem 
                to="/settings" 
                icon={<Settings className="h-5 w-5" />} 
                label="Settings" 
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
