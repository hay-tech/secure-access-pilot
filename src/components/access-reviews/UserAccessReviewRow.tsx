
import React, { useState } from 'react';
import { TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { User, PermissionGap } from "@/types/iam";
import { Check, X, Info, ChevronDown, ChevronUp, UserX, UserCheck } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface UserAccessReviewRowProps {
  user: User;
  gaps: PermissionGap[];
  environment: string;
  onApproveGap: (userId: string, gapIndex: number, approved: boolean, justification?: string) => Promise<void>;
  onCompleteReview: (userId: string, decision: 'maintain' | 'revoke' | 'modify', comments?: string) => Promise<void>;
}

const UserAccessReviewRow: React.FC<UserAccessReviewRowProps> = ({
  user,
  gaps,
  environment,
  onApproveGap,
  onCompleteReview
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [justification, setJustification] = useState('');
  
  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const isUnauthorizedUser = gaps.some(g => g.gapType === 'unauthorized_user');
  const hasUnauthorizedPermissions = gaps.some(g => g.gapType === 'excess');
  
  const handleApprove = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await onCompleteReview(user.id, 'maintain', justification || 'Job function still valid');
      toast.success("Access approved and added to accountability database");
      setJustification('');
    } catch (error) {
      toast.error("Failed to approve access");
    }
  };
  
  const handleReject = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await onCompleteReview(user.id, 'revoke', justification || 'Job function no longer valid');
      toast.success("Access rejected and added to accountability database");
      setJustification('');
    } catch (error) {
      toast.error("Failed to reject access");
    }
  };

  const handleReprovision = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await onCompleteReview(user.id, 'modify', justification || 'Reprovisioning user with authorized permissions');
      toast.success("User reprovisioned with proper permissions");
      setJustification('');
    } catch (error) {
      toast.error("Failed to reprovision user");
    }
  };

  // Get user groups based on their job functions
  const userGroups = user.jobFunction 
    ? [`${user.jobFunction.toLowerCase().replace(/\s+/g, '-')}-group`] 
    : user.jobFunctions 
      ? user.jobFunctions.map(jf => `${jf.toLowerCase().replace(/\s+/g, '-')}-group`) 
      : [];

  // Determine access type based on environment
  const accessType = environment.toLowerCase().includes('prod') 
    ? 'Production' 
    : environment.toLowerCase().includes('dev') 
      ? 'Development' 
      : 'Standard';

  return (
    <React.Fragment>
      <TableRow className="cursor-pointer hover:bg-muted/50" onClick={handleToggleExpand}>
        <TableCell>{environment}</TableCell>
        <TableCell>
          <div className="flex items-center gap-2">
            {user.firstName} {user.lastName}
            {isUnauthorizedUser && (
              <Badge variant="destructive" className="ml-1">
                Unauthorized
              </Badge>
            )}
            {isExpanded ? (
              <ChevronUp className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            )}
          </div>
        </TableCell>
        <TableCell>
          {user.jobFunction || (user.jobFunctions && user.jobFunctions.join(', ')) || 'Not assigned'}
        </TableCell>
        <TableCell>
          {userGroups.map((group, idx) => (
            <Badge key={idx} variant="outline" className="mr-1">
              {group}
            </Badge>
          ))}
        </TableCell>
        <TableCell>{accessType}</TableCell>
        <TableCell className="max-w-xs">
          {isExpanded ? (
            <Textarea 
              placeholder="Enter justification..."
              value={justification}
              onChange={(e) => setJustification(e.target.value)}
              className="w-full h-20"
            />
          ) : (
            <span className="truncate block">Click to add justification</span>
          )}
        </TableCell>
        <TableCell>
          <div className="flex space-x-2">
            {isUnauthorizedUser ? (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  className="bg-red-50 text-red-700 hover:bg-red-100 hover:text-red-800 border-red-200"
                  onClick={handleReject}
                >
                  <UserX className="mr-1 h-4 w-4" />
                  Remove User
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="bg-blue-50 text-blue-700 hover:bg-blue-100 hover:text-blue-800 border-blue-200"
                  onClick={handleReprovision}
                >
                  <UserCheck className="mr-1 h-4 w-4" />
                  Re-provision
                </Button>
              </>
            ) : hasUnauthorizedPermissions ? (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  className="bg-green-50 text-green-700 hover:bg-green-100 hover:text-green-800 border-green-200"
                  onClick={handleApprove}
                >
                  <Check className="mr-1 h-4 w-4" />
                  Approve
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="bg-blue-50 text-blue-700 hover:bg-blue-100 hover:text-blue-800 border-blue-200"
                  onClick={handleReprovision}
                >
                  <UserCheck className="mr-1 h-4 w-4" />
                  Fix Permissions
                </Button>
              </>
            ) : (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  className="bg-green-50 text-green-700 hover:bg-green-100 hover:text-green-800 border-green-200"
                  onClick={handleApprove}
                >
                  <Check className="mr-1 h-4 w-4" />
                  Approve
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="bg-red-50 text-red-700 hover:bg-red-100 hover:text-red-800 border-red-200"
                  onClick={handleReject}
                >
                  <X className="mr-1 h-4 w-4" />
                  Reject
                </Button>
              </>
            )}
          </div>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
};

export default UserAccessReviewRow;
