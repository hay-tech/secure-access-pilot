
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
import { Check, X } from "lucide-react";
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';

interface UnauthorizedUsersTableProps {
  users: any[];
  status: 'pending' | 'removed';
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
  if (users.length === 0) {
    return (
      <div className="text-center p-10 bg-muted/50 rounded-lg">
        <p className="text-muted-foreground">No unauthorized users found.</p>
      </div>
    );
  }

  return (
    <Table>
      <TableCaption>
        {status === 'pending' 
          ? 'These users have unauthorized access that needs to be reviewed.' 
          : 'These users have had their unauthorized access removed.'}
      </TableCaption>
      <TableHeader>
        <TableRow>
          {isManager && <TableHead className="w-[40px]"></TableHead>}
          <TableHead>User</TableHead>
          <TableHead>Department</TableHead>
          <TableHead>Access Items</TableHead>
          <TableHead>Violation Type</TableHead>
          <TableHead className="text-right">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map(user => (
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
            <TableCell>
              <ul className="list-disc list-inside text-xs">
                {user.gaps.map((gap: any, i: number) => (
                  <li key={i}>{gap.resourceName || gap.permissionName || 'Unknown Resource'}</li>
                ))}
              </ul>
            </TableCell>
            <TableCell>
              {user.gaps.some((gap: any) => gap.gapType === 'unauthorized_user') ? (
                <Badge variant="destructive">Unauthorized User</Badge>
              ) : (
                <Badge variant="outline">Excessive Permissions</Badge>
              )}
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
              ) : (
                <Badge variant="outline" className="bg-green-100 text-green-800">Removed</Badge>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default UnauthorizedUsersTable;
