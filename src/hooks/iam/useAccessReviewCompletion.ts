
import { AccessReview, AccessReviewLog, User, JobFunction } from '../../types/iam';
import { useAccessReviewCore } from './useAccessReviewCore';
import { useActivityLogging } from './useActivityLogging';
import { useUserPermissions } from './useUserPermissions';
import { useIAMStore } from './useIAMStore';
import { toast } from '@/components/ui/use-toast';

export const useAccessReviewCompletion = () => {
  const { accessReviews, setAccessReviews, users } = useIAMStore();
  const { accessReviewLogs, setAccessReviewLogs, updateUser } = useAccessReviewCore();
  const { logActivity } = useActivityLogging();
  const { getUserRoles, getUserPermissions } = useUserPermissions();

  const completeAccessReview = async (
    reviewId: string, 
    decision: 'maintain' | 'revoke' | 'modify', 
    comments?: string
  ): Promise<AccessReview | null> => {
    const reviewIndex = accessReviews.findIndex(r => r.id === reviewId);
    if (reviewIndex === -1) return null;
    
    const review = accessReviews[reviewIndex];
    const updatedReview: AccessReview = { 
      ...review, 
      decision, 
      comments, 
      status: 'completed' as const 
    };
    
    const newReviews = [...accessReviews];
    newReviews[reviewIndex] = updatedReview;
    setAccessReviews(newReviews);
    
    // Create accountability log
    const user = users.find(u => u.id === review.subjectId);
    const reviewer = users.find(u => u.id === review.reviewerId);
    
    if (user && reviewer) {
      const userRoles = getUserRoles(user.id);
      const permissionsGranted = getUserPermissions(user.id).map(p => `${p.resource}:${p.action}`);
      
      const newLog: AccessReviewLog = {
        id: `arlog${accessReviewLogs.length + 1}`,
        reviewId,
        approverId: reviewer.id,
        approvedUserId: user.id,
        environment: review.regulatoryEnvironment || 'Commercial',
        jobFunctions: [user.jobFunction || 'Unknown'],
        permissionsGranted,
        groupsMembership: userRoles.map(r => r.name),
        timestamp: new Date().toISOString(),
        decision,
        justification: comments
      };
      
      setAccessReviewLogs(prev => [...prev, newLog]);
    }
    
    // Log activity
    await logActivity(
      'role_change',
      review.reviewerId,
      `Access review completed for user ${review.subjectId} with decision: ${decision}`
    );
    
    // If the decision is to revoke, update the user's permissions
    if (decision === 'revoke' && review.roleId) {
      const user = users.find(u => u.id === review.subjectId);
      if (user) {
        const updatedRoleIds = user.roleIds.filter(id => id !== review.roleId);
        await updateUser(user.id, { roleIds: updatedRoleIds });
      }
    }
    
    toast({
      title: "Success",
      description: "Access review completed successfully",
    });
    
    return updatedReview;
  };

  return {
    completeAccessReview
  };
};
