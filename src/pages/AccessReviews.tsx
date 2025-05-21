
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useAccessReviewManagement } from '@/hooks/iam/useAccessReviewManagement';
import AccessReviewLogTable from '@/components/access-reviews/AccessReviewLogTable';
import AccessReviewCards from '@/components/access-reviews/AccessReviewCards';
import AccessReviewCharts from '@/components/access-reviews/AccessReviewCharts';
import AccessReviewEnvironmentHandler from '@/components/access-reviews/AccessReviewEnvironmentHandler';
import UnauthorizedUsersTable from '@/components/access-reviews/UnauthorizedUsersTable';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Database, AlertCircle, Check, X } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

const AccessReviews: React.FC = () => {
  const { accessReviewLogs, accessReviews, getPermissionGapsByEnvironment } = useAccessReviewManagement();
  const { currentUser } = useAuth();
  const [currentTab, setCurrentTab] = useState('federal');
  const [unauthorizedTab, setUnauthorizedTab] = useState('pending');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  
  // Get users with permission gaps (including unauthorized users)
  const federalGaps = getPermissionGapsByEnvironment('federal');
  
  // Filter out unauthorized users specifically
  const unauthorizedUsers = federalGaps.filter(item => 
    item.gaps.some(gap => gap.gapType === 'unauthorized_user')
  );

  // Determine user role for view customization
  const isManager = currentUser?.jobFunction?.includes('Manager') || false;
  const isDeveloper = currentUser?.jobFunction?.includes('Developer') || 
                      currentUser?.jobFunction?.includes('Engineer') || 
                      currentUser?.jobFunction?.includes('Contributor') || false;
  const isComplianceAnalyst = !isManager && !isDeveloper;
  
  // Handle bulk selection
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedUsers(unauthorizedUsers.map(user => user.user.id));
    } else {
      setSelectedUsers([]);
    }
  };
  
  // Handle individual selection
  const handleSelectUser = (userId: string, checked: boolean) => {
    if (checked) {
      setSelectedUsers(prev => [...prev, userId]);
    } else {
      setSelectedUsers(prev => prev.filter(id => id !== userId));
    }
  };
  
  // Handle bulk approve/reject
  const handleBulkApprove = () => {
    toast.success(`Approved access for ${selectedUsers.length} users`);
    setSelectedUsers([]);
  };
  
  const handleBulkReject = () => {
    toast.success(`Rejected access for ${selectedUsers.length} users`);
    setSelectedUsers([]);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">User Access Reviews & Validation</h2>
          <p className="text-muted-foreground">
            Review and manage user permissions and job functions.
          </p>
        </div>
      </div>

      <div className="grid gap-6">
        {/* Only show charts for managers and compliance analysts */}
        {!isDeveloper && <AccessReviewCharts />}

        {/* Don't show the status by manager card for managers */}
        {!isManager && <AccessReviewCards accessReviews={accessReviews} />}

        <Tabs defaultValue="reviews" className="w-full">
          <TabsList>
            <TabsTrigger value="reviews">Active Reviews</TabsTrigger>
            {/* Hide access review button for developers */}
            {!isDeveloper && (
              <TabsTrigger value="unauthorized" className="relative">
                Unauthorized Users
                {unauthorizedUsers.length > 0 && (
                  <span className="ml-2 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                    {unauthorizedUsers.length}
                  </span>
                )}
              </TabsTrigger>
            )}
          </TabsList>
          
          <TabsContent value="reviews" className="space-y-4">
            <AccessReviewEnvironmentHandler 
              currentTab={currentTab}
              setCurrentTab={setCurrentTab}
            />
            
            <Card>
              <CardHeader className="flex flex-row items-center gap-2">
                <Database className="h-6 w-6 text-primary" />
                <CardTitle>Accountability Database Example</CardTitle>
              </CardHeader>
              <CardContent>
                <AccessReviewLogTable logs={accessReviewLogs || []} />
              </CardContent>
            </Card>
          </TabsContent>
          
          {!isDeveloper && (
            <TabsContent value="unauthorized" className="space-y-4">
              <Card>
                <CardHeader className="flex flex-row items-center gap-2">
                  <AlertCircle className="h-6 w-6 text-red-500" />
                  <CardTitle>Unauthorized Users or Permissions - Users Deprovisioned</CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs value={unauthorizedTab} onValueChange={setUnauthorizedTab}>
                    <TabsList className="mb-4">
                      <TabsTrigger value="pending">Pending Action</TabsTrigger>
                      <TabsTrigger value="removed">Removed Access</TabsTrigger>
                    </TabsList>
                    
                    {/* Bulk actions for managers */}
                    {isManager && unauthorizedUsers.length > 0 && unauthorizedTab === "pending" && (
                      <div className="mb-4 flex items-center justify-between bg-muted p-3 rounded-md">
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="select-all" 
                            checked={selectedUsers.length === unauthorizedUsers.length && unauthorizedUsers.length > 0}
                            onCheckedChange={handleSelectAll}
                          />
                          <label htmlFor="select-all" className="text-sm font-medium">
                            Select All ({unauthorizedUsers.length})
                          </label>
                        </div>
                        
                        {selectedUsers.length > 0 && (
                          <div className="flex space-x-2">
                            <Button 
                              size="sm" 
                              onClick={handleBulkApprove}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <Check className="mr-1 h-4 w-4" /> 
                              Approve ({selectedUsers.length})
                            </Button>
                            <Button 
                              size="sm" 
                              onClick={handleBulkReject}
                              variant="destructive"
                            >
                              <X className="mr-1 h-4 w-4" /> 
                              Reject ({selectedUsers.length})
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
                    
                    <TabsContent value="pending">
                      <UnauthorizedUsersTable 
                        users={unauthorizedUsers} 
                        status="pending" 
                        isManager={isManager}
                        selectedUsers={selectedUsers}
                        onSelectUser={handleSelectUser}
                      />
                    </TabsContent>
                    
                    <TabsContent value="removed">
                      <UnauthorizedUsersTable 
                        users={[]} // This would be populated with the list of already-removed users
                        status="removed" 
                      />
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
};

export default AccessReviews;
