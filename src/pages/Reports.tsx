
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIAM } from '@/contexts/IAMContext';
import { ReportTabContent } from '@/components/reports/ReportTabContent';
import { complianceEnvironments } from '@/components/reports/reportConstants';
import { jobFunctionDefinitions } from '@/data/mockJobFunctions';
import { User } from '@/types/iam';
import { subMonths, format } from 'date-fns';

const Reports: React.FC = () => {
  const { users, accessReviews } = useIAM();
  const [currentTab, setCurrentTab] = useState('FedRamp');
  const [enrichedUsers, setEnrichedUsers] = useState<User[]>([]);

  // Function to get a random date within the last 4 months
  const getRandomRecentDate = () => {
    const today = new Date();
    const fourMonthsAgo = subMonths(today, 4);
    const randomTime = fourMonthsAgo.getTime() + Math.random() * (today.getTime() - fourMonthsAgo.getTime());
    return new Date(randomTime).toISOString();
  };

  // Function to get random job functions for a user
  const getRandomJobFunctions = (userId: string) => {
    // Generate a semi-random number based on the user ID to ensure consistency
    const randomSeed = userId.charCodeAt(0) % 3 + 1; // 1-3 job functions
    
    // Create a copy of the job function definitions to shuffle
    const shuffledJobFunctions = [...jobFunctionDefinitions]
      .sort(() => 0.5 - Math.random())
      .slice(0, randomSeed);
    
    return shuffledJobFunctions.map(jf => jf.id);
  };

  useEffect(() => {
    // Enrich users with random job functions and review dates
    const updatedUsers = users.map(user => {
      const randomJobFunctions = getRandomJobFunctions(user.id);
      const lastReviewDate = getRandomRecentDate();
      
      return {
        ...user,
        jobFunctions: randomJobFunctions,
        lastReviewDate // Adding this custom field to track the random review date
      };
    });
    
    setEnrichedUsers(updatedUsers as User[]);
  }, [users]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Reports</h2>
          <p className="text-muted-foreground">
            View and download access review and compliance reports
          </p>
        </div>
      </div>

      <Tabs defaultValue="FedRamp" value={currentTab} onValueChange={setCurrentTab}>
        <TabsList className="grid grid-cols-6 mb-4">
          {complianceEnvironments.map(env => (
            <TabsTrigger key={env.id} value={env.id}>{env.name}</TabsTrigger>
          ))}
        </TabsList>
        
        {complianceEnvironments.map(env => (
          <TabsContent key={env.id} value={env.id}>
            <ReportTabContent 
              envName={env.name}
              envId={env.id}
              users={enrichedUsers}
              accessReviews={accessReviews}
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default Reports;
