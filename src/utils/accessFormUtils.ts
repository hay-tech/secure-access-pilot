
import { targetResources } from '../data/mockData';

// Function to filter resources based on selected job function and filters
export const getFilteredResources = (selectedJobFunction: string, securityClassification: string, environmentFilter: string) => {
  let filtered = [...targetResources];
  
  // Filter by job function recommendations
  if (selectedJobFunction) {
    const jobFunction = jobFunctionDefinitions.find(jf => jf.id === selectedJobFunction);
    if (jobFunction) {
      filtered = filtered.filter(resource => 
        jobFunction.recommendedResources.includes(resource.id)
      );
    }
  }
  
  // Apply security classification filter
  if (securityClassification) {
    filtered = filtered.filter(resource => 
      resource.compliance === securityClassification
    );
  }
  
  // Apply environment filter
  if (environmentFilter) {
    filtered = filtered.filter(resource => 
      resource.environment === environmentFilter
    );
  }
  
  return filtered;
};

// Import job function definitions
import { jobFunctionDefinitions } from '../data/mockData';
