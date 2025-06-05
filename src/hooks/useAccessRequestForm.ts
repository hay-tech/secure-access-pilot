
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { jobFunctionDefinitions } from '../data/mockData';
import { useAccessRequestState } from './useAccessRequestState';
import { useAccessFormValidation } from './useAccessFormValidation';
import { useAccessApprovalChain } from './useAccessApprovalChain';
import { useAccessRequestSubmission } from './useAccessRequestSubmission';
import { useFormStepNavigation } from './useFormStepNavigation';
import { AccessRequestFormValues, conditionalAccessRequestSchema } from '../schemas/accessRequestSchema';
import { getFilteredResources } from '../utils/accessFormUtils';

export type { AccessRequestFormValues } from '../schemas/accessRequestSchema';

export const useAccessRequestForm = (onSuccess: () => void, onCancel: () => void) => {
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

  // Use submission hook
  const { submitRequest } = useAccessRequestSubmission(onSuccess, selectedClusters);

  // Use step navigation hook
  const { nextStep, prevStep } = useFormStepNavigation(form, formStep, setFormStep, isFormValid);

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

  const onSubmit = async (data: AccessRequestFormValues) => {
    await submitRequest(data);
    // Reset form and close dialog
    form.reset();
    setFormStep(1);
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
