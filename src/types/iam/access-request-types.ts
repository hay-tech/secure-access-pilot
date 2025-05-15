
import { ApprovalStep } from './access-review-types';

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
  environment?: string;
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
  projectName?: string;
  // Add jobFunction to match usage in mockAccessRequests.ts
  jobFunction?: string;
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
  resourceHierarchy?: string;
}

export interface ComplianceEnvironment {
  id: string;
  name: string;
  description: string;
  sovereignOps: boolean;
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
