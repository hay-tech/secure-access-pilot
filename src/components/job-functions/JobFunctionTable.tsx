
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
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
  currentTab
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Job Functions ({jobFunctions.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead className="hidden md:table-cell">Description</TableHead>
                <TableHead>Permissions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {jobFunctions.length > 0 ? (
                jobFunctions.map(jobFunction => (
                  <TableRow 
                    key={jobFunction.id}
                    onClick={() => onSelectJobFunction(jobFunction)}
                    className={`cursor-pointer ${selectedJobFunction?.id === jobFunction.id ? 'bg-muted' : ''}`}
                  >
                    <TableCell className="font-medium">{jobFunction.title}</TableCell>
                    <TableCell className="hidden md:table-cell">{jobFunction.description}</TableCell>
                    <TableCell>
                      {jobFunction.defaultPermissions?.length || 0}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="h-24 text-center">
                    No job functions found.
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
