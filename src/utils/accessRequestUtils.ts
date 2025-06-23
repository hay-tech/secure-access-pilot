
import { approvers, approvalMatrix, targetResources, complianceEnvironments } from '../data/mockData';

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
  
  // For CJIS, NIST, and Commercial, use the approval matrix based on resource hierarchy
  let approvalTypes: string[] = [];
  const resourceHierarchy = selectedResource.resourceHierarchy || "resource";
  let complianceType = 'default';
  
  // Determine compliance type
  if (selectedResource.compliance === 'cjis') {
    complianceType = 'cjis';
  } else if (selectedResource.compliance === 'nist-800-53-moderate') {
    complianceType = 'nist-800-53-moderate';
  } else if (selectedResource.compliance === 'commercial') {
    complianceType = 'commercial';
  }
  
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
        reason = "Compliance review required for CJIS environment";
        break;
      case 'legal':
        reason = "Legal review required for CJIS environment access";
        break;
      case 'hr':
        reason = "HR approval required for CJIS environment access";
        break;
      case 'cjis-screening':
        reason = "CJIS screening and compliance approval required";
        break;
      case 'nist-resource-owner':
        reason = "NIST resource owner approval required";
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
        reason = "Resource owner approval required for CJIS environment";
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
