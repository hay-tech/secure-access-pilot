
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
  const [filterManager, setFilterManager] = useState('');
  
  // Get unique managers from the users data
  const managers = users
    .filter(user => user.manager)
    .map(user => {
      // Find the manager user object
      const managerUser = users.find(u => u.id === user.manager);
      return managerUser ? {
        id: managerUser.id,
        name: `${managerUser.firstName} ${managerUser.lastName}`
      } : null;
    })
    .filter((manager, index, self) => 
      // Remove nulls and duplicates
      manager && self.findIndex(m => m?.id === manager?.id) === index
    );
  
  // Filter users based on compliance environment, job function, and search query
  const filteredUsers = users.filter(user => {
    // Filter by job function if set
    if (filterJobFunction && (!user.jobFunctions || !user.jobFunctions.includes(filterJobFunction))) {
      return false;
    }
    
    // Filter by manager if set
    if (filterManager && user.manager !== filterManager) {
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
          filterManager={filterManager}
          setFilterManager={setFilterManager}
          managers={managers}
        />
        <UserAccessTable users={filteredUsers} accessReviews={accessReviews} />
      </CardContent>
    </Card>
  );
};
