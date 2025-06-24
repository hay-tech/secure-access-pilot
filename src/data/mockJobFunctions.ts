
import { JobFunctionDefinition } from '../types/iam';

export const jobFunctionDefinitions: JobFunctionDefinition[] = [
  {
    id: 'cloud-account-owner',
    title: 'Cloud Account Owner',
    description: 'This role is the main point of contact with the CSP provider, owns the relationship with the vendor, and ensures the organization\'s cloud services account is used to execute cloud service offerings. This role reports on the other roles and ensures they are managed appropriately. This role sets organizational policy and evaluates permissions in the cloud PTE environment. The Cloud IAM administrator follows the user access management procedures to meet regulatory and compliance requirements.',
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
    description: 'This role is for centralized roles and permissions within the cloud computing environment, without the ability to perform account administrative functions. This role follows user access management procedures to ensure users have only the needed access, roles and permissions that permit them to do their job.',
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
    description: 'CSP Role that provides roles that create the tenant. Resource Owner and Folder resource owners have several aspects of cloud computing and infrastructure from Software to Data Storage, Application Folders. Business Rule: CSP is responsible for defining all administrative and operational actions from servers and workstation requirements to procedures required to enable compliant use of cloud services. The environment is properly monitored and they are informed in advance of any outage.',
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
    description: 'CSP Role that provides roles that create the tenant. Resource Owner and Folder resource owners have several aspects of cloud computing and infrastructure from Software to Data Storage, Application Folders. Oversees all aspects of the cloud system and its infrastructure from software to data storage through application processing, middleware, networking/connectivity. The Infrastructure Business Rule to be established is maintaining operations and operating the cloud operational environment.',
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
    description: 'Comprises the broadest view of a system operating the cloud operational performance. Provides tools for building, operating, and monitoring along with infrastructure management including development tools, development tools, CI/CD pipeline tools, automation and scripting, and deployment tools that provide a focused approach to optimize cloud operations and to maintain optimal platform performance.',
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
    description: 'A Cloud Platform contributor that provides development tools such as CI/CD pipeline tools, development tools such as CI/CD pipeline tools and development tools for system monitoring with environment to be provided. Business Rule: CSP is responsible for providing support for the overall health and performance of the cloud platform and its infrastructure.',
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
    description: 'A Cloud Platform reader with limited privileges within a specific project for monitoring cloud performance and maintaining optimal tools to read logs.',
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
    description: 'A Cloud Platform administrator with full privileges within that have several security roles, regulatory environment, security configuration, and Cloud security services.',
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
    description: 'A Cloud Platform contributor with limited privileges within a specific project for building, operating, and monitoring cloud performance including development and deployment tools, development tools, CI/CD pipeline tools, deployment tools that provide quality services.',
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
    description: 'A Cloud Platform reader with limited privileges within a specific project for monitoring performance and detecting issues or incidents early to read logs.',
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
    description: 'The primary guardian of data and systems within the Cloud Platform/Tenant, focusing on organizational measures. Business Rule: This role, monitoring and compliance enforcement.',
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
    description: 'Responsible for executing security-related tasks and optimizing security solutions across the platform in accordance with the relevant policies and procedures.',
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
    description: 'Focuses on detection, analysis and response to security threats and acts as watchdog for attack activity. It also includes proactive monitoring, alerting tools and incident management infrastructure.',
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
    description: 'Manages the financial aspects of cloud platform resources. It includes managing the costs, budgets, and ensuring the organization stays within cloud spending budgets, establishing and ensuring the organization stays within established cloud spending limits for monitoring, alerting and ensuring cloud spending compliance enforcement.',
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
    description: 'An SRE Engineer\'s main responsibility is the availability and performance of cloud platform systems. This includes practices, operational, alerting tools and incident management.',
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
