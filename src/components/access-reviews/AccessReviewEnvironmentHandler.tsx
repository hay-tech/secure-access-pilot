
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useIAM } from '@/contexts/IAMContext';
import { useAccessReviewManagement } from '@/hooks/iam/useAccessReviewManagement';
import { useJobFunctionMapping } from '@/hooks/iam/useJobFunctionMapping';
import { User, PermissionGap } from '@/types/iam';
import { toast } from "@/components/ui/use-toast";
import AccessReviewTabs from './AccessReviewTabs';

interface AccessReviewEnvironmentHandlerProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

const AccessReviewEnvironmentHandler: React.FC<AccessReviewEnvironmentHandlerProps> = ({ 
  currentTab, 
  setCurrentTab 
}) => {
  const { currentUser } = useAuth();
  const { users } = useIAM();
  const { 
    accessReviews, 
    createAccessReview, 
    reviewPermissionGap, 
    completeAccessReview,
    getPermissionGapsByEnvironment 
  } = useAccessReviewManagement();
  const { regulatoryEnvironments, detectPermissionGaps } = useJobFunctionMapping();
  
  // Fix type casting for regulatoryEnvironments
  const typedRegulatoryEnvironments = regulatoryEnvironments.map(env => ({
    ...env,
    riskLevel: env.riskLevel as "Low" | "Medium" | "High" | "Critical"
  }));
  
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
        updatedAt: new Date().toISOString(), // Add the updatedAt field
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
        updatedAt: new Date().toISOString(), // Add the updatedAt field
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
      description: `User access review completed with status: ${decision}`,
    });
  };

  // Calculate total metrics for downstream components
  const totalUsersWithGaps = Object.values(userGapsByEnvironment).reduce(
    (total, envGaps) => total + envGaps.length, 0
  );
  
  const totalPermissionGaps = Object.values(userGapsByEnvironment).reduce(
    (total, envGaps) => total + envGaps.reduce(
      (envTotal, { gaps }) => envTotal + gaps.length, 0
    ), 0
  );

  return (
    <AccessReviewTabs
      currentTab={currentTab}
      setCurrentTab={setCurrentTab}
      regulatoryEnvironments={typedRegulatoryEnvironments}
      userGapsByEnvironment={userGapsByEnvironment}
      onApproveGap={handleApproveGap}
      onCompleteReview={handleCompleteReview}
      totalUsersWithGaps={totalUsersWithGaps}
      totalPermissionGaps={totalPermissionGaps}
    />
  );
};

export default AccessReviewEnvironmentHandler;
