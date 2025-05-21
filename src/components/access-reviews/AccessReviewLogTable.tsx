
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
  
  // Format group name from job function
  const formatGroupName = (jobFunction: string, environment?: string) => {
    const baseGroup = jobFunction.toLowerCase().replace(/\s+/g, '-');
    const environments = ['dev', 'stage', 'prod', 'cjisstage', 'cjisprod'];
    
    // If an environment is specified, add it to the name
    if (environment && environments.includes(environment.toLowerCase())) {
      return `cpe-${baseGroup}-${environment.toLowerCase()}`;
    }
    
    // Choose a random environment for demo purposes
    const randomEnv = environments[Math.floor(Math.random() * environments.length)];
    return `cpe-${baseGroup}-${randomEnv}`;
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

  // Generate groups based on job function
  const getGroupsFromJobFunction = (jobFunctionId: string): string[] => {
    const jobFunction = jobFunctionDefinitions.find(jf => jf.id === jobFunctionId);
    if (!jobFunction) return [];
    
    const baseGroupName = jobFunction.title.toLowerCase().replace(/\s+/g, '-');
    
    // Generate different environment groups based on job function
    const environments = ['dev', 'stage', 'prod'];
    
    // For platform security roles, add additional environments
    if (baseGroupName.includes('security')) {
      environments.push('cjisstage', 'cjisprod');
    }
    
    // Format group names according to the pattern
    return environments.map(env => `cpe-${baseGroupName}-${env}`);
  };

  // If no logs, create sample data for demonstration
  const displayLogs = logs.length > 0 ? logs : [
    {
      id: 'sample1',
      reviewId: 'rev1',
      environment: 'Federal',
      approvedUserId: 'user1',
      jobFunctions: ['cloud-platform-admin'],
      permissionsGranted: [],
      groupsMembership: ['cpe-platform-administrators-dev', 'cpe-platform-administrators-stage'],
      approverId: 'user2',
      decision: 'maintain',
      timestamp: new Date().toISOString(),
      justification: 'Required for cloud platform management duties',
    },
    {
      id: 'sample2',
      reviewId: 'rev2',
      environment: 'Commercial',
      approvedUserId: 'user3',
      jobFunctions: ['cloud-platform-security-reader'],
      permissionsGranted: [],
      groupsMembership: ['cpe-platform-security-readers-dev', 'cpe-platform-security-readers-prod'],
      approverId: 'user2',
      decision: 'revoke',
      timestamp: new Date(Date.now() - 86400000).toISOString(), // Yesterday
      justification: 'Employee transfer to different team',
    },
    {
      id: 'sample3',
      reviewId: 'rev3',
      environment: 'GovCloud',
      approvedUserId: 'user4',
      jobFunctions: ['cloud-platform-contributor'],
      permissionsGranted: [],
      groupsMembership: ['cpe-platform-contributors-dev', 'cpe-platform-contributors-cjisstage'],
      approverId: 'user6',
      decision: 'modify',
      timestamp: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
      justification: 'Access scope reduced to align with current responsibilities',
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
            <TableHead>Group(s)</TableHead>
            <TableHead>Approver</TableHead>
            <TableHead>Decision</TableHead>
            <TableHead>Justification</TableHead>
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

            // Get appropriate groups for job functions
            const groups = log.groupsMembership && log.groupsMembership.length > 0 
              ? log.groupsMembership 
              : jobFunctionNames.flatMap(name => {
                  const baseGroup = name.toLowerCase().replace(/\s+/g, '-');
                  const environments = ['dev', 'stage', 'prod'];
                  return environments.map(env => `cpe-${baseGroup}-${env}`);
                }).slice(0, 2);

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
                    {groups.map((group, i) => (
                      <Badge key={i} variant="outline" className="bg-blue-50 font-mono text-xs">
                        {group}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>{getUserName(log.approverId)}</TableCell>
                <TableCell>{getDecisionBadge(log.decision)}</TableCell>
                <TableCell className="max-w-[200px] truncate">{log.justification || "No justification provided"}</TableCell>
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
