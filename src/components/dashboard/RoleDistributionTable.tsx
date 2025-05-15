
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Users } from 'lucide-react';

interface RoleDistribution {
  name: string;
  users: number;
}

interface RoleDistributionTableProps {
  data: RoleDistribution[];
  title?: string;
  description?: string;
}

const RoleDistributionTable: React.FC<RoleDistributionTableProps> = ({
  data,
  title = "Role to User Mapping",
  description = "Number of users assigned to each role"
}) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle>{title}</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{title.includes('Job Function') ? 'Job Function Name' : 'Role Name'}</TableHead>
              <TableHead className="text-right">Users</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.sort((a, b) => b.users - a.users).map((item) => (
              <TableRow key={item.name}>
                <TableCell>{item.name}</TableCell>
                <TableCell className="text-right">{item.users}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default RoleDistributionTable;
