
import { Approver } from '../types/iam';

export const approvers: Approver[] = [
  {
    id: 'approver1',
    name: 'Sarah L.',
    title: 'Engineering Manager',
    type: 'manager'
  },
  {
    id: 'approver2',
    name: 'DevOps Team',
    title: 'Resource Owner',
    type: 'resource-owner'
  },
  {
    id: 'approver3',
    name: 'Security Office',
    title: 'Security Review',
    type: 'security'
  },
  {
    id: 'approver4',
    name: 'Compliance Office',
    title: 'Compliance Review',
    type: 'compliance'
  },
  {
    id: 'approver5',
    name: 'Sovereign Ops Team',
    title: 'Sovereign Operations',
    type: 'sovereign-ops'
  },
  {
    id: 'approver6',
    name: 'Organization Owner',
    title: 'Organization Owner',
    type: 'org-owner' 
  },
  {
    id: 'approver7',
    name: 'Tenant Admin',
    title: 'Tenant Administrator',
    type: 'tenant-admin'
  },
  {
    id: 'approver8',
    name: 'Environment Owner',
    title: 'Environment/Region Owner',
    type: 'env-owner'
  },
  {
    id: 'approver9',
    name: 'Project Owner',
    title: 'Project/Resource Group Owner',
    type: 'project-owner'
  },
  {
    id: 'approver10',
    name: 'Legal Team',
    title: 'Legal Approval',
    type: 'legal'
  },
  {
    id: 'approver11',
    name: 'HR Team',
    title: 'HR Approval',
    type: 'hr'
  }
];

// Approval matrix for different resource hierarchies based on compliance framework
export const approvalMatrix = {
  'cjis': {
    'organization': ['manager', 'resource-owner', 'compliance', 'legal', 'hr'],
    'tenant': ['manager', 'resource-owner', 'compliance', 'legal', 'hr'],
    'environment': ['manager', 'resource-owner', 'compliance', 'legal', 'hr'],
    'project': ['manager', 'resource-owner', 'compliance', 'legal', 'hr'],
    'resource': ['manager', 'resource-owner', 'compliance', 'legal', 'hr']
  },
  'commercial': {
    'organization': ['manager', 'org-owner', 'security'],
    'tenant': ['manager', 'tenant-admin'],
    'environment': ['manager', 'env-owner'],
    'project': ['manager'],
    'resource': ['manager']
  },
  'default': {
    'organization': ['manager', 'security'],
    'tenant': ['manager', 'security'],
    'environment': ['manager'],
    'project': ['manager'],
    'resource': ['manager']
  }
};
