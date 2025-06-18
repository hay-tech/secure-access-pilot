
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useIAM } from '../contexts/IAMContext';
import { AccessRequest } from '../types/iam';

interface ApprovalManagementReturn {
  pendingApprovals: AccessRequest[];
  completedApprovals: AccessRequest[];
  selectedRequest: string | null;
  dialogType: 'approve' | 'reject' | null;
  comments: string;
  getUserName: (userId: string) => string;
  getUserJobFunctions: (userId: string) => string;
  getAccessType: (request: AccessRequest) => string;
  openDialog: (requestId: string, type: 'approve' | 'reject') => void;
  closeDialog: () => void;
  setComments: (comments: string) => void;
  handleAction: (approved: boolean) => Promise<void>;
}

export const useApprovalManagement = (): ApprovalManagementReturn => {
  const { currentUser } = useAuth();
  const { accessRequests, approveAccessRequest, users } = useIAM();
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);
  const [dialogType, setDialogType] = useState<'approve' | 'reject' | null>(null);
  const [comments, setComments] = useState('');
  
  if (!currentUser) {
    return {
      pendingApprovals: [],
      completedApprovals: [],
      selectedRequest: null,
      dialogType: null,
      comments: '',
      getUserName: () => 'Unknown User',
      getUserJobFunctions: () => 'N/A',
      getAccessType: () => 'Permanent',
      openDialog: () => {},
      closeDialog: () => {},
      setComments: () => {},
      handleAction: async () => {},
    };
  }
  
  // Get requests that need the current user's approval
  const pendingApprovals = accessRequests.filter(req => 
    (req.managerApproval?.approverId === currentUser.id && req.managerApproval?.status === 'pending') ||
    (req.securityApproval?.approverId === currentUser.id && req.securityApproval?.status === 'pending')
  );
  
  // Get requests that have been approved or rejected by the current user
  const completedApprovals = accessRequests.filter(req => 
    (req.managerApproval?.approverId === currentUser.id && req.managerApproval?.status !== 'pending') ||
    (req.securityApproval?.approverId === currentUser.id && req.securityApproval?.status !== 'pending')
  );
  
  const handleAction = async (approved: boolean) => {
    if (!selectedRequest) return;
    
    const request = accessRequests.find(r => r.id === selectedRequest);
    if (!request || !currentUser) return;
    
    const approverType = request.managerApproval?.approverId === currentUser.id ? 'manager' : 'security';
    
    await approveAccessRequest(
      selectedRequest,
      currentUser.id,
      approverType,
      approved,
      comments
    );
    
    setSelectedRequest(null);
    setDialogType(null);
    setComments('');
  };
  
  const openDialog = (requestId: string, type: 'approve' | 'reject') => {
    setSelectedRequest(requestId);
    setDialogType(type);
    setComments('');
  };
  
  const closeDialog = () => {
    setSelectedRequest(null);
    setDialogType(null);
    setComments('');
  };
  
  const getUserName = (userId: string) => {
    const user = users.find(u => u.id === userId);
    return user ? `${user.firstName} ${user.lastName}` : 'Unknown User';
  };

  const getUserJobFunctions = (userId: string) => {
    const user = users.find(u => u.id === userId);
    return user?.jobFunctions?.join(', ') || 'N/A';
  };

  const getAccessType = (request: AccessRequest) => {
    return request.requestType || (request.accessType === 'temporary' ? 'Temporary' : 'Permanent');
  };

  return {
    pendingApprovals,
    completedApprovals,
    selectedRequest,
    dialogType,
    comments,
    getUserName,
    getUserJobFunctions,
    getAccessType,
    openDialog,
    closeDialog,
    setComments,
    handleAction,
  };
};
