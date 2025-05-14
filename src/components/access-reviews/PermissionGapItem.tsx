
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { PermissionGap } from "@/types/iam";
import { ShieldCheck, ShieldX, Check, X } from "lucide-react";

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
  
  return (
    <div className="mb-6 bg-background rounded-md p-4 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          {gap.gapType === 'excess' ? (
            <ShieldX className="h-5 w-5 text-destructive" />
          ) : (
            <ShieldCheck className="h-5 w-5 text-warning" />
          )}
          <span className={`text-sm font-medium ${gap.gapType === 'excess' ? 'text-destructive' : 'text-warning'}`}>
            {gap.gapType === 'excess' ? 'Excess Permission' : 'Missing Permission'}
          </span>
          <span className={`ml-2 rounded-full px-2 py-1 text-xs ${
            gap.severity === 'Critical' ? 'bg-destructive text-destructive-foreground' :
            gap.severity === 'High' ? 'bg-destructive/80 text-destructive-foreground' :
            gap.severity === 'Medium' ? 'bg-amber-500 text-white' :
            'bg-amber-200 text-amber-800'
          }`}>
            {gap.severity}
          </span>
        </div>
        
        {gap.approved === undefined && (
          <div className="flex space-x-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onApproveGap(
                userId, 
                index, 
                true, 
                justification
              )}
            >
              <Check className="mr-1 h-4 w-4" />
              Approve Permission
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => onApproveGap(
                userId, 
                index, 
                false,
                justification
              )}
            >
              <X className="mr-1 h-4 w-4" />
              Reject Permission
            </Button>
          </div>
        )}
        
        {gap.approved !== undefined && (
          <div className={`flex items-center px-3 py-1 rounded-full text-sm ${
            gap.approved ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {gap.approved ? (
              <>
                <Check className="mr-1 h-4 w-4" />
                Approved
              </>
            ) : (
              <>
                <X className="mr-1 h-4 w-4" />
                Rejected
              </>
            )}
          </div>
        )}
      </div>
      
      <p className="text-sm mb-3">{gap.description}</p>
      
      {gap.approved === undefined && (
        <div className="mt-2">
          <Textarea 
            placeholder="Enter justification for your decision..."
            value={justification}
            onChange={(e) => setJustification(e.target.value)}
            className="h-20"
          />
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
