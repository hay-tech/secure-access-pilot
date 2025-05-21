
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../contexts/AuthContext';
import { useIAM } from '../contexts/IAMContext';
import { jobFunctionDefinitions, targetResources } from '../data/mockData';
import { useAccessRequestState } from './useAccessRequestState';
import { useAccessFormValidation } from './useAccessFormValidation';
import { useAccessApprovalChain } from './useAccessApprovalChain';
import { AccessRequestFormValues, conditionalAccessRequestSchema } from '../schemas/accessRequestSchema';
import { getFilteredResources } from '../utils/accessFormUtils';
import { getApprovalChain } from '../utils/accessRequestUtils';

export type { AccessRequestFormValues } from '../schemas/accessRequestSchema';

export const useAccessRequestForm = (onSuccess: () => void, onCancel: () => void) => {
  const { currentUser } = useAuth();
  const { createAccessRequest } = useIAM();

  // Use form with zod resolver
  const form = useForm<AccessRequestFormValues>({
    resolver: zodResolver(conditionalAccessRequestSchema),
    defaultValues: {
      jobFunction: '',
      resources: [],
      justification: '',
      environmentFilter: '',
      cloudProvider: '',
      cloudWorkload: '',
      securityClassification: '',
      clusters: [],
      accessType: 'permanent',
      tempDuration: '',
      projectName: '',
    },
  });

  // Watch for form value changes
  const watchedResources = form.watch('resources');
  const watchedJobFunction = form.watch('jobFunction');
  const watchedAccessType = form.watch('accessType');
  const watchedEnvironment = form.watch('environmentFilter');
  const watchedSecurityClass = form.watch('securityClassification');
  const watchedCloudProvider = form.watch('cloudProvider');
  const watchedCloudWorkload = form.watch('cloudWorkload');
  const watchedClusters = form.watch('clusters');

  // Use our custom state hook
  const {
    formStep,
    setFormStep,
    selectedJobFunction,
    setSelectedJobFunction,
    environmentFilter,
    setEnvironmentFilter,
    securityClassification,
    setSecurityClassification,
    cloudProvider,
    setCloudProvider,
    cloudWorkload,
    setCloudWorkload,
    approvalChain,
    setApprovalChain,
    riskScore,
    setRiskScore,
    showProjectField,
    selectedClusters,
    setSelectedClusters,
    isFormValid,
    setIsFormValid,
  } = useAccessRequestState(watchedJobFunction);

  // Use validation hook
  useAccessFormValidation(
    watchedJobFunction,
    watchedResources,
    watchedEnvironment,
    watchedSecurityClass,
    watchedCloudProvider,
    watchedCloudWorkload,
    selectedClusters,
    [],
    setIsFormValid
  );

  // Use approval chain hook
  useAccessApprovalChain(
    watchedResources,
    watchedJobFunction,
    setApprovalChain,
    setRiskScore
  );

  // Handle job function selection
  useEffect(() => {
    if (watchedJobFunction) {
      // Auto-select recommended resources
      const jobFunction = jobFunctionDefinitions.find(jf => jf.id === selectedJobFunction);
      if (jobFunction) {
        form.setValue('resources', jobFunction.recommendedResources);
      }
    }
  }, [watchedJobFunction, form, selectedJobFunction]);

  const nextStep = () => {
    form.trigger(['jobFunction', 'resources']);
    if (isFormValid) {
      setFormStep(2);
    }
  };
  
  const prevStep = () => {
    setFormStep(1);
  };

  const onSubmit = async (data: AccessRequestFormValues) => {
    if (!currentUser) return;
    
    // Calculate expiration date based on selected duration
    let expiresAt: string | undefined = undefined;
    if (data.accessType === 'temporary' && data.tempDuration) {
      const days = parseInt(data.tempDuration, 10);
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + days);
      expiresAt = expirationDate.toISOString();
    }
    
    // Get selected job function title
    const selectedJobFunctionObj = jobFunctionDefinitions.find(jf => jf.id === data.jobFunction);
    const jobFunctionTitle = selectedJobFunctionObj?.title || "Standard Role";
    
    // Get selected cluster name
    const clusterName = data.cloudWorkload || (data.clusters && data.clusters.length > 0 ? data.clusters[0] : "Default Cluster");
    
    // Collect resource names for the selected resources
    const selectedResources = targetResources.filter(resource => 
      data.resources.includes(resource.id)
    );
    const resourceNames = selectedResources.map(resource => 
      resource.name
    ).join(', ');
    
    // Get the first resource for determining compliance and resource hierarchy
    const primaryResource = selectedResources[0];
    
    // Generate approval chain
    const generatedApprovalChain = getApprovalChain(data.resources, data.jobFunction);
    
    try {
      // Create access request with enhanced data
      await createAccessRequest({
        userId: currentUser.id,
        resourceId: data.resources.join(','),
        resourceName: clusterName, // Use cluster name as resource name
        requestType: 'role',
        justification: data.justification,
        accessType: data.accessType,
        expiresAt: expiresAt,
        complianceFramework: data.securityClassification || primaryResource?.compliance,
        resourceHierarchy: primaryResource?.resourceHierarchy as "Organization" | "Tenant" | "Environment/Region" | "Project/RG" | "Resources/Services" || "Resources/Services",
        projectName: data.projectName,
        approvalChain: generatedApprovalChain.map(approver => ({
          id: `approver-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, // Generate a unique ID
          approverId: approver?.id || "",
          approverName: approver?.name || "",
          approverTitle: approver?.title || "",
          approverType: (approver?.type || "manager") as 'manager' | 'resource-owner' | 'security' | 'compliance',
          status: 'pending',
          reason: approver?.reason,
          // Include other properties that might be used elsewhere
          name: approver?.name,
          title: approver?.title,
          type: approver?.type
        })),
        // Update the field names to match the AccessRequest type
        cloudEnvironment: data.cloudProvider,
        environmentType: data.environmentFilter,
        // Add any selected clusters to the request
        cloudWorkload: data.cloudWorkload,
        // Set job function for the request
        jobFunction: jobFunctionTitle,
      });
      
      // Reset form and close dialog
      form.reset();
      setFormStep(1);
      onSuccess();
    } catch (error) {
      console.error("Failed to submit access request:", error);
    }
  };

  return {
    form,
    formStep,
    selectedJobFunction,
    environmentFilter,
    setEnvironmentFilter,
    securityClassification,
    setSecurityClassification,
    cloudProvider,
    setCloudProvider,
    cloudWorkload,
    setCloudWorkload,
    approvalChain,
    riskScore,
    showProjectField,
    selectedClusters,
    setSelectedClusters,
    getFilteredResources: () => getFilteredResources(selectedJobFunction, securityClassification, environmentFilter),
    nextStep,
    prevStep,
    onSubmit,
    watchedResources,
    watchedAccessType,
    isFormValid,
  };
};
