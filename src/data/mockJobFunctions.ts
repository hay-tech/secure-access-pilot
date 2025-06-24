
import { JobFunctionDefinition } from '../types/iam';

export const jobFunctionDefinitions: JobFunctionDefinition[] = [
  {
    id: 'cloud-account-owner',
    title: 'Cloud Account Owner',
    description: 'Full account ownership and management capabilities',
    permissions: [
      'Organization Administrator',
      'Billing Account Administrator'
    ],
    recommendedResources: ['aws-cccs-platform-admin', 'gcp-cjis-organization'],
    actions: [
      'Manage organization-level policies and settings',
      'Control billing and cost management',
      'Oversee compliance and governance'
    ]
  },
  {
    id: 'cloud-iam-admin',
    title: 'Cloud IAM Administrator',
    description: 'Identity and Access Management administration',
    permissions: [
      'Organization Administrator',
      'Security IAM Admin',
      'IAM Recommender Admin',
      'Security Admin',
      'IAM Recommender Viewer',
      'Security Reviewer',
      'Folder Admin'
    ],
    recommendedResources: ['aws-cccs-platform-admin', 'azure-federal-security-admin'],
    actions: [
      'Manage user identities and access rights',
      'Configure security policies and controls',
      'Monitor and audit access patterns'
    ]
  },
  {
    id: 'cloud-iam-reader',
    title: 'Cloud IAM Reader',
    description: 'Read-only access to IAM configurations',
    permissions: [
      'Security Reviewer'
    ],
    recommendedResources: ['aws-cccs-platform-reader', 'gcp-cjis-platform-reader'],
    actions: [
      'Review IAM policies and configurations',
      'Monitor access compliance',
      'Generate security reports'
    ]
  },
  {
    id: 'cloud-platform-tenant-admin',
    title: 'Cloud Platform Tenant Administrator',
    description: 'Administration of tenant-level resources',
    permissions: [
      'Organization Administrator',
      'Folder Admin'
    ],
    recommendedResources: ['aws-cccs-platform-admin', 'gcp-cjis-tenant'],
    actions: [
      'Manage tenant-level resources and policies',
      'Configure multi-tenant environments',
      'Oversee tenant compliance'
    ]
  },
  {
    id: 'cloud-platform-admin',
    title: 'Cloud Platform Administrator',
    description: 'Administration of platform-level resources',
    permissions: [
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
    actions: [
      'Manage cloud infrastructure and services',
      'Configure networking and compute resources',
      'Administer platform-wide configurations'
    ]
  },
  {
    id: 'cloud-platform-contributor',
    title: 'Cloud Platform Contributor',
    description: 'Contributor access to platform resources',
    permissions: [
      'Cloud Debugger Agent',
      'Cloud Functions Editor',
      'Cloud Scheduler Editor',
      'Compute Network Admin',
      'DNS Administrator',
      'GKE Cluster Admin (H1)',
      'Logs Configuration Writer'
    ],
    recommendedResources: ['aws-us-commercial-dev', 'aws-us-commercial-test'],
    actions: [
      'Contribute to platform development',
      'Deploy and manage applications',
      'Configure development environments'
    ]
  },
  {
    id: 'cloud-platform-reader',
    title: 'Cloud Platform Reader',
    description: 'Read-only access to platform resources',
    permissions: [
      'Logs Viewer',
      'Monitoring Viewer',
      'Security Center Admin Viewer',
      'Security Reviewer'
    ],
    recommendedResources: ['aws-cccs-platform-reader'],
    actions: [
      'Monitor platform health and performance',
      'View logs and metrics',
      'Generate platform reports'
    ]
  },
  {
    id: 'cloud-project-admin',
    title: 'Cloud Project Administrator',
    description: 'Administration of project-level resources',
    permissions: [
      'GCP Owner (project-specific)',
      'Project Logs Viewer',
      'Project Viewer'
    ],
    recommendedResources: ['aws-cccs-customer-data', 'azure-commercial-project'],
    actions: [
      'Manage project resources and configurations',
      'Control project access and permissions',
      'Oversee project lifecycle'
    ]
  },
  {
    id: 'cloud-project-contributor',
    title: 'Cloud Project Contributor',
    description: 'Contributor access to project resources',
    permissions: [
      'GCP Editor (project-specific)'
    ],
    recommendedResources: ['aws-us-commercial-dev', 'azure-commercial-project'],
    actions: [
      'Develop and deploy project applications',
      'Contribute to project development',
      'Manage project artifacts'
    ]
  },
  {
    id: 'cloud-project-reader',
    title: 'Cloud Project Reader',
    description: 'Read-only access to project resources',
    permissions: [
      'Project Logs Viewer',
      'Project Viewer'
    ],
    recommendedResources: ['aws-us-commercial-test'],
    actions: [
      'View project resources and configurations',
      'Monitor project status',
      'Access project documentation'
    ]
  },
  {
    id: 'cloud-platform-security-admin',
    title: 'Cloud Platform Security Administrator',
    description: 'Security administration for cloud platforms',
    permissions: [
      'Security Admin',
      'Security Contributors',
      'Organization Administrator',
      'Security Center Admin',
      'Logs Configuration Writer',
      'Security Center Project Editor',
      'Security Center Asset Discovery Runner',
      'Security Reviewer',
      'Cloud Asset Viewer',
      'Private Logs Viewer'
    ],
    recommendedResources: ['azure-federal-security-admin'],
    actions: [
      'Implement security policies and controls',
      'Monitor security threats and vulnerabilities',
      'Manage security compliance'
    ]
  },
  {
    id: 'cloud-platform-security-contributor',
    title: 'Cloud Platform Security Contributor',
    description: 'Security contributor for cloud platforms',
    permissions: [
      'Security Contributors',
      'Organization Administrator',
      'Security Center Admin',
      'Logs Configuration Writer',
      'Security Center Project Editor',
      'Security Reviewer'
    ],
    recommendedResources: ['azure-federal-security-admin'],
    actions: [
      'Contribute to security implementations',
      'Assist with security monitoring',
      'Support security compliance efforts'
    ]
  },
  {
    id: 'cloud-platform-security-reader',
    title: 'Cloud Platform Security Reader',
    description: 'Security monitoring for cloud platforms',
    permissions: [
      'Cloud Asset Viewer',
      'Security Center Admin Viewer',
      'Private Logs Viewer',
      'Security Reviewer'
    ],
    recommendedResources: ['gcp-cjis-platform-reader'],
    actions: [
      'Monitor security events and alerts',
      'Review security reports',
      'Track compliance status'
    ]
  },
  {
    id: 'cloud-platform-finops-admin',
    title: 'Cloud Platform FinOps Administrator',
    description: 'Financial operations for cloud platforms',
    permissions: [
      'Billing Account Administrator',
      'BigQuery Data Viewer',
      'BigQuery Job User',
      'BigQuery User',
      'Logs Configuration Writer'
    ],
    recommendedResources: ['aws-us-commercial-dev'],
    actions: [
      'Manage cloud costs and budgets',
      'Optimize resource utilization',
      'Generate financial reports'
    ]
  },
  {
    id: 'cloud-platform-sre',
    title: 'Cloud Platform Site Reliability Engineer',
    description: 'Site reliability engineering for cloud platforms',
    permissions: [
      'Logs Viewer',
      'Monitoring Editor',
      'Security Center Admin Viewer',
      'Security Reviewer',
      'Viewer'
    ],
    recommendedResources: ['aws-us-commercial-dev', 'aws-us-commercial-test'],
    actions: [
      'Ensure platform reliability and uptime',
      'Monitor system performance',
      'Implement automation and scaling'
    ]
  }
];
