
import React from 'react';
import { format } from 'date-fns';
import { Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { AccessRequest } from '../../types/iam';

interface PendingApprovalsTableProps {
  pendingApprovals: AccessRequest[];
  getUserName: (userId: string) => string;
  getUserJobFunctions: (userId: string) => string;
  getAccessType: (request: any) => string;
  openDialog: (requestId: string, type: 'approve' | 'reject') => void;
}

const PendingApprovalsTable: React.FC<PendingApprovalsTableProps> = ({
  pendingApprovals,
  getUserName,
  getUserJobFunctions,
  getAccessType,
  openDialog,
}) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Environment</TableHead>
          <TableHead>Requestor</TableHead>
          <TableHead>Job Function(s)</TableHead>
          <TableHead>Group(s)</TableHead>
          <TableHead>Request Type</TableHead>
          <TableHead>Justification</TableHead>
          <TableHead>Request Date</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {pendingApprovals.length === 0 ? (
          <TableRow>
            <TableCell colSpan={8} className="text-center py-4 text-muted-foreground">
              No pending approvals found
            </TableCell>
          </TableRow>
        ) : (
          pendingApprovals.map((request) => (
            <TableRow key={request.id}>
              <TableCell>{request.resourceName || 'N/A'}</TableCell>
              <TableCell className="font-medium">
                {getUserName(request.userId)}
              </TableCell>
              <TableCell>{request.jobFunction || 'N/A'}</TableCell>
              <TableCell>
                {request.projectName || 'N/A'}
              </TableCell>
              <TableCell>
                {request.accessType === 'temporary' ? 'Temporary' : 'Permanent'}
              </TableCell>
              <TableCell>
                <div className="max-w-sm truncate" title={request.justification}>
                  {request.justification}
                </div>
              </TableCell>
              <TableCell>
                {format(new Date(request.createdAt), 'MMM d, yyyy')}
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="bg-green-50 text-green-700 hover:bg-green-100 hover:text-green-800 border-green-200"
                    onClick={() => openDialog(request.id, 'approve')}
                  >
                    <Check className="h-4 w-4 mr-1" /> Approve
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="bg-red-50 text-red-700 hover:bg-red-100 hover:text-red-800 border-red-200"
                    onClick={() => openDialog(request.id, 'reject')}
                  >
                    <X className="h-4 w-4 mr-1" /> Reject
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};

export default PendingApprovalsTable;
