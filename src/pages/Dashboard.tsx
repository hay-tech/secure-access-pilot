
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useIAM } from '../contexts/IAMContext';

// Import dashboard components
import UserStatsCard from '../components/dashboard/UserStatsCard';
import AccessComplianceCard from '../components/dashboard/AccessComplianceCard';
import AccessViolationsCard from '../components/dashboard/AccessViolationsCard';
import RoleDistributionTable from '../components/dashboard/RoleDistributionTable';
import PendingAccessReviewsTable from '../components/dashboard/PendingAccessReviewsTable';
import AccessReviewProgress from '../components/dashboard/AccessReviewProgress';

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

  if (!currentUser) return null;

  const userRoles = getUserRoles(currentUser.id);
  const userPermissions = getUserPermissions(currentUser.id);
  
  const pendingRequests = accessRequests.filter(r => r.status === 'pending');
  const myPendingApprovals = pendingRequests.filter(r => 
    (r.managerApproval?.approverId === currentUser.id && r.managerApproval?.status === 'pending') ||
    (r.securityApproval?.approverId === currentUser.id && r.securityApproval?.status === 'pending')
  );
  
  const canViewSystemStats = hasPermission(currentUser.id, 'reports', 'read');
  
  // Chart data for access request status
  const statusData = [
    { name: 'Approved', value: accessRequests.filter(r => r.status === 'approved').length },
    { name: 'Pending', value: accessRequests.filter(r => r.status === 'pending').length },
    { name: 'Rejected', value: accessRequests.filter(r => r.status === 'rejected').length },
  ];
  
  // Chart data for role distribution
  const roleDistribution = roles.map(role => ({
    name: role.name,
    users: users.filter(user => user.roleIds.includes(role.id)).length,
  }));

  // New data for access review insights
  const pendingReviews = accessReviews.filter(r => r.status === 'pending' || r.status === 'overdue');
  const overdueReviews = pendingReviews.filter(r => r.daysOverdue && r.daysOverdue > 0);
  
  // Mock data for access matching insights
  const accessMatchData = [
    { name: 'Matched Access', value: 85 },
    { name: 'Unmatched Access', value: 15 }
  ];

  // Mock data for violations by type
  const violationsData = [
    { type: 'SoD', count: 12, description: 'Segregation of Duties' },
    { type: 'Excessive', count: 18, description: 'Excessive Permissions' },
    { type: 'Dormant', count: 7, description: 'Unused Access (90+ days)' },
    { type: 'Critical', count: 5, description: 'Critical System Exceptions' },
    { type: 'Mismatch', count: 10, description: 'Role-Permission Mismatch' }
  ];

  // Mock data for pending reviews table
  const pendingReviewsData = [
    { id: 'rev1', resource: 'Production Database', role: 'Database Administrator', daysOverdue: 5 },
    { id: 'rev2', resource: 'Financial Reports', role: 'Business Analyst', daysOverdue: 3 },
    { id: 'rev3', resource: 'Source Code Repository', role: 'Software Engineer', daysOverdue: 7 },
    { id: 'rev4', resource: 'Customer Data', role: 'Data Analyst', daysOverdue: 2 },
    { id: 'rev5', resource: 'Network Configuration', role: 'Network Administrator', daysOverdue: 9 }
  ];

  // Progress data for access review
  const progressItems = [
    { label: 'Manager Reviews', value: 75 },
    { label: 'Compliance Reviews', value: 45 },
    { label: 'Overall Completion', value: 60 },
  ];

  const COLORS = ['#10b981', '#f59e0b', '#ef4444']; // green, amber, red
  const ACCESS_COLORS = ['#3b82f6', '#4ade80']; // blue, green

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, {currentUser.firstName}!</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <UserStatsCard 
          title="Your Roles"
          value={userRoles.length}
          description={userRoles.map(r => r.name).join(', ')}
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
        />
        
        <UserStatsCard
          title="Your Approvals"
          value={myPendingApprovals.length}
          description="Access requests waiting for your approval"
          icon="approvals"
        />
      </div>

      {canViewSystemStats && (
        <>
          {/* Access Review Insights Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <AccessComplianceCard data={accessMatchData} colors={ACCESS_COLORS} />
            <AccessViolationsCard data={violationsData} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RoleDistributionTable data={roleDistribution} />
            <PendingAccessReviewsTable data={pendingReviewsData} />
          </div>

          <AccessReviewProgress progressItems={progressItems} />
        </>
      )}
    </div>
  );
};

export default Dashboard;
