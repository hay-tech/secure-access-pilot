import { useState } from 'react';
import { AccessReview, AuditLog, PermissionGap, AccessReviewLog, User, JobFunction } from '../../types/iam';
import { toast } from '@/components/ui/use-toast';
import { useIAMStore } from './useIAMStore';
import { useJobFunctionMapping } from './useJobFunctionMapping';

export const useAccessReviewManagement = () => {
  const { 
    accessReviews, 
    setAccessReviews, 
    users, 
    setUsers, 
    auditLogs, 
    setAuditLogs,
    roles 
  } = useIAMStore();
  
  const { detectPermissionGaps } = useJobFunctionMapping();
  
  const [accessReviewLogs, setAccessReviewLogs] = useState<AccessReviewLog[]>([]);

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
      status: (review.status as "pending" | "completed" | "overdue") || 'pending',
    };
    
    // Detect permission gaps if not provided
    if (!newReview.permissionGaps) {
      newReview.permissionGaps = detectPermissionGaps(newReview.subjectId);
    }
    
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
        const jobFunction = user.jobFunction as JobFunction;
        const { getEnvironmentsForJobFunction } = useJobFunctionMapping();
        const allowedEnvironments = getEnvironmentsForJobFunction(jobFunction);
        return allowedEnvironments.includes(environment);
      })
      .map(user => {
        const gaps = detectPermissionGaps(user.id);
        return { user, gaps };
      })
      .filter(({ gaps }) => gaps.length > 0);
  };

  const getUserRoles = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (!user) return [];
    
    return roles.filter(role => user.roleIds.includes(role.id));
  };

  const getUserPermissions = (userId: string) => {
    const userRoles = getUserRoles(userId);
    const permissionSet = new Set<string>();
    const userPermissions = [];
    
    userRoles.forEach(role => {
      role.permissions.forEach(permission => {
        if (!permissionSet.has(permission.id)) {
          permissionSet.add(permission.id);
          userPermissions.push(permission);
        }
      });
    });
    
    return userPermissions;
  };

  return {
    accessReviews,
    accessReviewLogs,
    createAccessReview,
    updateAccessReview,
    reviewPermissionGap,
    completeAccessReview,
    getAccessReviewsByManager,
    getPermissionGapsByEnvironment
  };
};
