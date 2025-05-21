
import React from 'react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { AccessReviewLog } from "@/types/iam";
import { formatDistanceToNow } from 'date-fns';
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

interface AccessReviewLogTableProps {
  logs: AccessReviewLog[];
  isExample?: boolean;
}

const sampleExampleLogs: AccessReviewLog[] = [
  {
    id: 'example-1',
    reviewId: 'review-2023-001',
    approverId: 'user-scott',
    approvedUserId: 'user-jane',
    environment: 'FedRAMP High',
    jobFunctions: ['Security Analyst'],
    permissionsGranted: ['read:security-logs', 'write:security-alerts'],
    groupsMembership: ['Security Team', 'SOC Analysts'],
    timestamp: new Date(2023, 10, 15).toISOString(),
    decision: 'maintain',
    justification: 'Annual certification - all permissions validated'
  },
  {
    id: 'example-2',
    reviewId: 'review-2023-015',
    approverId: 'user-scott',
    approvedUserId: 'user-john',
    environment: 'Commercial',
    jobFunctions: ['Developer'],
    permissionsGranted: ['read:code', 'write:code', 'deploy:staging'],
    groupsMembership: ['Developers', 'Frontend Team'],
    timestamp: new Date(2023, 10, 10).toISOString(),
    decision: 'modify',
    justification: 'Role change - removed production deploy permissions'
  },
  {
    id: 'example-3',
    reviewId: 'review-2023-022',
    approverId: 'user-scott',
    approvedUserId: 'user-alex',
    environment: 'CJIS',
    jobFunctions: ['Database Administrator'],
    permissionsGranted: ['read:database', 'write:database'],
    groupsMembership: ['DBAs', 'Production Support'],
    timestamp: new Date(2023, 10, 1).toISOString(),
    decision: 'revoke',
    justification: 'Employee transferred to different department'
  },
  {
    id: 'example-4',
    reviewId: 'review-2023-030',
    approverId: 'user-scott',
    approvedUserId: 'user-maria',
    environment: 'CCCS',
    jobFunctions: ['Security Engineer'],
    permissionsGranted: ['read:security-config', 'write:security-config', 'admin:security-tools'],
    groupsMembership: ['Security Engineers', 'Infrastructure Team'],
    timestamp: new Date(2023, 9, 25).toISOString(),
    decision: 'maintain',
    justification: 'Quarterly review - all permissions appropriate'
  },
  {
    id: 'example-5',
    reviewId: 'review-2023-035',
    approverId: 'user-scott',
    approvedUserId: 'user-tom',
    environment: 'Commercial',
    jobFunctions: ['IT Support'],
    permissionsGranted: ['read:tickets', 'update:tickets', 'read:user-accounts'],
    groupsMembership: ['Support Team', 'Help Desk'],
    timestamp: new Date(2023, 9, 20).toISOString(),
    decision: 'modify',
    justification: 'Added new permissions for updated ticketing system'
  }
];

const AccessReviewLogTable: React.FC<AccessReviewLogTableProps> = ({ logs, isExample }) => {
  const displayLogs = isExample ? sampleExampleLogs : logs;
  
  const getDecisionBadge = (decision: 'maintain' | 'revoke' | 'modify') => {
    switch (decision) {
      case 'maintain':
        return (
          <div className="flex items-center">
            <CheckCircle className="h-4 w-4 text-green-600 mr-1" />
            <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-100 border-green-200">
              Maintain
            </Badge>
          </div>
        );
      case 'revoke':
        return (
          <div className="flex items-center">
            <XCircle className="h-4 w-4 text-red-600 mr-1" />
            <Badge variant="outline" className="bg-red-50 text-red-700 hover:bg-red-100 border-red-200">
              Revoke
            </Badge>
          </div>
        );
      case 'modify':
        return (
          <div className="flex items-center">
            <AlertTriangle className="h-4 w-4 text-amber-600 mr-1" />
            <Badge variant="outline" className="bg-amber-50 text-amber-700 hover:bg-amber-100 border-amber-200">
              Modify
            </Badge>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Manager</TableHead>
          <TableHead>User</TableHead>
          <TableHead>Environment</TableHead>
          <TableHead>Job Function</TableHead>
          <TableHead>Decision</TableHead>
          <TableHead>Justification</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {displayLogs.length === 0 ? (
          <TableRow>
            <TableCell colSpan={7} className="text-center py-4">
              No access review logs found
            </TableCell>
          </TableRow>
        ) : (
          displayLogs.map((log) => (
            <TableRow key={log.id}>
              <TableCell>
                {formatDistanceToNow(new Date(log.timestamp))} ago
              </TableCell>
              <TableCell>
                {isExample ? "Scott Dale" : "No Manager"}
              </TableCell>
              <TableCell>
                {log.approvedUserId.replace('user-', '')}
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200">
                  {log.environment}
                </Badge>
              </TableCell>
              <TableCell>
                {log.jobFunctions.join(', ')}
              </TableCell>
              <TableCell>
                {getDecisionBadge(log.decision)}
              </TableCell>
              <TableCell>
                <div className="max-w-xs truncate" title={log.justification}>
                  {log.justification || 'No justification provided'}
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};

export default AccessReviewLogTable;
