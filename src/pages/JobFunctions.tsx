
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Shield, Info, Download, FilterX } from "lucide-react";
import { useJobFunctionMapping } from '@/hooks/iam/useJobFunctionMapping';
import JobFunctionSelector from '@/components/job-functions/JobFunctionSelector';
import JobFunctionDetail from '@/components/job-functions/JobFunctionDetail';
import EnvironmentBadge from '@/components/job-functions/EnvironmentBadge';
import { JobFunctionDefinition } from '@/types/iam';

const JobFunctions: React.FC = () => {
  const { regulatoryEnvironments, jobFunctionDefinitions } = useJobFunctionMapping();
  const [currentTab, setCurrentTab] = useState('all');
  const [selectedJobFunction, setSelectedJobFunction] = useState<JobFunctionDefinition | null>(null);
  const [searchText, setSearchText] = useState('');
  
  // Filter job functions by environment if needed and by search text
  const filteredJobFunctions = useMemo(() => {
    let filtered = jobFunctionDefinitions;
    
    // Filter by environment
    if (currentTab !== 'all') {
      filtered = filtered.filter(jf => 
        !jf.environmentRestrictions?.length || 
        jf.environmentRestrictions?.includes(currentTab));
    }
    
    // Filter by search text
    if (searchText.trim()) {
      const searchLower = searchText.toLowerCase();
      filtered = filtered.filter(jf => 
        jf.title.toLowerCase().includes(searchLower) || 
        jf.description.toLowerCase().includes(searchLower));
    }
    
    return filtered;
  }, [jobFunctionDefinitions, currentTab, searchText]);

  // When environment tab changes, maintain selected job function if it's available in the new environment
  React.useEffect(() => {
    if (selectedJobFunction) {
      const stillValid = filteredJobFunctions.some(jf => jf.id === selectedJobFunction.id);
      if (!stillValid) {
        setSelectedJobFunction(null);
      }
    }
  }, [currentTab, filteredJobFunctions, selectedJobFunction]);

  const handleJobFunctionSelect = (jobFunction: JobFunctionDefinition) => {
    setSelectedJobFunction(jobFunction);
  };

  // Count job functions by environment
  const environmentCounts = useMemo(() => {
    const counts = {
      all: jobFunctionDefinitions.length,
    };
    
    regulatoryEnvironments.forEach(env => {
      const envName = env.name.toLowerCase();
      counts[envName] = jobFunctionDefinitions.filter(jf => 
        !jf.environmentRestrictions?.length || 
        jf.environmentRestrictions?.includes(envName)
      ).length;
    });
    
    return counts;
  }, [jobFunctionDefinitions, regulatoryEnvironments]);

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

      <Tabs defaultValue="all" value={currentTab} onValueChange={setCurrentTab}>
         <div className="flex items-center justify-between mb-4">
          {/* <TabsList className="grid" style={{ gridTemplateColumns: `repeat(${regulatoryEnvironments.length + 1}, minmax(0, 1fr))` }}>
            <TabsTrigger value="all" className="gap-2">
              <EnvironmentBadge environment="All" active={currentTab === 'all'} count={environmentCounts['all']} />
            </TabsTrigger>
            {regulatoryEnvironments.map(env => {
              const envName = env.name.toLowerCase();
              return (
                <TabsTrigger key={env.id} value={envName} className="gap-2">
                  <EnvironmentBadge 
                    environment={env.name} 
                    active={currentTab === envName} 
                    count={environmentCounts[envName] || 0}
                  />
                </TabsTrigger>
              );
            })}
          </TabsList> */}
          <div className="flex gap-2">
            {searchText && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSearchText('')}
                className="h-9 w-9"
              >
                <FilterX className="h-4 w-4" />
              </Button>
            )}
            <div className="relative">
              <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Search job functions..."
                className="w-[250px] h-9 px-3 py-2 text-sm rounded-md border border-input bg-background ring-offset-background"
              />
            </div>
          </div>
        </div>

        <TabsContent value={currentTab} className="mt-0">
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 lg:col-span-8">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-6 w-6 text-primary" />
                    {currentTab === 'all' ? 'All Job Functions' : `${currentTab.charAt(0).toUpperCase() + currentTab.slice(1)} Environment Job Functions`}
                  </CardTitle>
                  <CardDescription>
                    {filteredJobFunctions.length} job function(s) available for this environment
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[600px]">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Job Function</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredJobFunctions.map((jobFunction) => (
                          <TableRow 
                            key={jobFunction.id}
                            className={selectedJobFunction?.id === jobFunction.id ? "bg-muted" : ""}
                            onClick={() => setSelectedJobFunction(jobFunction)}
                          >
                            <TableCell className="font-medium">
                              <div className="flex flex-col">
                                {jobFunction.title}
                                {jobFunction.environmentRestrictions?.length > 0 && (
                                  <div className="flex gap-1 mt-1">
                                    {jobFunction.environmentRestrictions.map(env => (
                                      <EnvironmentBadge 
                                        key={env} 
                                        environment={env.charAt(0).toUpperCase() + env.slice(1)} 
                                      />
                                    ))}
                                  </div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>{jobFunction.description}</TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button variant="ghost" size="sm" className="h-8">
                                  View Details
                                </Button>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                      <Info className="h-4 w-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p className="w-60">View detailed information about this job function.</p>
                                  </TooltipContent>
                                </Tooltip>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                        
                        {filteredJobFunctions.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={3} className="h-24 text-center">
                              No job functions found for this environment.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
            
            <div className="col-span-12 lg:col-span-4">
              {selectedJobFunction ? (
                <JobFunctionDetail jobFunction={selectedJobFunction} />
              ) : (
                <Card className="h-full flex flex-col justify-center items-center p-6">
                  <div className="text-center space-y-2">
                    <Shield className="h-12 w-12 text-muted-foreground mx-auto" />
                    <h3 className="text-lg font-medium">No Job Function Selected</h3>
                    <p className="text-muted-foreground">
                      Select a job function from the table to see detailed information.
                    </p>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default JobFunctions;
