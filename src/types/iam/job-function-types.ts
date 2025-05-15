
// Updated Job Function to include the Cloud specific roles
export type JobFunction = 
  // CPE Platform Engineering Roles
  | 'Cloud Account Owner'
  | 'Cloud IAM Administrator'
  | 'Cloud IAM Reader'
  | 'Cloud Platform Tenant Administrator'
  | 'Cloud Platform Administrator'
  | 'Cloud Platform Contributor'
  | 'Cloud Platform Reader'
  | 'Cloud Project Administrator'
  | 'Cloud Project Contributor'
  | 'Cloud Project Reader'
  | 'Cloud Platform Security Administrator'
  | 'Cloud Platform Security Contributor'
  | 'Cloud Platform Security Reader'
  | 'Cloud Platform FinOps Administrator'
  | 'Cloud Platform Site Reliability Engineer'
  // Additional roles
  | 'Security Analyst'
  | 'System Administrator';

// New interface for detailed job function definition
export interface JobFunctionDefinition {
  id: string;
  title: string;
  description: string;
  actions: string[];
  environmentRestrictions?: string[];
  defaultPermissions?: string[];
  recommendedResources?: string[];
}

export interface JobFunctionPermissionMapping {
  jobFunction: JobFunction;
  permissions: string[];
  resources: string[];
  environmentRestrictions?: string[];
}
