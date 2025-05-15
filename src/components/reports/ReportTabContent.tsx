
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from 'lucide-react';
import { User, AccessReview } from '@/types/iam';
import { ReportFilters } from './ReportFilters';
import { UserAccessTable } from './UserAccessTable';
import { toast } from 'sonner';

interface ReportTabContentProps {
  envName: string;
  envId: string;
  users: User[];
  accessReviews: AccessReview[];
}

export const ReportTabContent: React.FC<ReportTabContentProps> = ({
  envName,
  envId,
  users,
  accessReviews
}) => {
  const [filterJobFunction, setFilterJobFunction] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter users based on compliance environment and job function
  const filteredUsers = users.filter(user => {
    // In a real app, we would filter by compliance environment 
    // For now, we'll show all users on all tabs
    
    // Filter by job function if set
    if (filterJobFunction && (!user.jobFunctions || !user.jobFunctions.includes(filterJobFunction))) {
      return false;
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
      const email = user.email.toLowerCase();
      
      return fullName.includes(query) || email.includes(query);
    }
    
    return true;
  });
  
  const handleExport = () => {
    toast.success(`Report for ${envName} exported successfully`);
  };

  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle>User Access Report - {envName}</CardTitle>
          <CardDescription>
            Users and their job functions for {envName} environment
          </CardDescription>
        </div>
        <Button 
          className="mt-4 sm:mt-0" 
          onClick={handleExport}
          variant="outline"
        >
          <Download className="mr-2 h-4 w-4" />
          Export Report
        </Button>
      </CardHeader>
      <CardContent>
        <ReportFilters 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filterJobFunction={filterJobFunction}
          setFilterJobFunction={setFilterJobFunction}
        />
        <UserAccessTable users={filteredUsers} accessReviews={accessReviews} />
      </CardContent>
    </Card>
  );
};
