
import { Permission, Role } from './role-types';

export interface AccessReview {
  id: string;
  reviewerId: string;
  subjectId: string;
  roleId?: string;
  permissionId?: string;
  decision: 'maintain' | 'revoke' | 'modify';
  comments?: string;
  createdAt: string;
  updatedAt: string;
  status?: 'pending' | 'completed' | 'overdue';
  dueDate?: string;
  daysOverdue?: number;
  violationType?: string;
  permissionGaps?: PermissionGap[];
  regulatoryEnvironment?: string;
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

export interface PermissionGap {
  id: string;
  userId: string;
  requiredPermissions?: Permission[];
  missingPermissions?: Permission[];
  recommendedRoles?: Role[];
  severity: 'high' | 'medium' | 'low';
  gapType: 'missing_permission' | 'excessive_permission' | 'unauthorized_user' | 'role_mismatch';
  description: string;
  remediationSteps?: string[];
  environment?: string;
  permissionId?: string;
  roleId?: string;
  approved?: boolean;
  justification?: string;
  actualJobFunction?: string;
  approvedJobFunction?: string;
}

// Adding RegulatoryEnvironment type that was missing
export interface RegulatoryEnvironment {
  id: string;
  name: string;
  description: string;
  complianceFrameworks: string[];
  riskLevel: "Low" | "Medium" | "High" | "Critical";
}

// Adding AccessViolation type that was missing
export interface AccessViolation {
  id: string;
  userId: string;
  permissionId?: string;
  roleId?: string;
  violationType: string;
  severity: string;
  details: string;
  detectedAt: string;
  status: string;
  reviewId?: string;
}

// Adding ApprovalStep type that was missing
export interface ApprovalStep {
  id: string;
  approverType: 'manager' | 'security' | 'compliance' | 'admin';
  approverName: string;
  status: 'pending' | 'approved' | 'rejected';
  timestamp?: string;
  comments?: string;
}
