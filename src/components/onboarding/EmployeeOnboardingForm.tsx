
import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { X } from 'lucide-react';
import { useIAM } from '../../contexts/IAMContext';
import { useAuth } from '../../contexts/AuthContext';
import { employeesFromHR, mockDirectReports } from '../../data/mockEmployeeData';
import { jobFunctionDefinitions, complianceEnvironments } from '../../data/mockData';
import { User } from '@/types/iam';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';

interface EmployeeOnboardingFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  preselectedEmployeeId?: string | null;
  preselectedEmployeeIds?: string[];
  bulkMode?: boolean;
}

interface FormState {
  employees: string[];
  employeeToJobFunctions: Record<string, string[]>;
  environment: string;
  complianceFramework: string;
  accessType: 'permanent' | 'temporary';
  justification: string;
}

interface EmployeeFormView {
  id: string;
  name: string;
  email: string;
  department: string;
  currentJobFunctions: string[];
}

const initialFormState: FormState = {
  employees: [],
  employeeToJobFunctions: {},
  environment: 'dev',
  complianceFramework: '',
  accessType: 'permanent',
  justification: '',
};

const EmployeeOnboardingForm: React.FC<EmployeeOnboardingFormProps> = ({ 
  isOpen, 
  onClose, 
  onSuccess,
  preselectedEmployeeId,
  preselectedEmployeeIds,
  bulkMode = false
}) => {
  const [formState, setFormState] = useState<FormState>(initialFormState);
  const [employeeViews, setEmployeeViews] = useState<EmployeeFormView[]>([]);
  const [activeEmployeeId, setActiveEmployeeId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { createAccessRequest, users } = useIAM();
  const { currentUser } = useAuth();
  
  // Auto-select commercial-us compliance for development environment
  const commercialUs = complianceEnvironments.find(env => env.name === 'Commercial (US)')?.id || '';

  // Combine HR employees and direct reports
  const getAvailableEmployees = () => {
    // Get direct reports from the IAM context or mock data
    let directReports = users.filter(user => currentUser && user.manager === currentUser.id);
    if (directReports.length === 0) {
      directReports = mockDirectReports as any[];
    }
    
    // If we have preselected employees, filter for just those
    if (preselectedEmployeeIds && preselectedEmployeeIds.length > 0) {
      return directReports.filter(dr => preselectedEmployeeIds.includes(dr.id));
    }
    
    if (preselectedEmployeeId) {
      const employee = directReports.find(dr => dr.id === preselectedEmployeeId);
      return employee ? [employee] : [];
    }
    
    // Get HR employees that aren't in the system yet
    const hrEmployees = employeesFromHR.filter(hrEmp => 
      !users.some(user => user.email.toLowerCase() === hrEmp.email.toLowerCase())
    );
    
    return [...directReports, ...hrEmployees.map(hrToUser)];
  };
  
  // Convert HR employee to User format
  const hrToUser = (hrEmployee: any): User => ({
    id: hrEmployee.id,
    email: hrEmployee.email,
    firstName: hrEmployee.firstName,
    lastName: hrEmployee.lastName,
    roleIds: [],
    department: hrEmployee.department,
    createdAt: new Date().toISOString()
  });

  // Reset form on open/close
  useEffect(() => {
    if (isOpen) {
      let initialEmployees: string[] = [];
      let initialJobFunctions: Record<string, string[]> = {};
      
      // Handle preselected individual employee
      if (preselectedEmployeeId) {
        initialEmployees = [preselectedEmployeeId];
        
        // Get current job functions for this employee
        const employee = getAvailableEmployees().find(e => e.id === preselectedEmployeeId);
        if (employee) {
          const jobFns = employee.jobFunctions 
            ? employee.jobFunctions 
            : employee.jobFunction 
              ? [employee.jobFunction] 
              : [];
          initialJobFunctions[preselectedEmployeeId] = jobFns;
        }
      }
      
      // Handle bulk mode with preselected employees
      if (bulkMode && preselectedEmployeeIds && preselectedEmployeeIds.length > 0) {
        initialEmployees = preselectedEmployeeIds;
        
        // Get current job functions for these employees
        preselectedEmployeeIds.forEach(empId => {
          const employee = getAvailableEmployees().find(e => e.id === empId);
          if (employee) {
            const jobFns = employee.jobFunctions 
              ? employee.jobFunctions 
              : employee.jobFunction 
                ? [employee.jobFunction] 
                : [];
            initialJobFunctions[empId] = jobFns;
          } else {
            initialJobFunctions[empId] = [];
          }
        });
      }
      
      setFormState({
        ...initialFormState,
        employees: initialEmployees,
        employeeToJobFunctions: initialJobFunctions,
        complianceFramework: commercialUs
      });
      
      // Create employee views
      updateEmployeeViews(initialEmployees, initialJobFunctions);
      
      // Set active employee
      if (initialEmployees.length > 0) {
        setActiveEmployeeId(initialEmployees[0]);
      }
    }
  }, [isOpen, commercialUs, preselectedEmployeeId, preselectedEmployeeIds, bulkMode]);
  
  // Update employee views whenever form state changes
  const updateEmployeeViews = (
    employeeIds: string[], 
    jobFunctionMap: Record<string, string[]>
  ) => {
    const views: EmployeeFormView[] = [];
    
    employeeIds.forEach(empId => {
      const employee = getAvailableEmployees().find(e => e.id === empId);
      if (employee) {
        views.push({
          id: employee.id,
          name: `${employee.firstName} ${employee.lastName}`,
          email: employee.email,
          department: employee.department,
          currentJobFunctions: jobFunctionMap[empId] || []
        });
      }
    });
    
    setEmployeeViews(views);
  };
  
  const handleEmployeeChange = (value: string) => {
    const updatedEmployees = [...formState.employees, value];
    
    setFormState(prev => {
      const updatedState = {
        ...prev,
        employees: updatedEmployees,
        employeeToJobFunctions: {
          ...prev.employeeToJobFunctions,
          [value]: []
        }
      };
      
      updateEmployeeViews(updatedState.employees, updatedState.employeeToJobFunctions);
      setActiveEmployeeId(value);
      
      return updatedState;
    });
  };
  
  const handleEmployeeRemove = (employeeId: string) => {
    const updatedEmployees = formState.employees.filter(id => id !== employeeId);
    const updatedJobFunctions = { ...formState.employeeToJobFunctions };
    delete updatedJobFunctions[employeeId];
    
    setFormState(prev => {
      const updatedState = {
        ...prev,
        employees: updatedEmployees,
        employeeToJobFunctions: updatedJobFunctions
      };
      
      updateEmployeeViews(updatedState.employees, updatedState.employeeToJobFunctions);
      
      // Update active employee if needed
      if (activeEmployeeId === employeeId) {
        setActiveEmployeeId(updatedEmployees.length > 0 ? updatedEmployees[0] : null);
      }
      
      return updatedState;
    });
  };
  
  const handleJobFunctionAdd = (employeeId: string, value: string) => {
    if (!formState.employeeToJobFunctions[employeeId]?.includes(value)) {
      setFormState(prev => {
        const currentJobFunctions = prev.employeeToJobFunctions[employeeId] || [];
        const updatedJobFunctions = {
          ...prev.employeeToJobFunctions,
          [employeeId]: [...currentJobFunctions, value]
        };
        
        const updatedState = {
          ...prev,
          employeeToJobFunctions: updatedJobFunctions
        };
        
        updateEmployeeViews(updatedState.employees, updatedState.employeeToJobFunctions);
        return updatedState;
      });
    }
  };
  
  const handleJobFunctionRemove = (employeeId: string, value: string) => {
    setFormState(prev => {
      const currentJobFunctions = prev.employeeToJobFunctions[employeeId] || [];
      const updatedJobFunctions = {
        ...prev.employeeToJobFunctions,
        [employeeId]: currentJobFunctions.filter(jf => jf !== value)
      };
      
      const updatedState = {
        ...prev,
        employeeToJobFunctions: updatedJobFunctions
      };
      
      updateEmployeeViews(updatedState.employees, updatedState.employeeToJobFunctions);
      return updatedState;
    });
  };
  
  const handleEnvironmentChange = (value: string) => {
    const newState: Partial<FormState> = { environment: value };
    
    // Auto-set compliance framework for dev environment
    if (value === 'dev') {
      newState.complianceFramework = commercialUs;
    }
    
    setFormState(prev => ({
      ...prev,
      ...newState
    }));
  };
  
  const handleComplianceChange = (value: string) => {
    setFormState(prev => ({
      ...prev,
      complianceFramework: value
    }));
  };
  
  const handleAccessTypeChange = (value: 'permanent' | 'temporary') => {
    setFormState(prev => ({
      ...prev,
      accessType: value
    }));
  };
  
  const handleJustificationChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormState(prev => ({
      ...prev,
      justification: e.target.value
    }));
  };
  
  const handleSubmit = async () => {
    if (!currentUser) return;
    
    try {
      setIsLoading(true);
      
      // Create an access request for each employee
      const requests = formState.employees.map(empId => {
        // Get the selected employee data
        const availableEmployees = getAvailableEmployees();
        const employee = availableEmployees.find(emp => emp.id === empId);
        if (!employee) throw new Error(`Employee ${empId} not found`);
        
        // Get job functions for this employee
        const jobFunctions = formState.employeeToJobFunctions[empId] || [];
        
        // Get job function titles for description
        const jobFunctionTitles = jobFunctions.map(jfId => {
          const jf = jobFunctionDefinitions.find(j => j.id === jfId);
          return jf ? jf.title : jfId;
        }).join(', ');
        
        // Generate resources based on job functions
        const allResources: string[] = [];
        jobFunctions.forEach(jfId => {
          const jf = jobFunctionDefinitions.find(j => j.id === jfId);
          if (jf && jf.recommendedResources) {
            jf.recommendedResources.forEach(resource => {
              if (!allResources.includes(resource)) {
                allResources.push(resource);
              }
            });
          }
        });
        
        // Create an access request that will be auto-approved for dev environments
        return createAccessRequest({
          userId: currentUser.id, // The manager is the requester
          resourceId: allResources.join(','),
          resourceName: `Employee Onboarding: ${jobFunctionTitles}`,
          requestType: 'role',
          justification: formState.justification,
          accessType: formState.accessType,
          environmentType: formState.environment,
          complianceFramework: formState.complianceFramework,
          projectName: `Onboarding: ${employee.firstName} ${employee.lastName}`,
          // Include employee and job function data in the request
          businessJustification: `New employee onboarding for ${employee.firstName} ${employee.lastName} (${employee.email}) with roles: ${jobFunctionTitles}`
        });
      });
      
      // Wait for all requests to complete
      await Promise.all(requests);
      
      onSuccess();
    } catch (error) {
      console.error("Failed to submit onboarding request:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const isFormValid = formState.employees.length > 0 && 
                     formState.employees.every(empId => 
                       (formState.employeeToJobFunctions[empId]?.length || 0) > 0
                     ) && 
                     formState.environment && 
                     formState.complianceFramework && 
                     formState.justification.length >= 10;
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>
            {bulkMode ? "Bulk Employee Onboarding" : "Employee Onboarding"}
          </DialogTitle>
          <DialogDescription>
            {bulkMode 
              ? "Request access for multiple employees at once" 
              : "Request access for employee onboarding"
            }
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          {/* Employee Selection */}
          {!bulkMode && formState.employees.length === 0 && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="employee" className="text-right">
                Employee
              </Label>
              <div className="col-span-3">
                <Select
                  value=""
                  onValueChange={handleEmployeeChange}
                  disabled={!!preselectedEmployeeId}
                >
                  <SelectTrigger id="employee">
                    <SelectValue placeholder="Select employee" />
                  </SelectTrigger>
                  <SelectContent>
                    {getAvailableEmployees().filter(emp => !formState.employees.includes(emp.id)).map(employee => (
                      <SelectItem key={employee.id} value={employee.id}>
                        {employee.firstName} {employee.lastName} - {employee.department}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          
          {/* Selected Employees */}
          {formState.employees.length > 0 && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label>Selected Employees ({formState.employees.length})</Label>
                {!bulkMode && formState.employees.length < 5 && (
                  <Select
                    value=""
                    onValueChange={handleEmployeeChange}
                  >
                    <SelectTrigger className="w-[250px]">
                      <SelectValue placeholder="Add another employee" />
                    </SelectTrigger>
                    <SelectContent>
                      {getAvailableEmployees().filter(emp => !formState.employees.includes(emp.id)).map(employee => (
                        <SelectItem key={employee.id} value={employee.id}>
                          {employee.firstName} {employee.lastName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
              
              <div className="border rounded-md overflow-hidden">
                <div className="grid grid-cols-12 bg-muted px-4 py-2">
                  <div className="col-span-4 font-medium text-sm">Name</div>
                  <div className="col-span-4 font-medium text-sm">Department</div>
                  <div className="col-span-3 font-medium text-sm">Job Functions</div>
                  <div className="col-span-1"></div>
                </div>
                <ScrollArea className="h-[180px]">
                  {employeeViews.map((employee) => (
                    <div 
                      key={employee.id} 
                      className={`grid grid-cols-12 px-4 py-3 border-t ${activeEmployeeId === employee.id ? 'bg-accent' : ''}`}
                      onClick={() => setActiveEmployeeId(employee.id)}
                    >
                      <div className="col-span-4">
                        <div className="font-medium">{employee.name}</div>
                        <div className="text-sm text-muted-foreground">{employee.email}</div>
                      </div>
                      <div className="col-span-4 flex items-center">
                        {employee.department}
                      </div>
                      <div className="col-span-3 flex items-center">
                        <div className="flex flex-wrap gap-1">
                          {employee.currentJobFunctions.length > 0 ? (
                            <Badge variant="secondary">{employee.currentJobFunctions.length} assigned</Badge>
                          ) : (
                            <span className="text-sm text-muted-foreground">None</span>
                          )}
                        </div>
                      </div>
                      <div className="col-span-1 flex justify-end items-center">
                        {!preselectedEmployeeIds && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEmployeeRemove(employee.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </ScrollArea>
              </div>
            </div>
          )}
          
          {/* Job Function Assignment */}
          {activeEmployeeId && (
            <div className="border rounded-md p-4 mt-2">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">
                  Job Functions for {employeeViews.find(e => e.id === activeEmployeeId)?.name}
                </h3>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      const currentIndex = formState.employees.findIndex(id => id === activeEmployeeId);
                      if (currentIndex >= 0 && currentIndex < formState.employees.length - 1) {
                        setActiveEmployeeId(formState.employees[currentIndex + 1]);
                      }
                    }}
                    disabled={formState.employees.indexOf(activeEmployeeId) === formState.employees.length - 1}
                  >
                    Next Employee
                  </Button>
                </div>
              </div>
              
              {/* Job Function Selector */}
              <div className="grid grid-cols-4 items-center gap-4 mb-4">
                <Label htmlFor="job-function" className="text-right">
                  Add Job Function
                </Label>
                <div className="col-span-3">
                  <Select
                    onValueChange={(value) => handleJobFunctionAdd(activeEmployeeId, value)}
                    value=""
                  >
                    <SelectTrigger id="job-function">
                      <SelectValue placeholder="Select job function" />
                    </SelectTrigger>
                    <SelectContent>
                      {jobFunctionDefinitions.map(jf => (
                        <SelectItem
                          key={jf.id}
                          value={jf.id}
                          disabled={(formState.employeeToJobFunctions[activeEmployeeId] || []).includes(jf.id)}
                        >
                          {jf.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {/* Selected Job Functions */}
              <div className="grid grid-cols-4 items-start gap-4">
                <Label className="text-right mt-2">
                  Selected Functions
                </Label>
                <div className="col-span-3">
                  <div className="flex flex-wrap gap-2">
                    {(formState.employeeToJobFunctions[activeEmployeeId] || []).map(jfId => {
                      const jf = jobFunctionDefinitions.find(j => j.id === jfId);
                      return (
                        <Badge key={jfId} variant="secondary" className="flex items-center gap-1 px-3 py-1">
                          {jf ? jf.title : jfId}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-4 w-4 p-0 ml-1 text-muted-foreground hover:text-foreground"
                            onClick={() => handleJobFunctionRemove(activeEmployeeId, jfId)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </Badge>
                      );
                    })}
                    {(formState.employeeToJobFunctions[activeEmployeeId] || []).length === 0 && (
                      <span className="text-sm text-muted-foreground">No job functions selected</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Environment and Compliance Settings */}
          <div className="border rounded-md p-4 mt-4">
            <h3 className="text-lg font-medium mb-4">Access Settings</h3>
            
            {/* Environment Selection */}
            <div className="grid grid-cols-4 items-center gap-4 mb-4">
              <Label htmlFor="environment" className="text-right">
                Environment
              </Label>
              <div className="col-span-3">
                <Select
                  value={formState.environment}
                  onValueChange={handleEnvironmentChange}
                >
                  <SelectTrigger id="environment">
                    <SelectValue placeholder="Select environment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dev">Development</SelectItem>
                    <SelectItem value="test">Test</SelectItem>
                    <SelectItem value="prod">Production</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Access Type */}
            <div className="grid grid-cols-4 items-center gap-4 mb-4">
              <Label htmlFor="access-type" className="text-right">
                Access Type
              </Label>
              <div className="col-span-3">
                <RadioGroup
                  value={formState.accessType}
                  onValueChange={(value) => handleAccessTypeChange(value as 'permanent' | 'temporary')}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="permanent" id="permanent" />
                    <Label htmlFor="permanent">Permanent</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="temporary" id="temporary" />
                    <Label htmlFor="temporary">Temporary</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
            
            {/* Compliance Framework */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="compliance" className="text-right">
                Compliance Framework
              </Label>
              <div className="col-span-3">
                <Select
                  value={formState.complianceFramework}
                  onValueChange={handleComplianceChange}
                  disabled={formState.environment === 'dev'}
                >
                  <SelectTrigger id="compliance">
                    <SelectValue placeholder="Select compliance framework" />
                  </SelectTrigger>
                  <SelectContent>
                    {complianceEnvironments.map(ce => (
                      <SelectItem key={ce.id} value={ce.id}>
                        {ce.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          {/* Justification */}
          <div className="grid grid-cols-4 items-start gap-4 mt-2">
            <Label htmlFor="justification" className="text-right">
              Justification
            </Label>
            <div className="col-span-3">
              <Textarea
                id="justification"
                placeholder="Explain why these employees need the assigned job functions"
                value={formState.justification}
                onChange={handleJustificationChange}
                rows={4}
              />
              <div className="text-xs text-muted-foreground mt-1 flex justify-between">
                <span>Minimum 10 characters</span>
                <span>{formState.justification.length} characters</span>
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter className="flex justify-between items-center">
          <div>
            {/* Validation status */}
            {!isFormValid && (
              <span className="text-sm text-muted-foreground">
                {formState.employees.length === 0
                  ? "Select at least one employee"
                  : formState.employees.some(empId => (formState.employeeToJobFunctions[empId]?.length || 0) === 0)
                    ? "Assign job functions to all employees"
                    : formState.justification.length < 10
                      ? "Justification too short"
                      : "Complete all required fields"}
              </span>
            )}
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!isFormValid || isLoading}
            >
              {isLoading ? 'Submitting...' : bulkMode ? 'Submit Bulk Request' : 'Submit Request'}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EmployeeOnboardingForm;
