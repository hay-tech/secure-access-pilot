
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
  getUserName: (userId: string) => string;
  getUserJobFunctions: (userId: string) => string;
  getAccessType: (request: any) => string;
}

const CompletedApprovalsTable: React.FC<CompletedApprovalsTableProps> = ({
  completedApprovals,
  getUserName,
  getUserJobFunctions,
  getAccessType,
}) => {
  // Mock data reusing examples from accountability database
  const mockCompletedApprovals = [
    {
      id: 'completed-1',
      userId: 'user-maria-garcia',
      requestor: 'Maria Garcia',
      jobFunction: 'Cloud Platform Security Reader',
      environment: 'CCCS',
      justification: 'Read-only access needed for security monitoring and compliance reporting',
      requestDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      approvalDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      decision: 'approved',
    },
    {
      id: 'completed-2',
      userId: 'user-tom-wilson',
      requestor: 'Tom Wilson',
      jobFunction: 'Cloud Platform Reader',
      environment: 'NIST 800-53 Moderate',
      justification: 'Access required for system monitoring and performance analysis',
      requestDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      approvalDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      decision: 'approved',
    },
    {
      id: 'completed-3',
      userId: 'user-sarah-jones',
      requestor: 'Sarah Jones',
      jobFunction: 'Cloud Platform Administrator',
      environment: 'FedRAMP High',
      justification: 'Temporary elevated access for emergency system maintenance',
      requestDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      approvalDate: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
      decision: 'rejected',
    }
  ];

  const displayData = completedApprovals.length > 0 ? completedApprovals : mockCompletedApprovals;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Requestor</TableHead>
          <TableHead>Job Function(s)</TableHead>
          <TableHead>Environment</TableHead>
          <TableHead>Justification</TableHead>
          <TableHead>Request Date</TableHead>
          <TableHead>Approval Date</TableHead>
          <TableHead>Decision</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {displayData.length === 0 ? (
          <TableRow>
            <TableCell colSpan={7} className="text-center py-4 text-muted-foreground">
              No completed approvals found
            </TableCell>
          </TableRow>
        ) : (
          displayData.map((request) => {
            // Get approval details - we'll determine this from the request itself
            const isManagerApproval = request.managerApproval?.status !== 'pending';
            const approval = isManagerApproval ? request.managerApproval : request.securityApproval;
            const decision = request.decision || approval?.status || 'pending';
            
            return (
              <TableRow key={request.id}>
                <TableCell className="font-medium">
                  {request.requestor || getUserName(request.userId)}
                </TableCell>
                <TableCell>
                  {request.jobFunction || getUserJobFunctions(request.userId)}
                </TableCell>
                <TableCell>
                  {request.environment || request.environmentType || 'N/A'}
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
                  {request.approvalDate ? 
                    format(new Date(request.approvalDate), 'MMM d, yyyy') : 
                    (approval?.timestamp ? 
                      format(new Date(approval.timestamp), 'MMM d, yyyy') : 
                      'N/A')}
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={decision === 'approved' ? 
                      'bg-green-100 text-green-800' : 
                      'bg-red-100 text-red-800'}
                  >
                    {decision === 'approved' ? 'Approved' : 'Rejected'}
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
