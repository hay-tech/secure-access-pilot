import React, { useState, useEffect } from 'react';
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
import { HelpCircle, AlertCircle, CheckCircle, Info } from 'lucide-react';
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { environmentTypes, jobFunctionDefinitions } from '../../data/mockData';
import { ApprovalChainPreview } from './ApprovalChainPreview';
import { ResourceSelectionList } from './ResourceSelectionList';
import { useAccessRequestForm, AccessRequestFormValues } from '../../hooks/useAccessRequestForm';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';

// Export the type for use in other components
export type { AccessRequestFormValues } from '../../hooks/useAccessRequestForm';

interface AccessRequestFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

// Define cluster data structure
interface Cluster {
  environmentTier: string;
  cluster: string;
  clusterName: string;
  cloud: string;
  cspSubtype: string;
  region: string;
  securityClassification: string;
}

// Define security classification options
const securityClassifications = [
  { id: 'fedramp-high', name: 'FedRAMP High' },
  { id: 'cccs', name: 'CCCS' },
  { id: 'cjis', name: 'CJIS' },
  { id: 'nist-800-53-moderate', name: 'NIST 800-53 Moderate' }
];

// Define cloud provider options
const cloudProviders = [
  { id: 'azure', name: 'Azure' },
  { id: 'aws', name: 'AWS' },
  { id: 'gcp', name: 'GCP' }
];

// Define cloud provider workload options
const cloudWorkloads = [
  { id: 'commercial', name: 'Commercial' },
  { id: 'usgov', name: 'USGov' }
];

