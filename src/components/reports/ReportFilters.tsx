
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { jobFunctionDefinitions } from '@/data/mockJobFunctions';

interface ManagerOption {
  id: string;
  name: string;
}

interface ReportFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterJobFunction: string;
  setFilterJobFunction: (jobFunction: string) => void;
  filterManager?: string;
  setFilterManager?: (managerId: string) => void;
  managers?: ManagerOption[];
}

export const ReportFilters: React.FC<ReportFiltersProps> = ({
  searchQuery,
  setSearchQuery,
  filterJobFunction,
  setFilterJobFunction,
  filterManager = '',
  setFilterManager = () => {},
  managers = []
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="flex-grow">
        <Label htmlFor="search">Search Users</Label>
        <Input
          id="search"
          placeholder="Search by name or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="w-full sm:w-72">
        <Label htmlFor="job-function">Filter by Job Function</Label>
        <Select
          value={filterJobFunction}
          onValueChange={setFilterJobFunction}
        >
          <SelectTrigger id="job-function">
            <SelectValue placeholder="All Job Functions" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Job Functions</SelectItem>
            {jobFunctionDefinitions.map(jf => (
              <SelectItem key={jf.id} value={jf.id}>{jf.title}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {managers.length > 0 && (
        <div className="w-full sm:w-72">
          <Label htmlFor="manager">Filter by Manager</Label>
          <Select
            value={filterManager}
            onValueChange={setFilterManager}
          >
            <SelectTrigger id="manager">
              <SelectValue placeholder="All Managers" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Managers</SelectItem>
              {managers.map(manager => (
                <SelectItem key={manager.id} value={manager.id}>{manager.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
};
