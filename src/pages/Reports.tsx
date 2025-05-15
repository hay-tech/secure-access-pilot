
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIAM } from '@/contexts/IAMContext';
import { ReportTabContent } from '@/components/reports/ReportTabContent';
import { complianceEnvironments } from '@/components/reports/reportConstants';

const Reports: React.FC = () => {
  const { users, accessReviews } = useIAM();
  const [currentTab, setCurrentTab] = useState('federal');

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

      <Tabs defaultValue="federal" value={currentTab} onValueChange={setCurrentTab}>
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
              users={users}
              accessReviews={accessReviews}
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default Reports;
