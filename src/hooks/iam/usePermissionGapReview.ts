
import { AccessReview, PermissionGap } from '../../types/iam';
import { useActivityLogging } from './useActivityLogging';
import { useAccessReviewCore } from './useAccessReviewCore';
import { toast } from '@/components/ui/use-toast';
import { useIAMStore } from './useIAMStore';

export const usePermissionGapReview = () => {
  const { accessReviews, setAccessReviews } = useIAMStore();
  const { updateUser } = useAccessReviewCore();
  const { logActivity } = useActivityLogging();

  const reviewPermissionGap = async (
    reviewId: string, 
    gapIndex: number, 
    approved: boolean, 
    justification?: string
  ): Promise<AccessReview | null> => {
    const reviewIndex = accessReviews.findIndex(r => r.id === reviewId);
    if (reviewIndex === -1 || !accessReviews[reviewIndex].permissionGaps) return null;
    
    const review = { ...accessReviews[reviewIndex] };
    const permissionGaps = [...(review.permissionGaps || [])];
    
    if (gapIndex >= 0 && gapIndex < permissionGaps.length) {
      permissionGaps[gapIndex] = {
        ...permissionGaps[gapIndex],
        approved,
        justification
      };
      
      const updatedReview = { ...review, permissionGaps };
      const newReviews = [...accessReviews];
      newReviews[reviewIndex] = updatedReview;
      setAccessReviews(newReviews);
      
      // Update user's roles/permissions based on review decision if approved
      if (approved) {
        const gap = permissionGaps[gapIndex];
        const { users } = useIAMStore();
        const user = users.find(u => u.id === gap.userId);
        
        if (user && gap.gapType === 'missing' && gap.roleId) {
          // Add the missing role
          await updateUser(user.id, { roleIds: [...user.roleIds, gap.roleId] });
        } else if (user && gap.gapType === 'excess' && gap.roleId) {
          // Remove excess permission by removing the role
          await updateUser(user.id, { roleIds: user.roleIds.filter(id => id !== gap.roleId) });
        }
      }
      
      // Log this permission gap review
      await logActivity(
        'permission_change',
        review.reviewerId,
        `Permission gap ${approved ? 'approved' : 'rejected'} for user ${review.subjectId}: ${permissionGaps[gapIndex].description}`
      );
      
      toast({
        title: "Success",
        description: `Permission ${approved ? 'approved' : 'rejected'} successfully`,
      });
      
      return updatedReview;
    }
    
    return null;
  };

  return {
    reviewPermissionGap
  };
};
