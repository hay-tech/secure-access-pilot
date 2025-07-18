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
  
  // Enhanced mock data for accountability logs with recent dates and updated structure
  const [accessReviewLogs, setAccessReviewLogs] = useState<AccessReviewLog[]>([
    {
      id: 'arl1',
      reviewId: 'rev1',
      approverId: 'Scott Dale',
      approvedUserId: 'Alice Developer',
      environment: 'FedRamp',
      jobFunctions: ['Cloud Platform Administrator'],
      permissionsGranted: ['Editor', 'Compute Admin', 'Storage Admin'],
      groupsMembership: ['cpe-platform-administrators-fedrampdev', 'cpe-platform-administrators-fedrampprod'],
      timestamp: getRandomDateWithinLastMonth(),
      justification: 'Required for project maintenance'
    },
    {
      id: 'arl2',
      reviewId: 'rev2',
      approverId: 'Scott Dale',
      approvedUserId: 'Bob Developer',
      environment: 'CCCS',
      jobFunctions: ['Cloud Platform Contributor'],
      permissionsGranted: ['Viewer', 'Cloud SQL Editor'],
      groupsMembership: ['cpe-platform-contributors-cccsdev', 'cpe-platform-contributors-cccsprod'],
      timestamp: getRandomDateWithinLastMonth(),
      justification: 'Needed for development work'
    },
    {
      id: 'arl3',
      reviewId: 'rev3',
      approverId: 'Scott Dale',
      approvedUserId: 'Charlie DevOps',
      environment: 'NIST 800-53 Mod',
      jobFunctions: ['Cloud Platform Security Administrator'],
      permissionsGranted: ['Security Admin', 'IAM Admin', 'Monitoring Admin'],
      groupsMembership: ['cpe-platform-security-administrators-fedramprod'],
      timestamp: getRandomDateWithinLastMonth(),
      justification: 'Security administration responsibilities'
    },
    {
      id: 'arl4',
      reviewId: 'rev4',
      approverId: 'Scott Dale',
      approvedUserId: 'David Analyst',
      environment: 'CJIS',
      jobFunctions: ['Cloud Platform Security Reader'],
      permissionsGranted: ['Viewer', 'Security Reviewer'],
      groupsMembership: ['cpe-platform-security-readers-cjisdev', 'cpe-platform-security-readers-cjisprod'],
      timestamp: getRandomDateWithinLastMonth(),
      justification: 'Required for security audit work'
    },
    {
      id: 'arl5',
      reviewId: 'rev5',
      approverId: 'Scott Dale',
      approvedUserId: 'Eve Developer',
      environment: 'FedRamp',
      jobFunctions: ['Cloud Platform Contributor'],
      permissionsGranted: ['Viewer', 'Cloud SQL Editor'],
      groupsMembership: ['cpe-platform-contributors-fedrampdev'],
      timestamp: getRandomDateWithinLastMonth(),
      justification: 'Development and staging environment access'
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
