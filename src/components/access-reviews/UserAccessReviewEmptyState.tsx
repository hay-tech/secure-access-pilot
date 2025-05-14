
import React from 'react';
import { TableRow, TableCell } from "@/components/ui/table";

interface UserAccessReviewEmptyStateProps {
  colSpan?: number;
  message?: string;
}

const UserAccessReviewEmptyState: React.FC<UserAccessReviewEmptyStateProps> = ({
  colSpan = 5,
  message = "No permission gaps found for this environment."
}) => {
  return (
    <TableRow>
      <TableCell colSpan={colSpan} className="h-24 text-center">
        {message}
      </TableCell>
    </TableRow>
  );
};

export default UserAccessReviewEmptyState;
