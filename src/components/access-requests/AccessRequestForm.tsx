
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useIAM } from '../../contexts/IAMContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { HelpCircle, AlertCircle, CheckCircle, Info, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { jobFunctionDefinitions, targetResources, approvers, complianceEnvironments, environmentTypes, resourceHierarchyLevels, approvalMatrix } from '../../data/mockData';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ApprovalChainPreview } from './ApprovalChainPreview';
import { ResourceSelectionList } from './ResourceSelectionList';

// Define form schema with access type and expiration date
const accessRequestSchema = z.object({
  jobFunction: z.string().min(1, { message: "Please select a job function" }),
  resources: z.array(z.string()).min(1, { message: "Please select at least one resource" }),
  justification: z.string()
    .min(10, { message: "Please provide a detailed justification (at least 10 characters)" })
    .max(500, { message: "Justification is too long (maximum 500 characters)" }),
  complianceFilter: z.string().optional(),
  environmentFilter: z.string().optional(),
  accessType: z.enum(['permanent', 'temporary'], {
    required_error: "Please select an access type",
  }),
  expirationDate: z.date().optional()
    .refine(date => {
      if (!date) return true;
      return date > new Date();
    }, {
      message: "Expiration date must be in the future",
    }),
});

// Add conditional validation for expirationDate when accessType is 'temporary'
const conditionalAccessRequestSchema = z.intersection(
  accessRequestSchema,
  z.object({
    expirationDate: z.date().optional(),
  })
).refine(
  (data) => !(data.accessType === 'temporary' && !data.expirationDate),
  {
    message: "Expiration date is required for temporary access",
    path: ['expirationDate'],
  }
);

export type AccessRequestFormValues = z.infer<typeof conditionalAccessRequestSchema>;

// Extract approval chain based on selected resources, job function, and compliance framework
export const getApprovalChain = (resources: string[], jobFunction: string) => {
  if (!resources.length) return [];

  // Get the first selected resource for determining the approval flow
  const selectedResource = targetResources.find(r => resources.includes(r.id));
  if (!selectedResource) return [{ ...approvers[0], reason: "Default manager approval" }];

  // For sovereign environments (Federal, CCCS, CCCS-AWS), route to Sovereign Operations team
  const complianceEnv = complianceEnvironments.find(c => c.id === selectedResource.compliance);
  
  if (complianceEnv && complianceEnv.sovereignOps) {
    return [
      { ...approvers[0], reason: "Default manager approval" }, // Manager
      { ...approvers[4], reason: `Sovereign environment (${complianceEnv.name}) approval required` } // Sovereign Ops
    ];
  }
  
  // For CJIS and Commercial, use the approval matrix based on resource hierarchy
  let approvalTypes: string[] = [];
  const resourceHierarchy = selectedResource.resourceHierarchy;
  const complianceType = selectedResource.compliance === 'cjis' ? 'cjis' : 'commercial';
  
  // Get the appropriate approval chain from the matrix
  if (approvalMatrix[complianceType] && approvalMatrix[complianceType][resourceHierarchy]) {
    approvalTypes = approvalMatrix[complianceType][resourceHierarchy];
  } else {
    // Fallback to default approval chain
    approvalTypes = approvalMatrix.default[resourceHierarchy] || ['manager'];
  }
  
  // Map approval types to actual approver objects
  return approvalTypes.map(type => {
    const approverObj = approvers.find(a => a.type === type);
    if (!approverObj) return null;
    
    let reason = "Required approver";
    
    switch (type) {
      case 'manager':
        reason = "Default manager approval";
        break;
      case 'security':
        reason = "Security review required";
        break;
      case 'compliance':
        reason = "Compliance review required";
        break;
      case 'org-owner':
        reason = "Organization-level access requires owner approval";
        break;
      case 'tenant-admin':
        reason = "Tenant-level access requires administrator approval";
        break;
      case 'env-owner':
        reason = "Environment-level access requires owner approval";
        break;
      case 'project-owner':
        reason = "Project-level access requires owner approval";
        break;
      case 'resource-owner':
        reason = "Resource-specific access requires owner approval";
        break;
    }
    
    return { ...approverObj, reason };
  }).filter(Boolean);
};