// Cluster data
const clusterData: Cluster[] = [
  { environmentTier: 'dev', cluster: 'Dev West (Azure)', clusterName: 'az-dev-us-west2', cloud: 'azure', cspSubtype: 'commercial', region: 'uswest2', securityClassification: 'nist-800-53-moderate' },
  { environmentTier: 'dev', cluster: 'Dev East (Azure)', clusterName: 'az-dev-us-east', cloud: 'azure', cspSubtype: 'commercial', region: 'useast', securityClassification: 'nist-800-53-moderate' },
  { environmentTier: 'dev', cluster: 'AWS Dev', clusterName: 'aws-dev-us-east1', cloud: 'aws', cspSubtype: 'commercial', region: 'us-east-1', securityClassification: 'nist-800-53-moderate' },
  { environmentTier: 'dev', cluster: 'GCP Dev', clusterName: 'gcp-dev-us-east1', cloud: 'gcp', cspSubtype: 'commercial', region: 'us-east1', securityClassification: 'nist-800-53-moderate' },
  { environmentTier: 'dev', cluster: 'AWS SPSS Dev', clusterName: 'aws-spss-dev-us-west1', cloud: 'aws', cspSubtype: 'commercial', region: 'us-west1', securityClassification: 'nist-800-53-moderate' },
  { environmentTier: 'stage', cluster: 'Stage West (Azure)', clusterName: 'az-stage-us-west2', cloud: 'azure', cspSubtype: 'commercial', region: 'uswest2', securityClassification: 'nist-800-53-moderate' },
  { environmentTier: 'stage', cluster: 'AWS Stage Oregon', clusterName: 'aws-stage-us-west2', cloud: 'aws', cspSubtype: 'commercial', region: 'us-west-2', securityClassification: 'nist-800-53-moderate' },
  { environmentTier: 'stage', cluster: 'Stage West 3 (Azure)', clusterName: 'az-stage-us-west3', cloud: 'azure', cspSubtype: 'commercial', region: 'uswest3', securityClassification: 'nist-800-53-moderate' },
  { environmentTier: 'stage', cluster: 'Stage East (Azure)', clusterName: 'az-stage-us-east', cloud: 'azure', cspSubtype: 'commercial', region: 'useast', securityClassification: 'nist-800-53-moderate' },
  { environmentTier: 'stage', cluster: 'AWS Stage Ohio', clusterName: 'aws-stage-us-east2', cloud: 'aws', cspSubtype: 'commercial', region: 'us-east-2', securityClassification: 'nist-800-53-moderate' },
  { environmentTier: 'stage', cluster: 'Gov Stage (Azure)', clusterName: 'az-stage-usgov-east', cloud: 'azure', cspSubtype: 'usgov', region: 'usgovvirginia', securityClassification: 'nist-800-53-moderate' },
  { environmentTier: 'stage', cluster: 'GCP Stage', clusterName: 'gcp-stage-us-east1', cloud: 'gcp', cspSubtype: 'commercial', region: 'us-east1', securityClassification: 'nist-800-53-moderate' },
  { environmentTier: 'stage', cluster: 'EaaS Commercial Pre-Prod', clusterName: 'az-preprod-obs-us-east', cloud: 'azure', cspSubtype: 'commercial', region: 'useast', securityClassification: 'nist-800-53-moderate' },
  { environmentTier: 'prod', cluster: 'EaaS Commercial Prod', clusterName: 'az-prod-obs-east', cloud: 'azure', cspSubtype: 'commercial', region: 'useast', securityClassification: 'nist-800-53-moderate' },
  { environmentTier: 'prod', cluster: 'EaaS Gov Prod', clusterName: 'az-prod-obs-usgov-east', cloud: 'azure', cspSubtype: 'usgov', region: 'usgovvirginia', securityClassification: 'cjis' },
  { environmentTier: 'prod', cluster: 'BDP Search EaaD', clusterName: 'az-prod-eaad-usgov-east', cloud: 'azure', cspSubtype: 'usgov', region: 'usgovvirginia', securityClassification: 'cjis' },
  { environmentTier: 'prod', cluster: 'UK Prod (Azure)', clusterName: 'az-prod-uk-south', cloud: 'azure', cspSubtype: 'commercial', region: 'uksouth', securityClassification: 'nist-800-53-moderate' },
  { environmentTier: 'prod', cluster: 'CA Prod (Azure)', clusterName: 'az-prod-ca-central', cloud: 'azure', cspSubtype: 'commercial', region: 'canadacentral', securityClassification: 'nist-800-53-moderate' },
  { environmentTier: 'prod', cluster: 'AU Prod (Azure)', clusterName: 'az-prod-au-central', cloud: 'azure', cspSubtype: 'commercial', region: 'australiacentral', securityClassification: 'nist-800-53-moderate' },
  { environmentTier: 'prod', cluster: 'US Prod West (Azure)', clusterName: 'az-prod-us-west2', cloud: 'azure', cspSubtype: 'commercial', region: 'uswest2', securityClassification: 'nist-800-53-moderate' },
  { environmentTier: 'prod', cluster: 'US Prod West 3 (Azure)', clusterName: 'az-prod-us-west3', cloud: 'azure', cspSubtype: 'commercial', region: 'uswest3', securityClassification: 'nist-800-53-moderate' },
  { environmentTier: 'prod', cluster: 'US Prod East (Azure)', clusterName: 'az-prod-us-east', cloud: 'azure', cspSubtype: 'commercial', region: 'useast', securityClassification: 'nist-800-53-moderate' },
  { environmentTier: 'prod', cluster: 'US Gov Prod AZ (Azure)', clusterName: 'az-prod-usgov-az', cloud: 'azure', cspSubtype: 'usgov', region: 'usgovarizona', securityClassification: 'cjis' },
  { environmentTier: 'prod', cluster: 'US Gov Prod VA (Azure)', clusterName: 'az-prod-usgov-va', cloud: 'azure', cspSubtype: 'usgov', region: 'usgovvirginia', securityClassification: 'cjis' },
  { environmentTier: 'prod', cluster: 'AWS Prod VA', clusterName: 'aws-prod-us-east1', cloud: 'aws', cspSubtype: 'commercial', region: 'us-east-1', securityClassification: 'nist-800-53-moderate' },
  { environmentTier: 'prod', cluster: 'AWS Gov Prod VA', clusterName: 'aws-prod-usgov-east1', cloud: 'aws', cspSubtype: 'usgov', region: 'us-gov-east-1', securityClassification: 'cjis' },
  { environmentTier: 'prod', cluster: 'AWS Prod Oregon', clusterName: 'aws-prod-us-west2', cloud: 'aws', cspSubtype: 'commercial', region: 'us-west-2', securityClassification: 'nist-800-53-moderate' },
  { environmentTier: 'prod', cluster: 'AWS Prod Ohio', clusterName: 'aws-prod-us-east2', cloud: 'aws', cspSubtype: 'commercial', region: 'us-east-2', securityClassification: 'nist-800-53-moderate' },
  { environmentTier: 'stage', cluster: 'Fed Stage AZ', clusterName: 'az-stage-fed-us-az', cloud: 'azure', cspSubtype: 'usgov', region: 'usgovarizona', securityClassification: 'fedramp-high' },
  { environmentTier: 'stage', cluster: 'Fed Stage VA', clusterName: 'az-stage-fed-us-va', cloud: 'azure', cspSubtype: 'usgov', region: 'usgovvirginia', securityClassification: 'fedramp-high' },
  { environmentTier: 'prod', cluster: 'Fed Prod AZ', clusterName: 'az-prod-fed-us-az', cloud: 'azure', cspSubtype: 'usgov', region: 'usgovarizona', securityClassification: 'fedramp-high' },
  { environmentTier: 'prod', cluster: 'Fed Prod VA', clusterName: 'az-prod-fed-us-va', cloud: 'azure', cspSubtype: 'usgov', region: 'usgovvirginia', securityClassification: 'fedramp-high' },
  { environmentTier: 'prod', cluster: 'CCCS East', clusterName: 'az-prod-cccs-ca-east', cloud: 'azure', cspSubtype: 'commercial', region: 'canadaeast', securityClassification: 'cccs' },
  { environmentTier: 'prod', cluster: 'CCCS Central', clusterName: 'az-prod-cccs-ca-central', cloud: 'azure', cspSubtype: 'commercial', region: 'canadacentral', securityClassification: 'cccs' }
];

