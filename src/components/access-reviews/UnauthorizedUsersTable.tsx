
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
  status: 'pending' | 'removed' | 'frozen';
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
      case 'pending':
        return 'These users have unauthorized access that needs to be reviewed.';
      case 'removed':
        return 'These users have had their excessive permissions removed.';
      case 'frozen':
        return 'These accounts have been frozen due to no approval record found.';
      default:
        return '';
    }
  };

  // Get status badge
  const getStatusBadge = (userStatus: 'pending' | 'removed' | 'frozen', violationType?: string) => {
    switch (userStatus) {
      case 'pending':
        return violationType === 'unauthorized_user' ? 
          <Badge variant="destructive">Unauthorized User</Badge> :
          <Badge variant="outline">Excessive Permissions</Badge>;
      case 'removed':
        return <Badge variant="outline" className="bg-green-100 text-green-800">Permissions Removed</Badge>;
      case 'frozen':
        return <Badge variant="outline" className="bg-amber-100 text-amber-800">Account Frozen</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  // If no users, show empty state
  if (users.length === 0) {
    return (
      <div className="text-center p-10 bg-muted/50 rounded-lg">
        <p className="text-muted-foreground">No unauthorized users found.</p>
      </div>
    );
  }

  // Add mock data for different unauthorized users types
  const enhancedUsers = users.map((user, index) => {
    // For demo purposes, alternate between unauthorized user and excessive permissions
    const isUnauthorized = index % 2 === 0;
    
    return {
      ...user,
      gaps: user.gaps.map((gap: any) => ({
        ...gap,
        gapType: isUnauthorized ? 'unauthorized_user' : 'excess',
        permissionName: isUnauthorized ? undefined : `cpe-platform-administrators-${['dev', 'stage', 'prod'][index % 3]}`,
        resourceName: isUnauthorized ? undefined : `cpe-platform-administrators-${['dev', 'stage', 'prod'][index % 3]}`
      })),
      department: user.user.department || ['IT', 'Security', 'Finance', 'HR'][index % 4],
      userName: `${user.user.firstName} ${user.user.lastName}`,
      userId: user.user.id
    };
  });

  return (
    <Table>
      <TableCaption>{getStatusCaption()}</TableCaption>
      <TableHeader>
        <TableRow>
          {isManager && <TableHead className="w-[40px]"></TableHead>}
          <TableHead>User</TableHead>
          <TableHead>Department</TableHead>
          <TableHead>Access Items</TableHead>
          <TableHead>Violation Type</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {enhancedUsers.map((user) => {
          const isExcessPermissions = user.gaps.some((gap: any) => gap.gapType === 'excess');
          
          return (
            <TableRow key={user.userId}>
              {isManager && (
                <TableCell>
                  {status === 'pending' && (
                    <Checkbox
                      checked={selectedUsers.includes(user.userId)}
                      onCheckedChange={(checked) => onSelectUser(user.userId, !!checked)}
                    />
                  )}
                </TableCell>
              )}
              <TableCell className="font-medium">
                {user.userName || 'Unknown User'}
                <div className="text-xs text-muted-foreground">{user.userId}</div>
              </TableCell>
              <TableCell>{user.department || 'Unknown'}</TableCell>
              <TableCell>
                <ul className="list-disc list-inside text-xs">
                  {user.gaps.map((gap: any, i: number) => (
                    <li key={i} className="truncate max-w-[200px]">
                      {gap.resourceName || gap.permissionName || 'Unauthorized Access'}
                    </li>
                  ))}
                </ul>
              </TableCell>
              <TableCell>
                {isExcessPermissions ? (
                  <Badge variant="outline" className="bg-amber-100 text-amber-800">Excessive Permissions</Badge>
                ) : (
                  <Badge variant="destructive">No Approval Record</Badge>
                )}
              </TableCell>
              <TableCell>
                {getStatusBadge(status, user.gaps[0]?.gapType)}
              </TableCell>
              <TableCell className="text-right">
                {status === 'pending' ? (
                  <div className="flex justify-end gap-2">
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-green-600">
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-red-600">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : status === 'removed' ? (
                  <Badge variant="outline" className="bg-green-100 text-green-800">Removed</Badge>
                ) : (
                  <Badge variant="outline" className="bg-amber-100 text-amber-800 flex items-center">
                    <AlertTriangle className="h-3 w-3 mr-1" /> Frozen
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
