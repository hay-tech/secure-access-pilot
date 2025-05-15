
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type EnvironmentBadgeProps = {
  environment: string;
  active?: boolean;
  count?: number;
};

const getEnvironmentStyles = (environment: string, active: boolean = false) => {
  const baseClasses = "transition-colors";
  const styles = {
    all: {
      inactive: "bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-200",
      active: "bg-gray-700 text-white border-gray-600"
    },
    federal: {
      inactive: "bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200",
      active: "bg-blue-700 text-white border-blue-600"
    },
    cji: {
      inactive: "bg-purple-50 text-purple-700 hover:bg-purple-100 border-purple-200",
      active: "bg-purple-700 text-white border-purple-600"
    },
    commercial: {
      inactive: "bg-green-50 text-green-700 hover:bg-green-100 border-green-200",
      active: "bg-green-700 text-white border-green-600"
    },
    cccs: {
      inactive: "bg-amber-50 text-amber-700 hover:bg-amber-100 border-amber-200",
      active: "bg-amber-700 text-white border-amber-600"
    }
  };

  const envKey = environment.toLowerCase() as keyof typeof styles;
  const stateKey = active ? 'active' : 'inactive';

  return cn(
    baseClasses,
    styles[envKey] ? styles[envKey][stateKey] : styles.all[stateKey]
  );
};

const EnvironmentBadge: React.FC<EnvironmentBadgeProps> = ({ 
  environment, 
  active = false,
  count
}) => {
  return (
    <Badge 
      variant="outline" 
      className={cn(
        "flex items-center gap-1",
        getEnvironmentStyles(environment, active)
      )}
    >
      {environment}
      {count !== undefined && (
        <span className={cn(
          "ml-1 rounded-full w-5 h-5 text-xs flex items-center justify-center",
          active ? "bg-white text-gray-700" : "bg-gray-200 text-gray-700"
        )}>
          {count}
        </span>
      )}
    </Badge>
  );
};

export default EnvironmentBadge;
