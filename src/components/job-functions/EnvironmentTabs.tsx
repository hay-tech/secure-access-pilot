
import React from 'react';
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import EnvironmentBadge from '@/components/job-functions/EnvironmentBadge';

interface EnvironmentTabsProps {
  currentTab: string;
  regulatoryEnvironments: Array<{ id: string; name: string }>;
  environmentCounts: Record<string, number>;
}

const EnvironmentTabs: React.FC<EnvironmentTabsProps> = ({ 
  currentTab, 
  regulatoryEnvironments,
  environmentCounts 
}) => {
  return (
    <TabsList className="grid" style={{ gridTemplateColumns: `repeat(${regulatoryEnvironments.length + 1}, minmax(0, 1fr))` }}>
      <TabsTrigger value="all" className="gap-2">
        <EnvironmentBadge 
          environment="All" 
          active={currentTab === 'all'} 
          count={environmentCounts['all']} 
        />
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
    </TabsList>
  );
};

export default EnvironmentTabs;
