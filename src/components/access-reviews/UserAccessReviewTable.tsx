
import React from 'react';
import { Table, TableHeader, TableRow, TableHead, TableBody } from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { User, PermissionGap, RegulatoryEnvironment } from "@/types/iam";
import { Shield } from "lucide-react";
import UserAccessReviewRow from './UserAccessReviewRow';
import UserAccessReviewEmptyState from './UserAccessReviewEmptyState';

interface UserAccessReviewTableProps {
  regulatoryEnvironment: RegulatoryEnvironment;
  userGaps: Array<{ user: User; gaps: PermissionGap[] }>;
  onApproveGap: (userId: string, gapIndex: number, approved: boolean, justification?: string) => Promise<void>;
  onCompleteReview: (userId: string, decision: 'maintain' | 'revoke' | 'modify', comments?: string) => Promise<void>;
}

const UserAccessReviewTable: React.FC<UserAccessReviewTableProps> = ({
  regulatoryEnvironment,
  userGaps,
  onApproveGap,
  onCompleteReview
}) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-primary" />
          {regulatoryEnvironment.name} Environment Access Reviews
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Environment</TableHead>
              <TableHead>Employee Name</TableHead>
              <TableHead>Job Function</TableHead>
              <TableHead>Permission Gaps</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {userGaps.map(({ user, gaps }) => (
              <UserAccessReviewRow
                key={user.id}
                user={user}
                gaps={gaps}
                environment={regulatoryEnvironment.name}
                onApproveGap={onApproveGap}
                onCompleteReview={onCompleteReview}
              />
            ))}
            
            {userGaps.length === 0 && <UserAccessReviewEmptyState />}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default UserAccessReviewTable;
