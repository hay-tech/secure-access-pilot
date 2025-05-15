
import { AccessViolation } from '../types/iam';

// Mock Access Violations
export const accessViolations: AccessViolation[] = [
  {
    id: 'viol1',
    userId: 'user3',
    permissionId: 'perm2',
    violationType: 'SoD',
    severity: 'High',
    details: 'User has both create and delete permissions on the same resource',
    detectedAt: '2023-05-08T08:15:00Z',
    status: 'Open'
  },
  {
    id: 'viol2',
    userId: 'user4',
    roleId: 'role4',
    violationType: 'Excessive',
    severity: 'Medium',
    details: 'User has analyst role but does not perform data analysis',
    detectedAt: '2023-05-08T09:30:00Z',
    status: 'Open'
  },
  {
    id: 'viol3',
    userId: 'user5',
    permissionId: 'perm9',
    violationType: 'Dormant',
    severity: 'Low',
    details: 'Permission has not been used in over 120 days',
    detectedAt: '2023-05-07T14:45:00Z',
    status: 'Open'
  },
  {
    id: 'viol4',
    userId: 'user3',
    permissionId: 'perm7',
    violationType: 'Critical',
    severity: 'Critical',
    details: 'Developer has approval rights for production systems',
    detectedAt: '2023-05-08T16:20:00Z',
    status: 'Open',
    reviewId: 'review4'
  },
  {
    id: 'viol5',
    userId: 'user4',
    roleId: 'role3',
    violationType: 'Mismatch',
    severity: 'Medium',
    details: 'User has permissions not aligned with their job function',
    detectedAt: '2023-05-09T10:10:00Z',
    status: 'Open'
  },
];
