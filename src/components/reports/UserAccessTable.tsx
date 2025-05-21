
import React from 'react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from '@/components/ui/badge';
import { User, AccessReview } from '@/types/iam';
import { jobFunctionDefinitions } from '@/data/mockJobFunctions';
import { format } from 'date-fns';

interface UserAccessTableProps {
  users: User[];
  accessReviews: AccessReview[];
}

export const UserAccessTable: React.FC<UserAccessTableProps> = ({ users, accessReviews }) => {
  // Get the job function name by ID
  const getJobFunctionName = (id: string) => {
    const jobFunction = jobFunctionDefinitions.find(jf => jf.id === id);
    return jobFunction ? jobFunction.title : id;
  };
  
  // Generate random review status for demo
  const getReviewStatus = (userId: string) => {
    const statuses = ['Completed', 'Pending', 'Overdue'];
    // Use userId to get consistent but seemingly random status
    const statusIndex = userId.charCodeAt(0) % statuses.length;
    return statuses[statusIndex];
  };
  
  // Generate color for status badge
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Overdue':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <ScrollArea className="h-[500px]">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Job Functions</TableHead>
            <TableHead>Last Review Date</TableHead>
            <TableHead>Review Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="h-24 text-center">
                No users found matching your criteria.
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => {
              const reviewStatus = getReviewStatus(user.id);
              const statusColor = getStatusColor(reviewStatus);
              
              // Format the review date if it exists
              const lastReviewDate = user.lastReviewDate
                ? format(new Date(user.lastReviewDate), "MMM d, yyyy")
                : 'Not reviewed';
              
              return (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="font-medium">{user.firstName} {user.lastName}</div>
                    <div className="text-sm text-muted-foreground">{user.email}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {user.jobFunctions && user.jobFunctions.length > 0 ? (
                        user.jobFunctions.map(jfId => (
                          <Badge key={jfId} variant="outline" className="bg-blue-50">
                            {getJobFunctionName(jfId)}
                          </Badge>
                        ))
                      ) : (
                        user.jobFunction ? (
                          <Badge variant="outline" className="bg-blue-50">
                            {getJobFunctionName(user.jobFunction)}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground">No job functions</span>
                        )
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{lastReviewDate}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={statusColor}>
                      {reviewStatus}
                    </Badge>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </ScrollArea>
  );
};
