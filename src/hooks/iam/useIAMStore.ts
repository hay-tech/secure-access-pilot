
import { useState } from 'react';
import { User, Role, Permission, AccessRequest, AuditLog, AccessReview, AccessReviewLog } from '../../types/iam';
import { 
  users as initialUsers, 
  roles as initialRoles, 
  permissions as initialPermissions, 
  accessRequests as initialAccessRequests, 
  auditLogs as initialAuditLogs, 
  accessReviews as initialAccessReviews 
} from '../../data/mockData';

// Helper function to generate random date within the last month
const getRandomDateWithinLastMonth = () => {
  const now = new Date();
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(now.getMonth() - 1);
  
  const randomTime = oneMonthAgo.getTime() + Math.random() * (now.getTime() - oneMonthAgo.getTime());
  return new Date(randomTime).toISOString();
};

// Create a central store to avoid circular dependencies
export const useIAMStore = () => {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [roles, setRoles] = useState<Role[]>(initialRoles);
  const [permissions] = useState<Permission[]>(initialPermissions);
  const [accessRequests, setAccessRequests] = useState<AccessRequest[]>([
    ...initialAccessRequests,
    // Adding more mock requests to match the number shown in Dashboard
    {
      id: 'req4',
      userId: 'user3',
      resourceId: 'role5',
      resourceName: 'Cloud Platform Administrator',
      requestType: 'role',
      status: 'pending',
      justification: 'Need admin capabilities for project deployment',
      environment: 'AWS-CCCS-Prod',
      jobFunction: 'Cloud Platform Administrator',
      cloudWorkload: 'aws-cluster-prod-01',
      managerApproval: {
        approverId: 'user2',
        status: 'pending',
      },
      securityApproval: {
        approverId: 'user1',
        status: 'pending',
      },
      createdAt: getRandomDateWithinLastMonth(),
      updatedAt: getRandomDateWithinLastMonth(),
    },
    {
      id: 'req5',
      userId: 'user4',
      resourceId: 'role3',
      resourceName: 'Cloud Platform Contributor',
      requestType: 'role',
      status: 'pending',
      justification: 'Need contributor access for feature development',
      environment: 'Azure-CJIS-Prod',
      jobFunction: 'Cloud Platform Contributor',
      cloudWorkload: 'azure-cluster-cjis-02',
      managerApproval: {
        approverId: 'user2',
        status: 'pending',
      },
      securityApproval: {
        approverId: 'user1',
        status: 'pending',
      },
      createdAt: getRandomDateWithinLastMonth(),
      updatedAt: getRandomDateWithinLastMonth(),
    }
  ]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(initialAuditLogs);
  const [accessReviews, setAccessReviews] = useState<AccessReview[]>(initialAccessReviews);
  
  // Enhanced mock data for accountability logs with recent dates
  const [accessReviewLogs, setAccessReviewLogs] = useState<AccessReviewLog[]>([
    {
      id: 'arl1',
      reviewId: 'rev1',
      approverId: 'John Manager',
      approvedUserId: 'Alice Developer',
      environment: 'FedRamp',
      jobFunctions: ['Cloud Platform Administrator'],
      permissionsGranted: ['read', 'write', 'delete'],
      groupsMembership: ['cpe-platform-administrators-fedrampdev', 'cpe-platform-administrators-fedrampprod'],
      timestamp: getRandomDateWithinLastMonth(),
      decision: 'maintain',
      justification: 'Required for project maintenance'
    },
    {
      id: 'arl2',
      reviewId: 'rev2',
      approverId: 'Sarah Security',
      approvedUserId: 'Bob Developer',
      environment: 'CCCS',
      jobFunctions: ['Cloud Platform Contributor'],
      permissionsGranted: ['read', 'write'],
      groupsMembership: ['cpe-platform-contributors-cccsdev', 'cpe-platform-contributors-cccsprod'],
      timestamp: getRandomDateWithinLastMonth(),
      decision: 'maintain',
      justification: 'Needed for development work'
    },
    {
      id: 'arl3',
      reviewId: 'rev3',
      approverId: 'Mark Director',
      approvedUserId: 'Charlie DevOps',
      environment: 'NIST 800-53 Mod',
      jobFunctions: ['Cloud Platform Security Administrator'],
      permissionsGranted: ['read', 'write', 'admin'],
      groupsMembership: ['cpe-platform-security-administrators-fedramprod'],
      timestamp: getRandomDateWithinLastMonth(),
      decision: 'revoke',
      justification: 'No longer working on security projects'
    },
    {
      id: 'arl4',
      reviewId: 'rev4',
      approverId: 'John Manager',
      approvedUserId: 'David Analyst',
      environment: 'CJIS',
      jobFunctions: ['Cloud Platform Security Reader'],
      permissionsGranted: ['read'],
      groupsMembership: ['cpe-platform-security-readers-cjisdev', 'cpe-platform-security-readers-cjisprod'],
      timestamp: getRandomDateWithinLastMonth(),
      decision: 'maintain',
      justification: 'Required for security audit work'
    },
    {
      id: 'arl5',
      reviewId: 'rev5',
      approverId: 'Mike Compliance',
      approvedUserId: 'Eve Developer',
      environment: 'FedRamp',
      jobFunctions: ['Cloud Platform Contributor'],
      permissionsGranted: ['read', 'write', 'delete'],
      groupsMembership: ['cpe-platform-contributors-fedrampdev'],
      timestamp: getRandomDateWithinLastMonth(),
      decision: 'modify',
      justification: 'Reduced permissions to align with job responsibilities'
    }
  ]);

  return {
    users,
    setUsers,
    roles,
    setRoles,
    permissions,
    accessRequests,
    setAccessRequests,
    auditLogs,
    setAuditLogs,
    accessReviews,
    setAccessReviews,
    accessReviewLogs,
    setAccessReviewLogs
  };
};
