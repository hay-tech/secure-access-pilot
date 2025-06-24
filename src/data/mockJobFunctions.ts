
import { JobFunctionDefinition } from '../types/iam';

export const jobFunctionDefinitions: JobFunctionDefinition[] = [
  {
    id: 'cloud-account-owner',
    title: 'Cloud Account Owner',
    description: 'Owns the cloud services account and maintains service governance, compliance, and organizational alignment.',
    shortDescription: 'Manages cloud account ownership and vendor relationships',
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
    description: 'Maintains administrative roles and permissions in the cloud environment following user access management procedures to meet regulatory and compliance requirements.',
    shortDescription: 'Administers user identities, access rights, and security policies',
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
    description: 'Provides read-only access to centralized roles and permissions within the cloud environment for review and audit purposes.',
    shortDescription: 'Read-only access to review IAM policies and configurations',
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
    description: 'Creates and manages cloud tenants, resource types, and folders containing tenant/compartment resources while overseeing platform provisioning.',
    shortDescription: 'Manages multi-tenant cloud environments and resource allocation',
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
    description: 'Maintains full privileges for building, operating, and monitoring cloud operational performance including infrastructure, development tools, and CI/CD pipelines.',
    shortDescription: 'Full platform administration including infrastructure and deployments',
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
    description: 'Provides limited privileges for building, operating, and monitoring cloud performance including development tools and CI/CD pipeline management.',
    shortDescription: 'Contributes to platform development with limited administrative access',
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
    description: 'Provides limited read-only privileges for monitoring cloud operational performance and detecting issues or incidents early.',
    shortDescription: 'Read-only access to monitor platform health and performance',
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
    description: 'Maintains full administrative privileges within a specific project for building, operating, and monitoring cloud performance.',
    shortDescription: 'Full administrative access within a specific project scope',
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
    description: 'Provides limited privileges within a specific project for building, operating, and monitoring cloud performance including development and deployment tools.',
    shortDescription: 'Contributes to project development with editing permissions',
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
    description: 'Provides limited read-only privileges within a specific project for monitoring performance and detecting issues early.',
    shortDescription: 'Read-only access to view project resources and status',
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
    description: 'Serves as the primary guardian of data and systems within the Cloud Platform/Tenant, focusing on organizational security measures including monitoring and compliance enforcement.',
    shortDescription: 'Administers platform-wide security policies and compliance',
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
    description: 'Executes security-related tasks and optimizes security solutions across the platform in accordance with relevant policies and procedures.',
    shortDescription: 'Contributes to security implementations and monitoring',
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
    description: 'Focuses on detection, analysis, and response to security threats while monitoring the performance of infrastructure systems.',
    shortDescription: 'Read-only access to security events and compliance reports',
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
    description: 'Manages the financial aspects of cloud platform resources including cost optimization and ensuring the organization stays within cloud spending budgets.',
    shortDescription: 'Manages cloud costs, budgets, and financial optimization',
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
    description: 'Ensures the availability and performance of cloud platform systems through monitoring, alerting, and incident management.',
    shortDescription: 'Ensures platform reliability, uptime, and performance monitoring',
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
