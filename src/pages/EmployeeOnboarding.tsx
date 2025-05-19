
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';
import EmployeeOnboardingForm from '@/components/onboarding/EmployeeOnboardingForm';
import OnboardingRequestsTable from '@/components/onboarding/OnboardingRequestsTable';
import { useAuth } from '../contexts/AuthContext';
import { useIAM } from '../contexts/IAMContext';
import { toast } from 'sonner';

const EmployeeOnboarding: React.FC = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { currentUser } = useAuth();
  const { accessRequests } = useIAM();
  
  if (!currentUser) return null;
  
  // Filter onboarding requests created by the current manager
  const onboardingRequests = accessRequests.filter(
    req => req.userId === currentUser.id && req.projectName?.includes('Onboarding:')
  );
  
  const handleRequestSuccess = () => {
    setDialogOpen(false);
    toast.success("Onboarding request submitted successfully");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Employee Onboarding</h1>
          <p className="text-muted-foreground">Manage access for new employee onboarding</p>
        </div>
        
        <Button 
          className="bg-iam-primary hover:bg-iam-primary-light"
          onClick={() => setDialogOpen(true)}
        >
          <UserPlus className="mr-2 h-4 w-4" /> Onboard Employees
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Employee Onboarding Requests</CardTitle>
          <CardDescription>Access requests for employee onboarding</CardDescription>
        </CardHeader>
        <CardContent>
          <OnboardingRequestsTable requests={onboardingRequests} />
        </CardContent>
      </Card>
      
      <EmployeeOnboardingForm 
        isOpen={dialogOpen} 
        onClose={() => setDialogOpen(false)} 
        onSuccess={handleRequestSuccess} 
      />
    </div>
  );
};

export default EmployeeOnboarding;
