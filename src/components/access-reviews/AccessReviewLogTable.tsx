
import React from 'react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AccessReviewLog } from "@/types/iam";
import { Badge } from "@/components/ui/badge";
import { FileText, Calendar } from "lucide-react";

interface AccessReviewLogTableProps {
  logs: AccessReviewLog[];
}

const AccessReviewLogTable: React.FC<AccessReviewLogTableProps> = ({ logs }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    }).format(date);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-6 w-6 text-primary" />
          Approval Accountability Log
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[180px]">Date/Time</TableHead>
              <TableHead>Approver</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Environment</TableHead>
              <TableHead>Job Function</TableHead>
              <TableHead>Decision</TableHead>
              <TableHead>Permissions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.map((log) => (
              <TableRow key={log.id}>
                <TableCell className="flex items-center gap-2 whitespace-nowrap">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  {formatDate(log.timestamp)}
                </TableCell>
                <TableCell>{log.approverId}</TableCell>
                <TableCell>{log.approvedUserId}</TableCell>
                <TableCell>
                  <Badge>{log.environment}</Badge>
                </TableCell>
                <TableCell>
                  {log.jobFunctions.map((jf, i) => (
                    <Badge key={i} variant="outline" className="mr-1">
                      {jf}
                    </Badge>
                  ))}
                </TableCell>
                <TableCell>
                  <Badge 
                    variant={log.decision === 'maintain' ? 'default' : 
                           log.decision === 'revoke' ? 'destructive' : 
                           'outline'}
                  >
                    {log.decision === 'maintain' ? 'Approved' : 
                     log.decision === 'revoke' ? 'Revoked' : 
                     'Modified'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className="text-muted-foreground text-sm">
                    {log.permissionsGranted.length} permissions
                  </span>
                </TableCell>
              </TableRow>
            ))}
            
            {logs.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No approval logs found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default AccessReviewLogTable;
