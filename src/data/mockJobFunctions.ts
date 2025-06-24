
import { JobFunctionDefinition } from '../types/iam';

export const jobFunctionDefinitions: JobFunctionDefinition[] = [
  {
    id: 'cloud-account-owner',
    title: 'Cloud Account Owner',
    description: 'Full account ownership and management capabilities',
    defaultPermissions: [
      'Organization Administrator',
      'Billing Account Administrator'
    ],
    recommendedResources: ['aws-cccs-platform-admin', 'gcp-cjis-organization'],
    actions: []
  },
  {
    id: 'cloud-iam-admin',
    title: 'Cloud IAM Administrator',
    description: 'Identity and Access Management administration',
    defaultPermissions: [
      'Organization Administrator',
      'Security IAM Admin',
      'IAM Recommender Admin',
      'Security Admin',
      'IAM Recommender Viewer',
      'Security Reviewer',
      'Folder Admin'
    ],
    recommendedResources: ['aws-cccs-platform-admin', 'azure-federal-security-admin'],
    actions: []
  },
  {
    id: 'cloud-iam-reader',
    title: 'Cloud IAM Reader',
    description: 'Read-only access to IAM configurations',
    defaultPermissions: [
      'Security Reviewer'
    ],
    recommendedResources: ['aws-cccs-platform-reader', 'gcp-cjis-platform-reader'],
    actions: []
  },
  {
    id: 'cloud-platform-tenant-admin',
    title: 'Cloud Platform Tenant Administrator',
    description: 'Administration of tenant-level resources',
    defaultPermissions: [
      'Organization Administrator',
      'Folder Admin'
    ],
    recommendedResources: ['aws-cccs-platform-admin', 'gcp-cjis-tenant'],
    actions: []
  },
  {
    id: 'cloud-platform-admin',
    title: 'Cloud Platform Administrator',
    description: 'Administration of platform-level resources',
    defaultPermissions: [
      'Editor',
      'Cloud Debugger Agent',
      'Cloud Functions Editor',
      'Cloud Scheduler Admin',
      'Compute Network Admin',
      'DNS Administrator',
      'GKE Cluster Admin',
      'Logs Configuration Writer'
    ],
    recommendedResources: ['aws-cccs-platform-admin', 'aws-cccs-customer-data'],
    actions: []
  },
  {
    id: 'cloud-platform-contributor',
    title: 'Cloud Platform Contributor',
    description: 'Contributor access to platform resources',
    defaultPermissions: [
      'Cloud Debugger Agent',
      'Cloud Functions Editor',
      'Cloud Scheduler Editor',
      'Compute Network Admin',
      'DNS Administrator',
      'GKE Cluster Admin (H1)',
      'Logs Configuration Writer'
    ],
    recommendedResources: ['aws-us-commercial-dev', 'aws-us-commercial-test'],
    actions: []
  },
  {
    id: 'cloud-platform-reader',
    title: 'Cloud Platform Reader',
    description: 'Read-only access to platform resources',
    defaultPermissions: [
      'Logs Viewer',
      'Monitoring Viewer',
      'Security Center Admin Viewer',
      'Security Reviewer'
    ],
    recommendedResources: ['aws-cccs-platform-reader'],
    actions: []
  },
  {
    id: 'cloud-project-admin',
    title: 'Cloud Project Administrator',
    description: 'Administration of project-level resources',
    defaultPermissions: [
      'GCP Owner (project-specific)',
      'Project Logs Viewer',
      'Project Viewer'
    ],
    recommendedResources: ['aws-cccs-customer-data', 'azure-commercial-project'],
    actions: []
  },
  {
    id: 'cloud-project-contributor',
    title: 'Cloud Project Contributor',
    description: 'Contributor access to project resources',
    defaultPermissions: [
      'GCP Editor (project-specific)'
    ],
    recommendedResources: ['aws-us-commercial-dev', 'azure-commercial-project'],
    actions: []
  },
  {
    id: 'cloud-project-reader',
    title: 'Cloud Project Reader',
    description: 'Read-only access to project resources',
    defaultPermissions: [
      'Project Logs Viewer',
      'Project Viewer'
    ],
    recommendedResources: ['aws-us-commercial-test'],
    actions: []
  },
  {
    id: 'cloud-platform-security-admin',
    title: 'Cloud Platform Security Administrator',
    description: 'Security administration for cloud platforms',
    defaultPermissions: [
      'Security Admin',
      'Security Contributors',
      'Organization Administrator',
      'Security Center Admin',
      'Logs Configuration Writer',
      'Security Center Project Editor',
      'Security Center Asset Discovery Runner',
      'Security Reviewer',
      'Cloud Asset Viewer',
      'Private Logs Viewer',
      'Security Reviewer'
    ],
    recommendedResources: ['azure-federal-security-admin'],
    actions: []
  },
  {
    id: 'cloud-platform-security-contributor',
    title: 'Cloud Platform Security Contributor',
    description: 'Security contributor for cloud platforms',
    defaultPermissions: [
      'Security Contributors',
      'Organization Administrator',
      'Security Center Admin',
      'Logs Configuration Writer',
      'Security Center Project Editor',
      'Security Reviewer'
    ],
    recommendedResources: ['azure-federal-security-admin'],
    actions: []
  },
  {
    id: 'cloud-platform-security-reader',
    title: 'Cloud Platform Security Reader',
    description: 'Security monitoring for cloud platforms',
    defaultPermissions: [
      'Cloud Asset Viewer',
      'Security Center Admin Viewer',
      'Private Logs Viewer',
      'Security Reviewer'
    ],
    recommendedResources: ['gcp-cjis-platform-reader'],
    actions: []
  },
  {
    id: 'cloud-platform-finops-admin',
    title: 'Cloud Platform FinOps Administrator',
    description: 'Financial operations for cloud platforms',
    defaultPermissions: [
      'Billing Account Administrator',
      'BigQuery Data Viewer',
      'BigQuery Job User',
      'BigQuery User',
      'Logs Configuration Writer'
    ],
    recommendedResources: ['aws-us-commercial-dev'],
    actions: []
  },
  {
    id: 'cloud-platform-sre',
    title: 'Cloud Platform Site Reliability Engineer',
    description: 'Site reliability engineering for cloud platforms',
    defaultPermissions: [
      'Logs Viewer',
      'Monitoring Editor',
      'Security Center Admin Viewer',
      'Security Reviewer',
      'Viewer'
    ],
    recommendedResources: ['aws-us-commercial-dev', 'aws-us-commercial-test'],
    actions: []
  }
];
