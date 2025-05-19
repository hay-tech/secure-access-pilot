
import { useState } from 'react';
import { User, Role, Permission, AccessRequest, AuditLog, AccessReview } from '../../types/iam';
import { 
  users as initialUsers, 
  roles as initialRoles, 
  permissions as initialPermissions, 
  accessRequests as initialAccessRequests, 
  auditLogs as initialAuditLogs, 
  accessReviews as initialAccessReviews 
} from '../../data/mockData';

// Create a central store to avoid circular dependencies
export const useIAMStore = () => {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [roles, setRoles] = useState<Role[]>(initialRoles);
  const [permissions] = useState<Permission[]>(initialPermissions);
  const [accessRequests, setAccessRequests] = useState<AccessRequest[]>(initialAccessRequests);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(initialAuditLogs);
  const [accessReviews, setAccessReviews] = useState<AccessReview[]>(initialAccessReviews);

  return {
    users,
    setUsers,
    roles,
    setRoles,
    permissions,
    accessRequests,
    setAccessRequests,
    auditLogs,
    setAuditLogs,
    accessReviews,
    setAccessReviews
  };
};
