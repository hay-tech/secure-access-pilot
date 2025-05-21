
import { useEffect } from 'react';

export const useAccessFormValidation = (
  watchedJobFunction: string,
  watchedResources: string[],
  watchedEnvironment: string,
  watchedSecurityClass: string,
  watchedCloudProvider: string,
  watchedCloudWorkload: string,
  selectedClusters: string[],
  availableClusters: any[],
  setIsFormValid: (isValid: boolean) => void
) => {
  // Check form validity for Next button highlighting
  useEffect(() => {
    const checkFormValidity = () => {
      // Basic check for required fields in step 1
      const jobFunctionValid = !!watchedJobFunction;
      const resourcesValid = watchedResources.length > 0;
      
      // Additional validation for environment-specific fields
      let environmentValid = true;
      
      if (watchedEnvironment && watchedSecurityClass) {
        if (watchedCloudProvider) {
          if (watchedCloudWorkload) {
            // If we have selected clusters and there are available clusters, check if at least one is selected
            if (selectedClusters.length === 0 && availableClusters.length > 0) {
              environmentValid = false;
            }
          } else {
            environmentValid = false; // Need cloud workload if provider is selected
          }
        } else {
          environmentValid = false; // Need cloud provider if environment and security class are selected
        }
      }
      
      setIsFormValid(jobFunctionValid && resourcesValid && environmentValid);
    };
    
    checkFormValidity();
  }, [
    watchedJobFunction, 
    watchedResources, 
    watchedEnvironment, 
    watchedSecurityClass, 
    watchedCloudProvider, 
    watchedCloudWorkload, 
    selectedClusters, 
    availableClusters,
    setIsFormValid
  ]);
};
