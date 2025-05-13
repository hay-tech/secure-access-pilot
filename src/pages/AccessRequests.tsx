
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useIAM } from '../contexts/IAMContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { Plus, HelpCircle, AlertCircle, CheckCircle, Info } from 'lucide-react';
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
import { toast } from 'sonner';
import { jobFunctionDefinitions, targetResources, approvers, complianceEnvironments, environmentTypes } from '../data/mockData';

// Define form schema
const accessRequestSchema = z.object({
  jobFunction: z.string().min(1, { message: "Please select a job function" }),
  resources: z.array(z.string()).min(1, { message: "Please select at least one resource" }),
  justification: z.string()
    .min(10, { message: "Please provide a detailed justification (at least 10 characters)" })
    .max(500, { message: "Justification is too long (maximum 500 characters)" }),
  complianceFilter: z.string().optional(),
  environmentFilter: z.string().optional(),
});

type AccessRequestFormValues = z.infer<typeof accessRequestSchema>;

// Extract approval chain based on selected resources and job function
const getApprovalChain = (resources: string[], jobFunction: string) => {
  const selectedResources = targetResources.filter(r => resources.includes(r.id));
  const approvalChain = [
    { ...approvers[0], reason: "Default manager approval" } // Always include manager
  ];
  
  // Check if any resource requires special approval
  const needsResourceOwnerApproval = selectedResources.some(r => r.environment === 'prod');
  const needsSecurityApproval = selectedResources.some(r => r.isPrivileged || r.riskLevel === 'High');
  const needsComplianceApproval = selectedResources.some(r => r.compliance === 'federal' || r.compliance === 'cccs');
  
  if (needsResourceOwnerApproval) {
    approvalChain.push({ ...approvers[1], reason: "Production resource access" });
  }
  
  if (needsSecurityApproval) {
    approvalChain.push({ ...approvers[2], reason: "High-risk or privileged access" });
  }
  
  if (needsComplianceApproval) {
    approvalChain.push({ ...approvers[3], reason: "Regulated environment access" });
  }
  
  return approvalChain;
};

