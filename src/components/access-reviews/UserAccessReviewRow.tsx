
import React, { useState } from 'react';
import { TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { User, PermissionGap } from "@/types/iam";
import { Check, X, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import PermissionGapItem from './PermissionGapItem';

interface UserAccessReviewRowProps {
  user: User;
  gaps: PermissionGap[];
  onApproveGap: (userId: string, gapIndex: number, approved: boolean, justification?: string) => Promise<void>;
  onCompleteReview: (userId: string, decision: 'maintain' | 'revoke' | 'modify', comments?: string) => Promise<void>;
}

const UserAccessReviewRow: React.FC<UserAccessReviewRowProps> = ({
  user,
  gaps,
  onApproveGap,
  onCompleteReview
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const hasCriticalGaps = gaps.some(g => g.severity === 'Critical' || g.severity === 'High');

  return (
    <React.Fragment>
      <TableRow className="cursor-pointer hover:bg-muted/50" onClick={handleToggleExpand}>
        <TableCell>
          {user.firstName} {user.lastName}
        </TableCell>
        <TableCell>
          <div className="flex items-center gap-2">
            {user.jobFunction || 'Not assigned'}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-5 w-5 rounded-full p-0">
                  <Info className="h-4 w-4" />
                  <span className="sr-only">Job function info</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent className="max-w-md">
                <p className="font-semibold">Allowed Actions:</p>
                <ul className="list-disc pl-5 text-xs mt-1">
                  <li>Read IAM users and roles</li>
                  <li>Approve access requests</li>
                  <li>Review permissions</li>
                </ul>
              </TooltipContent>
            </Tooltip>
          </div>
        </TableCell>
        <TableCell>
          {user.roleIds.length} roles assigned
        </TableCell>
        <TableCell>
          <div className="flex items-center space-x-1">
            <span className="font-medium">{gaps.length}</span>
            <span className="text-muted-foreground">issues found</span>
            {hasCriticalGaps && (
              <span className="ml-2 rounded-full bg-destructive px-1.5 py-0.5 text-xs text-destructive-foreground">
                High Risk
              </span>
            )}
          </div>
        </TableCell>
        <TableCell>
          <div className="flex space-x-2">
            <div>
              <Button
                size="sm"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  onCompleteReview(user.id, 'maintain', 'Job function still valid');
                }}
              >
                <Check className="mr-1 h-4 w-4" />
                Approve Job Function
              </Button>
            </div>
            <div>
              <Button
                size="sm"
                variant="destructive"
                onClick={(e) => {
                  e.stopPropagation();
                  onCompleteReview(user.id, 'revoke', 'Job function no longer valid');
                }}
              >
                <X className="mr-1 h-4 w-4" />
                Reject Job Function
              </Button>
            </div>
          </div>
        </TableCell>
      </TableRow>
      
      {isExpanded && (
        <TableRow>
          <TableCell colSpan={5} className="p-0">
            <div className="bg-muted/30 p-4">
              <h4 className="font-medium mb-2">Permission Gaps Details</h4>
              
              {gaps.map((gap, index) => (
                <PermissionGapItem 
                  key={index}
                  gap={gap}
                  index={index}
                  userId={user.id}
                  onApproveGap={onApproveGap}
                />
              ))}
            </div>
          </TableCell>
        </TableRow>
      )}
    </React.Fragment>
  );
};

export default UserAccessReviewRow;
