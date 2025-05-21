import { useState, useEffect } from 'react';
import { jobFunctionDefinitions } from '../data/mockData';

export const useAccessRequestState = (watchedJobFunction: string) => {
  const [formStep, setFormStep] = useState(1);
  const [selectedJobFunction, setSelectedJobFunction] = useState('');
  const [environmentFilter, setEnvironmentFilter] = useState('');
  const [securityClassification, setSecurityClassification] = useState('');
  const [cloudProvider, setCloudProvider] = useState('');
  const [cloudWorkload, setCloudWorkload] = useState('');
  const [approvalChain, setApprovalChain] = useState<any[]>([]);
  const [riskScore, setRiskScore] = useState({ score: 0, level: 'Low' });
  const [showProjectField, setShowProjectField] = useState(false);
  const [selectedClusters, setSelectedClusters] = useState<string[]>([]);
  const [isFormValid, setIsFormValid] = useState(false);
  const [availableClusters, setAvailableClusters] = useState<any[]>([]);

  // Check if job function contains "project" to show project field
  useEffect(() => {
    if (watchedJobFunction) {
      const jobFunction = jobFunctionDefinitions.find(jf => jf.id === watchedJobFunction);
      if (jobFunction && jobFunction.title.toLowerCase().includes('project')) {
        setShowProjectField(true);
      } else {
        setShowProjectField(false);
      }
    }
  }, [watchedJobFunction]);

  // Handle job function selection
  useEffect(() => {
    if (watchedJobFunction) {
      setSelectedJobFunction(watchedJobFunction);
    }
  }, [watchedJobFunction]);
  
  // Update available clusters when filters change
  useEffect(() => {
    if (environmentFilter && securityClassification && cloudProvider && cloudWorkload) {
      // This would be populated from clusterData in the AccessRequestForm component
      // We're keeping a reference here to track if clusters are available
      setAvailableClusters([{}]); // Dummy data to indicate clusters are available
    } else {
      setAvailableClusters([]);
    }
  }, [environmentFilter, securityClassification, cloudProvider, cloudWorkload]);

  return {
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
    availableClusters,
    setAvailableClusters,
  };
};
