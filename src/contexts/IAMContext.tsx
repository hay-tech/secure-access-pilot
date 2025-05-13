import React, { createContext, useContext, useState } from 'react';
import { User, Role, Permission, AccessRequest, AuditLog, AccessReview, ApprovalStep } from '../types/iam';
import { users, roles, permissions, accessRequests, auditLogs, accessReviews } from '../data/mockData';
import { toast } from 'sonner';

interface IAMContextType {
  users: User[];
  roles: Role[];
  permissions: Permission[];
  accessRequests: AccessRequest[];
  auditLogs: AuditLog[];
  accessReviews: AccessReview[];
  
  // User management
  createUser: (user: Omit<User, 'id' | 'createdAt'>) => Promise<User>;
  updateUser: (id: string, updates: Partial<User>) => Promise<User | null>;
  deleteUser: (id: string) => Promise<boolean>;
  getUserById: (id: string) => User | undefined;
  
  // Role management
  createRole: (role: Omit<Role, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Role>;
  updateRole: (id: string, updates: Partial<Role>) => Promise<Role | null>;
  deleteRole: (id: string) => Promise<boolean>;
  getRoleById: (id: string) => Role | undefined;
  
  // Access requests
  createAccessRequest: (request: Omit<AccessRequest, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => Promise<AccessRequest>;
  updateAccessRequest: (id: string, updates: Partial<AccessRequest>) => Promise<AccessRequest | null>;
  approveAccessRequest: (id: string, approverId: string, approverType: 'manager' | 'security', approved: boolean, comments?: string) => Promise<AccessRequest | null>;
  
  // Logging
  logActivity: (eventType: AuditLog['eventType'], userId: string, details: string) => Promise<AuditLog>;
  
  // Access reviews
  createAccessReview: (review: Omit<AccessReview, 'id' | 'createdAt'>) => Promise<AccessReview>;
  
  // Helper functions
  getUserRoles: (userId: string) => Role[];
  getUserPermissions: (userId: string) => Permission[];
  hasPermission: (userId: string, resource: string, action: Permission['action']) => boolean;
}

const IAMContext = createContext<IAMContextType | null>(null);

export const useIAM = () => {
  const context = useContext(IAMContext);
  if (!context) {
    throw new Error('useIAM must be used within an IAMProvider');
  }
  return context;
};

export const IAMProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [usersState, setUsers] = useState<User[]>(users);
  const [rolesState, setRoles] = useState<Role[]>(roles);
  const [permissionsState] = useState<Permission[]>(permissions);
  const [accessRequestsState, setAccessRequests] = useState<AccessRequest[]>(accessRequests);
  const [auditLogsState, setAuditLogs] = useState<AuditLog[]>(auditLogs);
  const [accessReviewsState, setAccessReviews] = useState<AccessReview[]>(accessReviews);

  // User management
  const createUser = async (user: Omit<User, 'id' | 'createdAt'>): Promise<User> => {
    const newUser: User = {
      ...user,
      id: `user${usersState.length + 1}`,
      createdAt: new Date().toISOString(),
    };
    setUsers(prev => [...prev, newUser]);
    
    // Log activity
    await logActivity('login', newUser.id, `New user created: ${newUser.firstName} ${newUser.lastName}`);
    
    toast.success(`User ${newUser.firstName} ${newUser.lastName} created successfully`);
    return newUser;
  };

  const updateUser = async (id: string, updates: Partial<User>): Promise<User | null> => {
    const userIndex = usersState.findIndex(u => u.id === id);
    if (userIndex === -1) {
      toast.error(`User with ID ${id} not found`);
      return null;
    }

    const updatedUser = { ...usersState[userIndex], ...updates };
    const newUsers = [...usersState];
    newUsers[userIndex] = updatedUser;
    setUsers(newUsers);
    
    // Log activity
    await logActivity('role_change', id, `User updated: ${updatedUser.firstName} ${updatedUser.lastName}`);
    
    toast.success(`User ${updatedUser.firstName} ${updatedUser.lastName} updated successfully`);
    return updatedUser;
  };

  const deleteUser = async (id: string): Promise<boolean> => {
    const userIndex = usersState.findIndex(u => u.id === id);
    if (userIndex === -1) {
      toast.error(`User with ID ${id} not found`);
      return false;
    }

    const deletedUser = usersState[userIndex];
    setUsers(prev => prev.filter(u => u.id !== id));
    
    // Log activity
    await logActivity('role_change', 'system', `User deleted: ${deletedUser.firstName} ${deletedUser.lastName}`);
    
    toast.success(`User ${deletedUser.firstName} ${deletedUser.lastName} deleted successfully`);
    return true;
  };

  const getUserById = (id: string): User | undefined => {
    return usersState.find(u => u.id === id);
  };

  // Role management
  const createRole = async (role: Omit<Role, 'id' | 'createdAt' | 'updatedAt'>): Promise<Role> => {
    const now = new Date().toISOString();
    const newRole: Role = {
      ...role,
      id: `role${rolesState.length + 1}`,
      createdAt: now,
      updatedAt: now,
    };
    setRoles(prev => [...prev, newRole]);
    
    // Log activity
    await logActivity('role_change', 'system', `New role created: ${newRole.name}`);
    
    toast.success(`Role ${newRole.name} created successfully`);
    return newRole;
  };

  const updateRole = async (id: string, updates: Partial<Role>): Promise<Role | null> => {
    const roleIndex = rolesState.findIndex(r => r.id === id);
    if (roleIndex === -1) {
      toast.error(`Role with ID ${id} not found`);
      return null;
    }

    const updatedRole = { 
      ...rolesState[roleIndex], 
      ...updates, 
      updatedAt: new Date().toISOString() 
    };
    
    const newRoles = [...rolesState];
    newRoles[roleIndex] = updatedRole;
    setRoles(newRoles);
    
    // Log activity
    await logActivity('role_change', 'system', `Role updated: ${updatedRole.name}`);
    
    toast.success(`Role ${updatedRole.name} updated successfully`);
    return updatedRole;
  };

  const deleteRole = async (id: string): Promise<boolean> => {
    const roleIndex = rolesState.findIndex(r => r.id === id);
    if (roleIndex === -1) {
      toast.error(`Role with ID ${id} not found`);
      return false;
    }

    const deletedRole = rolesState[roleIndex];
    
    // Check if any users have this role
    const usersWithRole = usersState.filter(u => u.roleIds.includes(id));
    if (usersWithRole.length > 0) {
      toast.error(`Cannot delete role: ${usersWithRole.length} users are assigned to this role`);
      return false;
    }
    
    setRoles(prev => prev.filter(r => r.id !== id));
    
    // Log activity
    await logActivity('role_change', 'system', `Role deleted: ${deletedRole.name}`);
    
    toast.success(`Role ${deletedRole.name} deleted successfully`);
    return true;
  };

  const getRoleById = (id: string): Role | undefined => {
    return rolesState.find(r => r.id === id);
  };

  // Access requests with enhanced approval flow
  const createAccessRequest = async (request: Omit<AccessRequest, 'id' | 'createdAt' | 'updatedAt' | 'status'>): Promise<AccessRequest> => {
    const now = new Date().toISOString();
    
    // Generate approval chain based on compliance framework and resource hierarchy
    let approvalChain: ApprovalStep[] = [];
    
    if (request.approvalChain) {
      // Convert the incoming approval chain to the correct ApprovalStep type
      approvalChain = request.approvalChain.map(approver => ({
        approverId: approver.approverId || approver.id || "",
        approverName: approver.approverName || approver.name || "",
        approverTitle: approver.approverTitle || approver.title || "",
        approverType: (approver.approverType || approver.type || "manager") as 'manager' | 'resource-owner' | 'security' | 'compliance',
        status: 'pending',
        comments: approver.comments,
        reason: approver.reason
      }));
    }
    
    // Handle expiration for temporary access
    let expiresAt = request.expiresAt;
    if (request.accessType === 'temporary' && !expiresAt) {
      // Default expiration of 30 days if not specified
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + 30);
      expiresAt = expirationDate.toISOString();
    }
    
    const newRequest: AccessRequest = {
      ...request,
      id: `req${accessRequestsState.length + 1}`,
      status: 'pending',
      createdAt: now,
      updatedAt: now,
      expiresAt,
      approvalChain
    };
    
    setAccessRequests(prev => [...prev, newRequest]);
    
    // Log activity
    await logActivity('access_request', request.userId, `New access request created for ${request.resourceName}`);
    
    toast.success(`Access request submitted successfully`);
    return newRequest;
  };