// Calculate risk score based on selected resources
export const calculateRiskScore = (resources: string[]) => {
  const selectedResources = targetResources.filter(r => resources.includes(r.id));
  let riskScore = 0;
  
  // Count high risk resources
  const highRisk = selectedResources.filter(r => r.riskLevel === 'High').length;
  const mediumRisk = selectedResources.filter(r => r.riskLevel === 'Medium').length;
  const lowRisk = selectedResources.filter(r => r.riskLevel === 'Low').length;
  
  riskScore = highRisk * 10 + mediumRisk * 5 + lowRisk * 2;
  
  // Add extra points for sensitive or privileged resources
  if (selectedResources.some(r => r.isSensitive)) riskScore += 5;
  if (selectedResources.some(r => r.isPrivileged)) riskScore += 10;
  
  return {
    score: riskScore,
    level: riskScore >= 15 ? 'High' : riskScore >= 8 ? 'Medium' : 'Low'
  };
};

interface AccessRequestFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export const AccessRequestForm: React.FC<AccessRequestFormProps> = ({ onSuccess, onCancel }) => {
  const { currentUser } = useAuth();
  const { createAccessRequest } = useIAM();
  const [formStep, setFormStep] = useState(1);
  const [selectedJobFunction, setSelectedJobFunction] = useState('');
  const [complianceFilter, setComplianceFilter] = useState('');
  const [environmentFilter, setEnvironmentFilter] = useState('');
  const [approvalChain, setApprovalChain] = useState<any[]>([]);
  const [riskScore, setRiskScore] = useState({ score: 0, level: 'Low' });

  const form = useForm<AccessRequestFormValues>({
    resolver: zodResolver(conditionalAccessRequestSchema),
    defaultValues: {
      jobFunction: '',
      resources: [],
      justification: '',
      complianceFilter: '',
      environmentFilter: '',
      accessType: 'permanent',
      expirationDate: undefined
    },
  });

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
    
    // Apply compliance filter
    if (complianceFilter) {
      filtered = filtered.filter(resource => resource.compliance === complianceFilter);
    }
    
    // Apply environment filter
    if (environmentFilter) {
      filtered = filtered.filter(resource => resource.environment === environmentFilter);
    }
    
