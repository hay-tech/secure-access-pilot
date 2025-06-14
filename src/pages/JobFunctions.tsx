
import React, { useState, useMemo } from 'react';
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useJobFunctionMapping } from '@/hooks/iam/useJobFunctionMapping';
import JobFunctionDetail from '@/components/job-functions/JobFunctionDetail';
import { JobFunctionDefinition } from '@/types/iam';

// Import refactored components
import SearchBar from '@/components/job-functions/SearchBar';
import JobFunctionTable from '@/components/job-functions/JobFunctionTable';
import EmptyJobFunctionState from '@/components/job-functions/EmptyJobFunctionState';

const JobFunctions: React.FC = () => {
  const { regulatoryEnvironments, jobFunctionDefinitions } = useJobFunctionMapping();
  const [currentTab, setCurrentTab] = useState('all');
  const [selectedJobFunction, setSelectedJobFunction] = useState<JobFunctionDefinition | null>(null);
  const [searchText, setSearchText] = useState('');
  
  // Filter job functions by search text only (removed environment filtering)
  const filteredJobFunctions = useMemo(() => {
    let filtered = jobFunctionDefinitions;
    
    // Filter by search text
    if (searchText.trim()) {
      const searchLower = searchText.toLowerCase();
      filtered = filtered.filter(jf => 
        jf.title.toLowerCase().includes(searchLower) || 
        jf.description.toLowerCase().includes(searchLower));
    }
    
    return filtered;
  }, [jobFunctionDefinitions, searchText]);

  // When environment tab changes, maintain selected job function if it's available in the new environment
  React.useEffect(() => {
    if (selectedJobFunction) {
      const stillValid = filteredJobFunctions.some(jf => jf.id === selectedJobFunction.id);
      if (!stillValid) {
        setSelectedJobFunction(null);
      }
    }
  }, [filteredJobFunctions, selectedJobFunction]);

  // Count job functions (simplified as we removed environment filtering)
  const totalJobFunctions = jobFunctionDefinitions.length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Cloud-Agnostic Job Functions</h2>
          <p className="text-muted-foreground">
            Manage and view job functions and their associated permissions.
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export Report
        </Button>
      </div>

      <Tabs defaultValue="all" value={currentTab}>
        <div className="flex items-center justify-between mb-4">
          <SearchBar searchText={searchText} setSearchText={setSearchText} />
        </div>

        <TabsContent value={currentTab} className="mt-0">
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 lg:col-span-8">
              <JobFunctionTable 
                jobFunctions={filteredJobFunctions}
                selectedJobFunction={selectedJobFunction}
                onSelectJobFunction={setSelectedJobFunction}
                currentTab={currentTab}
              />
            </div>
            
            <div className="col-span-12 lg:col-span-4">
              {selectedJobFunction ? (
                <JobFunctionDetail jobFunction={selectedJobFunction} />
              ) : (
                <EmptyJobFunctionState />
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default JobFunctions;