export const AccessRequestForm: React.FC<AccessRequestFormProps> = ({ onSuccess, onCancel }) => {
  const {
    form,
    formStep,
    selectedJobFunction,
    environmentFilter,
    setEnvironmentFilter,
    approvalChain,
    riskScore,
    showProjectField,
    getFilteredResources,
    nextStep,
    prevStep,
    onSubmit,
    watchedResources,
    watchedAccessType,
    isFormValid
  } = useAccessRequestForm(onSuccess, onCancel);
  
  // Additional state for form fields
  const [securityClassification, setSecurityClassification] = useState<string>('');
  const [cloudProvider, setCloudProvider] = useState<string>('');
  const [cloudWorkload, setCloudWorkload] = useState<string>('');
  const [availableClusters, setAvailableClusters] = useState<Cluster[]>([]);
  const [selectedClusters, setSelectedClusters] = useState<string[]>([]);
  
  // Get available cloud providers based on environment and security classification
  const getAvailableCloudProviders = () => {
    if (!environmentFilter || !securityClassification) return [];
    
    const availableProviders = clusterData
      .filter(cluster => 
        cluster.environmentTier === environmentFilter && 
        cluster.securityClassification === securityClassification
      )
      .map(cluster => cluster.cloud)
      .filter((value, index, self) => self.indexOf(value) === index);
    
    return cloudProviders.filter(provider => availableProviders.includes(provider.id));
  };
  
  // Get available cloud provider workloads based on environment, security classification, and provider
  const getAvailableCloudWorkloads = () => {
    if (!environmentFilter || !securityClassification || !cloudProvider) return [];
    
    const availableWorkloads = clusterData
      .filter(cluster => 
        cluster.environmentTier === environmentFilter && 
        cluster.securityClassification === securityClassification &&
        cluster.cloud === cloudProvider
      )
      .map(cluster => cluster.cspSubtype)
      .filter((value, index, self) => self.indexOf(value) === index);
    
    return cloudWorkloads.filter(workload => availableWorkloads.includes(workload.id));
  };
  
  // Update available clusters when filters change
  useEffect(() => {
    if (environmentFilter && securityClassification && cloudProvider && cloudWorkload) {
      const filtered = clusterData.filter(cluster => 
        cluster.environmentTier === environmentFilter && 
        cluster.securityClassification === securityClassification &&
        cluster.cloud === cloudProvider &&
        cluster.cspSubtype === cloudWorkload
      );
      setAvailableClusters(filtered);
    } else {
      setAvailableClusters([]);
    }
  }, [environmentFilter, securityClassification, cloudProvider, cloudWorkload]);
  
  // Reset dependent fields when higher-level selections change
  useEffect(() => {
    if (environmentFilter && securityClassification) {
      // Check if current cloudProvider is still valid
      const availableProviders = getAvailableCloudProviders().map(p => p.id);
      if (cloudProvider && !availableProviders.includes(cloudProvider)) {
        setCloudProvider('');
        setCloudWorkload('');
        setSelectedClusters([]);
      }
    }
  }, [environmentFilter, securityClassification]);
  
  useEffect(() => {
    if (environmentFilter && securityClassification && cloudProvider) {
      // Check if current cloudWorkload is still valid
      const availableWorkloads = getAvailableCloudWorkloads().map(w => w.id);
      if (cloudWorkload && !availableWorkloads.includes(cloudWorkload)) {
        setCloudWorkload('');
        setSelectedClusters([]);
      }
    }
  }, [cloudProvider]);
  
  // Handle cluster selection
  const handleClusterChange = (clusterName: string, checked: boolean) => {
    if (checked) {
      setSelectedClusters(prev => [...prev, clusterName]);
    } else {
      setSelectedClusters(prev => prev.filter(name => name !== clusterName));
    }
  };
  
  // Get personnel prerequisites based on security classification
  const getPersonnelPrerequisites = () => {
    switch (securityClassification) {
      case 'fedramp-high':
        return (
          <div className="mt-2 p-2 border border-orange-200 bg-orange-50 rounded-md">
            <h4 className="font-medium text-orange-800">Personnel Prerequisites</h4>
            <ul className="list-disc pl-5 text-sm text-orange-700">
              <li>US Citizen on US Soil</li>
              <li>Background Check</li>
              <li>Federal Training</li>
              <li>YubiKey Verification</li>
            </ul>
          </div>
        );
      case 'cccs':
        return (
          <div className="mt-2 p-2 border border-blue-200 bg-blue-50 rounded-md">
            <h4 className="font-medium text-blue-800">Personnel Prerequisites</h4>
            <ul className="list-disc pl-5 text-sm text-blue-700">
              <li>Five Eyes Citizen on Five Eyes Soil</li>
              <li>Background Check</li>
              <li>Federal Training</li>
            </ul>
          </div>
        );
      case 'cjis':
        return (
          <div className="mt-2 p-2 border border-purple-200 bg-purple-50 rounded-md">
            <h4 className="font-medium text-purple-800">Personnel Prerequisites</h4>
            <div className="text-sm text-purple-700">
              <p>Must be on US Soil</p>
              <p>CJIS Screening Process</p>
              <a 
                href="https://batchat.motorolasolutions.com/home/ls/community/cjis-personnel" 
                target="_blank"
                rel="noreferrer"
                className="text-purple-600 hover:underline"
              >
                View CJIS Screening Details
              </a>
            </div>
          </div>
        );
      case 'nist-800-53-moderate':
        return (
          <div className="mt-2 p-2 border border-green-200 bg-green-50 rounded-md">
            <h4 className="font-medium text-green-800">Personnel Prerequisites</h4>
            <p className="text-sm text-green-700">
              MSI employee or contractor approved through MSI Corporate
            </p>
          </div>
        );
      default:
        return null;
    }
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
                    onValueChange={field.onChange}
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
            
            {/* Project name field (conditional) */}
            {showProjectField && (
              <FormField
                control={form.control}
                name="projectName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Name</FormLabel>
                    <FormDescription>
                      Enter the name of the project you're working on.
                    </FormDescription>
                    <FormControl>
                      <Input {...field} placeholder="Project name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            {/* Environment Tier and Security Classification - Updated Labels */}
            {selectedJobFunction && (
              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-md">
                {/* Environment Tier (renamed from Environment) */}
                <div>
                  <Label htmlFor="environment-filter">Environment Tier</Label>
                  <Select
                    value={environmentFilter}
                    onValueChange={(value) => {
                      setEnvironmentFilter(value);
                      form.setValue('environmentFilter', value);
                      // Reset dependent fields
                      setSecurityClassification('');
                      setCloudProvider('');
                      setCloudWorkload('');
                      setSelectedClusters([]);
                    }}
                  >
                    <SelectTrigger id="environment-filter">
                      <SelectValue placeholder="Select an environment tier" />
                    </SelectTrigger>
                    <SelectContent>
                      {environmentTypes.map(et => (
                        <SelectItem key={et.id} value={et.id}>{et.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Security Classification (renamed from Compliance Framework) */}
                <div>
                  <Label htmlFor="security-classification">Security Classification</Label>
                  <Select
                    value={securityClassification}
                    onValueChange={(value) => {
                      setSecurityClassification(value);
                      // Reset dependent fields
                      setCloudProvider('');
                      setCloudWorkload('');
                      setSelectedClusters([]);
                    }}
                  >
                    <SelectTrigger id="security-classification">
                      <SelectValue placeholder="Select a security classification" />
                    </SelectTrigger>
                    <SelectContent>
                      {securityClassifications.map(sc => (
                        <SelectItem key={sc.id} value={sc.id}>{sc.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {getPersonnelPrerequisites()}
                </div>
              </div>
            )}
            
            {/* Cloud Provider and Workload - New Fields */}
            {selectedJobFunction && environmentFilter && securityClassification && (
              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-md">
                {/* Cloud Provider */}
                <div>
                  <Label htmlFor="cloud-provider">Cloud Provider</Label>
                  <Select
                    value={cloudProvider}
                    onValueChange={(value) => {
                      setCloudProvider(value);
                      // Reset dependent field
                      setCloudWorkload('');
                      setSelectedClusters([]);
                    }}
                  >
                    <SelectTrigger id="cloud-provider">
                      <SelectValue placeholder="Select cloud provider" />
                    </SelectTrigger>
                    <SelectContent>
                      {getAvailableCloudProviders().map(cp => (
                        <SelectItem key={cp.id} value={cp.id}>{cp.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Cloud Workload */}
                <div>
                  <Label htmlFor="cloud-workload">Cloud Provider Workload</Label>
                  <Select
                    value={cloudWorkload}
                    onValueChange={(value) => {
                      setCloudWorkload(value);
                      setSelectedClusters([]);
                    }}
                  >
                    <SelectTrigger id="cloud-workload">
                      <SelectValue placeholder="Select workload type" />
                    </SelectTrigger>
                    <SelectContent>
                      {getAvailableCloudWorkloads().map(cw => (
                        <SelectItem key={cw.id} value={cw.id}>{cw.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
            
            {/* Available Clusters - Based on selected filters */}
            {availableClusters.length > 0 && (
              <div className="border rounded-md p-4">
                <h3 className="font-medium mb-2">Available Clusters</h3>
                <p className="text-sm text-gray-500 mb-3">
                  Select the clusters you need access to:
                </p>
                <ScrollArea className="h-[200px] pr-4">
                  <div className="space-y-2">
                    {availableClusters.map((cluster) => (
                      <div key={cluster.clusterName} className="flex items-start gap-2">
                        <Checkbox 
                          id={cluster.clusterName}
                          checked={selectedClusters.includes(cluster.clusterName)}
                          onCheckedChange={(checked) => 
                            handleClusterChange(cluster.clusterName, !!checked)
                          }
                        />
                        <div className="grid gap-1">
                          <Label 
                            htmlFor={cluster.clusterName}
                            className="font-medium cursor-pointer"
                          >
                            {cluster.cluster}
                          </Label>
                          <div className="text-xs text-gray-500">
                            {cluster.clusterName} • Region: {cluster.region}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                
                {selectedClusters.length > 0 && (
                  <div className="mt-3 pt-3 border-t">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Selected: {selectedClusters.length}</span>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setSelectedClusters([])}
                      >
                        Clear
                      </Button>
                    </div>
                  </div>
                )}
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
                disabled={!isFormValid}
                className={cn(
                  isFormValid ? "bg-iam-primary hover:bg-iam-primary-light" : "bg-gray-300 cursor-not-allowed"
                )}
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
              "p-2 rounded-md",
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
            
            {/* Temporary Duration Dropdown (only if temporary access is selected) */}
            {watchedAccessType === 'temporary' && (
              <FormField
                control={form.control}
                name="tempDuration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Access Duration</FormLabel>
                    <FormDescription>
                      Select how many days you need temporary access.
                    </FormDescription>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select duration" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="1">1 Day</SelectItem>
                        <SelectItem value="2">2 Days</SelectItem>
                        <SelectItem value="3">3 Days</SelectItem>
                        <SelectItem value="4">4 Days</SelectItem>
                        <SelectItem value="5">5 Days</SelectItem>
                      </SelectContent>
                    </Select>
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
                      className="min-h-[80px]"
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
            
            {/* Selected Clusters Summary */}
            {selectedClusters.length > 0 && (
              <div className="border rounded-md p-4 bg-gray-50">
                <h3 className="font-medium mb-2">Selected Clusters</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedClusters.map(clusterName => {
                    const cluster = clusterData.find(c => c.clusterName === clusterName);
                    return cluster ? (
                      <Badge key={clusterName} variant="secondary">
                        {cluster.cluster}
                      </Badge>
                    ) : null;
                  })}
                </div>
              </div>
            )}
            
            {/* Approval Chain Preview */}
            <ApprovalChainPreview 
              approvalChain={approvalChain} 
              securityClassification={securityClassification} 
            />
            
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
