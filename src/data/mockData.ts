import { User, Role, Permission, AccessRequest, AuditLog, AccessReview, AccessViolation } from '../types/iam';

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

// Enhanced Access Reviews with status and due dates
export const accessReviews: AccessReview[] = [
  {
    id: 'review1',
    reviewerId: 'user2',
    subjectId: 'user3',
    roleId: 'role3',
    decision: 'maintain',
    comments: 'Role is appropriate for current responsibilities',
    createdAt: '2023-05-01T10:00:00Z',
    status: 'completed'
  },
  {
    id: 'review2',
    reviewerId: 'user2',
    subjectId: 'user4',
    roleId: 'role3',
    decision: 'maintain',
    comments: 'Role is appropriate for current responsibilities',
    createdAt: '2023-05-01T10:30:00Z',
    status: 'completed'
  },
  {
    id: 'review3',
    reviewerId: 'user6',
    subjectId: 'user5',
    permissionId: 'perm9',
    decision: 'revoke',
    comments: 'No longer required for current responsibilities',
    createdAt: '2023-05-02T11:15:00Z',
    status: 'completed'
  },
  {
    id: 'review4',
    reviewerId: 'user2',
    subjectId: 'user3',
    permissionId: 'perm8',
    decision: 'maintain',
    createdAt: '2023-05-10T09:00:00Z',
    dueDate: '2023-05-15T09:00:00Z',
    status: 'pending',
    daysOverdue: 5
  },
  {
    id: 'review5',
    reviewerId: 'user6',
    subjectId: 'user4',
    roleId: 'role4',
    decision: 'maintain',
    createdAt: '2023-05-11T15:00:00Z',
    dueDate: '2023-05-18T15:00:00Z',
    status: 'pending',
    daysOverdue: 2
  },
  {
    id: 'review6',
    reviewerId: 'user1',
    subjectId: 'user5',
    permissionId: 'perm6',
    decision: 'revoke',
    createdAt: '2023-05-09T11:30:00Z',
    dueDate: '2023-05-12T11:30:00Z',
    status: 'overdue',
    daysOverdue: 8,
    violationType: 'Excessive'
  },
];

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

// Additional data for enhanced Access Request form
export const complianceEnvironments = [
  { id: 'federal', name: 'Federal', description: 'US Federal Government compliance standards' },
  { id: 'cccs', name: 'CCCS', description: 'Canadian Centre for Cyber Security compliance standards' },
  { id: 'usgov', name: 'USGov', description: 'US Government compliance standards' },
  { id: 'us-commercial', name: 'US (Commercial)', description: 'US Commercial compliance standards' },
  { id: 'uk-commercial', name: 'UK (Commercial)', description: 'UK Commercial compliance standards' },
  { id: 'au-commercial', name: 'AU (Commercial)', description: 'Australian Commercial compliance standards' }
];

export const environmentTypes = [
  { id: 'dev', name: 'Development', riskLevel: 'Low' },
  { id: 'stage', name: 'Staging', riskLevel: 'Medium' },
  { id: 'prod', name: 'Production', riskLevel: 'High' }
];

