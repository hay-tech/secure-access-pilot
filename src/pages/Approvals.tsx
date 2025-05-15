
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useIAM } from '../contexts/IAMContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ApprovalsTabContent from '../components/approvals/ApprovalsTabContent';
import ApprovalDialogs from '../components/approvals/ApprovalDialogs';

const Approvals: React.FC = () => {
  const { currentUser } = useAuth();
  const { accessRequests, approveAccessRequest, users } = useIAM();
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);
  const [dialogType, setDialogType] = useState<'approve' | 'reject' | null>(null);
  const [comments, setComments] = useState('');
  const [activeTab, setActiveTab] = useState<'pending' | 'completed'>('pending');
  
  if (!currentUser) return null;
  
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
    if (!request) return;
    
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

  const getAccessType = (request: any) => {
    return request.accessType === 'temporary' ? 'Temporary' : 'Permanent';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Approvals</h1>
        <p className="text-muted-foreground">Manage access requests that need your approval</p>
      </div>
      
      <Tabs defaultValue="pending" onValueChange={(value) => setActiveTab(value as 'pending' | 'completed')}>
        <TabsList>
          <TabsTrigger value="pending">Pending Approvals</TabsTrigger>
          <TabsTrigger value="completed">Completed Approvals</TabsTrigger>
        </TabsList>
        
        <TabsContent value="pending">
          <ApprovalsTabContent
            activeTab="pending"
            pendingApprovals={pendingApprovals}
            completedApprovals={completedApprovals}
            currentUserId={currentUser.id}
            getUserName={getUserName}
            getUserJobFunctions={getUserJobFunctions}
            getAccessType={getAccessType}
            openDialog={openDialog}
          />
        </TabsContent>
        
        <TabsContent value="completed">
          <ApprovalsTabContent
            activeTab="completed"
            pendingApprovals={pendingApprovals}
            completedApprovals={completedApprovals}
            currentUserId={currentUser.id}
            getUserName={getUserName}
            getUserJobFunctions={getUserJobFunctions}
            getAccessType={getAccessType}
            openDialog={openDialog}
          />
        </TabsContent>
      </Tabs>
      
      <ApprovalDialogs
        dialogType={dialogType}
        comments={comments}
        setComments={setComments}
        closeDialog={closeDialog}
        handleAction={handleAction}
      />
    </div>
  );
};

export default Approvals;
