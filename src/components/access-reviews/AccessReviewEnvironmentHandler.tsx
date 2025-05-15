
import React from 'react';
import { usePermissionGapReview } from '@/hooks/iam/usePermissionGapReview';
import { useIAMStore } from '@/hooks/iam/useIAMStore';
import { useAccessReviewManagement } from '@/hooks/iam/useAccessReviewManagement';
import { useAccessReviewCompletion } from '@/hooks/iam/useAccessReviewCompletion';
import AccessReviewTabs from './AccessReviewTabs';
import { jobFunctionDefinitions } from '@/data/mockJobFunctions';

interface AccessReviewEnvironmentHandlerProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

const AccessReviewEnvironmentHandler: React.FC<AccessReviewEnvironmentHandlerProps> = ({
  currentTab,
  setCurrentTab
}) => {
  const { users, accessReviews } = useIAMStore();
  const { getPermissionGapsByEnvironment } = useAccessReviewManagement();
  const { reviewPermissionGap } = usePermissionGapReview();
  const { completeAccessReview } = useAccessReviewCompletion();
  
  // Define regulatory environments
  const regulatoryEnvironments = [
    {
      id: 'federal',
      name: 'Federal',
      description: 'Federal government compliance requirements',
      complianceFrameworks: ['FedRAMP', 'FISMA'],
      riskLevel: 'High' as const
    },
    {
      id: 'commercial',
      name: 'Commercial',
      description: 'Commercial sector compliance requirements',
      complianceFrameworks: ['SOC2', 'ISO27001'],
      riskLevel: 'Medium' as const
    },
    {
      id: 'healthcare',
      name: 'Healthcare',
      description: 'Healthcare industry compliance requirements',
      complianceFrameworks: ['HIPAA', 'HITRUST'],
      riskLevel: 'Critical' as const
    },
    {
      id: 'financial',
      name: 'Financial',
      description: 'Financial industry compliance requirements',
      complianceFrameworks: ['PCI-DSS', 'SOX'],
      riskLevel: 'High' as const
    }
  ];

  // Get job function name by id
  const getJobFunctionName = (id?: string) => {
    if (!id) return 'Unknown';
    const jobFunction = jobFunctionDefinitions.find(jf => jf.id === id);
    return jobFunction ? jobFunction.title : id;
  };
  
  // Enhanced gaps by environment with actual and approved job functions
  const userGapsByEnvironment = Object.fromEntries(
    regulatoryEnvironments.map(env => {
      const envKey = env.name.toLowerCase();
      const gaps = getPermissionGapsByEnvironment(envKey);
      
      // Enhance the gaps with actual and approved job functions
      const enhancedGaps = gaps.map(({ user, gaps }) => ({
        user,
        gaps: gaps.map(gap => {
          const actualUserData = users.find(u => u.id === gap.userId);
          
          // Find actual job function for user
          let actualJobFunction = 'Unknown';
          if (actualUserData?.jobFunction) {
            actualJobFunction = getJobFunctionName(actualUserData.jobFunction);
          }
          
          // For missing permissions, find the approved job function
          let approvedJobFunction;
          if (gap.gapType === 'missing' && gap.roleId) {
            // In a real application, you would look up the job function associated with the role
            // Here we'll simulate it by using a different job function
            approvedJobFunction = gap.description.includes('Administrator') ? 
              'Cloud Platform Administrator' : 
              'Cloud Platform Contributor';
          } else if (gap.gapType === 'excess') {
            // For excess permissions, the approved is less than actual
            approvedJobFunction = gap.description.includes('Administrator') ? 
              'Cloud Platform Contributor' : 
              'Cloud Platform Reader';
          }
          
          return {
            ...gap,
            actualJobFunction,
            approvedJobFunction: getJobFunctionName(approvedJobFunction)
          };
        })
      }));
      
      return [envKey, enhancedGaps];
    })
  );
  
  // Calculate total users with gaps and total permission gaps
  const totalUsersWithGaps = Object.values(userGapsByEnvironment).reduce(
    (total, envGaps) => total + envGaps.length, 0
  );
  
  const totalPermissionGaps = Object.values(userGapsByEnvironment).reduce(
    (total, envGaps) => total + envGaps.reduce((sum, { gaps }) => sum + gaps.length, 0), 0
  );

  // Create wrapper functions to match the expected function signatures
  const handleApproveGap = async (userId: string, gapIndex: number, approved: boolean, justification?: string): Promise<void> => {
    // Find the reviewId for this user
    const review = accessReviews.find(r => r.subjectId === userId);
    if (review) {
      await reviewPermissionGap(review.id, gapIndex, approved, justification);
    }
  };

  const handleCompleteReview = async (userId: string, decision: 'maintain' | 'revoke' | 'modify', comments?: string): Promise<void> => {
    // Find the reviewId for this user
    const review = accessReviews.find(r => r.subjectId === userId);
    if (review) {
      await completeAccessReview(review.id, decision, comments);
    }
  };
  
  return (
    <AccessReviewTabs
      currentTab={currentTab}
      setCurrentTab={setCurrentTab}
      regulatoryEnvironments={regulatoryEnvironments}
      userGapsByEnvironment={userGapsByEnvironment}
      onApproveGap={handleApproveGap}
      onCompleteReview={handleCompleteReview}
      totalUsersWithGaps={totalUsersWithGaps}
      totalPermissionGaps={totalPermissionGaps}
    />
  );
};

export default AccessReviewEnvironmentHandler;