  const updateAccessRequest = async (id: string, updates: Partial<AccessRequest>): Promise<AccessRequest | null> => {
    const requestIndex = accessRequestsState.findIndex(r => r.id === id);
    if (requestIndex === -1) {
      toast.error(`Access request with ID ${id} not found`);
      return null;
    }

    const updatedRequest = { 
      ...accessRequestsState[requestIndex], 
      ...updates, 
      updatedAt: new Date().toISOString() 
    };
    
    const newRequests = [...accessRequestsState];
    newRequests[requestIndex] = updatedRequest;
    setAccessRequests(newRequests);
    
    // Log activity
    await logActivity('access_request', 'system', `Access request updated: ${id}`);
    
    toast.success(`Access request updated successfully`);
    return updatedRequest;
  };

  const approveAccessRequest = async (
    id: string, 
    approverId: string, 
    approverType: 'manager' | 'security', 
    approved: boolean, 
    comments?: string
  ): Promise<AccessRequest | null> => {
    const requestIndex = accessRequestsState.findIndex(r => r.id === id);
    if (requestIndex === -1) {
      toast.error(`Access request with ID ${id} not found`);
      return null;
    }

    const request = { ...accessRequestsState[requestIndex] };
    const now = new Date().toISOString();
    
    if (approverType === 'manager') {
      request.managerApproval = {
        approverId,
        status: approved ? 'approved' : 'rejected',
        comments,
        timestamp: now,
      };
    } else {
      request.securityApproval = {
        approverId,
        status: approved ? 'approved' : 'rejected',
        comments,
        timestamp: now,
      };
    }
    
    // Update overall status if both approvals are complete
    if (
      request.managerApproval?.status !== 'pending' && 
      request.securityApproval?.status !== 'pending'
    ) {
      if (
        request.managerApproval?.status === 'approved' && 
        request.securityApproval?.status === 'approved'
      ) {
        request.status = 'approved';
        
        // If approved, update user's roles/permissions
        if (request.requestType === 'role') {
          const user = usersState.find(u => u.id === request.userId);
          if (user) {
            const updatedUser = { 
              ...user, 
              roleIds: [...user.roleIds, request.resourceId] 
            };
            await updateUser(user.id, updatedUser);
          }
        }
      } else {
        request.status = 'rejected';
      }
    }
    
    request.updatedAt = now;
    
    const newRequests = [...accessRequestsState];
    newRequests[requestIndex] = request;
    setAccessRequests(newRequests);
    
    // Log activity
    await logActivity(
      'approval', 
      approverId, 
      `Access request ${approved ? 'approved' : 'rejected'} by ${approverType}: ${id}`
    );
    
    toast.success(`Access request ${approved ? 'approved' : 'rejected'} successfully`);
    return request;
  };

