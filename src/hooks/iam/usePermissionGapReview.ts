
import { AccessReview, PermissionGap } from '../../types/iam';
import { useActivityLogging } from './useActivityLogging';
import { useAccessReviewCore } from './useAccessReviewCore';
import { toast } from '@/components/ui/use-toast';
import { useIAMStore } from './useIAMStore';

export const usePermissionGapReview = () => {
  const { accessReviews, setAccessReviews, users } = useIAMStore();
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
   * Logs the permission gap review activity
   */
  const logPermissionReview = async (
    review: AccessReview,
    gapIndex: number,
    approved: boolean
  ): Promise<void> => {
    if (!review.permissionGaps) return;
    
    await logActivity(
      'permission_change',
      review.reviewerId,
      `Permission gap ${approved ? 'approved' : 'rejected'} for user ${review.subjectId}: ${review.permissionGaps[gapIndex].description}`
    );
    
    toast({
      title: "Success",
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
    
    // Log the activity
    await logPermissionReview(updatedReview, gapIndex, approved);
    
    return updatedReview;
  };

  return {
    reviewPermissionGap
  };
};
