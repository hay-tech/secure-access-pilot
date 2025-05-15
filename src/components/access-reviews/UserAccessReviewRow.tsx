
import React, { useState } from 'react';
import { TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { User, PermissionGap } from "@/types/iam";
import { Check, X, Info, ChevronDown, ChevronUp } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
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

  // Get CSP details from user if available
  const csp = user.csp || "Azure";
  const cspSubtype = user.cspSubtype || "Commercial";
  const securityLevel = user.securityLevel || "NIST 800-53 Moderate";

  const hasCriticalGaps = gaps.some(g => g.severity === 'Critical' || g.severity === 'High');

  return (
    <React.Fragment>
      <TableRow className="cursor-pointer hover:bg-muted/50" onClick={handleToggleExpand}>
        <TableCell>
          <div className="flex items-center gap-2">
            {user.firstName} {user.lastName}
            {isExpanded ? (
              <ChevronUp className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            )}
          </div>
        </TableCell>
        <TableCell>
          <div className="flex items-center gap-2">
            {user.jobFunction || 'Not assigned'}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-5 w-5 rounded-full p-0">
                  <Info className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="max-w-md">
                <p className="font-semibold">Job Function: {user.jobFunction}</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </TableCell>
        <TableCell>{csp}</TableCell>
        <TableCell>{cspSubtype}</TableCell>
        <TableCell>{securityLevel}</TableCell>
        <TableCell>
          <div className="flex items-center space-x-1">
            <span className="font-medium">{gaps.length}</span>
            <span className="text-muted-foreground">issues found</span>
            {hasCriticalGaps && (
              <Badge variant="destructive" className="ml-2">
                High Risk
              </Badge>
            )}
          </div>
        </TableCell>
        <TableCell>
          <div className="flex space-x-2">
            <Button
              size="sm"
              variant="outline"
              className="bg-green-50 text-green-700 hover:bg-green-100 hover:text-green-800 border-green-200"
              onClick={(e) => {
                e.stopPropagation();
                onCompleteReview(user.id, 'maintain', 'Job function still valid');
              }}
            >
              <Check className="mr-1 h-4 w-4" />
              Approve
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="bg-red-50 text-red-700 hover:bg-red-100 hover:text-red-800 border-red-200"
              onClick={(e) => {
                e.stopPropagation();
                onCompleteReview(user.id, 'revoke', 'Job function no longer valid');
              }}
            >
              <X className="mr-1 h-4 w-4" />
              Reject
            </Button>
          </div>
        </TableCell>
      </TableRow>
      
      {isExpanded && (
        <TableRow>
          <TableCell colSpan={7} className="p-0">
            <div className="bg-muted/30 p-4">
              <h4 className="font-medium mb-4">Permission Gaps</h4>
              
              {gaps.map((gap, index) => (
                <PermissionGapItem 
                  key={index}
                  gap={gap}
                  index={index}
                  userId={user.id}
                  onApproveGap={onApproveGap}
                />
              ))}
              
              {gaps.length === 0 && (
                <p className="text-muted-foreground py-4 text-center">No permission gaps detected</p>
              )}
            </div>
          </TableCell>
        </TableRow>
      )}
    </React.Fragment>
  );
};

export default UserAccessReviewRow;
