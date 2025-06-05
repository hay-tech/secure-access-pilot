
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

  // Helper to get the resource name (cluster name) directly from the request
  const getResourceName = (request: AccessRequest): string => {
    // Use the resourceName field which should contain the cluster name from the form
    if (request.resourceName) {
      return request.resourceName;
    }
    
    // Fallback to cloudWorkload if available
    if (request.cloudWorkload) {
      return request.cloudWorkload;
    }
    
    // Final fallback to a default name
    return 'Default Cluster';
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Resource</TableHead>
          <TableHead>Job Function</TableHead>
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
              <TableCell className="font-medium">{getResourceName(request)}</TableCell>
              <TableCell>
                {request.jobFunction || "Standard Role"}
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
