
import React from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface ApprovalDialogsProps {
  dialogType: 'approve' | 'reject' | null;
  comments: string;
  setComments: (comments: string) => void;
  closeDialog: () => void;
  handleAction: (approved: boolean) => void;
}

const ApprovalDialogs: React.FC<ApprovalDialogsProps> = ({
  dialogType,
  comments,
  setComments,
  closeDialog,
  handleAction,
}) => {
  return (
    <>
      {/* Approval Dialog */}
      <Dialog open={dialogType === 'approve'} onOpenChange={() => dialogType === 'approve' && closeDialog()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Access Request</DialogTitle>
            <DialogDescription>
              You are about to approve this access request. Please provide any comments or conditions.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Textarea
              placeholder="Optional comments or conditions for approval"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              rows={3}
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={closeDialog}
            >
              Cancel
            </Button>
            <Button 
              onClick={() => handleAction(true)}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Approve Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Rejection Dialog */}
      <Dialog open={dialogType === 'reject'} onOpenChange={() => dialogType === 'reject' && closeDialog()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Access Request</DialogTitle>
            <DialogDescription>
              You are about to reject this access request. Please provide a reason for rejection.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Textarea
              placeholder="Reason for rejection (required)"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              rows={3}
              required
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={closeDialog}
            >
              Cancel
            </Button>
            <Button 
              onClick={() => handleAction(false)}
              disabled={!comments.trim()}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Reject Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ApprovalDialogs;
