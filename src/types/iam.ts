
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  roleIds: string[];
  department: string;
  manager?: string;
  createdAt: string;
  lastLogin?: string;
  jobFunction?: string;
  accessLevel?: string;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  createdAt: string;
  updatedAt: string;
  category?: 'IT' | 'Business' | 'Security' | 'Management';
}

export interface Permission {
  id: string;
  name: string;
  resource: string;
  action: 'create' | 'read' | 'update' | 'delete' | 'approve';
  description: string;
  category?: 'Data' | 'System' | 'Function' | 'Security';
  level?: 'Basic' | 'Elevated' | 'Admin';
}

export interface AccessRequest {
  id: string;
  userId: string;
  resourceId: string;
  resourceName: string;
  requestType: 'role' | 'permission' | 'system';
  status: 'pending' | 'approved' | 'rejected' | 'canceled';
  justification: string;
  managerApproval?: {
    approverId: string;
    status: 'pending' | 'approved' | 'rejected';
    comments?: string;
    timestamp?: string;
  };
  securityApproval?: {
    approverId: string;
    status: 'pending' | 'approved' | 'rejected';
    comments?: string;
    timestamp?: string;
  };
  createdAt: string;
  updatedAt: string;
  expiresAt?: string;
  // Enhanced fields
  riskScore?: number;
  riskLevel?: 'Low' | 'Medium' | 'High';
  environmentType?: string;
  complianceFramework?: string;
  approvalChain?: ApprovalStep[];
}

export interface ApprovalStep {
  approverId: string;
  approverName: string;
  approverTitle: string;
  approverType: 'manager' | 'resource-owner' | 'security' | 'compliance';
  status: 'pending' | 'approved' | 'rejected';
  comments?: string;
  timestamp?: string;
  reason?: string;
}

export interface AuditLog {
  id: string;
  eventType: 'login' | 'logout' | 'access_request' | 'approval' | 'role_change' | 'permission_change';
  userId: string;
  details: string;
  ipAddress?: string;
  timestamp: string;
}

export interface AccessReview {
  id: string;
  reviewerId: string;
  subjectId: string;
  roleId?: string;
  permissionId?: string;
  decision: 'maintain' | 'revoke' | 'modify';
  comments?: string;
  createdAt: string;
  dueDate?: string;
  status?: 'pending' | 'completed' | 'overdue';
  violationType?: 'SoD' | 'Excessive' | 'Dormant' | 'Critical' | 'Mismatch';
  daysOverdue?: number;
}

export interface AccessViolation {
  id: string;
  userId: string;
  roleId?: string;
  permissionId?: string;
  violationType: 'SoD' | 'Excessive' | 'Dormant' | 'Critical' | 'Mismatch';
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  details: string;
  detectedAt: string;
  status: 'Open' | 'Resolved' | 'Accepted';
  reviewId?: string;
}

export interface AccessReviewSummary {
  totalReviews: number;
  pendingReviews: number;
  completedReviews: number;
  overdueReviews: number;
  violationsByType: {
    SoD: number;
    Excessive: number; 
    Dormant: number;
    Critical: number;
    Mismatch: number;
  };
  approvalRate: number;
  averageResponseTime: number;
}

// Enhanced job function and access types
export type JobFunction = 
  // IT/Engineering Roles
  | 'System Administrator' 
  | 'Network Administrator'
  | 'Database Administrator'
  | 'DevOps Engineer'
  | 'Software Engineer (Junior)'
  | 'Software Engineer (Senior)'
  | 'Software Architect'
  | 'QA Engineer'
  | 'Site Reliability Engineer'
  // Business/Data Roles
  | 'Data Analyst'
  | 'Business Analyst'
  | 'Data Scientist'
  | 'Product Manager'
  | 'Project Manager'
  | 'Business Intelligence Developer'
  // Security/Compliance Roles
  | 'Security Analyst'
  | 'Compliance Auditor'
  | 'Risk Manager'
  | 'Data Privacy Officer'
  // Management Roles
  | 'Team Lead'
  | 'Department Manager'
  | 'Executive'
  | 'System Owner';

export type AccessType =
  // Data Access Types
  | 'Sensitive Data Access'
  | 'Business Data Access'
  | 'Customer Data Access'
  | 'Internal Data Access'
  // System Access Types
  | 'Production System Access'
  | 'Development Environment Access'
  | 'Test Environment Access'
  | 'Admin Console Access'
  // Function Access Types
  | 'Read Only'
  | 'Standard User'
  | 'Power User'
  | 'Administrator'
  | 'Approver'
  | 'Auditor'
  // Security Level Access Types
  | 'Public'
  | 'Internal'
  | 'Confidential'
  | 'Restricted';

// Additional interface definitions for the enhanced access request form
export interface JobFunctionDefinition {
  id: string;
  title: string;
  description: string;
  defaultPermissions: string[];
  recommendedResources: string[];
}

export interface TargetResource {
  id: string;
  name: string;
  environment: string;
  compliance: string;
  riskLevel: 'Low' | 'Medium' | 'High';
  isSensitive?: boolean;
  isPrivileged?: boolean;
  recommendedFor: string[];
}

export interface ComplianceEnvironment {
  id: string;
  name: string;
  description: string;
}

export interface EnvironmentType {
  id: string;
  name: string;
  riskLevel: 'Low' | 'Medium' | 'High';
}

export interface Approver {
  id: string;
  name: string;
  title: string;
  type: string;
}
