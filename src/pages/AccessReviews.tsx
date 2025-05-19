
import React, { useState } from 'react';
import { useAccessReviewManagement } from '@/hooks/iam/useAccessReviewManagement';
import AccessReviewLogTable from '@/components/access-reviews/AccessReviewLogTable';
import AccessReviewCards from '@/components/access-reviews/AccessReviewCards';
import AccessReviewCharts from '@/components/access-reviews/AccessReviewCharts';
import AccessReviewEnvironmentHandler from '@/components/access-reviews/AccessReviewEnvironmentHandler';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Database } from "lucide-react";

const AccessReviews: React.FC = () => {
  const { accessReviewLogs, accessReviews } = useAccessReviewManagement();
  const [currentTab, setCurrentTab] = useState('federal');
  
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
        <AccessReviewCharts />
        
        <AccessReviewCards 
          accessReviews={accessReviews}
          totalPermissionGaps={0} 
          totalUsersWithGaps={0}
        />

        <AccessReviewEnvironmentHandler 
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
        />

        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <Database className="h-6 w-6 text-primary" />
            <CardTitle>Accountability Database Example</CardTitle>
          </CardHeader>
          <CardContent>
            <AccessReviewLogTable logs={accessReviewLogs || []} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AccessReviews;
