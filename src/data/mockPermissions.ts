
import { Permission } from '../types/iam';

// Mock Permissions
export const permissions: Permission[] = [
  {
    id: 'perm1',
    name: 'View Users',
    resource: 'users',
    action: 'read',
    description: 'Ability to view user profiles',
    category: 'Data',
    level: 'Basic'
  },
  {
    id: 'perm2',
    name: 'Create Users',
    resource: 'users',
    action: 'create',
    description: 'Ability to create new users',
    category: 'Function',
    level: 'Admin'
  },
  {
    id: 'perm3',
    name: 'Edit Users',
    resource: 'users',
    action: 'update',
    description: 'Ability to edit user profiles',
    category: 'Function',
    level: 'Admin'
  },
  {
    id: 'perm4',
    name: 'Delete Users',
    resource: 'users',
    action: 'delete',
    description: 'Ability to delete users',
    category: 'Function',
    level: 'Admin'
  },
  {
    id: 'perm5',
    name: 'View Roles',
    resource: 'roles',
    action: 'read',
    description: 'Ability to view roles',
    category: 'Data',
    level: 'Basic'
  },
  {
    id: 'perm6',
    name: 'Manage Roles',
    resource: 'roles',
    action: 'update',
    description: 'Ability to create/edit/delete roles',
    category: 'Function',
    level: 'Admin'
  },
  {
    id: 'perm7',
    name: 'Approve Access',
    resource: 'access_requests',
    action: 'approve',
    description: 'Ability to approve access requests',
    category: 'Function',
    level: 'Elevated'
  },
  {
    id: 'perm8',
    name: 'View Reports',
    resource: 'reports',
    action: 'read',
    description: 'Ability to view compliance reports',
    category: 'Data',
    level: 'Elevated'
  },
  {
    id: 'perm9',
    name: 'Run Audit',
    resource: 'audits',
    action: 'create',
    description: 'Ability to run compliance audits',
    category: 'Security',
    level: 'Elevated'
  },
  {
    id: 'perm10',
    name: 'View Systems',
    resource: 'systems',
    action: 'read',
    description: 'Ability to view system information',
    category: 'System',
    level: 'Basic'
  },
];
