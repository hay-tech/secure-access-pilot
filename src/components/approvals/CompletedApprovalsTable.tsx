
import React from 'react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { AccessRequest } from '../../types/iam';

interface CompletedApprovalsTableProps {
  completedApprovals: AccessRequest[];
  currentUserId: string;
  getUserName: (userId: string) => string;
  getUserJobFunctions: (userId: string) => string;
  getAccessType: (request: any) => string;
}

const CompletedApprovalsTable: React.FC<CompletedApprovalsTableProps> = ({
  completedApprovals,
  currentUserId,
  getUserName,
  getUserJobFunctions,
  getAccessType,
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
          <TableHead>Approval Date</TableHead>
          <TableHead>Decision</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {completedApprovals.length === 0 ? (
          <TableRow>
            <TableCell colSpan={9} className="text-center py-4 text-muted-foreground">
              No completed approvals found
            </TableCell>
          </TableRow>
        ) : (
          completedApprovals.map((request) => {
            const isManager = request.managerApproval?.approverId === currentUserId;
            const approval = isManager ? request.managerApproval : request.securityApproval;
            
            return (
              <TableRow key={request.id}>
                <TableCell>{request.environmentType || 'N/A'}</TableCell>
                <TableCell className="font-medium">
                  {getUserName(request.userId)}
                </TableCell>
                <TableCell>{getUserJobFunctions(request.userId)}</TableCell>
                <TableCell>
                  {request.projectName || 'N/A'}
                </TableCell>
                <TableCell>
                  {getAccessType(request)}
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
                  {approval?.timestamp ? 
                    format(new Date(approval.timestamp), 'MMM d, yyyy') : 
                    'N/A'}
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={approval?.status === 'approved' ? 
                      'bg-green-100 text-green-800' : 
                      'bg-red-100 text-red-800'}
                  >
                    {approval?.status === 'approved' ? 'Approved' : 'Rejected'}
                  </Badge>
                </TableCell>
              </TableRow>
            );
          })
        )}
      </TableBody>
    </Table>
  );
};

export default CompletedApprovalsTable;
