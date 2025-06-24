
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Check, X, AlertTriangle } from "lucide-react";
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { useAccessReviewManagement } from '@/hooks/iam/useAccessReviewManagement';

interface UnauthorizedUsersTableProps {
  users: any[];
  status: 'removed' | 'frozen';
  isManager?: boolean;
  selectedUsers?: string[];
  onSelectUser?: (userId: string, checked: boolean) => void;
}

const UnauthorizedUsersTable: React.FC<UnauthorizedUsersTableProps> = ({ 
  users, 
  status,
  isManager = false,
  selectedUsers = [],
  onSelectUser = () => {}
}) => {
  const { getUsersByCSP } = useAccessReviewManagement();
  
  // Get the status caption text
  const getStatusCaption = () => {
    switch (status) {
      case 'removed':
        return 'These users have had their excessive permissions removed.';
      case 'frozen':
        return 'These accounts have been frozen due to no approval record found.';
      default:
        return '';
    }
  };

  // Mock unauthorized users data with updated structure
  const mockUnauthorizedUsers = [
    {
      userId: 'user1',
      userName: 'John Smith',
      jobFunction: 'Cloud Platform Administrator',
      environment: 'FedRAMP High',
      approvedGroups: ['cpe-platform-contributors-fedrampdev'],
      approvedPermissions: ['Viewer', 'Cloud SQL Editor'],
      currentGroups: ['cpe-platform-administrators-fedrampdev', 'cpe-platform-administrators-fedrampprod'],
      currentPermissions: ['Editor', 'Compute Admin', 'Storage Admin'],
      violationType: 'excessive',
      status: 'removed',
      gaps: [{ gapType: 'excess', resourceName: 'cpe-platform-administrators-dev' }]
    },
    {
      userId: 'user2',
      userName: 'Joe Doe',
      jobFunction: 'Cloud Platform Security Administrator',
      environment: 'CJIS',
      approvedGroups: ['None (No Approval Record)'],
      approvedPermissions: ['None (No Approval Record)'],
      currentGroups: ['cpe-platform-security-administrators-cjisprod'],
      currentPermissions: ['Security Admin', 'IAM Admin', 'Monitoring Admin'],
      violationType: 'unauthorized_user',
      status: 'frozen',
      gaps: [{ gapType: 'unauthorized_user' }]
    },
    {
      userId: 'user3',
      userName: 'Maria Garcia',
      jobFunction: 'Cloud Platform Security Reader',
      environment: 'CCCS',
      approvedGroups: ['cpe-platform-security-readers-cccsdev'],
      approvedPermissions: ['Viewer'],
      currentGroups: ['cpe-platform-security-readers-cccsdev', 'cpe-platform-security-readers-cccsprod'],
      currentPermissions: ['Viewer', 'Security Reviewer'],
      violationType: 'excessive',
      status: 'removed',
      gaps: [{ gapType: 'excess', resourceName: 'cpe-platform-security-readers-cccsprod' }]
    }
  ];
  
  // Filter mock data based on status
  const filteredUsers = mockUnauthorizedUsers.filter(user => 
    (status === 'removed' && user.violationType === 'excessive') ||
    (status === 'frozen' && user.violationType === 'unauthorized_user')
  );

  // If no users, show empty state
  if (filteredUsers.length === 0) {
    return (
      <div className="text-center p-10 bg-muted/50 rounded-lg">
        <p className="text-muted-foreground">No unauthorized users found.</p>
      </div>
    );
  }

  return (
    <Table>
      <TableCaption>{getStatusCaption()}</TableCaption>
      <TableHeader>
        <TableRow>
          {isManager && <TableHead className="w-[40px]"></TableHead>}
          <TableHead>User</TableHead>
          <TableHead>Job Function</TableHead>
          <TableHead>Environment</TableHead>
          <TableHead>Approved Groups</TableHead>
          <TableHead>Approved Permissions</TableHead>
          <TableHead>Current Groups</TableHead>
          <TableHead>Current Permissions</TableHead>
          <TableHead>Violation Type</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredUsers.map((user) => {
          const isExcessPermissions = user.violationType === 'excessive';
          
          return (
            <TableRow key={user.userId}>
              {isManager && (
                <TableCell>
                  <Checkbox
                    checked={selectedUsers.includes(user.userId)}
                    onCheckedChange={(checked) => onSelectUser(user.userId, !!checked)}
                  />
                </TableCell>
              )}
              <TableCell className="font-medium">
                {user.userName || 'Unknown User'}
                <div className="text-xs text-muted-foreground">{user.userId}</div>
              </TableCell>
              <TableCell>{user.jobFunction || 'N/A'}</TableCell>
              <TableCell>
                <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200">
                  {user.environment}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="max-w-xs">
                  {user.approvedGroups.slice(0, 2).map((group, index) => (
                    <div key={index} className="text-xs text-muted-foreground truncate">
                      {group}
                    </div>
                  ))}
                  {user.approvedGroups.length > 2 && (
                    <div className="text-xs text-muted-foreground">
                      +{user.approvedGroups.length - 2} more
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="max-w-xs">
                  {user.approvedPermissions.slice(0, 2).map((permission, index) => (
                    <div key={index} className="text-xs text-muted-foreground truncate">
                      {permission}
                    </div>
                  ))}
                  {user.approvedPermissions.length > 2 && (
                    <div className="text-xs text-muted-foreground">
                      +{user.approvedPermissions.length - 2} more
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="max-w-xs">
                  {user.currentGroups.slice(0, 2).map((group, index) => (
                    <div key={index} className="text-xs text-muted-foreground truncate">
                      {group}
                    </div>
                  ))}
                  {user.currentGroups.length > 2 && (
                    <div className="text-xs text-muted-foreground">
                      +{user.currentGroups.length - 2} more
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="max-w-xs">
                  {user.currentPermissions.slice(0, 2).map((permission, index) => (
                    <div key={index} className="text-xs text-muted-foreground truncate">
                      {permission}
                    </div>
                  ))}
                  {user.currentPermissions.length > 2 && (
                    <div className="text-xs text-muted-foreground">
                      +{user.currentPermissions.length - 2} more
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                {isExcessPermissions ? (
                  <Badge variant="outline" className="bg-amber-100 text-amber-800">Excessive Permissions</Badge>
                ) : (
                  <Badge variant="destructive">No Approval Record</Badge>
                )}
              </TableCell>
              <TableCell>
                {user.status === 'removed' ? (
                  <Badge variant="outline" className="bg-green-100 text-green-800">Permissions Removed</Badge>
                ) : (
                  <Badge variant="outline" className="bg-amber-100 text-amber-800 flex items-center">
                    <AlertTriangle className="h-3 w-3 mr-1" /> Account Disabled
                  </Badge>
                )}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default UnauthorizedUsersTable;
