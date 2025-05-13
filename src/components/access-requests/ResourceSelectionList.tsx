
import React from 'react';
import { resourceHierarchyLevels, complianceEnvironments, environmentTypes } from '../../data/mockData';
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Badge } from '@/components/ui/badge';
import { Control } from 'react-hook-form';
import { Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AccessRequestFormValues } from './AccessRequestForm';

interface ResourceSelectionListProps {
  filteredResources: any[];
  selectedResources: string[];
  selectedJobFunction: string;
  onChange: (resources: string[]) => void;
  control: Control<AccessRequestFormValues>;
}

export const ResourceSelectionList: React.FC<ResourceSelectionListProps> = ({
  filteredResources,
  selectedResources,
  selectedJobFunction,
  onChange,
  control
}) => {
  const renderRiskBadge = (level: string) => {
    const colors = {
      High: 'bg-red-100 text-red-800 border-red-300',
      Medium: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      Low: 'bg-green-100 text-green-800 border-green-300',
    };
    
    return (
      <Badge variant="outline" className={colors[level as keyof typeof colors]}>
        {level} Risk
      </Badge>
    );
  };

  return (
    <FormField
      control={control}
      name="resources"
      render={({ field }) => (
        <FormItem>
          <div className="flex items-center">
            <div className="font-medium">Select Specific Resources</div>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              className="h-4 w-4 ml-1 text-gray-400"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
              <path d="M12 17h.01" />
            </svg>
          </div>
          <p className="text-sm text-gray-500">
            Choose the systems and compliance level to which these permissions will apply. Suggested resources are based on your job function.
          </p>
          <div className="grid grid-cols-1 gap-2 mt-2">
            {filteredResources.map(resource => (
              <div key={resource.id} className="flex items-center border rounded-md p-3 hover:bg-gray-50">
                <input
                  type="checkbox"
                  id={`resource-${resource.id}`}
                  value={resource.id}
                  checked={field.value.includes(resource.id)}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    const value = e.target.value;
                    let newValues = [...field.value];
                    
                    if (checked) {
                      newValues.push(value);
                    } else {
                      newValues = newValues.filter(v => v !== value);
                    }
                    
                    field.onChange(newValues);
                    onChange(newValues);
                  }}
                  className="h-4 w-4 mr-3"
                />
                <label htmlFor={`resource-${resource.id}`} className="flex-1 cursor-pointer">
                  <div className="font-medium">{resource.name}</div>
                  <div className="text-sm text-gray-500">
                    {environmentTypes.find(e => e.id === resource.environment)?.name} | 
                    {complianceEnvironments.find(c => c.id === resource.compliance)?.name} | 
                    {resourceHierarchyLevels.find(h => h.id === resource.resourceHierarchy)?.name}
                  </div>
                  <div className="mt-1 flex items-center gap-2">
                    {renderRiskBadge(resource.riskLevel)}
                    {resource.isSensitive && (
                      <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">
                        Sensitive
                      </Badge>
                    )}
                    {resource.isPrivileged && (
                      <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-300">
                        Privileged
                      </Badge>
                    )}
                  </div>
                </label>
              </div>
            ))}
          </div>
          {filteredResources.length === 0 && selectedJobFunction && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md text-yellow-700 flex items-center">
              <Info className="h-5 w-5 mr-2" />
              <span>No resources match your current filters. Try changing the compliance framework or environment filter.</span>
            </div>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