export const targetResources = [
  { 
    id: 'aws-cccs-platform-admin',
    name: 'AWS CCCS Platform Administrator', 
    environment: 'prod',
    compliance: 'cccs',
    riskLevel: 'High',
    recommendedFor: ['System Administrator', 'DevOps Engineer']
  },
  { 
    id: 'aws-cccs-platform-reader',
    name: 'AWS CCCS Platform Reader', 
    environment: 'prod',
    compliance: 'cccs',
    riskLevel: 'Medium',
    recommendedFor: ['Data Analyst', 'Business Analyst', 'Compliance Auditor']
  },
  { 
    id: 'aws-cccs-customer-data',
    name: 'AWS CCCS Customer Data', 
    environment: 'prod',
    compliance: 'cccs',
    riskLevel: 'High',
    recommendedFor: ['Data Scientist', 'Business Intelligence Developer']
  },
  { 
    id: 'gcp-cjis-platform-reader',
    name: 'GCP CJIS Platform Reader', 
    environment: 'prod',
    compliance: 'federal',
    riskLevel: 'High',
    isSensitive: true,
    recommendedFor: ['Security Analyst', 'Compliance Auditor']
  },
  { 
    id: 'azure-federal-security-admin',
    name: 'Azure Federal Security Admin', 
    environment: 'stage',
    compliance: 'federal',
    riskLevel: 'High',
    isPrivileged: true,
    recommendedFor: ['Security Analyst', 'System Administrator']
  },
  { 
    id: 'aws-us-commercial-dev',
    name: 'AWS US Commercial Dev Environment', 
    environment: 'dev',
    compliance: 'us-commercial',
    riskLevel: 'Low',
    recommendedFor: ['Software Engineer (Junior)', 'Software Engineer (Senior)', 'QA Engineer']
  },
  { 
    id: 'aws-us-commercial-test',
    name: 'AWS US Commercial Test Environment', 
    environment: 'test',
    compliance: 'us-commercial',
    riskLevel: 'Low',
    recommendedFor: ['Software Engineer (Junior)', 'Software Engineer (Senior)', 'QA Engineer']
  }
];

export const jobFunctionDefinitions = [
  {
    id: 'cloud-platform-administrator',
    title: 'Cloud Platform Administrator',
    description: 'Responsible for cloud infrastructure management and system configuration',
    defaultPermissions: ['perm1', 'perm3', 'perm5', 'perm6', 'perm10'],
    recommendedResources: ['aws-cccs-platform-admin', 'azure-federal-security-admin']
  },
  {
    id: 'devops-engineer',
    title: 'DevOps Engineer',
    description: 'Handles CI/CD pipelines and deployment environments',
    defaultPermissions: ['perm1', 'perm3', 'perm5', 'perm10'],
    recommendedResources: ['aws-cccs-platform-admin', 'aws-us-commercial-dev', 'aws-us-commercial-test']
  },
  {
    id: 'software-engineer-senior',
    title: 'Software Engineer (Senior)',
    description: 'Advanced development with broader system access',
    defaultPermissions: ['perm1', 'perm3', 'perm5', 'perm10'],
    recommendedResources: ['aws-us-commercial-dev', 'aws-us-commercial-test']
  },
  {
    id: 'software-engineer-junior',
    title: 'Software Engineer (Junior)',
    description: 'Entry-level development with limited access',
    defaultPermissions: ['perm1', 'perm5', 'perm10'],
    recommendedResources: ['aws-us-commercial-dev', 'aws-us-commercial-test']
  },
  {
    id: 'data-analyst',
    title: 'Data Analyst',
    description: 'Basic data access for reporting',
    defaultPermissions: ['perm1', 'perm5', 'perm8', 'perm10'],
    recommendedResources: ['aws-cccs-platform-reader']
  },
  {
    id: 'data-scientist',
    title: 'Data Scientist',
    description: 'Advanced data manipulation and model training access',
    defaultPermissions: ['perm1', 'perm5', 'perm8', 'perm10'],
    recommendedResources: ['aws-cccs-customer-data']
  },
  {
    id: 'security-analyst',
    title: 'Security Analyst',
    description: 'Security monitoring and investigation',
    defaultPermissions: ['perm1', 'perm5', 'perm8', 'perm9', 'perm10'],
    recommendedResources: ['gcp-cjis-platform-reader', 'azure-federal-security-admin']
  },
  {
    id: 'compliance-auditor',
    title: 'Compliance Auditor',
    description: 'Read-only access for compliance reviews',
    defaultPermissions: ['perm1', 'perm5', 'perm8', 'perm9', 'perm10'],
    recommendedResources: ['aws-cccs-platform-reader', 'gcp-cjis-platform-reader']
  }
];

export const approvers = [
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
  }
];
