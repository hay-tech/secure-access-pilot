
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
import { UserPlus, AlertTriangle } from 'lucide-react';
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
  
  // Creating mock users for the example
  const mockUsers = [
    {
      user: {
        id: 'mock1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        department: 'Engineering',
        jobFunction: 'Platform Engineer'
      },
      gaps: [{
        userId: 'mock1',
        gapType: 'unauthorized_user', 
        description: 'User has no valid job function assignment',
        severity: 'Critical' as const
      }]
    },
    {
      user: {
        id: 'mock2',
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@example.com',
        department: 'Security',
        jobFunction: 'Security Analyst'
      },
      gaps: [{
        userId: 'mock2',
        gapType: 'unauthorized_user',
        description: 'User has excessive permissions for their job function',
        severity: 'High' as const
      }]
    },
    {
      user: {
        id: 'mock3',
        firstName: 'Robert',
        lastName: 'Johnson',
        email: 'robert.johnson@example.com',
        department: 'IT',
        jobFunction: 'System Administrator'
      },
      gaps: [{
        userId: 'mock3',
        gapType: 'unauthorized_user',
        description: 'User account has been dormant for over 90 days',
        severity: 'Medium' as const
      }]
    }
  ];
  
  // Combine real and mock users based on status
  const displayUsers = status === 'pending' ? [...users, ...mockUsers] : mockUsers;
  
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
          {status === 'removed' && <TableHead>Actions</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {displayUsers.map(({ user, gaps }) => (
          <TableRow key={user.id}>
            <TableCell>Federal</TableCell>
            <TableCell className="font-medium">
              {user.firstName} {user.lastName}
            </TableCell>
            <TableCell>
              {user.jobFunction || (user.jobFunctions && user.jobFunctions.length > 0 ? user.jobFunctions.join(', ') : 'N/A')}
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
            {status === 'removed' && (
              <TableCell>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleReprovisionAccess(user.id)}
                  className="bg-blue-50 text-blue-700 hover:bg-blue-100 hover:text-blue-800 border-blue-200"
                >
                  <UserPlus className="h-4 w-4 mr-1" /> Re-Provision
                </Button>
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default UnauthorizedUsersTable;
