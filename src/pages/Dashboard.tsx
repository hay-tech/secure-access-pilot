
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useIAM } from '../contexts/IAMContext';

// Import dashboard components
import UserStatsCard from '../components/dashboard/UserStatsCard';
import RoleDistributionTable from '../components/dashboard/RoleDistributionTable';
import AccessReviewPieChart from '../components/dashboard/AccessReviewPieChart';
import DashboardSkeleton from '../components/dashboard/DashboardSkeleton';

// Import UI components
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { AspectRatio } from '@/components/ui/aspect-ratio';

const Dashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const { 
    accessRequests, 
    accessReviews, 
    users, 
    roles,
    getUserRoles, 
    getUserPermissions,
    hasPermission
  } = useIAM();
  
  // Added loading state for dashboard
  const [loading, setLoading] = useState(true);
  
  // Simulate loading for demo purposes
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  if (!currentUser) return null;

  if (loading) {
    return <DashboardSkeleton />;
  }

  const userRoles = getUserRoles(currentUser.id);
  const userPermissions = getUserPermissions(currentUser.id);
  
  // Get job functions directly from the user object instead of from roles
  const userJobFunctions = currentUser.jobFunction ? [currentUser.jobFunction] : 
                          currentUser.jobFunctions ? currentUser.jobFunctions : [];
  
  // Get all pending requests from the system to match the /requests page
  const pendingRequests = accessRequests.filter(r => r.status === 'pending');
  const myPendingApprovals = pendingRequests.filter(r => 
    (r.managerApproval?.approverId === currentUser.id && r.managerApproval?.status === 'pending') ||
    (r.securityApproval?.approverId === currentUser.id && r.securityApproval?.status === 'pending')
  );
  
  // Check if user is manager
  const isManager = currentUser.jobFunction?.includes('Manager') || 
                    (currentUser.jobFunctions && currentUser.jobFunctions.some(jf => jf.includes('Manager')));
  
  // Only show system stats if user is not a manager and has 'reports' read permission
  const canViewSystemStats = hasPermission(currentUser.id, 'reports', 'read') && !isManager;
  
  // Data for job function distribution - get directly from users
  const jobFunctionCounts: Record<string, number> = {};
  users.forEach(user => {
    // Get job functions directly from user
    const jobFunctions = user.jobFunction ? [user.jobFunction] : 
                       user.jobFunctions ? user.jobFunctions : [];
    
    jobFunctions.forEach(jobFunction => {
      if (jobFunction) {
        jobFunctionCounts[jobFunction] = (jobFunctionCounts[jobFunction] || 0) + 1;
      }
    });
  });
  
  const jobFunctionDistribution = Object.entries(jobFunctionCounts).map(([name, users]) => ({
    name,
    users,
  }));

  // Access review progress data for pie chart
  const completedReviews = accessReviews.filter(review => review.status === 'completed').length;
  const totalReviews = accessReviews.length;
  const remainingReviews = totalReviews - completedReviews;

  const reviewProgressData = [
    { name: 'Completed', value: completedReviews },
    { name: 'Remaining', value: remainingReviews },
  ];

  // Count unauthorized users for UAR validation findings
  const fedrampGaps = accessReviews.filter(review => review.violationType === 'unauthorized_user');
  const unauthorizedUsersCount = fedrampGaps.length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {currentUser.firstName}!</p>
        </div>
        <div className="text-sm text-muted-foreground">
          <div className="flex items-center">
            <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
            <span>System Status: Operational</span>
          </div>
          <span className="text-xs">Last updated: {new Date().toLocaleString()}</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <UserStatsCard 
          title="Your Job Function(s)"
          value={userJobFunctions.length || 0}
          description={userJobFunctions.join(', ') || 'No job functions assigned'}
          icon="roles"
        />
        
        <UserStatsCard
          title="Automated UAR Validation Findings"
          value={unauthorizedUsersCount}
          description="Unauthorized user access findings"
          icon="permissions"
          linkTo="/reviews?tab=unauthorized"
        />
        
        <UserStatsCard
          title="Pending Requests"
          value={pendingRequests.length}
          description="System-wide pending access requests"
          icon="pendingRequests"
          linkTo="/requests"
        />

        <UserStatsCard
          title="Your Approvals"
          value={myPendingApprovals.length}
          description="Access requests waiting for your approval"
          icon="approvals"
          linkTo="/approvals"
        />
      </div>

      {/* Hide specific components for manager role */}
      {canViewSystemStats && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RoleDistributionTable data={jobFunctionDistribution} title="Job Function to User Mapping" description="Number of users assigned to each job function" />
            <AccessReviewPieChart data={reviewProgressData} /> 
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
