
import { JobFunctionDefinition } from '../types/iam';

export const jobFunctionDefinitions: JobFunctionDefinition[] = [
  {
    id: 'cloud-account-owner',
    title: 'Cloud Account Owner',
    description: 'This role is the main point of contact with the CSP provider, owns the relationship with the vendor and maintains ownership of the cloud services account in order to ensure service governance and compliance and organizational objectives are aligned.',
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
    description: 'This role has administrative roles and permissions in the cloud CPE environment. The cloud IAM administrator follows the user access management procedures and processes to meet the tenant\'s regulatory and compliance requirements.',
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
    description: 'This role has read-only centralized roles and permissions within the cloud computing environment, without the ability to perform account management or administrative functions. The access is limited to view-only privileges. As a reviewer, to ensure users have only the needed access, roles and privileges but grants read only access.',
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
    description: 'CSP tenant administrator who creates the tenant. Resource types and folders containing resource folder/tenant/compartments. Oversees all aspects of the cloud system and its infrastructure from software to data across the environment that is under their control. Tenant leads stand as deploying all platform resources and overseeing how many tenant environments they have provisioned.',
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
    description: 'A Cloud Platform administrator will full privileges within that one project. In relation to building, operating and monitoring the cloud operational performance. Comprises to the application including building, configuration management, infrastructure, development tools, deployment tools, CI/CD pipeline tools, observability and metrics gathering, etc.',
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
    description: 'A Cloud Platform contributor with limited privileges within that one project. In relation to building, operating and monitoring the cloud operational performance. Comprises to the application including building configuration management, infrastructure, development tools, deployment tools, CI/CD pipeline tools, observability and metrics gathering.',
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
    description: 'A Cloud Platform reader with limited privileges within that one project. In relation to building, operating and monitoring the cloud operational performance. The environment is properly monitored and that any abnormal issues or incidents are detected early, providing support for the overall health and performance of the cloud platform. Has the ability to provide various alerts.',
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
    description: 'A Cloud Platform administrator will full privileges within that one project. In relation to building, operating and monitoring the cloud operational performance. Comprises to the application including building, configuration management, infrastructure, deployment tools, development tools, CI/CD pipeline tools, observability and metrics gathering.',
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
    description: 'A Cloud Platform contributor with limited privileges within that one project. In relation to building, operating and monitoring the cloud operational performance. Comprises to the application including building, configuration management, infrastructure, development tools, deployment tools, CI/CD pipeline tools, observability and metrics gathering, quickly services.',
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
    description: 'A Cloud Platform reader with limited privileges within that one project. In relation to building, operating and monitoring the cloud operational performance. The environment is properly monitored and that any abnormal issues or incidents are detected early, providing support for the overall health and performance of the cloud platform. It has the ability to read logs.',
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
    description: 'The primary guardian of data and systems within the Cloud Platform/Tenant, focusing on the organizational security measures including monitoring and compliance enforcement.',
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
    description: 'Responsible for executing security-related tasks, optimizing security solutions across the platform in accordance with the relevant policies and procedures.',
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
    description: 'Focuses on detection, analysis and responds to security threats and on performance tuning in other systems and monitors the performance of the infrastructure.',
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
    description: 'Manages the financial aspects of cloud platform resources including cost optimization, ensuring the organization stays within its cloud spending budget and conducts operational measurement for optimization.',
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
    description: 'An SRE Engineer\'s main responsibility is the availability and performance of the cloud platform systems. Monitoring and alerting on system availability, starting tools and incident management.',
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
