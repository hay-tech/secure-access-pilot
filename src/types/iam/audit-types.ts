
export interface AuditLog {
  id: string;
  eventType: 'login' | 'logout' | 'access_request' | 'approval' | 'role_change' | 'permission_change';
  userId: string;
  details: string;
  ipAddress?: string;
  timestamp: string;
}
