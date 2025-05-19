
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';
import EmployeeOnboardingForm from '@/components/onboarding/EmployeeOnboardingForm';
import DirectReportsList from '@/components/onboarding/DirectReportsList';
import OnboardingRequestsTable from '@/components/onboarding/OnboardingRequestsTable';
import { useAuth } from '../contexts/AuthContext';
import { useIAM } from '../contexts/IAMContext';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const EmployeeOnboarding: React.FC = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);
  const { currentUser } = useAuth();
  const { accessRequests, users } = useIAM();
  
  if (!currentUser) return null;
  
  // Filter onboarding requests created by the current manager
  const onboardingRequests = accessRequests.filter(
    req => req.userId === currentUser.id && req.projectName?.includes('Onboarding:')
  );
  
  // Get direct reports
  const directReports = users.filter(user => user.manager === currentUser.id);
  
  const handleRequestSuccess = () => {
    setDialogOpen(false);
    setSelectedEmployee(null);
    toast.success("Onboarding request submitted successfully");
  };
  
  const handleEmployeeSelect = (employeeId: string) => {
    setSelectedEmployee(employeeId);
    setDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Employee Onboarding</h1>
          <p className="text-muted-foreground">Manage access for employee onboarding</p>
        </div>
        
        <Button 
          className="bg-iam-primary hover:bg-iam-primary-light"
          onClick={() => setDialogOpen(true)}
        >
          <UserPlus className="mr-2 h-4 w-4" /> Onboard Employees
        </Button>
      </div>
      
      <Tabs defaultValue="employees" className="w-full">
        <TabsList>
          <TabsTrigger value="employees">My Direct Reports</TabsTrigger>
          <TabsTrigger value="requests">Onboarding Requests</TabsTrigger>
        </TabsList>
        
        <TabsContent value="employees" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Your Direct Reports</CardTitle>
              <CardDescription>Select an employee to manage their access</CardDescription>
            </CardHeader>
            <CardContent>
              <DirectReportsList 
                employees={directReports}
                onSelectEmployee={handleEmployeeSelect}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="requests" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Employee Onboarding Requests</CardTitle>
              <CardDescription>Access requests for employee onboarding</CardDescription>
            </CardHeader>
            <CardContent>
              <OnboardingRequestsTable requests={onboardingRequests} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <EmployeeOnboardingForm 
        isOpen={dialogOpen} 
        onClose={() => setDialogOpen(false)} 
        onSuccess={handleRequestSuccess}
        preselectedEmployeeId={selectedEmployee} 
      />
    </div>
  );
};

export default EmployeeOnboarding;
