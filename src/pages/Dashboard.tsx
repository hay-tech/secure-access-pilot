
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useIAM } from '../contexts/IAMContext';

// Import dashboard components
import UserStatsCard from '../components/dashboard/UserStatsCard';
import RoleDistributionTable from '../components/dashboard/RoleDistributionTable';
import PendingAccessReviewsTable from '../components/dashboard/PendingAccessReviewsTable';
import AccessReviewProgress from '../components/dashboard/AccessReviewProgress';
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
  
  const pendingRequests = accessRequests.filter(r => r.status === 'pending');
  const myPendingApprovals = pendingRequests.filter(r => 
    (r.managerApproval?.approverId === currentUser.id && r.managerApproval?.status === 'pending') ||
    (r.securityApproval?.approverId === currentUser.id && r.securityApproval?.status === 'pending')
  );
  
  const canViewSystemStats = hasPermission(currentUser.id, 'reports', 'read');
  
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

  // Get actual pending reviews for the table - matching the access review data
  const pendingReviewsData = accessReviews
    .filter(r => r.status === 'pending' || r.status === 'overdue')
    .map(review => {
      // Get the resource name from the review or use a default
      let resource = 'Unknown Resource';
      let role = 'Unknown Role';
      
      if (review.regulatoryEnvironment) {
        resource = review.regulatoryEnvironment;
      }
      
      if (review.roleId) {
        const foundRole = roles.find(r => r.id === review.roleId);
        if (foundRole) {
          role = foundRole.name;
        }
      }
      
      return {
        id: review.id,
        resource,
        role,
        daysOverdue: review.daysOverdue || 0
      };
    })
    .slice(0, 5); // Limit to 5 reviews for the dashboard

  // Progress data for access review
  const progressItems = [
    { label: 'Manager Reviews', value: 75 },
    { label: 'Compliance Reviews', value: 45 },
    { label: 'Overall Completion', value: 60 },
  ];

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
          title="Permissions"
          value={userPermissions.length}
          description={`Across ${new Set(userPermissions.map(p => p.resource)).size} resources`}
          icon="permissions"
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

      {canViewSystemStats && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RoleDistributionTable data={jobFunctionDistribution} title="Job Function to User Mapping" description="Number of users assigned to each job function" />
            <PendingAccessReviewsTable data={pendingReviewsData} />
          </div>

          <AccessReviewProgress progressItems={progressItems} />
        </>
      )}
    </div>
  );
};

export default Dashboard;
