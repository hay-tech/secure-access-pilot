
import { AccessRequestFormValues } from '../schemas/accessRequestSchema';
import { jobFunctionDefinitions, targetResources } from '../data/mockData';
import { getApprovalChain } from './accessRequestUtils';

export const prepareRequestData = (
  data: AccessRequestFormValues,
  currentUserId: string,
  selectedClusters: string[]
) => {
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
  
  // Use the selected clusters from the form for the resource name
  const clusterNames = selectedClusters.length > 0 ? selectedClusters.join(', ') : "Default Cluster";
  
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
  
  return {
    userId: currentUserId,
    resourceId: data.resources.join(','),
    resourceName: clusterNames, // Contains the selected cluster names
    requestType: data.accessType === 'temporary' ? 'temporary' : 'permanent', // Use access type as request type
    justification: data.justification,
    accessType: data.accessType,
    expiresAt: expiresAt,
    complianceFramework: data.securityClassification || primaryResource?.compliance,
    resourceHierarchy: primaryResource?.resourceHierarchy as "Organization" | "Tenant" | "Environment/Region" | "Project/RG" | "Resources/Services" || "Resources/Services",
    projectName: data.projectName,
    approvalChain: generatedApprovalChain.map(approver => ({
      id: `approver-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      approverId: approver?.id || "",
      approverName: approver?.name || "",
      approverTitle: approver?.title || "",
      approverType: (approver?.type || "manager") as 'manager' | 'resource-owner' | 'security' | 'compliance',
      status: 'pending' as const,
      reason: approver?.reason,
      name: approver?.name,
      title: approver?.title,
      type: approver?.type
    })),
    cloudEnvironment: data.cloudProvider,
    environmentType: data.environmentFilter,
    cloudWorkload: data.cloudWorkload,
    jobFunction: jobFunctionTitle,
    // Store selected clusters for use in approvals
    selectedClusters: selectedClusters,
  };
};
