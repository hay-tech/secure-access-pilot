
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import PendingApprovalsTable from './PendingApprovalsTable';
import CompletedApprovalsTable from './CompletedApprovalsTable';
import { AccessRequest } from '../../types/iam';

interface ApprovalsTabContentProps {
  activeTab: 'pending' | 'completed';
  pendingApprovals: AccessRequest[];
  completedApprovals: AccessRequest[];
  currentUserId: string;
  getUserName: (userId: string) => string;
  getUserJobFunctions: (userId: string) => string;
  getAccessType: (request: any) => string;
  openDialog: (requestId: string, type: 'approve' | 'reject') => void;
}

const ApprovalsTabContent: React.FC<ApprovalsTabContentProps> = ({
  activeTab,
  pendingApprovals,
  completedApprovals,
  currentUserId,
  getUserName,
  getUserJobFunctions,
  getAccessType,
  openDialog,
}) => {
  return (
    <>
      {activeTab === 'pending' && (
        <Card>
          <CardHeader>
            <CardTitle>Pending Approvals</CardTitle>
            <CardDescription>Access requests awaiting your approval</CardDescription>
          </CardHeader>
          <CardContent>
            <PendingApprovalsTable
              pendingApprovals={pendingApprovals}
              getUserName={getUserName}
              getUserJobFunctions={getUserJobFunctions}
              getAccessType={getAccessType}
              openDialog={openDialog}
            />
          </CardContent>
        </Card>
      )}
      
      {activeTab === 'completed' && (
        <Card>
          <CardHeader>
            <CardTitle>Completed Approvals</CardTitle>
            <CardDescription>Access requests you've already reviewed</CardDescription>
          </CardHeader>
          <CardContent>
            <CompletedApprovalsTable
              completedApprovals={completedApprovals}
              currentUserId={currentUserId}
              getUserName={getUserName}
              getUserJobFunctions={getUserJobFunctions}
              getAccessType={getAccessType}
            />
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default ApprovalsTabContent;
