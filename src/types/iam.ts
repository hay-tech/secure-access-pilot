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
  jobFunctions?: string[];
  accessLevel?: string;
  csp?: string;
  cspSubtype?: string;
  securityLevel?: string;
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
  accessType?: 'permanent' | 'temporary';
  resourceHierarchy?: 'Organization' | 'Tenant' | 'Environment/Region' | 'Project/RG' | 'Resources/Services';
  // New fields for enhanced access request form
  cloudEnvironment?: string;
  accessDurationType?: 'permanent' | 'temporary';
  temporaryAccessDuration?: '1 day' | '3 days' | '5 days';
  businessJustification?: string;
  projectName?: string; // Add the missing projectName field
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
  // Compatibility properties for approval chain mapping
  id?: string;  
  name?: string;
  title?: string;
  type?: string;
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
  updatedAt: string; // Add missing updatedAt field
  dueDate?: string;
  status?: 'pending' | 'completed' | 'overdue';
  violationType?: 'SoD' | 'Excessive' | 'Dormant' | 'Critical' | 'Mismatch';
  daysOverdue?: number;
  regulatoryEnvironment?: string;
  permissionGaps?: PermissionGap[];
  // New fields for alignment check
  actualPermissions?: string[];
  approvedPermissions?: string[];
  permissionDiscrepancies?: boolean;
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

// Updated Job Function to include the Cloud specific roles
export type JobFunction = 
  // CPE Platform Engineering Roles
  | 'Cloud Account Owner'
  | 'Cloud IAM Administrator'
  | 'Cloud IAM Reader'
  | 'Cloud Platform Tenant Administrator'
  | 'Cloud Platform Administrator'
  | 'Cloud Platform Contributor'
  | 'Cloud Platform Reader'
  | 'Cloud Project Administrator'
  | 'Cloud Project Contributor'
  | 'Cloud Project Reader'
  | 'Cloud Platform Security Administrator'
  | 'Cloud Platform Security Contributor'
  | 'Cloud Platform Security Reader'
  | 'Cloud Platform FinOps Administrator'
  | 'Cloud Platform Site Reliability Engineer'
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

// New interface for detailed job function definition
export interface JobFunctionDefinition {
  id: string;
  title: string;
  description: string;
  actions: string[];
  environmentRestrictions?: string[];
  defaultPermissions?: string[];
  recommendedResources?: string[];
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

// New types for User Access Review Workflow
export interface PermissionGap {
  userId: string;
  permissionId?: string;
  roleId?: string;
  gapType: 'excess' | 'missing';
  description: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  approved?: boolean;
  justification?: string;
}

export interface RegulatoryEnvironment {
  id: string;
  name: string;
  description: string;
  complianceFrameworks: string[];
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
}

export interface JobFunctionPermissionMapping {
  jobFunction: JobFunction;
  permissions: string[];
  resources: string[];
  environmentRestrictions?: string[];
}

export interface AccessReviewLog {
  id: string;
  reviewId: string;
  approverId: string;
  approvedUserId: string;
  environment: string;
  jobFunctions: string[];
  permissionsGranted: string[];
  groupsMembership: string[];
  timestamp: string;
  decision: 'maintain' | 'revoke' | 'modify';
  justification?: string;
}

// New interface for permission comparison
export interface PermissionComparisonResult {
  userId: string;
  userName: string;
  jobFunction?: string;
  hasApprovalRecord: boolean;
  permissionsMatch: boolean;
  excessPermissions: string[];
  missingPermissions: string[];
}
