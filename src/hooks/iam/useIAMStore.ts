
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
  const [accessRequests, setAccessRequests] = useState<AccessRequest[]>(initialAccessRequests);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(initialAuditLogs);
  const [accessReviews, setAccessReviews] = useState<AccessReview[]>(initialAccessReviews);
  
  // Add mock data for accountability logs
  const [accessReviewLogs, setAccessReviewLogs] = useState<AccessReviewLog[]>([
    {
      id: 'arl1',
      reviewId: 'rev1',
      approverId: 'John Manager',
      approvedUserId: 'Alice Developer',
      environment: 'FedRamp',
      jobFunctions: ['Cloud Platform Administrator'],
      permissionsGranted: ['read', 'write', 'delete'],
      groupsMembership: ['cpe-platform-administrators-dev'],
      timestamp: '2023-05-15T10:30:00Z',
      decision: 'maintain',
      justification: 'Required for project maintenance'
    },
    {
      id: 'arl2',
      reviewId: 'rev2',
      approverId: 'Sarah Security',
      approvedUserId: 'Bob Engineer',
      environment: 'CCCS',
      jobFunctions: ['Cloud Platform Contributor'],
      permissionsGranted: ['read', 'write'],
      groupsMembership: ['cpe-platform-contributors-prod'],
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
      groupsMembership: ['cpe-platform-security-administrators-prod'],
      timestamp: '2023-05-17T09:15:00Z',
      decision: 'revoke',
      justification: 'No longer working on security projects'
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
