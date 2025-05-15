
import React from 'react';
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
import { HelpCircle, AlertCircle, CheckCircle } from 'lucide-react';
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
import { complianceEnvironments, environmentTypes, jobFunctionDefinitions } from '../../data/mockData';
import { ApprovalChainPreview } from './ApprovalChainPreview';
import { ResourceSelectionList } from './ResourceSelectionList';
import { useAccessRequestForm, AccessRequestFormValues } from '../../hooks/useAccessRequestForm';

// Export the type for use in other components
export type { AccessRequestFormValues } from '../../hooks/useAccessRequestForm';

interface AccessRequestFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export const AccessRequestForm: React.FC<AccessRequestFormProps> = ({ onSuccess, onCancel }) => {
  const {
    form,
    formStep,
    selectedJobFunction,
    complianceFilter,
    setComplianceFilter,
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
    watchedAccessType
  } = useAccessRequestForm(onSuccess, onCancel);

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
            
            {/* Resource filters - Swapped order of Environment and Compliance */}
            {selectedJobFunction && (
              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-md">
                <div>
                  <Label htmlFor="environment-filter">Environment</Label>
                  <Select
                    value={environmentFilter}
                    onValueChange={(value) => {
                      setEnvironmentFilter(value);
                      form.setValue('environmentFilter', value);
                    }}
                  >
                    <SelectTrigger id="environment-filter">
                      <SelectValue placeholder="Select an environment" />
                    </SelectTrigger>
                    <SelectContent>
                      {environmentTypes.map(et => (
                        <SelectItem key={et.id} value={et.id}>{et.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="compliance-filter">Compliance Framework</Label>
                  <Select
                    value={complianceFilter}
                    onValueChange={setComplianceFilter}
                    disabled={environmentFilter === 'dev'}
                  >
                    <SelectTrigger id="compliance-filter">
                      <SelectValue placeholder="Select a framework" />
                    </SelectTrigger>
                    <SelectContent>
                      {complianceEnvironments.map(ce => (
                        <SelectItem key={ce.id} value={ce.id}>{ce.name}</SelectItem>
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
