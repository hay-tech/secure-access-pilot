
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
  requiredPermissions: Permission[];
  missingPermissions: Permission[];
  recommendedRoles: Role[];
  severity: 'high' | 'medium' | 'low';
  gapType: 'missing_permission' | 'excessive_permission' | 'unauthorized_user' | 'role_mismatch';
  description: string;
  remediationSteps: string[];
  environment?: string;
}
