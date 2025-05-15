
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
          {logs.length > 0 ? (
            logs.map((log) => (
              <TableRow key={log.id}>
                <TableCell>{log.environment}</TableCell>
                <TableCell>{getUserName(log.approvedUserId)}</TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    {log.jobFunctions.map(jfId => (
                      <div key={jfId}>{getJobFunctionName(jfId)}</div>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    {log.permissionsGranted.length > 3 ? (
                      <>
                        <span>{log.permissionsGranted.slice(0, 2).join(', ')}</span>
                        <Badge variant="outline">{log.permissionsGranted.length - 2} more</Badge>
                      </>
                    ) : (
                      log.permissionsGranted.join(', ')
                    )}
                  </div>
                </TableCell>
                <TableCell>{getUserName(log.approverId)}</TableCell>
                <TableCell>{getDecisionBadge(log.decision)}</TableCell>
                <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                No access review logs found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </ScrollArea>
  );
};

export default AccessReviewLogTable;
