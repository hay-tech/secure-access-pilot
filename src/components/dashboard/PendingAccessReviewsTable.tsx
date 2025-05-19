
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

interface PendingReview {
  id: string;
  resource: string;
  role: string;
  daysOverdue: number;
}

interface PendingAccessReviewsTableProps {
  data: PendingReview[];
}

const PendingAccessReviewsTable: React.FC<PendingAccessReviewsTableProps> = ({ data }) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle>Pending Access Reviews</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </div>
        <CardDescription>Reviews requiring attention</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Resource</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="text-right">Days Overdue</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((review) => (
              <TableRow key={review.id} className="cursor-pointer hover:bg-muted/50">
                <TableCell>
                  <Link to={`/reviews?reviewId=${review.id}`} className="block w-full">
                    {review.resource}
                  </Link>
                </TableCell>
                <TableCell>
                  <Link to={`/reviews?reviewId=${review.id}`} className="block w-full">
                    {review.role}
                  </Link>
                </TableCell>
                <TableCell className="text-right">
                  <Link to={`/reviews?reviewId=${review.id}`} className="block w-full">
                    <span className={`font-medium ${review.daysOverdue > 5 ? 'text-red-500' : 'text-amber-500'}`}>
                      {review.daysOverdue}
                    </span>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default PendingAccessReviewsTable;
