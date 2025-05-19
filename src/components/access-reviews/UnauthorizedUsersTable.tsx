
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User, PermissionGap } from '@/types/iam';
import { UserPlus, X, Check, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface UnauthorizedUsersTableProps {
  users: Array<{ user: User; gaps: PermissionGap[] }>;
  status: 'pending' | 'removed';
}

const UnauthorizedUsersTable: React.FC<UnauthorizedUsersTableProps> = ({ users, status }) => {
  const navigate = useNavigate();
  
  const handleReprovisionAccess = (userId: string) => {
    navigate(`/onboarding?userId=${userId}`);
  };
  
  if (users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <AlertTriangle className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium">
          No {status === 'pending' ? 'pending' : 'removed'} unauthorized users found
        </h3>
        <p className="text-muted-foreground mt-2">
          {status === 'pending' 
            ? "There are no users with unauthorized access pending action." 
            : "There are no users with access that has been removed."}
        </p>
      </div>
    );
  }
  
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Environment</TableHead>
          <TableHead>Employee Name</TableHead>
          <TableHead>Job Function</TableHead>
          <TableHead>Department</TableHead>
          <TableHead>Access Type</TableHead>
          <TableHead>Issue</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map(({ user, gaps }) => (
          <TableRow key={user.id}>
            <TableCell>Federal</TableCell>
            <TableCell className="font-medium">
              {user.firstName} {user.lastName}
            </TableCell>
            <TableCell>
              {user.jobFunction || user.jobFunctions?.join(', ') || 'N/A'}
            </TableCell>
            <TableCell>{user.department}</TableCell>
            <TableCell>
              <Badge variant={status === 'pending' ? 'destructive' : 'outline'}>
                {status === 'pending' ? 'Unauthorized' : 'Removed'}
              </Badge>
            </TableCell>
            <TableCell>
              <div className="max-w-xs">
                {gaps.filter(g => g.gapType === 'unauthorized_user').map((gap, idx) => (
                  <div key={idx} className="text-sm text-red-600">
                    {gap.description}
                  </div>
                ))}
              </div>
            </TableCell>
            <TableCell>
              {status === 'pending' ? (
                <div className="flex items-center gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => console.log('Remove access')}
                    className="bg-red-50 text-red-700 hover:bg-red-100 hover:text-red-800 border-red-200"
                  >
                    <X className="h-4 w-4 mr-1" /> Remove
                  </Button>
                </div>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleReprovisionAccess(user.id)}
                  className="bg-blue-50 text-blue-700 hover:bg-blue-100 hover:text-blue-800 border-blue-200"
                >
                  <UserPlus className="h-4 w-4 mr-1" /> Re-Provision
                </Button>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default UnauthorizedUsersTable;
