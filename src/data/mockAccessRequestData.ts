
import { ComplianceEnvironment, EnvironmentType, TargetResource, JobFunctionDefinition, Approver } from '../types/iam';

// Additional data for enhanced Access Request form
export const complianceEnvironments: ComplianceEnvironment[] = [
  { id: 'federal', name: 'Federal', description: 'US Federal Government compliance standards', sovereignOps: true },
  { id: 'cccs', name: 'CCCS', description: 'Canadian Centre for Cyber Security compliance standards', sovereignOps: true },
  { id: 'cccs-aws', name: 'CCCS-AWS', description: 'CCCS AWS specific standards', sovereignOps: true },
  { id: 'cjis', name: 'CJIS', description: 'Criminal Justice Information Services', sovereignOps: false },
  { id: 'us-commercial', name: 'US (Commercial)', description: 'US Commercial compliance standards', sovereignOps: false },
  { id: 'uk-commercial', name: 'UK (Commercial)', description: 'UK Commercial compliance standards', sovereignOps: false },
  { id: 'au-commercial', name: 'AU (Commercial)', description: 'Australian Commercial compliance standards', sovereignOps: false }
];

export const environmentTypes: EnvironmentType[] = [
  { id: 'dev', name: 'Development', riskLevel: 'Low' },
  { id: 'stage', name: 'Staging', riskLevel: 'Medium' },
  { id: 'prod', name: 'Production', riskLevel: 'High' }
];

export const resourceHierarchyLevels = [
  { id: 'organization', name: 'Organization', approverRole: 'Cloud Account Owner' },
  { id: 'tenant', name: 'Tenant', approverRole: 'Cloud Platform Tenant Administrator' },
  { id: 'environment', name: 'Environment/Region', approverRole: 'Cloud Platform Administrator' },
  { id: 'project', name: 'Project/RG', approverRole: 'Cloud Project Administrator' },
  { id: 'resource', name: 'Resources/Services', approverRole: 'Cloud Platform Contributor' }
];

export const targetResources: TargetResource[] = [
  { 
    id: 'aws-cccs-platform-admin',
    name: 'AWS CCCS Platform Administrator', 
    environment: 'prod',
    compliance: 'cccs',
    resourceHierarchy: 'organization',
    riskLevel: 'High',
    recommendedFor: ['Cloud Account Owner', 'Cloud IAM Administrator']
  },
  { 
    id: 'aws-cccs-platform-reader',
    name: 'AWS CCCS Platform Reader', 
    environment: 'prod',
    compliance: 'cccs',
    resourceHierarchy: 'tenant',
    riskLevel: 'Medium',
    recommendedFor: ['Cloud IAM Reader', 'Cloud Platform Reader']
  },
  { 
    id: 'aws-cccs-customer-data',
    name: 'AWS CCCS Customer Data', 
    environment: 'prod',
    compliance: 'cccs',
    resourceHierarchy: 'project',
    riskLevel: 'High',
    recommendedFor: ['Cloud Platform Administrator', 'Cloud Project Administrator']
  },
  { 
    id: 'gcp-cjis-platform-reader',
    name: 'GCP CJIS Platform Reader', 
    environment: 'prod',
    compliance: 'cjis',
    resourceHierarchy: 'tenant',
    riskLevel: 'High',
    isSensitive: true,
    recommendedFor: ['Cloud Platform Security Reader', 'Cloud IAM Reader']
  },
  { 
    id: 'azure-federal-security-admin',
    name: 'Azure Federal Security Admin', 
    environment: 'stage',
    compliance: 'federal',
    resourceHierarchy: 'organization',
    riskLevel: 'High',
    isPrivileged: true,
    recommendedFor: ['Cloud Platform Security Administrator', 'Cloud IAM Administrator']
  },
  { 
    id: 'aws-us-commercial-dev',
    name: 'AWS US Commercial Dev Environment', 
    environment: 'dev',
    compliance: 'us-commercial',
    resourceHierarchy: 'environment',
    riskLevel: 'Low',
    recommendedFor: ['Cloud Platform Contributor', 'Cloud Project Contributor']
  },
  { 
    id: 'aws-us-commercial-test',
    name: 'AWS US Commercial Test Environment', 
    environment: 'test',
    compliance: 'us-commercial',
    resourceHierarchy: 'project',
    riskLevel: 'Low',
    recommendedFor: ['Cloud Platform Contributor', 'Cloud Project Reader']
  },
  {
    id: 'gcp-cjis-organization',
    name: 'GCP CJIS Organization',
    environment: 'prod',
    compliance: 'cjis',
    resourceHierarchy: 'organization',
    riskLevel: 'High',
    isPrivileged: true,
    recommendedFor: ['Cloud Account Owner']
  },
  {
    id: 'gcp-cjis-tenant',
    name: 'GCP CJIS Tenant',
    environment: 'prod',
    compliance: 'cjis',
    resourceHierarchy: 'tenant',
    riskLevel: 'High',
    isSensitive: true,
    recommendedFor: ['Cloud Platform Tenant Administrator']
  },
  {
    id: 'azure-commercial-project',
    name: 'Azure Commercial Project',
    environment: 'prod',
    compliance: 'us-commercial',
    resourceHierarchy: 'project',
    riskLevel: 'Medium',
    recommendedFor: ['Cloud Project Administrator', 'Cloud Project Contributor']
  }
];
