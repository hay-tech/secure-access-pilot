
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
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  createdAt: string;
  updatedAt: string;
}

export interface Permission {
  id: string;
  name: string;
  resource: string;
  action: 'create' | 'read' | 'update' | 'delete' | 'approve';
  description: string;
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
}
