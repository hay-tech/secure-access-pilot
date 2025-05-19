
import React, { useState } from 'react';
import { useAccessReviewManagement } from '@/hooks/iam/useAccessReviewManagement';
import AccessReviewLogTable from '@/components/access-reviews/AccessReviewLogTable';
import AccessReviewCards from '@/components/access-reviews/AccessReviewCards';
import AccessReviewCharts from '@/components/access-reviews/AccessReviewCharts';
import AccessReviewEnvironmentHandler from '@/components/access-reviews/AccessReviewEnvironmentHandler';
import UnauthorizedUsersTable from '@/components/access-reviews/UnauthorizedUsersTable';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Database, AlertCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AccessReviews: React.FC = () => {
  const { accessReviewLogs, accessReviews, getPermissionGapsByEnvironment } = useAccessReviewManagement();
  const [currentTab, setCurrentTab] = useState('federal');
  const [unauthorizedTab, setUnauthorizedTab] = useState('pending');
  
  // Get users with permission gaps (including unauthorized users)
  const federalGaps = getPermissionGapsByEnvironment('federal');
  
  // Calculate total metrics
  const totalPermissionGaps = federalGaps.reduce(
    (sum, item) => sum + item.gaps.length, 0
  );
  
  const totalUsersWithGaps = federalGaps.length;
  
  // Filter out unauthorized users specifically
  const unauthorizedUsers = federalGaps.filter(item => 
    item.gaps.some(gap => gap.gapType === 'unauthorized_user')
  );
  
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
        <AccessReviewCharts />
        
        <AccessReviewCards 
          accessReviews={accessReviews}
          totalPermissionGaps={totalPermissionGaps} 
          totalUsersWithGaps={totalUsersWithGaps}
        />

        <Tabs defaultValue="reviews" className="w-full">
          <TabsList>
            <TabsTrigger value="reviews">Active Reviews</TabsTrigger>
            <TabsTrigger value="unauthorized" className="relative">
              Unauthorized Users
              {unauthorizedUsers.length > 0 && (
                <span className="ml-2 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                  {unauthorizedUsers.length}
                </span>
              )}
            </TabsTrigger>
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
          
          <TabsContent value="unauthorized" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center gap-2">
                <AlertCircle className="h-6 w-6 text-red-500" />
                <CardTitle>Unauthorized Users</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs value={unauthorizedTab} onValueChange={setUnauthorizedTab}>
                  <TabsList className="mb-4">
                    <TabsTrigger value="pending">Pending Action</TabsTrigger>
                    <TabsTrigger value="removed">Removed Access</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="pending">
                    <UnauthorizedUsersTable 
                      users={unauthorizedUsers} 
                      status="pending" 
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
        </Tabs>
      </div>
    </div>
  );
};

export default AccessReviews;
