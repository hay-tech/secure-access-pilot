
import { Role } from '../types/iam';
import { permissions } from './mockPermissions';

// Mock Roles
export const roles: Role[] = [
  {
    id: 'role1',
    name: 'Administrator',
    description: 'Full system access',
    permissions: permissions,
    createdAt: '2023-01-15T08:00:00Z',
    updatedAt: '2023-01-15T08:00:00Z',
    category: 'IT'
  },
  {
    id: 'role2',
    name: 'Manager',
    description: 'Department manager with approval capabilities',
    permissions: [permissions[0], permissions[2], permissions[4], permissions[6], permissions[7]],
    createdAt: '2023-01-15T08:30:00Z',
    updatedAt: '2023-01-15T08:30:00Z',
    category: 'Management'
  },
  {
    id: 'role3',
    name: 'Developer',
    description: 'Software developer with limited access',
    permissions: [permissions[0], permissions[4], permissions[9]],
    createdAt: '2023-01-15T09:00:00Z',
    updatedAt: '2023-01-15T09:00:00Z',
    category: 'IT'
  },
  {
    id: 'role4',
    name: 'Analyst',
    description: 'Data analyst with reporting capabilities',
    permissions: [permissions[0], permissions[4], permissions[7], permissions[9]],
    createdAt: '2023-01-15T09:30:00Z',
    updatedAt: '2023-01-15T09:30:00Z',
    category: 'Business'
  },
  {
    id: 'role5',
    name: 'Compliance Officer',
    description: 'Ensures regulatory compliance',
    permissions: [permissions[0], permissions[4], permissions[7], permissions[8], permissions[9]],
    createdAt: '2023-01-15T10:00:00Z',
    updatedAt: '2023-01-15T10:00:00Z',
    category: 'Security'
  },
];
