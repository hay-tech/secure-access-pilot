
import { AccessReview, AuditLog } from '../../types/iam';
import { toast } from 'sonner';
import { useIAMStore } from './useIAMStore';

export const useAccessReviewManagement = () => {
  const { accessReviews, setAccessReviews, users, setUsers, auditLogs, setAuditLogs } = useIAMStore();

  const logActivity = async (eventType: AuditLog['eventType'], userId: string, details: string) => {
    const newLog: AuditLog = {
      id: `log${auditLogs.length + 1}`,
      eventType,
      userId,
      details,
      ipAddress: '127.0.0.1',
      timestamp: new Date().toISOString(),
    };
    setAuditLogs(prev => [newLog, ...prev]);
    return newLog;
  };
  
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
    
    toast.success(`Access review completed successfully`);
    return newReview;
  };

  return {
    accessReviews,
    createAccessReview
  };
};
