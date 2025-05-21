
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../contexts/AuthContext';
import { useIAM } from '../contexts/IAMContext';
import {
  jobFunctionDefinitions,
  targetResources,
  approvers,
} from '../data/mockData';
import { getApprovalChain, calculateRiskScore } from '../utils/accessRequestUtils';

// Define form schema with access type and temporary duration
const accessRequestSchema = z.object({
  jobFunction: z.string().min(1, { message: "Please select a job function" }),
  resources: z.array(z.string()).min(1, { message: "Please select at least one resource" }),
  justification: z.string()
    .min(10, { message: "Please provide a detailed justification (at least 10 characters)" })
    .max(500, { message: "Justification is too long (maximum 500 characters)" }),
  environmentFilter: z.string().optional(),
  cloudProvider: z.string().optional(),
  cloudWorkload: z.string().optional(),
  securityClassification: z.string().optional(),
  clusters: z.array(z.string()).optional(),
  accessType: z.enum(['permanent', 'temporary'], {
    required_error: "Please select an access type",
  }),
  tempDuration: z.string().optional(),
  projectName: z.string().optional(),
});

// Add conditional validation for tempDuration when accessType is 'temporary'
const conditionalAccessRequestSchema = z.intersection(
  accessRequestSchema,
  z.object({
    tempDuration: z.string().optional(),
    projectName: z.string().optional(),
  })
).refine(
  (data) => !(data.accessType === 'temporary' && !data.tempDuration),
  {
    message: "Duration is required for temporary access",
    path: ['tempDuration'],
  }
).refine(
  (data) => {
    // Check if job function has "project" in the name and require projectName
    const selectedJob = jobFunctionDefinitions.find(jf => jf.id === data.jobFunction);
    if (selectedJob && selectedJob.title.toLowerCase().includes('project') && !data.projectName) {
      return false;
    }
    return true;
  },
  {
    message: "Project name is required for this job function",
    path: ['projectName'],
  }
);

export type AccessRequestFormValues = z.infer<typeof conditionalAccessRequestSchema>;

export const useAccessRequestForm = (onSuccess: () => void, onCancel: () => void) => {
  const { currentUser } = useAuth();
  const { createAccessRequest } = useIAM();
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

  // Check if job function contains "project" to show project field
  useEffect(() => {
    if (watchedJobFunction) {
      const jobFunction = jobFunctionDefinitions.find(jf => jf.id === watchedJobFunction);
      if (jobFunction && jobFunction.title.toLowerCase().includes('project')) {
        setShowProjectField(true);
      } else {
        setShowProjectField(false);
        form.setValue('projectName', '');
      }
    }
  }, [watchedJobFunction, form]);
  
  // Update approval chain when resources or job function changes
  useEffect(() => {
    if (watchedResources.length > 0) {
      setApprovalChain(getApprovalChain(watchedResources, watchedJobFunction));
      setRiskScore(calculateRiskScore(watchedResources));
    } else {
      setApprovalChain([]);
      setRiskScore({ score: 0, level: 'Low' });
    }
  }, [watchedResources, watchedJobFunction]);
  
  // Handle job function selection
  useEffect(() => {
    if (watchedJobFunction) {
      setSelectedJobFunction(watchedJobFunction);
      
      // Auto-select recommended resources
      const jobFunction = jobFunctionDefinitions.find(jf => jf.id === watchedJobFunction);
      if (jobFunction) {
        form.setValue('resources', jobFunction.recommendedResources);
      }
    }
  }, [watchedJobFunction, form]);

  // Filter resources based on selected job function and filters
  const getFilteredResources = () => {
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

  const nextStep = () => {
    form.trigger(['jobFunction', 'resources']);
    const jobFunctionValid = !!form.getValues('jobFunction');
    const resourcesValid = form.getValues('resources').length > 0;
    
    if (jobFunctionValid && resourcesValid) {
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
        resourceName: resourceNames,
        requestType: 'role',
        justification: data.justification,
        accessType: data.accessType,
        expiresAt: expiresAt,
        complianceFramework: data.securityClassification || primaryResource?.compliance,
        resourceHierarchy: primaryResource?.resourceHierarchy as "Organization" | "Tenant" | "Environment/Region" | "Project/RG" | "Resources/Services" || "Resources/Services",
        projectName: data.projectName,
        approvalChain: generatedApprovalChain.map(approver => ({
          approverId: approver?.id || "",
          approverName: approver?.name || "",
          approverTitle: approver?.title || "",
          approverType: (approver?.type || "manager") as 'manager' | 'resource-owner' | 'security' | 'compliance',
          status: 'pending',
          reason: approver?.reason
        })),
        // Add additional fields for clusters if selected
        cloudEnvironment: data.cloudProvider,
        cspSubtype: data.cloudWorkload,
        environmentType: data.environmentFilter,
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
    getFilteredResources,
    nextStep,
    prevStep,
    onSubmit,
    watchedResources,
    watchedAccessType
  };
};