  // Logging
  const logActivity = async (eventType: AuditLog['eventType'], userId: string, details: string): Promise<AuditLog> => {
    const newLog: AuditLog = {
      id: `log${auditLogsState.length + 1}`,
      eventType,
      userId,
      details,
      ipAddress: '127.0.0.1', // In a real app, this would be the actual IP
      timestamp: new Date().toISOString(),
    };
    setAuditLogs(prev => [newLog, ...prev]);
    return newLog;
  };

  // Access reviews
  const createAccessReview = async (review: Omit<AccessReview, 'id' | 'createdAt'>): Promise<AccessReview> => {
    const newReview: AccessReview = {
      ...review,
      id: `review${accessReviewsState.length + 1}`,
      createdAt: new Date().toISOString(),
    };
    setAccessReviews(prev => [...prev, newReview]);
    
    // Log activity
    await logActivity(
      'role_change', 
      review.reviewerId, 
      `Access review created for user ${review.subjectId}: ${review.decision}`
    );
    
    // If the decision is to revoke, update the user's permissions
    if (review.decision === 'revoke') {
      const user = usersState.find(u => u.id === review.subjectId);
      if (user && review.roleId) {
        const updatedRoleIds = user.roleIds.filter(id => id !== review.roleId);
        await updateUser(user.id, { roleIds: updatedRoleIds });
      }
    }
    
    toast.success(`Access review completed successfully`);
    return newReview;
  };

  // Helper functions
  const getUserRoles = (userId: string): Role[] => {
    const user = usersState.find(u => u.id === userId);
    if (!user) return [];
    
    return rolesState.filter(role => user.roleIds.includes(role.id));
  };

  const getUserPermissions = (userId: string): Permission[] => {
    const userRoles = getUserRoles(userId);
    const permissionSet = new Set<string>();
    const userPermissions: Permission[] = [];
    
    userRoles.forEach(role => {
      role.permissions.forEach(permission => {
        if (!permissionSet.has(permission.id)) {
          permissionSet.add(permission.id);
          userPermissions.push(permission);
        }
      });
    });
    
    return userPermissions;
  };

  const hasPermission = (userId: string, resource: string, action: Permission['action']): boolean => {
    const userPermissions = getUserPermissions(userId);
    return userPermissions.some(p => p.resource === resource && p.action === action);
  };

  const value = {
    users: usersState,
    roles: rolesState,
    permissions: permissionsState,
    accessRequests: accessRequestsState,
    auditLogs: auditLogsState,
    accessReviews: accessReviewsState,
    
    createUser,
    updateUser,
    deleteUser,
    getUserById,
    
    createRole,
    updateRole,
    deleteRole,
    getRoleById,
    
    createAccessRequest,
    updateAccessRequest,
    approveAccessRequest,
    
    logActivity,
    
    createAccessReview,
    
    getUserRoles,
    getUserPermissions,
    hasPermission,
  };

  return <IAMContext.Provider value={value}>{children}</IAMContext.Provider>;
};
