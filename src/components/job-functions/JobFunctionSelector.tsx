
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Info, ShieldCheck } from "lucide-react";
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
  const [selectedJobFunctionId, setSelectedJobFunctionId] = React.useState<string>(
    currentJobFunction?.id || ''
  );

  React.useEffect(() => {
    if (currentJobFunction) {
      setSelectedJobFunctionId(currentJobFunction.id);
    } else {
      setSelectedJobFunctionId('');
    }
  }, [currentJobFunction]);

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
        <ShieldCheck className="h-5 w-5 text-primary" />
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
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a job function" />
          </SelectTrigger>
          <SelectContent className="max-h-[300px]">
            {jobFunctions.map((jf) => (
              <SelectItem key={jf.id} value={jf.id} className="flex items-center justify-between py-2">
                <div className="flex flex-col">
                  {jf.title}
                  <span className="text-xs text-muted-foreground">{jf.description.substring(0, 50)}...</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {currentJobFunction?.environmentRestrictions?.length > 0 && (
        <div className="mt-2">
          <p className="text-sm text-muted-foreground mb-1">Environment Restrictions:</p>
          <div className="flex flex-wrap gap-1">
            {currentJobFunction.environmentRestrictions.map(env => (
              <Badge key={env} variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                {env}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default JobFunctionSelector;
