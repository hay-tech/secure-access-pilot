
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
import { User, UserPlus } from 'lucide-react';
import { User as UserType } from '@/types/iam';
import { Badge } from '@/components/ui/badge';

interface DirectReportsListProps {
  employees: UserType[];
  onSelectEmployee: (employeeId: string) => void;
}

const DirectReportsList: React.FC<DirectReportsListProps> = ({ employees, onSelectEmployee }) => {
  if (employees.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <User className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium">No direct reports found</h3>
        <p className="text-muted-foreground mt-2">You don't have any direct reports assigned to you.</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Employee Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Department</TableHead>
          <TableHead>Job Function(s)</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {employees.map((employee) => {
          const jobFunctions = employee.jobFunction 
            ? [employee.jobFunction] 
            : employee.jobFunctions || [];
            
          return (
            <TableRow key={employee.id}>
              <TableCell className="font-medium">
                {employee.firstName} {employee.lastName}
              </TableCell>
              <TableCell>{employee.email}</TableCell>
              <TableCell>{employee.department}</TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {jobFunctions.length > 0 ? (
                    jobFunctions.map((jf, index) => (
                      <Badge key={index} variant="outline">
                        {jf}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-muted-foreground text-sm">No job functions</span>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-right">
                <Button 
                  size="sm"
                  variant="outline"
                  onClick={() => onSelectEmployee(employee.id)}
                >
                  <UserPlus className="h-4 w-4 mr-1" /> Manage Access
                </Button>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default DirectReportsList;
