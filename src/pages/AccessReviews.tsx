
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useIAM } from '@/contexts/IAMContext';
import { useAccessReviewManagement } from '@/hooks/iam/useAccessReviewManagement';
import { useJobFunctionMapping } from '@/hooks/iam/useJobFunctionMapping';
import AccessReviewLogTable from '@/components/access-reviews/AccessReviewLogTable';
import { User, PermissionGap } from '@/types/iam';
import { toast } from "@/components/ui/use-toast";
import AccessReviewCards from '@/components/access-reviews/AccessReviewCards';
import AccessReviewTabs from '@/components/access-reviews/AccessReviewTabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie } from 'recharts';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

const AccessReviews: React.FC = () => {
  const { currentUser } = useAuth();
  const { users } = useIAM();
  const { 
    accessReviews, 
    accessReviewLogs, 
    createAccessReview, 
    reviewPermissionGap, 
    completeAccessReview, 
    getAccessReviewsByManager,
    getPermissionGapsByEnvironment 
  } = useAccessReviewManagement();
  const { regulatoryEnvironments, detectPermissionGaps } = useJobFunctionMapping();
  
  // Fix type casting for regulatoryEnvironments
  const typedRegulatoryEnvironments = regulatoryEnvironments.map(env => ({
    ...env,
    riskLevel: env.riskLevel as "Low" | "Medium" | "High" | "Critical"
  }));
  
  const [currentTab, setCurrentTab] = useState('federal');
  const [userGapsByEnvironment, setUserGapsByEnvironment] = useState<Record<string, Array<{ user: User; gaps: PermissionGap[] }>>>({});
  
  // Generate mock data for charts
  const accessComplianceData = [
    { name: 'Federal', compliant: 89, noncompliant: 11 },
    { name: 'CJIS', compliant: 95, noncompliant: 5 },
    { name: 'CCCS', compliant: 92, noncompliant: 8 },
    { name: 'Commercial (US)', compliant: 87, noncompliant: 13 },
    { name: 'Commercial (UK)', compliant: 91, noncompliant: 9 },
    { name: 'Commercial (AU)', compliant: 94, noncompliant: 6 },
  ];
  
  // Review status data by manager
  const reviewStatusByManagerData = [
    { name: 'John Smith', completed: 12, pending: 3, inProgress: 2 },
    { name: 'Sarah Johnson', completed: 8, pending: 5, inProgress: 1 },
    { name: 'Michael Chen', completed: 15, pending: 0, inProgress: 0 },
    { name: 'Anita Patel', completed: 6, pending: 8, inProgress: 4 },
    { name: 'David Wilson', completed: 10, pending: 2, inProgress: 1 },
  ];
  
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

  // Calculate total metrics for cards
  const totalUsersWithGaps = Object.values(userGapsByEnvironment).reduce(
    (total, envGaps) => total + envGaps.length, 0
  );
  
  const totalPermissionGaps = Object.values(userGapsByEnvironment).reduce(
    (total, envGaps) => total + envGaps.reduce(
      (envTotal, { gaps }) => envTotal + gaps.length, 0
    ), 0
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">User Access Reviews & Validation</h2>
          <p className="text-muted-foreground">
            Review and manage user permissions and job functions.
          </p>
        </div>
      </div>

      <div className="grid gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Access Compliance Overview Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Access Compliance Overview</CardTitle>
              <CardDescription>
                Compliance status across environments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={accessComplianceData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="compliant" name="Compliant %" stackId="a" fill="#4ade80" />
                    <Bar dataKey="noncompliant" name="Non-compliant %" stackId="a" fill="#f87171" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          {/* Access Reviews Status Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Access Reviews Status by Manager</CardTitle>
              <CardDescription>
                Completed vs. Pending vs. In-Progress reviews
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={reviewStatusByManagerData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="completed" name="Completed" fill="#4ade80" />
                    <Bar dataKey="pending" name="Pending" fill="#fbbf24" />
                    <Bar dataKey="inProgress" name="In-Progress" fill="#60a5fa" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <AccessReviewCards 
          accessReviews={accessReviews}
          totalPermissionGaps={totalPermissionGaps}
          totalUsersWithGaps={totalUsersWithGaps}
        />

        <AccessReviewTabs
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          regulatoryEnvironments={typedRegulatoryEnvironments}
          userGapsByEnvironment={userGapsByEnvironment}
          onApproveGap={handleApproveGap}
          onCompleteReview={handleCompleteReview}
        />

        <AccessReviewLogTable logs={accessReviewLogs || []} />
      </div>
    </div>
  );
};

export default AccessReviews;
