
import React from 'react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { AccessReviewLog } from "@/types/iam";
import { formatDistanceToNow } from 'date-fns';
import { Badge } from "@/components/ui/badge";

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
    jobFunctions: ['Cloud Platform Administrator'],
    permissionsGranted: ['cpe-cloud-account-owners', 'cpe-iam-administrators'],
    groupsMembership: ['cpe-platform-administrators-fedrampdev', 'cpe-platform-administrators-fedrampprod'],
    timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    justification: 'Annual certification - all permissions validated'
  },
  {
    id: 'example-2',
    reviewId: 'review-2023-015',
    approverId: 'user-scott',
    approvedUserId: 'user-john',
    environment: 'Commercial',
    jobFunctions: ['Cloud Platform Contributor'],
    permissionsGranted: ['cpe-platform-contributors-dev', 'cpe-platform-contributors-prod'],
    groupsMembership: ['cpe-platform-contributors-dev', 'cpe-platform-contributors-prod'],
    timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    justification: 'Role change - updated permissions for new responsibilities'
  },
  {
    id: 'example-3',
    reviewId: 'review-2023-022',
    approverId: 'user-scott',
    approvedUserId: 'user-alex',
    environment: 'CJIS',
    jobFunctions: ['Cloud Platform Security Administrator'],
    permissionsGranted: ['cpe-platform-security-administrators-prod', 'cpe-platform-security-administrators-staging'],
    groupsMembership: ['cpe-platform-security-administrators-cjisprod'],
    timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    justification: 'Security administration access for compliance requirements'
  },
  {
    id: 'example-4',
    reviewId: 'review-2023-030',
    approverId: 'user-scott',
    approvedUserId: 'user-maria',
    environment: 'CCCS',
    jobFunctions: ['Cloud Platform Security Reader'],
    permissionsGranted: ['cpe-platform-security-readers-dev', 'cpe-platform-security-readers-prod'],
    groupsMembership: ['cpe-platform-security-readers-cccsdev', 'cpe-platform-security-readers-cccsprod'],
    timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    justification: 'Quarterly review - all permissions appropriate'
  },
  {
    id: 'example-5',
    reviewId: 'review-2023-035',
    approverId: 'user-scott',
    approvedUserId: 'user-tom',
    environment: 'Commercial',
    jobFunctions: ['Cloud Platform Reader'],
    permissionsGranted: ['cpe-platform-readers-dev', 'cpe-platform-readers-prod'],
    groupsMembership: ['cpe-platform-readers-dev', 'cpe-platform-readers-prod'],
    timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    justification: 'Read-only access for monitoring and reporting'
  }
];

const AccessReviewLogTable: React.FC<AccessReviewLogTableProps> = ({ logs, isExample }) => {
  const displayLogs = isExample ? sampleExampleLogs : logs;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>User</TableHead>
          <TableHead>Job Function</TableHead>
          <TableHead>Environment</TableHead>
          <TableHead>Groups</TableHead>
          <TableHead>Permissions</TableHead>
          <TableHead>Approvers</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Justification</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {displayLogs.length === 0 ? (
          <TableRow>
            <TableCell colSpan={8} className="text-center py-4">
              No access review logs found
            </TableCell>
          </TableRow>
        ) : (
          displayLogs.map((log) => (
            <TableRow key={log.id}>
              <TableCell>
                {log.approvedUserId.replace('user-', '')}
              </TableCell>
              <TableCell>
                {log.jobFunctions.join(', ')}
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200">
                  {log.environment}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="max-w-xs">
                  {log.groupsMembership.slice(0, 2).map((group, index) => (
                    <div key={index} className="text-xs text-muted-foreground truncate">
                      {group}
                    </div>
                  ))}
                  {log.groupsMembership.length > 2 && (
                    <div className="text-xs text-muted-foreground">
                      +{log.groupsMembership.length - 2} more
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="max-w-xs">
                  {log.permissionsGranted.slice(0, 2).map((permission, index) => (
                    <div key={index} className="text-xs text-muted-foreground truncate">
                      {permission}
                    </div>
                  ))}
                  {log.permissionsGranted.length > 2 && (
                    <div className="text-xs text-muted-foreground">
                      +{log.permissionsGranted.length - 2} more
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                {isExample ? "Scott Dale" : log.approverId}
              </TableCell>
              <TableCell>
                {formatDistanceToNow(new Date(log.timestamp))} ago
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
