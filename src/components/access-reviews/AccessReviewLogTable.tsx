
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
  // Mock group data based on job functions and environments
  const mockGroups = {
    'FedRamp': {
      'Cloud Platform Administrator': ['cpe-platform-administrators-fedrampdev', 'cpe-platform-administrators-fedrampstage', 'cpe-platform-administrators-fedramprod'],
      'Cloud Platform Contributor': ['cpe-platform-contributors-fedrampdev', 'cpe-platform-contributors-fedrampstage', 'cpe-platform-contributors-fedramprod'],
      'Cloud Platform Reader': ['cpe-platform-readers-fedrampdev', 'cpe-platform-readers-fedrampstage', 'cpe-platform-readers-fedramprod'],
      'Cloud Platform Security Administrator': ['cpe-platform-security-administrators-fedrampdev', 'cpe-platform-security-administrators-fedrampstage', 'cpe-platform-security-administrators-fedramprod'],
    },
    'CJIS': {
      'Cloud Platform Administrator': ['cpe-platform-administrators-cjisdev', 'cpe-platform-administrators-cjisstage', 'cpe-platform-administrators-cjisprod'],
      'Cloud Platform Contributor': ['cpe-platform-contributors-cjisdev', 'cpe-platform-contributors-cjisstage', 'cpe-platform-contributors-cjisprod'],
      'Cloud Platform Reader': ['cpe-platform-readers-cjisdev', 'cpe-platform-readers-cjisstage', 'cpe-platform-readers-cjisprod'],
      'Cloud Platform Security Administrator': ['cpe-platform-security-administrators-cjisdev', 'cpe-platform-security-administrators-cjisstage', 'cpe-platform-security-administrators-cjisprod'],
    },
    'CCCS': {
      'Cloud Platform Administrator': ['cpe-platform-administrators-cccsdev', 'cpe-platform-administrators-cccsstage', 'cpe-platform-administrators-cccsprod'],
      'Cloud Platform Contributor': ['cpe-platform-contributors-cccsdev', 'cpe-platform-contributors-cccsstage', 'cpe-platform-contributors-cccsprod'],
      'Cloud Platform Reader': ['cpe-platform-readers-cccsdev', 'cpe-platform-readers-cccsstage', 'cpe-platform-readers-cccsprod'],
      'Cloud Platform Security Administrator': ['cpe-platform-security-administrators-cccsdev', 'cpe-platform-security-administrators-cccsstage', 'cpe-platform-security-administrators-cccsprod'],
    }
  };

  // Function to get groups based on job functions and environment
  const getGroups = (jobFunctions: string[], environment: string) => {
    let groups: string[] = [];
    const envGroups = mockGroups[environment as keyof typeof mockGroups] || {};
    
    jobFunctions.forEach(jf => {
      const jfGroups = envGroups[jf as keyof typeof envGroups] || [];
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
          <TableHead>Approver</TableHead>
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
                )) || getGroups(log.jobFunctions, log.environment).map((group) => (
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
