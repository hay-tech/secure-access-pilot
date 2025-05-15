
import { AuditLog } from '../types/iam';

// Mock Audit Logs
export const auditLogs: AuditLog[] = [
  {
    id: 'log1',
    eventType: 'login',
    userId: 'user1',
    details: 'User logged in successfully',
    ipAddress: '192.168.1.1',
    timestamp: '2023-05-10T08:30:00Z'
  },
  {
    id: 'log2',
    eventType: 'access_request',
    userId: 'user3',
    details: 'User requested access to AWS CCCS environment',
    ipAddress: '192.168.1.45',
    timestamp: '2023-05-10T09:15:00Z'
  },
  {
    id: 'log3',
    eventType: 'approval',
    userId: 'user2',
    details: 'Approved access request for Alice Developer to AWS CCCS environment',
    ipAddress: '192.168.1.22',
    timestamp: '2023-05-10T10:05:00Z'
  },
  {
    id: 'log4',
    eventType: 'login',
    userId: 'user3',
    details: 'User logged in successfully',
    ipAddress: '192.168.1.45',
    timestamp: '2023-05-11T08:45:00Z'
  },
  {
    id: 'log5',
    eventType: 'logout',
    userId: 'user1',
    details: 'User logged out',
    ipAddress: '192.168.1.1',
    timestamp: '2023-05-11T12:30:00Z'
  },
  {
    id: 'log6',
    eventType: 'role_change',
    userId: 'user1',
    details: 'Added role "Cloud Platform Administrator" to Bob Developer',
    ipAddress: '192.168.1.1',
    timestamp: '2023-05-12T14:20:00Z'
  },
  {
    id: 'log7',
    eventType: 'permission_change',
    userId: 'user1',
    details: 'Modified permissions for role "Cloud Platform Reader"',
    ipAddress: '192.168.1.1',
    timestamp: '2023-05-12T15:10:00Z'
  },
  {
    id: 'log8',
    eventType: 'access_request',
    userId: 'user4',
    details: 'User requested access to Azure Federal environment',
    ipAddress: '192.168.1.78',
    timestamp: '2023-05-13T09:30:00Z'
  },
  {
    id: 'log9',
    eventType: 'approval',
    userId: 'user2',
    details: 'Approved access request for Bob Developer to Azure Federal environment',
    ipAddress: '192.168.1.22',
    timestamp: '2023-05-13T11:15:00Z'
  },
  {
    id: 'log10',
    eventType: 'login',
    userId: 'user4',
    details: 'User logged in successfully',
    ipAddress: '192.168.1.78',
    timestamp: '2023-05-14T08:20:00Z'
  }
];
