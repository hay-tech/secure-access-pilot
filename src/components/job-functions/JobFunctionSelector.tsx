
import React, { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import { JobFunctionDefinition } from '@/types/iam';

interface JobFunctionSelectorProps {
  jobFunctions: JobFunctionDefinition[];
  onSelect: (jobFunction: JobFunctionDefinition) => void;
  currentJobFunction?: JobFunctionDefinition;
}

const JobFunctionSelector: React.FC<JobFunctionSelectorProps> = ({
  jobFunctions,
  onSelect,
  currentJobFunction
}) => {
  const [selectedJobFunctionId, setSelectedJobFunctionId] = useState<string>(
    currentJobFunction?.id || ''
  );

  const handleSelectChange = (value: string) => {
    setSelectedJobFunctionId(value);
    const selectedFunction = jobFunctions.find(jf => jf.id === value);
    if (selectedFunction) {
      onSelect(selectedFunction);
    }
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center space-x-2">
        <h3 className="text-lg font-medium">Select Job Function</h3>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="h-5 w-5">
              <Info className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p className="w-60">Select a job function to view its details and permissions.</p>
          </TooltipContent>
        </Tooltip>
      </div>

      <div className="flex items-center space-x-2">
        <Select value={selectedJobFunctionId} onValueChange={handleSelectChange}>
          <SelectTrigger className="w-[300px]">
            <SelectValue placeholder="Select a job function" />
          </SelectTrigger>
          <SelectContent>
            {jobFunctions.map((jf) => (
              <SelectItem key={jf.id} value={jf.id}>
                {jf.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default JobFunctionSelector;
