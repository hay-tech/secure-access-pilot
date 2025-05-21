
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { PermissionGap } from "@/types/iam";
import { ShieldCheck, ShieldX, Check, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { 
  Tooltip,
  TooltipContent,
  TooltipTrigger 
} from "@/components/ui/tooltip";

interface PermissionGapItemProps {
  gap: PermissionGap;
  index: number;
  userId: string;
  onApproveGap: (userId: string, gapIndex: number, approved: boolean, justification?: string) => Promise<void>;
}

const PermissionGapItem: React.FC<PermissionGapItemProps> = ({
  gap,
  index,
  userId,
  onApproveGap
}) => {
  const [justification, setJustification] = useState<string>('');
  const [showJustification, setShowJustification] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  
  const getSeverityColor = (severity: string) => {
    switch(severity) {
      case 'Critical': return 'bg-destructive text-destructive-foreground';
      case 'High': return 'bg-destructive/80 text-destructive-foreground';
      case 'Medium': return 'bg-amber-500 text-white';
      default: return 'bg-amber-200 text-amber-800';
    }
  };

  const handleApproveClick = async () => {
    if (!showJustification) {
      setShowJustification(true);
      return;
    }

    if (justification.trim().length === 0) return;

    setIsSubmitting(true);
    try {
      await onApproveGap(userId, index, true, justification);
      setShowJustification(false);
      setJustification('');
    } catch (error) {
      console.error('Error approving gap:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRejectClick = async () => {
    if (!showJustification) {
      setShowJustification(true);
      return;
    }

    if (justification.trim().length === 0) return;

    setIsSubmitting(true);
    try {
      await onApproveGap(userId, index, false, justification);
      setShowJustification(false);
      setJustification('');
    } catch (error) {
      console.error('Error rejecting gap:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelClick = () => {
    setShowJustification(false);
    setJustification('');
  };
  
  return (
    <div className="mb-4 bg-background rounded-md p-4 shadow-sm border">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          {gap.gapType === 'excessive_permission' ? (
            <ShieldX className="h-5 w-5 text-destructive" />
          ) : (
            <ShieldCheck className="h-5 w-5 text-warning" />
          )}
          <span className={`text-sm font-medium ${gap.gapType === 'excessive_permission' ? 'text-destructive' : 'text-warning'}`}>
            {gap.gapType === 'excessive_permission' ? 'Excess Permission' : 'Missing Permission'}
          </span>
          <Badge className={getSeverityColor(gap.severity)}>
            {gap.severity}
          </Badge>
        </div>
        
        {gap.approved === undefined && !showJustification && (
          <div className="flex space-x-2">
            <Button
              size="sm"
              variant="outline"
              className="bg-green-50 text-green-700 hover:bg-green-100 hover:text-green-800 border-green-200"
              onClick={handleApproveClick}
              disabled={isSubmitting}
            >
              <Check className="mr-1 h-4 w-4" />
              Approve
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="bg-red-50 text-red-700 hover:bg-red-100 hover:text-red-800 border-red-200"
              onClick={handleRejectClick}
              disabled={isSubmitting}
            >
              <X className="mr-1 h-4 w-4" />
              Reject
            </Button>
          </div>
        )}
        
        {gap.approved !== undefined && (
          <Badge variant={gap.approved ? "outline" : "destructive"} className={`px-3 py-1 ${
            gap.approved ? 'bg-green-100 text-green-800 border-green-200' : 'bg-red-100 text-red-800 border-red-200'
          }`}>
            {gap.approved ? (
              <>
                <Check className="mr-1 h-4 w-4 inline" />
                Approved
              </>
            ) : (
              <>
                <X className="mr-1 h-4 w-4 inline" />
                Rejected
              </>
            )}
          </Badge>
        )}
      </div>
      
      <p className="text-sm mb-3">{gap.description}</p>

      {/* Display actual vs approved job functions */}
      {(gap.actualJobFunction || gap.approvedJobFunction) && (
        <div className="mt-2 mb-3 flex flex-col gap-1.5">
          {gap.actualJobFunction && (
            <div className="text-sm">
              <span className="font-medium">Actual:</span>{" "}
              <Badge variant="outline" className="bg-blue-50 ml-1">
                {gap.actualJobFunction}
              </Badge>
            </div>
          )}
          {gap.approvedJobFunction && (
            <div className="text-sm">
              <span className="font-medium">Approved:</span>{" "}
              <Badge variant="outline" className="bg-green-50 ml-1">
                {gap.approvedJobFunction}
              </Badge>
            </div>
          )}
        </div>
      )}
      
      {showJustification && (
        <div className="mt-4 space-y-4">
          <Textarea 
            placeholder="Enter justification for your decision..."
            value={justification}
            onChange={(e) => setJustification(e.target.value)}
            className="h-20"
          />
          
          <div className="flex justify-end space-x-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handleCancelClick}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="bg-green-50 text-green-700 hover:bg-green-100 hover:text-green-800 border-green-200"
              onClick={handleApproveClick}
              disabled={!justification.trim() || isSubmitting}
            >
              <Check className="mr-1 h-4 w-4" />
              Approve
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="bg-red-50 text-red-700 hover:bg-red-100 hover:text-red-800 border-red-200"
              onClick={handleRejectClick}
              disabled={!justification.trim() || isSubmitting}
            >
              <X className="mr-1 h-4 w-4" />
              Reject
            </Button>
          </div>
        </div>
      )}
      
      {gap.justification && (
        <div className="mt-2 text-sm">
          <span className="font-medium">Justification:</span> {gap.justification}
        </div>
      )}
    </div>
  );
};

export default PermissionGapItem;
