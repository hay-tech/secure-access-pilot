
import React, { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { User, UserPlus, UserCheck, Edit, Check } from 'lucide-react';
import { User as UserType } from '@/types/iam';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';

interface DirectReportsListProps {
  employees: UserType[];
  onSelectEmployee: (employeeId: string) => void;
  onSelectMultipleEmployees?: (employeeIds: string[]) => void;
}

const DirectReportsList: React.FC<DirectReportsListProps> = ({ 
  employees, 
  onSelectEmployee,
  onSelectMultipleEmployees 
}) => {
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  
  const handleSelectEmployee = (employeeId: string, isChecked: boolean) => {
    if (isChecked) {
      setSelectedEmployees([...selectedEmployees, employeeId]);
    } else {
      setSelectedEmployees(selectedEmployees.filter(id => id !== employeeId));
    }
  };
  
  const handleBulkOnboard = () => {
    if (onSelectMultipleEmployees && selectedEmployees.length > 0) {
      onSelectMultipleEmployees(selectedEmployees);
    }
  };

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
    <div className="space-y-4">
      {onSelectMultipleEmployees && (
        <div className="flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            {selectedEmployees.length} employees selected
          </div>
          <Button
            disabled={selectedEmployees.length === 0}
            onClick={handleBulkOnboard}
          >
            <UserCheck className="h-4 w-4 mr-1" /> Bulk Onboard
          </Button>
        </div>
      )}
      
      <Table>
        <TableHeader>
          <TableRow>
            {onSelectMultipleEmployees && (
              <TableHead className="w-12">
                <Checkbox 
                  checked={employees.length > 0 && selectedEmployees.length === employees.length}
                  indeterminate={selectedEmployees.length > 0 && selectedEmployees.length < employees.length}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedEmployees(employees.map(emp => emp.id));
                    } else {
                      setSelectedEmployees([]);
                    }
                  }}
                />
              </TableHead>
            )}
            <TableHead>Employee Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Job Function(s)</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {employees.map((employee) => {
            // Handle different ways job functions might be stored
            const jobFunctions = employee.jobFunctions 
              ? employee.jobFunctions 
              : employee.jobFunction 
                ? [employee.jobFunction] 
                : [];
                
            return (
              <TableRow key={employee.id}>
                {onSelectMultipleEmployees && (
                  <TableCell className="w-12">
                    <Checkbox 
                      checked={selectedEmployees.includes(employee.id)}
                      onCheckedChange={(checked) => handleSelectEmployee(employee.id, !!checked)}
                    />
                  </TableCell>
                )}
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
                    {jobFunctions.length > 0 ? (
                      <>
                        <Edit className="h-4 w-4 mr-1" /> Update Access
                      </>
                    ) : (
                      <>
                        <UserPlus className="h-4 w-4 mr-1" /> Assign Access
                      </>
                    )}
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default DirectReportsList;
