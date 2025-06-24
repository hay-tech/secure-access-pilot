
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
import { AccessRequest } from '@/types/iam';

interface AccessRequestsTableProps {
  requests: AccessRequest[];
}

export const AccessRequestsTable: React.FC<AccessRequestsTableProps> = ({ requests }) => {
  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    canceled: 'bg-gray-100 text-gray-800',
  };
  
  const renderStatusBadge = (status: string) => {
    const color = statusColors[status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800';
    return (
      <Badge variant="outline" className={color}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  // Helper to get the environment name with examples from accountability database
  const getEnvironmentName = (request: AccessRequest): string => {
    // Use environment field if available, otherwise map from resourceName or use defaults
    if (request.environment) {
      return request.environment;
    }
    
    // Map based on compliance framework or existing data
    if (request.complianceFramework === 'cccs' || request.resourceName?.includes('CCCS')) {
      return 'CCCS';
    }
    if (request.complianceFramework === 'cjis' || request.resourceName?.includes('CJIS')) {
      return 'CJIS';
    }
    if (request.complianceFramework === 'federal' || request.resourceName?.includes('Federal')) {
      return 'FedRAMP High';
    }
    if (request.resourceName?.includes('Commercial')) {
      return 'Commercial';
    }
    
    // Default examples from accountability database
    const environmentExamples = [
      'FedRAMP High',
      'CCCS',
      'CJIS', 
      'Commercial',
      'NIST 800-53 Moderate'
    ];
    
    // Use a simple hash to consistently assign environments
    const hash = request.id.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    return environmentExamples[hash % environmentExamples.length];
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Job Function</TableHead>
          <TableHead>Environment</TableHead>
          <TableHead>Access Type</TableHead>
          <TableHead>Expiration</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Approval Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {requests.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
              No requests found
            </TableCell>
          </TableRow>
        ) : (
          requests.map((request) => (
            <TableRow key={request.id}>
              <TableCell className="font-medium">
                {request.jobFunction || "Standard Role"}
              </TableCell>
              <TableCell>
                {getEnvironmentName(request)}
              </TableCell>
              <TableCell>
                {request.accessType ? (
                  <Badge variant="outline" className={request.accessType === 'permanent' ? 
                    "bg-blue-100 text-blue-800" : "bg-amber-100 text-amber-800"
                  }>
                    {request.accessType.charAt(0).toUpperCase() + request.accessType.slice(1)}
                  </Badge>
                ) : (
                  <Badge variant="outline">Permanent</Badge>
                )}
              </TableCell>
              <TableCell>
                {request.expiresAt ? (
                  format(new Date(request.expiresAt), "PPP")
                ) : (
                  "N/A"
                )}
              </TableCell>
              <TableCell>{renderStatusBadge(request.status)}</TableCell>
              <TableCell>
                {request.approvalChain ? (
                  `${request.approvalChain.filter(a => a.status === 'approved').length}/${request.approvalChain.length} Approvals`
                ) : (
                  request.managerApproval ? (
                    <Badge variant="outline" className={statusColors[request.managerApproval.status as keyof typeof statusColors]}>
                      Manager: {request.managerApproval.status.charAt(0).toUpperCase() + request.managerApproval.status.slice(1)}
                    </Badge>
                  ) : (
                    "Pending"
                  )
                )}
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};
