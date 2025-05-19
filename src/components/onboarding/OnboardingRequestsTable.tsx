
import React from 'react';
import { format } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { AccessRequest } from '../../types/iam';
import { useIAM } from '../../contexts/IAMContext';

interface OnboardingRequestsTableProps {
  requests: AccessRequest[];
}

const OnboardingRequestsTable: React.FC<OnboardingRequestsTableProps> = ({
  requests
}) => {
  const { users } = useIAM();
  
  // Extract employee name from projectName (format: "Onboarding: First Last")
  const getEmployeeName = (projectName?: string): string => {
    if (!projectName) return 'Unknown';
    const match = projectName.match(/Onboarding: (.+)/);
    return match ? match[1] : 'Unknown';
  };
  
  // Extract job function titles from resource name (format: "Employee Onboarding: Job1, Job2, etc.")
  const getJobFunctions = (resourceName: string): string => {
    const match = resourceName.match(/Employee Onboarding: (.+)/);
    return match ? match[1] : 'Unknown';
  };
  
  // Get environment name from environment type
  const getEnvironmentName = (envType?: string): string => {
    switch (envType) {
      case 'dev': return 'Development';
      case 'test': return 'Test';
      case 'prod': return 'Production';
      default: return envType || 'Unknown';
    }
  };
  
  // Get approvers from the approval chain
  const getApprovers = (request: AccessRequest): string => {
    if (!request.approvalChain || request.approvalChain.length === 0) {
      return 'None required';
    }
    
    return request.approvalChain
      .map(approver => approver.approverName)
      .join(', ');
  };
  
  // Get badge color based on status
  const getStatusBadge = (status: AccessRequest['status']) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">Pending</Badge>;
      case 'approved':
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">Approved</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  // Special handling for development environment (auto-approved)
  const isAutoApproved = (request: AccessRequest): boolean => {
    return request.environmentType === 'dev' && request.status === 'approved';
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Employee</TableHead>
          <TableHead>Job Functions</TableHead>
          <TableHead>Environment</TableHead>
          <TableHead>Approvers</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Created</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {requests.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
              No onboarding requests found
            </TableCell>
          </TableRow>
        ) : (
          requests.map((request) => (
            <TableRow key={request.id}>
              <TableCell className="font-medium">
                {getEmployeeName(request.projectName)}
              </TableCell>
              <TableCell>
                {getJobFunctions(request.resourceName)}
              </TableCell>
              <TableCell>
                {getEnvironmentName(request.environmentType)}
              </TableCell>
              <TableCell>
                {isAutoApproved(request) ? (
                  <span className="text-green-600">Auto-approved (Dev)</span>
                ) : (
                  getApprovers(request)
                )}
              </TableCell>
              <TableCell>
                {getStatusBadge(request.status)}
              </TableCell>
              <TableCell>
                {format(new Date(request.createdAt), 'MMM d, yyyy')}
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};

export default OnboardingRequestsTable;
