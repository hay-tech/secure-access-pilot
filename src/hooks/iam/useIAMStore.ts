
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
      createdAt: '2023-05-09T14:22:00Z',
      updatedAt: '2023-05-09T14:22:00Z',
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
      createdAt: '2023-05-10T16:45:00Z',
      updatedAt: '2023-05-10T16:45:00Z',
    }
  ]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(initialAuditLogs);
  const [accessReviews, setAccessReviews] = useState<AccessReview[]>(initialAccessReviews);
  
  // Enhanced mock data for accountability logs
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
      timestamp: '2023-05-15T10:30:00Z',
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
      timestamp: '2023-05-16T11:45:00Z',
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
      timestamp: '2023-05-17T09:15:00Z',
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
      timestamp: '2023-05-18T13:20:00Z',
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
      timestamp: '2023-05-19T14:10:00Z',
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
