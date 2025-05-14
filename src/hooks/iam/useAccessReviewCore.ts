
import { useState } from 'react';
import { AccessReview, AccessReviewLog, PermissionGap } from '../../types/iam';
import { useIAMStore } from './useIAMStore';
import { useActivityLogging } from './useActivityLogging';
import { toast } from '@/components/ui/use-toast';

export const useAccessReviewCore = () => {
  const { accessReviews, setAccessReviews, users, setUsers } = useIAMStore();
  const { logActivity } = useActivityLogging();
  const [accessReviewLogs, setAccessReviewLogs] = useState<AccessReviewLog[]>([]);

  const updateUser = async (id: string, updates: any) => {
    const userIndex = users.findIndex(u => u.id === id);
    if (userIndex === -1) return null;
    
    const updatedUser = { ...users[userIndex], ...updates };
    const newUsers = [...users];
    newUsers[userIndex] = updatedUser;
    setUsers(newUsers);
    return updatedUser;
  };

  const createAccessReview = async (review: Omit<AccessReview, 'id' | 'createdAt'>): Promise<AccessReview> => {
    const newReview: AccessReview = {
      ...review,
      id: `review${accessReviews.length + 1}`,
      createdAt: new Date().toISOString(),
      status: (review.status as "pending" | "completed" | "overdue") || 'pending',
    };
    
    setAccessReviews(prev => [...prev, newReview]);
    
    // Log activity
    await logActivity(
      'role_change', 
      review.reviewerId, 
      `Access review created for user ${review.subjectId}: ${review.decision}`
    );
    
    // If the decision is to revoke, update the user's permissions
    if (review.decision === 'revoke') {
      const user = users.find(u => u.id === review.subjectId);
      if (user && review.roleId) {
        const updatedRoleIds = user.roleIds.filter(id => id !== review.roleId);
        await updateUser(user.id, { roleIds: updatedRoleIds });
      }
    }
    
    toast({
      title: "Success",
      description: "Access review completed successfully",
    });
    return newReview;
  };

  const updateAccessReview = async (id: string, updates: Partial<AccessReview>): Promise<AccessReview | null> => {
    const reviewIndex = accessReviews.findIndex(r => r.id === id);
    if (reviewIndex === -1) {
      toast({
        title: "Error",
        description: `Access review with ID ${id} not found`,
        variant: "destructive",
      });
      return null;
    }

    const updatedReview = { ...accessReviews[reviewIndex], ...updates };
    const newReviews = [...accessReviews];
    newReviews[reviewIndex] = updatedReview;
    setAccessReviews(newReviews);
    
    // Log activity
    await logActivity(
      'role_change',
      'system',
      `Access review updated: ${id}`
    );
    
    toast({
      title: "Success",
      description: "Access review updated successfully",
    });
    return updatedReview;
  };

  return {
    accessReviews,
    accessReviewLogs,
    setAccessReviewLogs,
    createAccessReview,
    updateAccessReview,
    updateUser
  };
};
