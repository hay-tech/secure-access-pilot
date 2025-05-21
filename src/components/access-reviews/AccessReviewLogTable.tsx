
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
    'Cloud Platform Administrator': ['cpe-platform-administrators-dev', 'cpe-platform-administrators-stage', 'cpe-platform-administrators-prod', 'cpe-platform-administrators-cjisstage', 'cpe-platform-administrators-cjisprod'],
    'Cloud Platform Contributor': ['cpe-platform-contributors-dev', 'cpe-platform-contributors-stage', 'cpe-platform-contributors-prod', 'cpe-platform-contributors-cjisstage', 'cpe-platform-contributors-cjisprod'],
    'Cloud Platform Reader': ['cpe-platform-readers-dev', 'cpe-platform-readers-stage', 'cpe-platform-readers-prod', 'cpe-platform-readers-cjisstage', 'cpe-platform-readers-cjisprod'],
    'Cloud Platform Security Administrator': ['cpe-platform-security-administrators-dev', 'cpe-platform-security-administrators-stage', 'cpe-platform-security-administrators-prod', 'cpe-platform-security-administrators-cjisstage', 'cpe-platform-security-administrators-cjisprod'],
    'Cloud Platform Security Contributor': ['cpe-platform-security-contributors-dev', 'cpe-platform-security-contributors-stage', 'cpe-platform-security-contributors-prod', 'cpe-platform-security-contributors-cjisstage', 'cpe-platform-security-contributors-cjisprod'],
    'Cloud Platform Security Reader': ['cpe-platform-security-readers-dev', 'cpe-platform-security-readers-stage', 'cpe-platform-security-readers-prod', 'cpe-platform-security-readers-cjisstage', 'cpe-platform-security-readers-cjisprod'],
    'Cloud Platform FinOps Administrator': ['cpe-platform-finops-administrators-dev', 'cpe-platform-finops-administrators-stage', 'cpe-platform-finops-administrators-prod', 'cpe-platform-finops-administrators-cjisstage', 'cpe-platform-finops-administrators-cjisprod'],
    'Cloud Platform Site Reliability Engineer': ['cpe-platform-sre-dev', 'cpe-platform-sre-stage', 'cpe-platform-sre-prod', 'cpe-platform-sre-cjisstage', 'cpe-platform-sre-cjisprod']
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
          <TableHead>Access Type</TableHead>
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
                {log.groupsMembership?.map((group) => (
                  <div key={group} className="mb-1">
                    {group}
                  </div>
                )) || getGroups(log.jobFunctions).map((group) => (
                  <div key={group} className="mb-1">
                    {group}
                  </div>
                ))}
              </div>
            </TableCell>
            <TableCell>
              <Badge variant="outline">Permanent</Badge>
            </TableCell>
            <TableCell>
              <Badge
                variant={log.decision === 'maintain' ? 'secondary' : log.decision === 'revoke' ? 'destructive' : 'outline'}
              >
                {log.decision === 'maintain' ? 'Approved' : log.decision === 'revoke' ? 'Rejected' : log.decision}
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