// Calculate risk score based on selected resources
const calculateRiskScore = (resources: string[]) => {
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

// Enhanced Access Requests component
const AccessRequests: React.FC = () => {
  const { currentUser } = useAuth();
  const { accessRequests, roles, createAccessRequest } = useIAM();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formStep, setFormStep] = useState(1);
  const [selectedJobFunction, setSelectedJobFunction] = useState('');
  const [complianceFilter, setComplianceFilter] = useState('');
  const [environmentFilter, setEnvironmentFilter] = useState('');
  const [approvalChain, setApprovalChain] = useState<any[]>([]);
  const [riskScore, setRiskScore] = useState({ score: 0, level: 'Low' });
  
  const form = useForm<AccessRequestFormValues>({
    resolver: zodResolver(accessRequestSchema),
    defaultValues: {
      jobFunction: '',
      resources: [],
      justification: '',
      complianceFilter: '',
      environmentFilter: '',
    },
  });
  
  if (!currentUser) return null;
  
  const myRequests = accessRequests.filter(req => req.userId === currentUser.id);
  
  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    canceled: 'bg-gray-100 text-gray-800',
  };
  
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
    // Collect resource names for the selected resources
    const resourceNames = targetResources
      .filter(resource => data.resources.includes(resource.id))
      .map(resource => resource.name)
      .join(', ');
    
    // Get job function title
    const jobFunction = jobFunctionDefinitions.find(jf => jf.id === data.jobFunction);
    
    try {
      // Create access request with enhanced data
      await createAccessRequest({
        userId: currentUser.id,
        resourceId: data.resources.join(','),
        resourceName: resourceNames,
        requestType: 'role',
        justification: data.justification,
      });
      
      // Reset form and close dialog
      form.reset();
      setFormStep(1);
      setDialogOpen(false);
      toast.success("Access request submitted successfully");
    } catch (error) {
      toast.error("Failed to submit access request");
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
  
  const renderStatusBadge = (status: string) => {
    const color = statusColors[status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800';
    return (
      <Badge variant="outline" className={color}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Access Requests</h1>
          <p className="text-muted-foreground">Request new access or view your requests</p>
        </div>
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-iam-primary hover:bg-iam-primary-light">
              <Plus className="mr-2 h-4 w-4" /> New Request
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[700px]">
            <DialogHeader>
              <DialogTitle>Request Access</DialogTitle>
              <DialogDescription>
                Complete this form to request access to cloud resources and environments.
              </DialogDescription>
            </DialogHeader>
            
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
                            <SelectTrigger>
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
                            <SelectTrigger>
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
                    <FormField
                      control={form.control}
                      name="resources"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center">
                            Select Specific Resources
                            <HelpCircle className="h-4 w-4 ml-1 text-gray-400" />
                          </FormLabel>
                          <FormDescription>
                            Choose the systems and compliance level to which these permissions will apply. Suggested resources are based on your job function.
                          </FormDescription>
                          <div className="grid grid-cols-1 gap-2 mt-2">
                            {getFilteredResources().map(resource => (
                              <div key={resource.id} className="flex items-center border rounded-md p-3 hover:bg-gray-50">
                                <input
                                  type="checkbox"
                                  id={`resource-${resource.id}`}
                                  value={resource.id}
                                  checked={field.value.includes(resource.id)}
                                  onChange={(e) => {
                                    const checked = e.target.checked;
                                    const value = e.target.value;
                                    let newValues = [...field.value];
                                    
                                    if (checked) {
                                      newValues.push(value);
                                    } else {
                                      newValues = newValues.filter(v => v !== value);
                                    }
                                    
                                    field.onChange(newValues);
                                  }}
                                  className="h-4 w-4 mr-3"
                                />
                                <label htmlFor={`resource-${resource.id}`} className="flex-1 cursor-pointer">
                                  <div className="font-medium">{resource.name}</div>
                                  <div className="text-sm text-gray-500">
                                    {environmentTypes.find(e => e.id === resource.environment)?.name} | 
                                    {complianceEnvironments.find(c => c.id === resource.compliance)?.name}
                                  </div>
                                  <div className="mt-1 flex items-center gap-2">
                                    {renderRiskBadge(resource.riskLevel)}
                                    {resource.isSensitive && (
                                      <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">
                                        Sensitive
                                      </Badge>
                                    )}
                                    {resource.isPrivileged && (
                                      <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-300">
                                        Privileged
                                      </Badge>
                                    )}
                                  </div>
                                </label>
                              </div>
                            ))}
                          </div>
                          {getFilteredResources().length === 0 && selectedJobFunction && (
                            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md text-yellow-700 flex items-center">
                              <Info className="h-5 w-5 mr-2" />
                              <span>No resources match your current filters. Try changing the compliance framework or environment filter.</span>
                            </div>
                          )}
                          <FormMessage />
                        </FormItem>
                      )}
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
                
                {/* Step 2: Justification and approval preview */}
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
                    <div>
                      <h3 className="text-sm font-medium mb-2 flex items-center">
                        Approval Chain Preview
                        <HelpCircle className="h-4 w-4 ml-1 text-gray-400" />
                      </h3>
                      <p className="text-sm text-gray-500 mb-3">
                        Based on your selected actions and resource sensitivity, this is the approval chain your request will follow.
                      </p>
                      <div className="bg-gray-50 p-4 rounded-md">
                        {approvalChain.length > 0 ? (
                          <ol className="relative border-l border-gray-300">
                            {approvalChain.map((approver, index) => (
                              <li key={approver.id} className="mb-6 ml-6 last:mb-0">
                                <div className="absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full bg-iam-primary text-white">
                                  {index + 1}
                                </div>
                                <div className="flex flex-col">
                                  <h4 className="flex items-center font-medium">{approver.name}</h4>
                                  <p className="text-sm text-gray-500">{approver.title}</p>
                                  <p className="text-xs text-gray-500 italic">{approver.reason}</p>
                                </div>
                              </li>
                            ))}
                          </ol>
                        ) : (
                          <p className="text-center text-gray-500 py-2">No approvals needed</p>
                        )}
                      </div>
                    </div>
                    
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
          </DialogContent>
        </Dialog>
      </div>
      
      <Tabs defaultValue="my-requests">
        <TabsList>
          <TabsTrigger value="my-requests">My Requests</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>
        
        <TabsContent value="my-requests">
          <Card>
            <CardHeader>
              <CardTitle>All My Requests</CardTitle>
              <CardDescription>View all your access requests</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Resource</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Requested</TableHead>
                    <TableHead>Manager Approval</TableHead>
                    <TableHead>Security Approval</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {myRequests.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                        No requests found
                      </TableCell>
                    </TableRow>
                  ) : (
                    myRequests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell className="font-medium">{request.resourceName}</TableCell>
                        <TableCell>
                          {request.requestType.charAt(0).toUpperCase() + request.requestType.slice(1)}
                        </TableCell>
                        <TableCell>{renderStatusBadge(request.status)}</TableCell>
                        <TableCell>
                          {formatDistanceToNow(new Date(request.createdAt), { addSuffix: true })}
                        </TableCell>
                        <TableCell>
                          {request.managerApproval ? (
                            <Badge variant="outline" className={statusColors[request.managerApproval.status as keyof typeof statusColors]}>
                              {request.managerApproval.status.charAt(0).toUpperCase() + request.managerApproval.status.slice(1)}
                            </Badge>
                          ) : (
                            <Badge variant="outline">N/A</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {request.securityApproval ? (
                            <Badge variant="outline" className={statusColors[request.securityApproval.status as keyof typeof statusColors]}>
                              {request.securityApproval.status.charAt(0).toUpperCase() + request.securityApproval.status.slice(1)}
                            </Badge>
                          ) : (
                            <Badge variant="outline">N/A</Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="approved">
          <Card>
            <CardHeader>
              <CardTitle>Approved Requests</CardTitle>
              <CardDescription>Access requests that have been approved</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Resource</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Requested</TableHead>
                    <TableHead>Approved Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {myRequests.filter(r => r.status === 'approved').length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                        No approved requests found
                      </TableCell>
                    </TableRow>
                  ) : (
                    myRequests
                      .filter(r => r.status === 'approved')
                      .map((request) => (
                        <TableRow key={request.id}>
                          <TableCell className="font-medium">{request.resourceName}</TableCell>
                          <TableCell>
                            {request.requestType.charAt(0).toUpperCase() + request.requestType.slice(1)}
                          </TableCell>
                          <TableCell>
                            {formatDistanceToNow(new Date(request.createdAt), { addSuffix: true })}
                          </TableCell>
                          <TableCell>
                            {request.updatedAt ? 
                              formatDistanceToNow(new Date(request.updatedAt), { addSuffix: true }) : 
                              'N/A'}
                          </TableCell>
                        </TableRow>
                      ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="pending">
          <Card>
            <CardHeader>
              <CardTitle>Pending Requests</CardTitle>
              <CardDescription>Access requests awaiting approval</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Resource</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Requested</TableHead>
                    <TableHead>Manager Approval</TableHead>
                    <TableHead>Security Approval</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {myRequests.filter(r => r.status === 'pending').length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                        No pending requests found
                      </TableCell>
                    </TableRow>
                  ) : (
                    myRequests
                      .filter(r => r.status === 'pending')
                      .map((request) => (
                        <TableRow key={request.id}>
                          <TableCell className="font-medium">{request.resourceName}</TableCell>
                          <TableCell>
                            {request.requestType.charAt(0).toUpperCase() + request.requestType.slice(1)}
                          </TableCell>
                          <TableCell>
                            {formatDistanceToNow(new Date(request.createdAt), { addSuffix: true })}
                          </TableCell>
                          <TableCell>
                            {request.managerApproval ? (
                              <Badge variant="outline" className={statusColors[request.managerApproval.status as keyof typeof statusColors]}>
                                {request.managerApproval.status.charAt(0).toUpperCase() + request.managerApproval.status.slice(1)}
                              </Badge>
                            ) : (
                              <Badge variant="outline">N/A</Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            {request.securityApproval ? (
                              <Badge variant="outline" className={statusColors[request.securityApproval.status as keyof typeof statusColors]}>
                                {request.securityApproval.status.charAt(0).toUpperCase() + request.securityApproval.status.slice(1)}
                              </Badge>
                            ) : (
                              <Badge variant="outline">N/A</Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="rejected">
          <Card>
            <CardHeader>
              <CardTitle>Rejected Requests</CardTitle>
              <CardDescription>Access requests that have been rejected</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Resource</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Requested</TableHead>
                    <TableHead>Rejected By</TableHead>
                    <TableHead>Rejection Reason</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {myRequests.filter(r => r.status === 'rejected').length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                        No rejected requests found
                      </TableCell>
                    </TableRow>
                  ) : (
                    myRequests
                      .filter(r => r.status === 'rejected')
                      .map((request) => (
                        <TableRow key={request.id}>
                          <TableCell className="font-medium">{request.resourceName}</TableCell>
                          <TableCell>
                            {request.requestType.charAt(0).toUpperCase() + request.requestType.slice(1)}
                          </TableCell>
                          <TableCell>
                            {formatDistanceToNow(new Date(request.createdAt), { addSuffix: true })}
                          </TableCell>
                          <TableCell>
                            {request.managerApproval?.status === 'rejected' ? 'Manager' : 
                             request.securityApproval?.status === 'rejected' ? 'Security' : 'Unknown'}
                          </TableCell>
                          <TableCell>
                            {request.managerApproval?.status === 'rejected' ? request.managerApproval.comments : 
                             request.securityApproval?.status === 'rejected' ? request.securityApproval.comments : 'N/A'}
                          </TableCell>
                        </TableRow>
                      ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AccessRequests;
