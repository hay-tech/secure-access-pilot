
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, XCircle, Clock } from "lucide-react";
import { AccessReview } from '@/types/iam';

interface AccessReviewCardsProps {
  accessReviews: AccessReview[];
  totalPermissionGaps?: number;
  totalUsersWithGaps?: number;
}

const AccessReviewCards: React.FC<AccessReviewCardsProps> = ({ 
  accessReviews
}) => {
  // Calculate stats from access reviews
  const pendingReviews = accessReviews.filter(review => review.status === 'pending').length;
  const completedReviews = accessReviews.filter(review => review.status === 'completed').length;
  const overdueReviews = accessReviews.filter(review => review.status === 'overdue').length;
  
  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Completed Reviews
          </CardTitle>
          <CheckCircle className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{completedReviews}</div>
          <p className="text-xs text-muted-foreground">
            Access reviews finished
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Pending Reviews
          </CardTitle>
          <Clock className="h-4 w-4 text-amber-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{pendingReviews}</div>
          <p className="text-xs text-muted-foreground">
            {overdueReviews > 0 ? `${overdueReviews} overdue` : 'All on schedule'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccessReviewCards;
