
import { AccessRequest } from '../types/iam';

// Mock Access Requests
export const accessRequests: AccessRequest[] = [
  {
    id: 'req1',
    userId: 'user3',
    resourceId: 'role4',
    resourceName: 'Analyst Role',
    requestType: 'role',
    status: 'pending',
    justification: 'Need analysis capabilities for the new project',
    environment: 'AWS-CCCS-Prod',
    jobFunction:'Cloud Platform Administrator',    
    managerApproval: {
      approverId: 'user2',
      status: 'pending',
    },
    securityApproval: {
      approverId: 'user1',
      status: 'pending',
    },
    createdAt: '2023-05-08T09:15:00Z',
    updatedAt: '2023-05-08T09:15:00Z',
  },
  {
    id: 'req2',
    userId: 'user4',
    resourceId: 'perm8',
    resourceName: 'View Reports Permission',
    requestType: 'permission',
    status: 'approved',
    environment: 'Azure-Federal-Prod',
    jobFunction:'Cloud Platform Contributor',    
    justification: 'Required for quarterly project reporting',
    managerApproval: {
      approverId: 'user2',
      status: 'approved',
      comments: 'Approved for quarterly reporting needs',
      timestamp: '2023-05-07T14:20:00Z',
    },
    securityApproval: {
      approverId: 'user1',
      status: 'approved',
      comments: 'Granted for 90 days',
      timestamp: '2023-05-07T16:45:00Z',
    },
    createdAt: '2023-05-07T11:30:00Z',
    updatedAt: '2023-05-07T16:45:00Z',
  },
  {
    id: 'req3',
    userId: 'user5',
    resourceId: 'system-1',
    resourceName: 'Production Database',
    requestType: 'system',
    status: 'rejected',
    justification: 'Need to run performance analysis',
    environment: 'GCP-CJIS-Prod',
    jobFunction:'Cloud Platform Security Administrator',    
    managerApproval: {
      approverId: 'user2',
      status: 'approved',
      comments: 'Needed for performance tuning',
      timestamp: '2023-05-06T10:15:00Z',
    },
    securityApproval: {
      approverId: 'user1',
      status: 'rejected',
      comments: 'Use the staging environment instead',
      timestamp: '2023-05-06T13:25:00Z',
    },
    createdAt: '2023-05-06T09:00:00Z',
    updatedAt: '2023-05-06T13:25:00Z',
  },
];
