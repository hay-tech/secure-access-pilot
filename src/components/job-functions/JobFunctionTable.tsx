
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Shield, Info } from "lucide-react";
import EnvironmentBadge from '@/components/job-functions/EnvironmentBadge';
import { JobFunctionDefinition } from '@/types/iam';

interface JobFunctionTableProps {
  jobFunctions: JobFunctionDefinition[];
  selectedJobFunction: JobFunctionDefinition | null;
  onSelectJobFunction: (jobFunction: JobFunctionDefinition) => void;
  currentTab: string;
}

const JobFunctionTable: React.FC<JobFunctionTableProps> = ({
  jobFunctions,
  selectedJobFunction,
  onSelectJobFunction,
  currentTab,
}) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-primary" />
          {currentTab === 'all' 
            ? 'All Job Functions' 
            : `${currentTab.charAt(0).toUpperCase() + currentTab.slice(1)} Environment Job Functions`}
        </CardTitle>
        <CardDescription>
          {jobFunctions.length} job function(s) available for this environment
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
              {jobFunctions.map((jobFunction) => (
                <TableRow 
                  key={jobFunction.id}
                  className={selectedJobFunction?.id === jobFunction.id ? "bg-muted" : ""}
                  onClick={() => onSelectJobFunction(jobFunction)}
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
              
              {jobFunctions.length === 0 && (
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
  );
};

export default JobFunctionTable;
