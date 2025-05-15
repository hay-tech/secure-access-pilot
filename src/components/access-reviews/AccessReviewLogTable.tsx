
import React from 'react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useIAM } from '@/contexts/IAMContext';
import { AccessReviewLog } from '@/types/iam';
import { jobFunctionDefinitions } from '@/data/mockJobFunctions';

interface AccessReviewLogTableProps {
  logs: AccessReviewLog[];
}

const AccessReviewLogTable: React.FC<AccessReviewLogTableProps> = ({ logs }) => {
  const { users } = useIAM();
  
  // Get job function name from ID
  const getJobFunctionName = (id: string) => {
    const jobFunction = jobFunctionDefinitions.find(jf => jf.id === id);
    return jobFunction ? jobFunction.title : id;
  };
  
  // Get user name from ID
  const getUserName = (userId: string) => {
    const user = users.find(u => u.id === userId);
    return user ? `${user.firstName} ${user.lastName}` : userId;
  };
  
  // Format permission group name from job function
  const formatPermissionGroupName = (jobFunction: string) => {
    return jobFunction.toLowerCase().replace(/\s+/g, '-') + '-permissions';
  };
  
  // Get decision badge style
  const getDecisionBadge = (decision: string) => {
    switch (decision) {
      case 'maintain':
        return <Badge className="bg-green-100 text-green-800 border-green-300">Approved</Badge>;
      case 'revoke':
        return <Badge className="bg-red-100 text-red-800 border-red-300">Revoked</Badge>;
      case 'modify':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-300">Modified</Badge>;
      default:
        return <Badge>{decision}</Badge>;
    }
  };

  // If no logs, create sample data for demonstration
  const displayLogs = logs.length > 0 ? logs : [
    {
      id: 'sample1',
      reviewId: 'rev1',
      environment: 'Federal',
      approvedUserId: 'user1',
      jobFunctions: ['cloud-platform-admin'],
      permissionsGranted: ['platform:read', 'platform:create', 'platform:update', 'platform:delete'],
      groupsMembership: [],
      approverId: 'user2',
      decision: 'maintain',
      timestamp: new Date().toISOString(),
    },
    {
      id: 'sample2',
      reviewId: 'rev2',
      environment: 'Commercial',
      approvedUserId: 'user3',
      jobFunctions: ['cloud-platform-security-reader'],
      permissionsGranted: ['security:read', 'logs:read', 'monitor:read'],
      groupsMembership: [],
      approverId: 'user2',
      decision: 'revoke',
      timestamp: new Date(Date.now() - 86400000).toISOString(), // Yesterday
    },
    {
      id: 'sample3',
      reviewId: 'rev3',
      environment: 'GovCloud',
      approvedUserId: 'user4',
      jobFunctions: ['cloud-platform-contributor'],
      permissionsGranted: ['compute:read', 'compute:update', 'storage:read', 'storage:update'],
      groupsMembership: [],
      approverId: 'user6',
      decision: 'modify',
      timestamp: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    }
  ];

  return (
    <ScrollArea className="h-[500px] w-full rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Environment</TableHead>
            <TableHead>User</TableHead>
            <TableHead>Job Function</TableHead>
            <TableHead>Permissions</TableHead>
            <TableHead>Approver</TableHead>
            <TableHead>Decision</TableHead>
            <TableHead>Date/Time</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {displayLogs.map((log) => {
            const jobFunctionNames = log.jobFunctions.map(jfId => {
              // Find the corresponding job function definition
              const jobFunction = jobFunctionDefinitions.find(jf => jf.id === jfId);
              return jobFunction ? jobFunction.title : jfId;
            });

            return (
              <TableRow key={log.id}>
                <TableCell>{log.environment}</TableCell>
                <TableCell>{getUserName(log.approvedUserId)}</TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    {jobFunctionNames.map((name, i) => (
                      <div key={i}>{name}</div>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    {jobFunctionNames.map((name, i) => {
                      const groupName = formatPermissionGroupName(name);
                      return (
                        <Badge key={i} variant="outline" className="bg-blue-50 font-mono text-xs">
                          {groupName}
                        </Badge>
                      );
                    })}
                    {log.permissionsGranted.length > 0 && (
                      <div className="text-xs text-muted-foreground mt-1">
                        {log.permissionsGranted.length} permission(s)
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>{getUserName(log.approverId)}</TableCell>
                <TableCell>{getDecisionBadge(log.decision)}</TableCell>
                <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </ScrollArea>
  );
};

export default AccessReviewLogTable;
