
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface ProgressItem {
  label: string;
  value: number;
}

interface AccessReviewProgressProps {
  progressItems: ProgressItem[];
}

const AccessReviewProgress: React.FC<AccessReviewProgressProps> = ({ progressItems }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Access Review Progress</CardTitle>
        <CardDescription>Status of current access review cycle</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {progressItems.map((item, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{item.label}</span>
                <span className="text-sm text-muted-foreground">{item.value}%</span>
              </div>
              <Progress value={item.value} className="h-2" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AccessReviewProgress;
