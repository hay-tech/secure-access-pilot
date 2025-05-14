
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useIAM } from '@/contexts/IAMContext';
import { useAccessReviewManagement } from '@/hooks/iam/useAccessReviewManagement';
import { useJobFunctionMapping } from '@/hooks/iam/useJobFunctionMapping';
import AccessReviewLogTable from '@/components/access-reviews/AccessReviewLogTable';
import { User, PermissionGap } from '@/types/iam';
import { toast } from "@/components/ui/use-toast";
import AccessReviewCards from '@/components/access-reviews/AccessReviewCards';
import AccessReviewTabs from '@/components/access-reviews/AccessReviewTabs';

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

  // Calculate total metrics for cards
  const totalUsersWithGaps = Object.values(userGapsByEnvironment).reduce(
    (total, envGaps) => total + envGaps.length, 0
  );
  
  const totalPermissionGaps = Object.values(userGapsByEnvironment).reduce(
    (total, envGaps) => total + envGaps.reduce(
      (envTotal, { gaps }) => envTotal + gaps.length, 0
    ), 0
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
        <AccessReviewCards 
          accessReviews={accessReviews}
          totalPermissionGaps={totalPermissionGaps}
          totalUsersWithGaps={totalUsersWithGaps}
        />

        <AccessReviewTabs
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          regulatoryEnvironments={regulatoryEnvironments}
          userGapsByEnvironment={userGapsByEnvironment}
          onApproveGap={handleApproveGap}
          onCompleteReview={handleCompleteReview}
        />

        <AccessReviewLogTable logs={accessReviewLogs || []} />
      </div>
    </div>
  );
};

export default AccessReviews;
