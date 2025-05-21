
import React, { useState } from 'react';
import { TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { User, PermissionGap } from "@/types/iam";
import { Badge } from "@/components/ui/badge";
import { Check, X } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

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
  const [justification, setJustification] = useState("No change");
  const [isEditing, setIsEditing] = useState(false);
  
  const jobFunctions = user.jobFunction 
    ? [user.jobFunction]
    : user.jobFunctions || [];
  
  // For demo, we'll just use the first gap
  const firstGap = gaps[0];
  
  const handleApprove = async () => {
    try {
      await onApproveGap(user.id, 0, true, justification);
      await onCompleteReview(user.id, 'maintain', justification);
      toast.success(`Approved access for ${user.firstName} ${user.lastName}`);
    } catch (error) {
      console.error(error);
      toast.error("Failed to approve access");
    }
  };
  
  const handleReject = async () => {
    try {
      await onApproveGap(user.id, 0, false, justification);
      await onCompleteReview(user.id, 'revoke', justification);
      toast.success(`Rejected access for ${user.firstName} ${user.lastName}`);
    } catch (error) {
      console.error(error);
      toast.error("Failed to reject access");
    }
  };
  
  const toggleEditing = () => {
    setIsEditing(!isEditing);
  };
  
  return (
    <TableRow>
      <TableCell>{environment}</TableCell>
      <TableCell className="font-medium">
        {user.firstName} {user.lastName}
      </TableCell>
      <TableCell>
        {jobFunctions.length > 0
          ? jobFunctions.join(", ")
          : "No job function"}
      </TableCell>
      <TableCell>
        {user.department || "N/A"}
      </TableCell>
      <TableCell>
        <Badge variant="outline">Permanent</Badge>
      </TableCell>
      <TableCell>
        <div className="max-w-xs">
          {isEditing ? (
            <Textarea
              value={justification}
              onChange={(e) => setJustification(e.target.value)}
              className="text-sm"
              rows={2}
            />
          ) : (
            <div className="flex items-center gap-2">
              <span>{justification}</span>
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={toggleEditing} 
                className="h-6 px-2">
                Edit
              </Button>
            </div>
          )}
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            className="bg-green-50 text-green-700 hover:bg-green-100 hover:text-green-800 border-green-200"
            onClick={handleApprove}
          >
            <Check className="h-4 w-4 mr-1" /> Approve
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="bg-red-50 text-red-700 hover:bg-red-100 hover:text-red-800 border-red-200"
            onClick={handleReject}
          >
            <X className="h-4 w-4 mr-1" /> Reject
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default UserAccessReviewRow;
