
import { AccessReview, PermissionGap, User, JobFunction } from '../../types/iam';
import { useAccessReviewCore } from './useAccessReviewCore';
import { usePermissionGapReview } from './usePermissionGapReview';
import { useAccessReviewCompletion } from './useAccessReviewCompletion';
import { useJobFunctionMapping } from './useJobFunctionMapping';
import { useIAMStore } from './useIAMStore';

export const useAccessReviewManagement = () => {
  const { users } = useIAMStore();
  const { detectPermissionGaps } = useJobFunctionMapping();
  
  const { 
    accessReviews, 
    accessReviewLogs,
    createAccessReview, 
    updateAccessReview 
  } = useAccessReviewCore();
  
  const { reviewPermissionGap } = usePermissionGapReview();
  const { completeAccessReview } = useAccessReviewCompletion();
  
  const getAccessReviewsByManager = (managerId: string): AccessReview[] => {
    // Get all users that this manager is responsible for
    const managedUsers = users.filter(u => u.manager === managerId);
    
    // Get all reviews for these users
    return accessReviews.filter(review => 
      managedUsers.some(user => user.id === review.subjectId) && 
      review.status !== 'completed'
    );
  };

  const getPermissionGapsByEnvironment = (environment: string): { user: User, gaps: PermissionGap[] }[] => {
    return users
      .filter(user => {
        // Check if the user has a jobFunction that matches the environment
        if (!user.jobFunction) return false;
        
        // In the updated version, we don't filter by environment restrictions
        // Instead, we assume users can be assigned to any environment based on CSP settings
        return true;
      })
      .map(user => {
        const gaps = detectPermissionGaps(user.id);
        return { user, gaps };
      })
      .filter(({ gaps }) => gaps.length > 0);
  };
  
  const getUsersByCSP = (csp: string, subtype?: string): User[] => {
    return users.filter(user => {
      if (!user.csp) return false;
      if (user.csp !== csp) return false;
      if (subtype && user.cspSubtype !== subtype) return false;
      return true;
    });
  };

  return {
    accessReviews,
    accessReviewLogs,
    createAccessReview,
    updateAccessReview,
    reviewPermissionGap,
    completeAccessReview,
    getAccessReviewsByManager,
    getPermissionGapsByEnvironment,
    getUsersByCSP
  };
};
