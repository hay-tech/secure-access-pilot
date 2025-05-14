
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from '@/contexts/AuthContext';
import { useIAM } from '@/contexts/IAMContext';
import { useAccessReviewManagement } from '@/hooks/iam/useAccessReviewManagement';
import { useJobFunctionMapping } from '@/hooks/iam/useJobFunctionMapping';
import UserAccessReviewTable from '@/components/access-reviews/UserAccessReviewTable';
import AccessReviewLogTable from '@/components/access-reviews/AccessReviewLogTable';
import { User, PermissionGap, RegulatoryEnvironment } from '@/types/iam';
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import { Shield, Calendar, Users, ListCheck } from "lucide-react";

const AccessReviews: React.FC = () => {
  const { currentUser } = useAuth();
  const { users } = useIAM();
  const { 
    accessReviews, 
    accessReviewLogs, 
    createAccessReview, 
    reviewPermissionGap, 
    completeAccessReview, 
    getAccessReviewsByManager,
    getPermissionGapsByEnvironment 
  } = useAccessReviewManagement();
  const { regulatoryEnvironments, detectPermissionGaps } = useJobFunctionMapping();
  
  const [currentTab, setCurrentTab] = useState('federal');
  const [userGapsByEnvironment, setUserGapsByEnvironment] = useState<Record<string, Array<{ user: User; gaps: PermissionGap[] }>>>({});
  
  useEffect(() => {
    if (!currentUser) return;
    
    // Get all users managed by the current user
    const managedUsers = users.filter(user => user.manager === currentUser.id);
    
    // Generate user gaps for each environment
    const gapsByEnv: Record<string, Array<{ user: User; gaps: PermissionGap[] }>> = {};
    
    regulatoryEnvironments.forEach(env => {
      const envUsers = managedUsers.filter(user => {
        // In a real app, this would check if the user is allowed to work in this environment
        // For demo purposes, we'll include all users in all environments
        return true;
      });
      
      const envGaps = envUsers.map(user => ({
        user,
        gaps: detectPermissionGaps(user.id)
      })).filter(({ gaps }) => gaps.length > 0);
      
      gapsByEnv[env.name.toLowerCase()] = envGaps;
    });
    
    setUserGapsByEnvironment(gapsByEnv);
  }, [currentUser, users, regulatoryEnvironments, detectPermissionGaps]);
  
  const handleApproveGap = async (userId: string, gapIndex: number, approved: boolean, justification?: string) => {
    // Find the relevant access review or create one if it doesn't exist
    let review = accessReviews.find(r => 
      r.subjectId === userId && 
      r.status === 'pending' &&
      r.regulatoryEnvironment?.toLowerCase() === currentTab
    );
    
    if (!review) {
      // Create a new review if one doesn't exist
      review = await createAccessReview({
        reviewerId: currentUser?.id || '',
        subjectId: userId,
        decision: 'modify',
        status: 'pending',
        regulatoryEnvironment: currentTab,
        permissionGaps: detectPermissionGaps(userId)
      });
    }
    
    if (review) {
      // Update the specific permission gap
      await reviewPermissionGap(review.id, gapIndex, approved, justification);
      
      // Refresh the user gaps
      const updatedGaps = { ...userGapsByEnvironment };
      const userIndex = updatedGaps[currentTab]?.findIndex(item => item.user.id === userId);
      
      if (userIndex !== undefined && userIndex >= 0) {
        const updatedGapsList = [...updatedGaps[currentTab]];
        const userGaps = [...updatedGapsList[userIndex].gaps];
        userGaps[gapIndex] = { ...userGaps[gapIndex], approved, justification };
        updatedGapsList[userIndex] = { ...updatedGapsList[userIndex], gaps: userGaps };
        updatedGaps[currentTab] = updatedGapsList;
        setUserGapsByEnvironment(updatedGaps);
      }
      
      toast({
        title: "Success",
        description: `Permission ${approved ? 'approved' : 'rejected'} successfully`,
      });
    }
  };
  
  const handleCompleteReview = async (userId: string, decision: 'maintain' | 'revoke' | 'modify', comments?: string) => {
    // Find existing review or create a new one
    let review = accessReviews.find(r => 
      r.subjectId === userId && 
      r.status === 'pending' &&
      r.regulatoryEnvironment?.toLowerCase() === currentTab
    );
    
    if (!review) {
      review = await createAccessReview({
        reviewerId: currentUser?.id || '',
        subjectId: userId,
        decision,
        comments,
        status: 'pending',
        regulatoryEnvironment: currentTab,
        permissionGaps: detectPermissionGaps(userId)
      });
    } else {
      // Update the existing review
      await completeAccessReview(review.id, decision, comments);
    }
    
    // Remove the user from the current view
    const updatedGaps = { ...userGapsByEnvironment };
    updatedGaps[currentTab] = updatedGaps[currentTab]?.filter(item => item.user.id !== userId) || [];
    setUserGapsByEnvironment(updatedGaps);
    
    toast({
      title: "Success",
      description: `User access review completed with status: ${decision}`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">User Access Reviews</h2>
          <p className="text-muted-foreground">
            Review and manage user permissions and job functions.
          </p>
        </div>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ListCheck className="h-6 w-6 text-primary" />
              Access Reviews Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Pending Reviews
                  </CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {accessReviews.filter(r => r.status === 'pending').length}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Users with Permission Gaps
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {Object.values(userGapsByEnvironment).reduce((total, envGaps) => total + envGaps.length, 0)}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Permission Gaps
                  </CardTitle>
                  <Shield className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {Object.values(userGapsByEnvironment).reduce((total, envGaps) => 
                      total + envGaps.reduce((envTotal, { gaps }) => envTotal + gaps.length, 0), 0)}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Completed Reviews
                  </CardTitle>
                  <ListCheck className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {accessReviews.filter(r => r.status === 'completed').length}
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="federal" value={currentTab} onValueChange={setCurrentTab}>
          <TabsList className="grid grid-cols-4 mb-4">
            {regulatoryEnvironments.map(env => (
              <TabsTrigger key={env.id} value={env.name.toLowerCase()}>
                <div className="flex items-center gap-2">
                  <span>{env.name}</span>
                  {userGapsByEnvironment[env.name.toLowerCase()]?.length > 0 && (
                    <Badge variant="destructive" className="ml-1">
                      {userGapsByEnvironment[env.name.toLowerCase()].length}
                    </Badge>
                  )}
                </div>
              </TabsTrigger>
            ))}
          </TabsList>

          {regulatoryEnvironments.map(env => (
            <TabsContent key={env.id} value={env.name.toLowerCase()}>
              <UserAccessReviewTable
                regulatoryEnvironment={env}
                userGaps={userGapsByEnvironment[env.name.toLowerCase()] || []}
                onApproveGap={handleApproveGap}
                onCompleteReview={handleCompleteReview}
              />
            </TabsContent>
          ))}
        </Tabs>

        <AccessReviewLogTable logs={accessReviewLogs || []} />
      </div>
    </div>
  );
};

export default AccessReviews;
