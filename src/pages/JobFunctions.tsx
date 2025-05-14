
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Shield, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useJobFunctionMapping } from '@/hooks/iam/useJobFunctionMapping';
import { useParams } from 'react-router-dom';

const JobFunctions: React.FC = () => {
  const { regulatoryEnvironments, jobFunctionDefinitions } = useJobFunctionMapping();
  const [currentTab, setCurrentTab] = React.useState('all');
  
  // Filter job functions by environment if needed
  const filteredJobFunctions = currentTab === 'all' 
    ? jobFunctionDefinitions
    : jobFunctionDefinitions.filter(jf => 
        jf.environmentRestrictions?.includes(currentTab) || 
        !jf.environmentRestrictions?.length);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Job Functions</h2>
          <p className="text-muted-foreground">
            Manage and view job functions and their associated permissions.
          </p>
        </div>
        <Button>Export Report</Button>
      </div>

      <Tabs defaultValue="all" value={currentTab} onValueChange={setCurrentTab}>
        <TabsList className="grid grid-cols-5 mb-4">
          <TabsTrigger value="all">All</TabsTrigger>
          {regulatoryEnvironments.map(env => (
            <TabsTrigger key={env.id} value={env.name.toLowerCase()}>
              {env.name}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={currentTab}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-6 w-6 text-primary" />
                {currentTab === 'all' ? 'All Job Functions' : `${currentTab.charAt(0).toUpperCase() + currentTab.slice(1)} Environment Job Functions`}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Job Function</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Required Actions</TableHead>
                      <TableHead>Environments</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredJobFunctions.map((jobFunction) => (
                      <TableRow key={jobFunction.title}>
                        <TableCell className="font-medium">{jobFunction.title}</TableCell>
                        <TableCell>{jobFunction.description}</TableCell>
                        <TableCell>
                          <div className="max-w-md">
                            <ul className="list-disc pl-5 space-y-1 text-sm">
                              {jobFunction.actions.map((action, idx) => (
                                <li key={idx}>{action}</li>
                              ))}
                            </ul>
                          </div>
                        </TableCell>
                        <TableCell>
                          {jobFunction.environmentRestrictions?.length 
                            ? jobFunction.environmentRestrictions.join(', ')
                            : 'All Environments'}
                        </TableCell>
                      </TableRow>
                    ))}
                    
                    {filteredJobFunctions.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} className="h-24 text-center">
                          No job functions found for this environment.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default JobFunctions;
