
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useAccessReviewManagement } from '@/hooks/iam/useAccessReviewManagement';
import AccessReviewLogTable from '@/components/access-reviews/AccessReviewLogTable';
import AccessReviewCards from '@/components/access-reviews/AccessReviewCards';
import AccessReviewCharts from '@/components/access-reviews/AccessReviewCharts';
import AccessReviewEnvironmentHandler from '@/components/access-reviews/AccessReviewEnvironmentHandler';
import UnauthorizedUsersTable from '@/components/access-reviews/UnauthorizedUsersTable';
import BulkAccessReview from '@/components/access-reviews/BulkAccessReview';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Database, AlertCircle, Check, X, Users } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const AccessReviews: React.FC = () => {
  const { accessReviewLogs, accessReviews, getPermissionGapsByEnvironment } = useAccessReviewManagement();
  const { currentUser } = useAuth();
  const [currentTab, setCurrentTab] = useState('fedramp');
  const [unauthorizedTab, setUnauthorizedTab] = useState('removed');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [bulkReviewOpen, setBulkReviewOpen] = useState(false);
  
  // Get users with permission gaps (including unauthorized users)
  const fedrampGaps = getPermissionGapsByEnvironment('fedramp');
  
  // Filter out unauthorized users specifically
  const unauthorizedUsers = fedrampGaps.filter(item => 
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

  // Open the bulk review dialog
  const openBulkReview = () => {
    setBulkReviewOpen(true);
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
        {isManager && (
          <Button onClick={openBulkReview} className="flex items-center gap-2">
            <Users size={16} />
            Bulk Access Review
          </Button>
        )}
      </div>

      <div className="grid gap-6">
        {/* Only show charts for compliance analysts */}
        {isComplianceAnalyst && <AccessReviewCharts />}

        {/* Don't show the status cards for managers */}
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
                <AccessReviewLogTable logs={accessReviewLogs || []} isExample={true} />
              </CardContent>
            </Card>
          </TabsContent>
          
          {!isDeveloper && (
            <TabsContent value="unauthorized" className="space-y-4">
              <Card>
                <CardHeader className="flex flex-row items-center gap-2">
                  <AlertCircle className="h-6 w-6 text-red-500" />
                  <CardTitle>Automated User Access Validation - Actuals vs Approved Permissions</CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs value={unauthorizedTab} onValueChange={setUnauthorizedTab}>
                    <TabsList className="mb-4">
                      <TabsTrigger value="removed">Removed Access</TabsTrigger>
                      <TabsTrigger value="frozen">Frozen Accounts</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="removed">
                      <UnauthorizedUsersTable 
                        users={unauthorizedUsers.slice(0, 2)} 
                        status="removed" 
                        isManager={false}
                      />
                    </TabsContent>
                    
                    <TabsContent value="frozen">
                      <UnauthorizedUsersTable 
                        users={unauthorizedUsers.slice(1, 3)} 
                        status="frozen" 
                        isManager={false}
                      />
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>

      {/* Bulk Access Review Dialog */}
      <Dialog open={bulkReviewOpen} onOpenChange={setBulkReviewOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Bulk Access Review</DialogTitle>
          </DialogHeader>
          <BulkAccessReview onClose={() => setBulkReviewOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AccessReviews;