    return filtered;
  };

  // Watch for form value changes
  const watchedResources = form.watch('resources');
  const watchedJobFunction = form.watch('jobFunction');
  const watchedAccessType = form.watch('accessType');
  
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

  const onSubmit = async (data: AccessRequestFormValues) => {
    if (!currentUser) return;
    
    // Collect resource names for the selected resources
    const selectedResources = targetResources.filter(resource => data.resources.includes(resource.id));
    const resourceNames = selectedResources.map(resource => resource.name).join(', ');
    
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
        expiresAt: data.accessType === 'temporary' && data.expirationDate ? 
                   data.expirationDate.toISOString() : undefined,
        complianceFramework: primaryResource?.compliance,
        resourceHierarchy: primaryResource?.resourceHierarchy,
        approvalChain: generatedApprovalChain
      });
      
      // Reset form and close dialog
      form.reset();
      setFormStep(1);
      onSuccess();
    } catch (error) {
      console.error("Failed to submit access request:", error);
    }
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Progress indicator */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center w-full">
            <div className={cn(
              "flex items-center justify-center w-8 h-8 rounded-full mr-2",
              formStep === 1 ? "bg-iam-primary text-white" : "bg-iam-primary text-white"
            )}>
              1
            </div>
            <div className={cn(
              "h-1 flex-1 mx-2",
              formStep === 2 ? "bg-iam-primary" : "bg-gray-300"
            )} />
            <div className={cn(
              "flex items-center justify-center w-8 h-8 rounded-full",
              formStep === 2 ? "bg-iam-primary text-white" : "bg-gray-300 text-gray-600"
            )}>
              2
            </div>
          </div>
          <span className="ml-4 text-sm text-gray-500">
            {formStep === 1 ? "Select Access" : "Complete Request"}
          </span>
        </div>
        
        {/* Step 1: Job function and resource selection */}
        {formStep === 1 && (
          <div className="space-y-4">
            {/* Job Function */}
            <FormField
              control={form.control}
              name="jobFunction"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center">
                    Select Your Job Function
                    <HelpCircle className="h-4 w-4 ml-1 text-gray-400" />
                  </FormLabel>
                  <FormDescription>
                    Select the role that aligns with your current responsibilities. This determines your recommended access profile.
                  </FormDescription>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      setSelectedJobFunction(value);
                    }}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your job function" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {jobFunctionDefinitions.map(jf => (
                        <SelectItem key={jf.id} value={jf.id}>
                          <div className="flex flex-col">
                            <span>{jf.title}</span>
                            <span className="text-xs text-gray-500">{jf.description}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Resource filters */}
            {selectedJobFunction && (
              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-md">
                <div>
                  <Label htmlFor="compliance-filter">Compliance Framework</Label>
                  <Select
                    value={complianceFilter}
                    onValueChange={setComplianceFilter}
                  >
                    <SelectTrigger id="compliance-filter">
                      <SelectValue placeholder="All frameworks" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All frameworks</SelectItem>
                      {complianceEnvironments.map(ce => (
                        <SelectItem key={ce.id} value={ce.id}>{ce.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="environment-filter">Environment</Label>
                  <Select
                    value={environmentFilter}
                    onValueChange={setEnvironmentFilter}
                  >
                    <SelectTrigger id="environment-filter">
                      <SelectValue placeholder="All environments" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All environments</SelectItem>
                      {environmentTypes.map(et => (
                        <SelectItem key={et.id} value={et.id}>{et.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
            
            {/* Resource selection */}
            <ResourceSelectionList 
              filteredResources={getFilteredResources()} 
              selectedResources={watchedResources}
              selectedJobFunction={selectedJobFunction}
              onChange={(resources) => form.setValue('resources', resources)}
              control={form.control}
            />
            
            <div className="flex justify-end">
              <Button 
                type="button" 
                onClick={nextStep}
                disabled={!selectedJobFunction || !watchedResources.length}
              >
                Next
              </Button>
            </div>
          </div>
        )}
        
        {/* Step 2: Justification, access type, and approval preview */}
        {formStep === 2 && (
          <div className="space-y-6">
            {/* Risk Score Indicator */}
            <div className={cn(
              "p-4 rounded-md",
              riskScore.level === 'High' ? "bg-red-50 border border-red-200" :
              riskScore.level === 'Medium' ? "bg-yellow-50 border border-yellow-200" :
              "bg-green-50 border border-green-200"
            )}>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {riskScore.level === 'High' ? (
                    <AlertCircle className="h-5 w-5 mr-2 text-red-600" />
                  ) : riskScore.level === 'Medium' ? (
                    <AlertCircle className="h-5 w-5 mr-2 text-yellow-600" />
                  ) : (
                    <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                  )}
                  <span className="font-medium">
                    {riskScore.level === 'High' ? "High Risk Request" :
                      riskScore.level === 'Medium' ? "Medium Risk Request" :
                      "Low Risk Request"}
                  </span>
                </div>
                <div>
                  <Badge variant="outline" className={cn(
                    "text-sm font-semibold",
                    riskScore.level === 'High' ? "bg-red-100 text-red-800 border-red-300" :
                    riskScore.level === 'Medium' ? "bg-yellow-100 text-yellow-800 border-yellow-300" :
                    "bg-green-100 text-green-800 border-green-300"
                  )}>
                    Risk Score: {riskScore.score}
                  </Badge>
                </div>
              </div>
            </div>
            
            {/* Access Type Selection */}
            <FormField
              control={form.control}
              name="accessType"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Access Type</FormLabel>
                  <FormDescription>
                    Choose whether you need permanent or temporary access.
                  </FormDescription>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="permanent" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Permanent Access
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="temporary" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Temporary Access
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Expiration Date (only if temporary access is selected) */}
            {watchedAccessType === 'temporary' && (
              <FormField
                control={form.control}
                name="expirationDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Expiration Date</FormLabel>
                    <FormDescription>
                      Select when this temporary access should expire.
                    </FormDescription>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <Calendar className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date()}
                          initialFocus
                          className={cn("p-3 pointer-events-auto")}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            {/* Business Justification */}
            <FormField
              control={form.control}
              name="justification"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center">
                    Business Justification
                    <HelpCircle className="h-4 w-4 ml-1 text-gray-400" />
                  </FormLabel>
                  <FormDescription>
                    Provide a clear explanation of why this access is needed.
                    {riskScore.level === 'High' && (
                      <span className="text-red-600 font-medium ml-1">
                        Detailed justification required for high-risk access.
                      </span>
                    )}
                  </FormDescription>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="I require this access to..."
                      className="min-h-[120px]"
                    />
                  </FormControl>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Example: "I require write access to cccs-prod to update security services images with latest patches for Q2."</span>
                    <span>{field.value.length}/500 characters</span>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Approval Chain Preview */}
            <ApprovalChainPreview approvalChain={approvalChain} />
            
            <div className="flex justify-between">
              <Button type="button" variant="outline" onClick={prevStep}>
                Back
              </Button>
              <Button type="submit">
                Submit Request
              </Button>
            </div>
          </div>
        )}
      </form>
    </Form>
  );
};
