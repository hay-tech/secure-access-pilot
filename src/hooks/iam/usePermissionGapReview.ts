
import { AccessReview, PermissionGap, AccessReviewLog } from '../../types/iam';
import { useActivityLogging } from './useActivityLogging';
import { useAccessReviewCore } from './useAccessReviewCore';
import { toast } from '@/components/ui/use-toast';
import { useIAMStore } from './useIAMStore';
import { v4 as uuidv4 } from 'uuid';

export const usePermissionGapReview = () => {
  const { accessReviews, setAccessReviews, users, setAccessReviewLogs } = useIAMStore();
  const { updateUser } = useAccessReviewCore();
  const { logActivity } = useActivityLogging();

  /**
   * Finds a permission gap review by ID and index
   */
  const findReviewAndGap = (
    reviewId: string, 
    gapIndex: number
  ): { reviewIndex: number; review: AccessReview | null; permissionGaps: PermissionGap[] | null } => {
    const reviewIndex = accessReviews.findIndex(r => r.id === reviewId);
    
    if (reviewIndex === -1 || !accessReviews[reviewIndex].permissionGaps) {
      return { reviewIndex: -1, review: null, permissionGaps: null };
    }
    
    const review = { ...accessReviews[reviewIndex] };
    const permissionGaps = [...(review.permissionGaps || [])];
    
    if (gapIndex < 0 || gapIndex >= permissionGaps.length) {
      return { reviewIndex, review, permissionGaps: null };
    }
    
    return { reviewIndex, review, permissionGaps };
  };

  /**
   * Updates the permission gap in the review
   */
  const updatePermissionGapInReview = (
    reviewIndex: number,
    updatedReview: AccessReview
  ): void => {
    const newReviews = [...accessReviews];
    newReviews[reviewIndex] = updatedReview;
    setAccessReviews(newReviews);
  };

  /**
   * Updates user permissions based on the approved permission gap
   */
  const applyPermissionChange = async (gap: PermissionGap): Promise<void> => {
    const user = users.find(u => u.id === gap.userId);
    
    if (!user) return;
    
    if (gap.gapType === 'missing' && gap.roleId) {
      // Add the missing role
      await updateUser(user.id, { roleIds: [...user.roleIds, gap.roleId] });
    } else if (gap.gapType === 'excess' && gap.roleId) {
      // Remove excess permission by removing the role
      await updateUser(user.id, { roleIds: user.roleIds.filter(id => id !== gap.roleId) });
    }
  };

  /**
   * Creates a new access review log entry
   */
  const createAccessReviewLog = (
    review: AccessReview,
    gapIndex: number,
    approved: boolean,
    justification?: string
  ): AccessReviewLog => {
    if (!review.permissionGaps) return {} as AccessReviewLog;

    const gap = review.permissionGaps[gapIndex];
    const user = users.find(u => u.id === gap.userId);
    const jobFunctions = user?.jobFunctions || [user?.jobFunction || 'Unknown'];
    
    const newLog: AccessReviewLog = {
      id: uuidv4(),
      reviewId: review.id,
      approverId: review.reviewerId,
      approvedUserId: gap.userId,
      environment: review.regulatoryEnvironment || 'Federal',
      jobFunctions,
      permissionsGranted: approved ? (gap.gapType === 'missing' ? ['Added: ' + gap.description] : []) : 
                                     (gap.gapType === 'excess' ? ['Removed: ' + gap.description] : []),
      groupsMembership: [],
      timestamp: new Date().toISOString(),
      decision: approved ? 'maintain' : 'revoke',
      justification
    };

    return newLog;
  };

  /**
   * Logs the permission gap review activity and creates a review log
   */
  const logPermissionReview = async (
    review: AccessReview,
    gapIndex: number,
    approved: boolean,
    justification?: string
  ): Promise<void> => {
    if (!review.permissionGaps) return;
    
    // Log system activity
    await logActivity(
      'permission_change',
      review.reviewerId,
      `Permission gap ${approved ? 'approved' : 'rejected'} for user ${review.subjectId}: ${review.permissionGaps[gapIndex].description}`
    );
    
    // Create access review log
    const newLog = createAccessReviewLog(review, gapIndex, approved, justification);
    setAccessReviewLogs(prev => [newLog, ...(prev || [])]);
    
    toast({
      description: `Permission ${approved ? 'approved' : 'rejected'} successfully`,
    });
  };

  /**
   * Reviews a specific permission gap and updates the system accordingly
   */
  const reviewPermissionGap = async (
    reviewId: string, 
    gapIndex: number, 
    approved: boolean, 
    justification?: string
  ): Promise<AccessReview | null> => {
    const { reviewIndex, review, permissionGaps } = findReviewAndGap(reviewId, gapIndex);
    
    if (!review || !permissionGaps) return null;
    
    // Update the specific permission gap with the decision
    permissionGaps[gapIndex] = {
      ...permissionGaps[gapIndex],
      approved,
      justification
    };
    
    const updatedReview = { ...review, permissionGaps };
    
    // Update the reviews in the store
    updatePermissionGapInReview(reviewIndex, updatedReview);
    
    // If approved, update the user's permissions
    if (approved) {
      await applyPermissionChange(permissionGaps[gapIndex]);
    }
    
    // Log the activity and create review log
    await logPermissionReview(updatedReview, gapIndex, approved, justification);
    
    return updatedReview;
  };

  return {
    reviewPermissionGap
  };
};
