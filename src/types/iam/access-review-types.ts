
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

export interface PermissionComparisonResult {
  userId: string;
  userName: string;
  jobFunction?: string;
  hasApprovalRecord: boolean;
  permissionsMatch: boolean;
  excessPermissions: string[];
  missingPermissions: string[];
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

export interface RegulatoryEnvironment {
  id: string;
  name: string;
  description: string;
  complianceFrameworks: string[];
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
}
