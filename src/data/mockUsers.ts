
import { User } from '../types/iam';

// Mock Users
export const users: User[] = [
  {
    id: 'user1',
    email: 'admin@example.com',
    firstName: 'Admin',
    lastName: 'User',
    roleIds: ['role1'],
    department: 'IT',
    createdAt: '2023-01-16T08:00:00Z',
    lastLogin: '2023-05-10T14:32:00Z',
    jobFunction: 'System Administrator',
    accessLevel: 'Administrator'
  },
  {
    id: 'user2',
    email: 'john.manager@example.com',
    firstName: 'John',
    lastName: 'Manager',
    roleIds: ['role2'],
    department: 'Engineering',
    createdAt: '2023-01-16T08:30:00Z',
    lastLogin: '2023-05-09T11:20:00Z',
    jobFunction: 'Department Manager',
    accessLevel: 'Approver'
  },
  {
    id: 'user3',
    email: 'alice.dev@example.com',
    firstName: 'Alice',
    lastName: 'Developer',
    roleIds: ['role3'],
    department: 'Engineering',
    manager: 'user2',
    createdAt: '2023-01-16T09:00:00Z',
    lastLogin: '2023-05-10T09:15:00Z',
    jobFunction: 'Software Engineer (Senior)',
    accessLevel: 'Power User'
  },
  {
    id: 'user4',
    email: 'bob.dev@example.com',
    firstName: 'Bob',
    lastName: 'Developer',
    roleIds: ['role3'],
    department: 'Engineering',
    manager: 'user2',
    createdAt: '2023-01-16T09:30:00Z',
    lastLogin: '2023-05-10T10:45:00Z',
    jobFunction: 'Software Engineer (Junior)',
    accessLevel: 'Standard User'
  },
  {
    id: 'user5',
    email: 'sarah.analyst@example.com',
    firstName: 'Sarah',
    lastName: 'Analyst',
    roleIds: ['role4'],
    department: 'Data Science',
    createdAt: '2023-01-16T10:00:00Z',
    lastLogin: '2023-05-08T16:20:00Z',
    jobFunction: 'Data Analyst',
    accessLevel: 'Standard User'
  },
  {
    id: 'user6',
    email: 'mike.compliance@example.com',
    firstName: 'Mike',
    lastName: 'Compliance',
    roleIds: ['role5'],
    department: 'Legal',
    createdAt: '2023-01-16T10:30:00Z',
    lastLogin: '2023-05-09T15:10:00Z',
    jobFunction: 'Compliance Auditor',
    accessLevel: 'Auditor'
  },
];
