
import React, { useState } from 'react';
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
import { X } from 'lucide-react';
import { useIAM } from '../../contexts/IAMContext';
import { useAuth } from '../../contexts/AuthContext';
import { employeesFromHR } from '../../data/mockEmployeeData';
import { jobFunctionDefinitions, complianceEnvironments } from '../../data/mockData';

interface EmployeeOnboardingFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface FormState {
  employee: string;
  jobFunctions: string[];
  environment: string;
  complianceFramework: string;
  justification: string;
}

const initialFormState: FormState = {
  employee: '',
  jobFunctions: [],
  environment: 'dev',
  complianceFramework: '',
  justification: '',
};

const EmployeeOnboardingForm: React.FC<EmployeeOnboardingFormProps> = ({ 
  isOpen, 
  onClose, 
  onSuccess 
}) => {
  const [formState, setFormState] = useState<FormState>(initialFormState);
  const [isLoading, setIsLoading] = useState(false);
  const { createAccessRequest } = useIAM();
  const { currentUser } = useAuth();
  
  // Auto-select commercial-us compliance for development environment
  const commercialUs = complianceEnvironments.find(env => env.name === 'Commercial (US)')?.id || '';

  // Reset form on open/close
  React.useEffect(() => {
    if (isOpen) {
      setFormState({
        ...initialFormState,
        complianceFramework: commercialUs
      });
    }
  }, [isOpen, commercialUs]);
  
  const handleEmployeeChange = (value: string) => {
    setFormState(prev => ({
      ...prev,
      employee: value
    }));
  };
  
  const handleJobFunctionAdd = (value: string) => {
    if (!formState.jobFunctions.includes(value)) {
      setFormState(prev => ({
        ...prev,
        jobFunctions: [...prev.jobFunctions, value]
      }));
    }
  };
  
  const handleJobFunctionRemove = (value: string) => {
    setFormState(prev => ({
      ...prev,
      jobFunctions: prev.jobFunctions.filter(jf => jf !== value)
    }));
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
      
      // Get the selected employee data
      const employee = employeesFromHR.find(emp => emp.id === formState.employee);
      if (!employee) throw new Error("Employee not found");
      
      // Get job function titles for description
      const jobFunctionTitles = formState.jobFunctions.map(jfId => {
        const jf = jobFunctionDefinitions.find(j => j.id === jfId);
        return jf ? jf.title : jfId;
      }).join(', ');
      
      // Generate resources based on job functions
      const allResources: string[] = [];
      formState.jobFunctions.forEach(jfId => {
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
      await createAccessRequest({
        userId: currentUser.id, // The manager is the requester
        resourceId: allResources.join(','),
        resourceName: `Employee Onboarding: ${jobFunctionTitles}`,
        requestType: 'role',
        justification: formState.justification,
        accessType: 'permanent',
        environmentType: formState.environment,
        complianceFramework: formState.complianceFramework,
        projectName: `Onboarding: ${employee.firstName} ${employee.lastName}`,
        // Include employee and job function data in the request
        businessJustification: `New employee onboarding for ${employee.firstName} ${employee.lastName} (${employee.email}) with roles: ${jobFunctionTitles}`
      });
      
      onSuccess();
    } catch (error) {
      console.error("Failed to submit onboarding request:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const isFormValid = formState.employee && 
                     formState.jobFunctions.length > 0 && 
                     formState.environment && 
                     formState.complianceFramework && 
                     formState.justification.length >= 10;
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Employee Onboarding</DialogTitle>
          <DialogDescription>
            Request access for new employee onboarding
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          {/* Employee Selection */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="employee" className="text-right">
              Employee
            </Label>
            <div className="col-span-3">
              <Select
                value={formState.employee}
                onValueChange={handleEmployeeChange}
              >
                <SelectTrigger id="employee">
                  <SelectValue placeholder="Select employee" />
                </SelectTrigger>
                <SelectContent>
                  {employeesFromHR.map(employee => (
                    <SelectItem key={employee.id} value={employee.id}>
                      {employee.firstName} {employee.lastName} - {employee.department}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Job Function Selection */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="job-function" className="text-right">
              Job Functions
            </Label>
            <div className="col-span-3">
              <Select
                onValueChange={handleJobFunctionAdd}
                value=""
              >
                <SelectTrigger id="job-function">
                  <SelectValue placeholder="Add job function" />
                </SelectTrigger>
                <SelectContent>
                  {jobFunctionDefinitions.map(jf => (
                    <SelectItem
                      key={jf.id}
                      value={jf.id}
                      disabled={formState.jobFunctions.includes(jf.id)}
                    >
                      {jf.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {/* Selected Job Functions */}
              <div className="flex flex-wrap gap-2 mt-2">
                {formState.jobFunctions.map(jfId => {
                  const jf = jobFunctionDefinitions.find(j => j.id === jfId);
                  return (
                    <Badge key={jfId} variant="secondary" className="flex items-center gap-1">
                      {jf ? jf.title : jfId}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 p-0 text-muted-foreground hover:text-foreground"
                        onClick={() => handleJobFunctionRemove(jfId)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  );
                })}
                {formState.jobFunctions.length === 0 && (
                  <span className="text-sm text-muted-foreground">No job functions selected</span>
                )}
              </div>
            </div>
          </div>
          
          {/* Environment Selection */}
          <div className="grid grid-cols-4 items-center gap-4">
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
          
          {/* Justification */}
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="justification" className="text-right">
              Justification
            </Label>
            <div className="col-span-3">
              <Textarea
                id="justification"
                placeholder="Explain why this employee needs these job functions"
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
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!isFormValid || isLoading}
          >
            {isLoading ? 'Submitting...' : 'Submit Request'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EmployeeOnboardingForm;
