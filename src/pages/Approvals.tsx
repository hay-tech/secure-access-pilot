
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ApprovalsTabContent from '../components/approvals/ApprovalsTabContent';
import ApprovalDialogs from '../components/approvals/ApprovalDialogs';
import { useApprovalManagement } from '../hooks/useApprovalManagement';

const Approvals: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'pending' | 'completed'>('pending');
  const {
    pendingApprovals,
    completedApprovals,
    dialogType,
    comments,
    getUserName,
    getUserJobFunctions,
    getAccessType,
    openDialog,
    closeDialog,
    setComments,
    handleAction,
  } = useApprovalManagement();

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
