
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { AccessReviewLog } from '@/types/iam';
import { format } from 'date-fns';

interface AccessReviewLogTableProps {
  logs: AccessReviewLog[];
}

const AccessReviewLogTable: React.FC<AccessReviewLogTableProps> = ({ logs }) => {
  // Mock group data based on job functions
  const mockGroups = {
    'Cloud Account Owner': ['cpe-cloud-account-owners'],
    'Cloud IAM Administrator': ['cpe-iam-administrators'],
    'Cloud IAM Reader': ['cpe-iam-readers'],
    'Cloud Platform Tenant Administrator': ['cpe-platform-tenant-administrators'],
    'Cloud Platform Administrator': ['cpe-platform-administrators-dev', 'cpe-platform-administrators-stage', 'cpe-platform-administrators-prod'],
    'Cloud Platform Contributor': ['cpe-platform-contributors-dev', 'cpe-platform-contributors-stage', 'cpe-platform-contributors-prod'],
    'Cloud Platform Reader': ['cpe-platform-readers-dev', 'cpe-platform-readers-stage', 'cpe-platform-readers-prod'],
    'Cloud Platform Security Administrator': ['cpe-platform-security-administrators-dev', 'cpe-platform-security-administrators-stage', 'cpe-platform-security-administrators-prod'],
    'Cloud Platform Security Contributor': ['cpe-platform-security-contributors-dev', 'cpe-platform-security-contributors-stage', 'cpe-platform-security-contributors-prod'],
    'Cloud Platform Security Reader': ['cpe-platform-security-readers-dev', 'cpe-platform-security-readers-stage', 'cpe-platform-security-readers-prod'],
    'Cloud Platform FinOps Administrator': ['cpe-platform-finops-administrators-dev', 'cpe-platform-finops-administrators-stage', 'cpe-platform-finops-administrators-prod'],
    'Cloud Platform Site Reliability Engineer': ['cpe-platform-sre-dev', 'cpe-platform-sre-stage', 'cpe-platform-sre-prod']
  };

  // Function to get groups based on job functions
  const getGroups = (jobFunctions: string[]) => {
    let groups: string[] = [];
    jobFunctions.forEach(jf => {
      const jfGroups = mockGroups[jf as keyof typeof mockGroups] || [];
      groups = [...groups, ...jfGroups];
    });
    return groups.length > 0 ? groups : ['No groups assigned'];
  };

  if (!logs || logs.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No access review logs found.
      </div>
    );
  }

  return (
    <Table>
      <TableCaption>Access review accountability database records</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Reviewer</TableHead>
          <TableHead>User</TableHead>
          <TableHead>Environment</TableHead>
          <TableHead>Job Functions</TableHead>
          <TableHead>Group(s)</TableHead>
          <TableHead>Decision</TableHead>
          <TableHead>Justification</TableHead>
          <TableHead>Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {logs.map((log) => (
          <TableRow key={log.id}>
            <TableCell className="font-medium">{log.approverId}</TableCell>
            <TableCell>{log.approvedUserId}</TableCell>
            <TableCell>{log.environment}</TableCell>
            <TableCell>
              <div className="max-w-[200px]">
                {log.jobFunctions.map((jf) => (
                  <Badge key={jf} variant="outline" className="mr-1 mb-1">
                    {jf}
                  </Badge>
                ))}
              </div>
            </TableCell>
            <TableCell>
              <div className="max-w-[200px] text-xs">
                {getGroups(log.jobFunctions).map((group) => (
                  <div key={group} className="mb-1">
                    {group}
                  </div>
                ))}
              </div>
            </TableCell>
            <TableCell>
              <Badge
                variant={log.decision === 'maintain' ? 'outline' : log.decision === 'revoke' ? 'destructive' : 'secondary'}
              >
                {log.decision}
              </Badge>
            </TableCell>
            <TableCell>
              <span className="text-xs">{log.justification || "No change"}</span>
            </TableCell>
            <TableCell className="text-nowrap">
              {format(new Date(log.timestamp), 'MMM d, yyyy')}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default AccessReviewLogTable;
