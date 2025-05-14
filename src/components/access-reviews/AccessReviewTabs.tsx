
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { User, PermissionGap, RegulatoryEnvironment } from '@/types/iam';
import UserAccessReviewTable from './UserAccessReviewTable';

interface AccessReviewTabsProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  regulatoryEnvironments: RegulatoryEnvironment[];
  userGapsByEnvironment: Record<string, Array<{ user: User; gaps: PermissionGap[] }>>;
  onApproveGap: (userId: string, gapIndex: number, approved: boolean, justification?: string) => Promise<void>;
  onCompleteReview: (userId: string, decision: 'maintain' | 'revoke' | 'modify', comments?: string) => Promise<void>;
}

const AccessReviewTabs: React.FC<AccessReviewTabsProps> = ({
  currentTab,
  setCurrentTab,
  regulatoryEnvironments,
  userGapsByEnvironment,
  onApproveGap,
  onCompleteReview
}) => {
  return (
    <Tabs defaultValue="federal" value={currentTab} onValueChange={setCurrentTab}>
      <TabsList className="grid grid-cols-4 mb-4">
        {regulatoryEnvironments.map(env => (
          <TabsTrigger key={env.id} value={env.name.toLowerCase()}>
            <div className="flex items-center gap-2">
              <span>{env.name}</span>
              {userGapsByEnvironment[env.name.toLowerCase()]?.length > 0 && (
                <Badge variant="destructive" className="ml-1">
                  {userGapsByEnvironment[env.name.toLowerCase()].length}
                </Badge>
              )}
            </div>
          </TabsTrigger>
        ))}
      </TabsList>

      {regulatoryEnvironments.map(env => (
        <TabsContent key={env.id} value={env.name.toLowerCase()}>
          <UserAccessReviewTable
            regulatoryEnvironment={{
              id: env.id,
              name: env.name,
              description: env.description,
              complianceFrameworks: env.complianceFrameworks,
              riskLevel: env.riskLevel as "Low" | "Medium" | "High" | "Critical"
            }}
            userGaps={userGapsByEnvironment[env.name.toLowerCase()] || []}
            onApproveGap={onApproveGap}
            onCompleteReview={onCompleteReview}
          />
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default AccessReviewTabs;
