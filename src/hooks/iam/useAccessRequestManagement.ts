
import { AccessRequest, ApprovalStep, AuditLog } from '../../types/iam';
import { toast } from 'sonner';
import { useIAMStore } from './useIAMStore';

export const useAccessRequestManagement = () => {
  const { accessRequests, setAccessRequests, users, setUsers, auditLogs, setAuditLogs } = useIAMStore();
  
  const logActivity = async (eventType: AuditLog['eventType'], userId: string, details: string) => {
    const newLog: AuditLog = {
      id: `log${auditLogs.length + 1}`,
      eventType,
      userId,
      details,
      ipAddress: '127.0.0.1',
      timestamp: new Date().toISOString(),
    };
    setAuditLogs(prev => [newLog, ...prev]);
    return newLog;
  };
  
  const updateUser = async (id: string, updates: any) => {
    const userIndex = users.findIndex(u => u.id === id);
    if (userIndex === -1) return null;
    
    const updatedUser = { ...users[userIndex], ...updates };
    const newUsers = [...users];
    newUsers[userIndex] = updatedUser;
    setUsers(newUsers);
    return updatedUser;
  };

  const createAccessRequest = async (request: Omit<AccessRequest, 'id' | 'createdAt' | 'updatedAt' | 'status'>): Promise<AccessRequest> => {
    const now = new Date().toISOString();
    
    // Generate approval chain based on compliance framework and resource hierarchy
    let approvalChain: ApprovalStep[] = [];
    
    if (request.approvalChain) {
      // Convert the incoming approval chain to the correct ApprovalStep type
      approvalChain = request.approvalChain.map(approver => ({
        id: `approver-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, // Generate a unique ID
        approverId: approver.approverId || (approver.id as string) || "",
        approverName: approver.approverName || (approver.name as string) || "",
        approverTitle: approver.approverTitle || (approver.title as string) || "",
        approverType: (approver.approverType || approver.type || "manager") as 'manager' | 'resource-owner' | 'security' | 'compliance',
        status: 'pending',
        comments: approver.comments,
        reason: approver.reason,
        // Add other required properties from the original object
        name: approver.name as string,
        title: approver.title as string,
        type: approver.type as string
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
    
    // Set initial status - Auto-approve for development environments
    const isDevEnvironment = request.environmentType === 'dev';
    const initialStatus = isDevEnvironment ? 'approved' : 'pending';
    
    const newRequest: AccessRequest = {
      ...request,
      id: `req${accessRequests.length + 1}`,
      status: initialStatus,
      createdAt: now,
      updatedAt: now,
      expiresAt,
      approvalChain,
      projectName: request.projectName,
    };
    
    setAccessRequests(prev => [...prev, newRequest]);
    
    // For development environments, log as auto-approved
    if (isDevEnvironment) {
      await logActivity(
        'approval', 
        'system', 
        `Access request auto-approved for ${request.resourceName} in development environment`
      );
    } else {
      // Log regular activity for other environments
      await logActivity(
        'access_request', 
        request.userId, 
        `New access request created for ${request.resourceName}`
      );
    }
    
    toast.success(
      isDevEnvironment 
        ? `Access request automatically approved for development environment` 
        : `Access request submitted successfully`
    );
    
    return newRequest;
  };

  const updateAccessRequest = async (id: string, updates: Partial<AccessRequest>): Promise<AccessRequest | null> => {
    const requestIndex = accessRequests.findIndex(r => r.id === id);
    if (requestIndex === -1) {
      toast.error(`Access request with ID ${id} not found`);
      return null;
    }

    const updatedRequest = { 
      ...accessRequests[requestIndex], 
      ...updates, 
      updatedAt: new Date().toISOString() 
    };
    
    const newRequests = [...accessRequests];
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
    const requestIndex = accessRequests.findIndex(r => r.id === id);
    if (requestIndex === -1) {
      toast.error(`Access request with ID ${id} not found`);
      return null;
    }

    const request = { ...accessRequests[requestIndex] };
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
          const user = users.find(u => u.id === request.userId);
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
    
    const newRequests = [...accessRequests];
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

  return {
    accessRequests,
    createAccessRequest,
    updateAccessRequest,
    approveAccessRequest
  };
};
