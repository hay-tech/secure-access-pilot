
import React from 'react';
import { resourceHierarchyLevels, complianceEnvironments, environmentTypes } from '../../data/mockData';
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Badge } from '@/components/ui/badge';
import { Control } from 'react-hook-form';
import { AccessRequestFormValues } from '../../hooks/useAccessRequestForm';

// Component is kept for future use but no longer shown in the form
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

  // Empty component - not rendered anymore
  return null;
}
