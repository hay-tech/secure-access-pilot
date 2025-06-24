
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
  // Mock data reusing examples from accountability database
  const mockPendingApprovals = [
    {
      id: 'pending-1',
      userId: 'user-jane-smith',
      requestor: 'Jane Smith',
      jobFunction: 'Cloud Platform Administrator',
      environment: 'FedRAMP High',
      justification: 'Need elevated access for platform maintenance and security updates',
      requestDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'pending-2',
      userId: 'user-john-doe',
      requestor: 'John Doe',
      jobFunction: 'Cloud Platform Contributor',
      environment: 'Commercial',
      justification: 'Require access for new development project deployment',
      requestDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'pending-3',
      userId: 'user-alex-johnson',
      requestor: 'Alex Johnson',
      jobFunction: 'Cloud Platform Security Administrator',
      environment: 'CJIS',
      justification: 'Security administration access required for compliance audit',
      requestDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    }
  ];

  const displayData = pendingApprovals.length > 0 ? pendingApprovals : mockPendingApprovals;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Requestor</TableHead>
          <TableHead>Job Function(s)</TableHead>
          <TableHead>Environment</TableHead>
          <TableHead>Justification</TableHead>
          <TableHead>Request Date</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {displayData.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
              No pending approvals found
            </TableCell>
          </TableRow>
        ) : (
          displayData.map((request) => (
            <TableRow key={request.id}>
              <TableCell className="font-medium">
                {request.requestor || getUserName(request.userId)}
              </TableCell>
              <TableCell>
                {request.jobFunction || getUserJobFunctions(request.userId)}
              </TableCell>
              <TableCell>
                {request.environment || request.resourceName || 'N/A'}
              </TableCell>
              <TableCell>
                <div className="max-w-sm truncate" title={request.justification}>
                  {request.justification}
                </div>
              </TableCell>
              <TableCell>
                {format(new Date(request.requestDate || request.createdAt), 'MMM d, yyyy')}
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
