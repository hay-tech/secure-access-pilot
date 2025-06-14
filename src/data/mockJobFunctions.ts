import { JobFunctionDefinition } from '../types/iam';

export const jobFunctionDefinitions: JobFunctionDefinition[] = [
  {
    id: 'cloud-account-owner',
    title: 'Cloud Account Owner',
    description: 'Full account ownership and management capabilities',
    defaultPermissions: ['perm1', 'perm3', 'perm5', 'perm6', 'perm10'],
    recommendedResources: ['aws-cccs-platform-admin', 'gcp-cjis-organization'],
    actions: []
  },
  {
    id: 'cloud-iam-admin',
    title: 'Cloud IAM Administrator',
    description: 'Identity and Access Management administration',
    defaultPermissions: ['perm1', 'perm2', 'perm3', 'perm5', 'perm6'],
    recommendedResources: ['aws-cccs-platform-admin', 'azure-federal-security-admin'],
    actions: []
  },
  {
    id: 'cloud-iam-reader',
    title: 'Cloud IAM Reader',
    description: 'Read-only access to IAM configurations',
    defaultPermissions: ['perm1', 'perm5'],
    recommendedResources: ['aws-cccs-platform-reader', 'gcp-cjis-platform-reader'],
    actions: []
  },
  {
    id: 'cloud-platform-tenant-admin',
    title: 'Cloud Platform Tenant Administrator',
    description: 'Administration of tenant-level resources',
    defaultPermissions: ['perm1', 'perm3', 'perm5', 'perm6', 'perm10'],
    recommendedResources: ['aws-cccs-platform-admin', 'gcp-cjis-tenant'],
    actions: []
  },
  {
    id: 'cloud-platform-admin',
    title: 'Cloud Platform Administrator',
    description: 'Administration of platform-level resources',
    defaultPermissions: ['perm1', 'perm3', 'perm5', 'perm6', 'perm10'],
    recommendedResources: ['aws-cccs-platform-admin', 'aws-cccs-customer-data'],
    actions: []
  },
  {
    id: 'cloud-platform-contributor',
    title: 'Cloud Platform Contributor',
    description: 'Contributor access to platform resources',
    defaultPermissions: ['perm1', 'perm3', 'perm5', 'perm10'],
    recommendedResources: ['aws-us-commercial-dev', 'aws-us-commercial-test'],
    actions: []
  },
  {
    id: 'cloud-platform-reader',
    title: 'Cloud Platform Reader',
    description: 'Read-only access to platform resources',
    defaultPermissions: ['perm1', 'perm5', 'perm10'],
    recommendedResources: ['aws-cccs-platform-reader'],
    actions: []
  },
  {
    id: 'cloud-project-admin',
    title: 'Cloud Project Administrator',
    description: 'Administration of project-level resources',
    defaultPermissions: ['perm1', 'perm3', 'perm5', 'perm6', 'perm10'],
    recommendedResources: ['aws-cccs-customer-data', 'azure-commercial-project'],
    actions: []
  },
  {
    id: 'cloud-project-contributor',
    title: 'Cloud Project Contributor',
    description: 'Contributor access to project resources',
    defaultPermissions: ['perm1', 'perm3', 'perm5', 'perm10'],
    recommendedResources: ['aws-us-commercial-dev', 'azure-commercial-project'],
    actions: []
  },
  {
    id: 'cloud-project-reader',
    title: 'Cloud Project Reader',
    description: 'Read-only access to project resources',
    defaultPermissions: ['perm1', 'perm5', 'perm10'],
    recommendedResources: ['aws-us-commercial-test'],
    actions: []
  },
  {
    id: 'cloud-platform-security-admin',
    title: 'Cloud Platform Security Administrator',
    description: 'Security administration for cloud platforms',
    defaultPermissions: ['perm1', 'perm3', 'perm5', 'perm6', 'perm7', 'perm10'],
    recommendedResources: ['azure-federal-security-admin'],
    actions: []
  },
  {
    id: 'cloud-platform-security-contributor',
    title: 'Cloud Platform Security Contributor',
    description: 'Security contributor for cloud platforms',
    defaultPermissions: ['perm1', 'perm3', 'perm5', 'perm7', 'perm10'],
    recommendedResources: ['azure-federal-security-admin'],
    actions: []
  },
  {
    id: 'cloud-platform-security-reader',
    title: 'Cloud Platform Security Reader',
    description: 'Security monitoring for cloud platforms',
    defaultPermissions: ['perm1', 'perm5', 'perm10'],
    recommendedResources: ['gcp-cjis-platform-reader'],
    actions: []
  },
  {
    id: 'cloud-platform-finops-admin',
    title: 'Cloud Platform FinOps Administrator',
    description: 'Financial operations for cloud platforms',
    defaultPermissions: ['perm1', 'perm5', 'perm8', 'perm10'],
    recommendedResources: ['aws-us-commercial-dev'],
    actions: []
  },
  {
    id: 'cloud-platform-sre',
    title: 'Cloud Platform Site Reliability Engineer',
    description: 'Site reliability engineering for cloud platforms',
    defaultPermissions: ['perm1', 'perm3', 'perm5', 'perm10'],
    recommendedResources: ['aws-us-commercial-dev', 'aws-us-commercial-test'],
    actions: []
  }
];
