
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { AuditLog, User } from '@/types/iam';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipTrigger 
} from '@/components/ui/tooltip';
import { InfoIcon } from 'lucide-react';

interface AuditLogsTableProps {
  logs: AuditLog[];
  users: User[];
}

export const AuditLogsTable: React.FC<AuditLogsTableProps> = ({ logs, users }) => {
  const getUserName = (userId: string) => {
    const user = users.find(u => u.id === userId);
    return user ? `${user.firstName} ${user.lastName}` : 'Unknown User';
  };

  const getEventTypeDisplay = (type: string) => {
    switch (type) {
      case 'login':
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">Login</Badge>;
      case 'logout':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">Logout</Badge>;
      case 'access_request':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">Access Request</Badge>;
      case 'approval':
        return <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-300">Approval</Badge>;
      case 'role_change':
        return <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300">Role Change</Badge>;
      case 'permission_change':
        return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">Permission Change</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Timestamp</TableHead>
            <TableHead>Event Type</TableHead>
            <TableHead>User</TableHead>
            <TableHead>Details</TableHead>
            <TableHead>IP Address</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.length > 0 ? (
            logs.map((log) => (
              <TableRow key={log.id}>
                <TableCell className="font-medium">
                  {format(new Date(log.timestamp), 'MMM d, yyyy HH:mm:ss')}
                </TableCell>
                <TableCell>{getEventTypeDisplay(log.eventType)}</TableCell>
                <TableCell>{getUserName(log.userId)}</TableCell>
                <TableCell className="max-w-sm truncate">
                  <div className="flex items-center gap-1">
                    {log.details}
                    {log.details.length > 60 && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <InfoIcon className="h-4 w-4 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">{log.details}</p>
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </div>
                </TableCell>
                <TableCell>{log.ipAddress || 'N/A'}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
                No audit logs found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
