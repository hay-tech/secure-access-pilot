
import { AuditLog } from '../types/iam';

// Mock Audit Logs
export const auditLogs: AuditLog[] = [
  {
    id: 'log1',
    eventType: 'login',
    userId: 'user1',
    details: 'User logged in',
    ipAddress: '192.168.1.100',
    timestamp: '2023-05-10T14:30:00Z',
  },
  {
    id: 'log2',
    eventType: 'access_request',
    userId: 'user3',
    details: 'Requested Analyst role',
    ipAddress: '192.168.1.101',
    timestamp: '2023-05-08T09:15:00Z',
  },
  {
    id: 'log3',
    eventType: 'approval',
    userId: 'user2',
    details: 'Approved access request req2 for user4',
    ipAddress: '192.168.1.102',
    timestamp: '2023-05-07T14:20:00Z',
  },
  {
    id: 'log4',
    eventType: 'role_change',
    userId: 'user1',
    details: 'Added View Reports permission to user4',
    ipAddress: '192.168.1.100',
    timestamp: '2023-05-07T16:45:00Z',
  },
  {
    id: 'log5',
    eventType: 'login',
    userId: 'user4',
    details: 'User logged in',
    ipAddress: '192.168.1.103',
    timestamp: '2023-05-10T10:45:00Z',
  },
  {
    id: 'log6',
    eventType: 'logout',
    userId: 'user5',
    details: 'User logged out',
    ipAddress: '192.168.1.104',
    timestamp: '2023-05-08T16:20:00Z',
  },
];
