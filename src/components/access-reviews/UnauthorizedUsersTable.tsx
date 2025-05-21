
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

  // Get status badge
  const getStatusBadge = (userStatus: 'removed' | 'frozen', violationType?: string) => {
    switch (userStatus) {
      case 'removed':
        return <Badge variant="outline" className="bg-green-100 text-green-800">Permissions Removed</Badge>;
      case 'frozen':
        return <Badge variant="outline" className="bg-amber-100 text-amber-800">Account Frozen</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  // Mock unauthorized users data
  const mockUnauthorizedUsers = [
    {
      userId: 'user1',
      userName: 'John Smith',
      department: 'CPE DLT',
      currentRole: 'CPE Platform Administrator',
      approvedRole: 'CPE Platform Reader',
      violationType: 'excessive',
      status: 'removed',
      gaps: [{ gapType: 'excess', resourceName: 'cpe-platform-administrators-dev' }]
    },
    {
      userId: 'user2',
      userName: 'Joe Doe',
      department: 'CPE Security',
      currentRole: 'CPE Platform Security Administrator',
      approvedRole: 'None (No Approval Record)',
      violationType: 'unauthorized_user',
      status: 'frozen',
      gaps: [{ gapType: 'unauthorized_user' }]
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
          <TableHead>Department</TableHead>
          <TableHead>Current Role</TableHead>
          <TableHead>Approved Role</TableHead>
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
              <TableCell>{user.department || 'Unknown'}</TableCell>
              <TableCell>{user.currentRole || 'N/A'}</TableCell>
              <TableCell>{user.approvedRole || 'N/A'}</TableCell>
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
