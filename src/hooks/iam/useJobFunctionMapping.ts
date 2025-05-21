import { useState } from 'react';
import { JobFunction, JobFunctionPermissionMapping, JobFunctionDefinition, PermissionGap } from '../../types/iam';
import { useIAMStore } from './useIAMStore';

const jobFunctionMappings: JobFunctionPermissionMapping[] = [
  {
    jobFunction: 'Cloud IAM Administrator',
    permissions: ['iam:read', 'iam:create', 'iam:update', 'iam:delete'],
    resources: ['users', 'roles', 'policies']
  },
  {
    jobFunction: 'Cloud IAM Reader',
    permissions: ['iam:read'],
    resources: ['users', 'roles', 'policies']
  },
  {
    jobFunction: 'Cloud Platform Administrator',
    permissions: ['platform:read', 'platform:create', 'platform:update', 'platform:delete'],
    resources: ['compute', 'storage', 'network', 'security']
  },
  {
    jobFunction: 'Cloud Platform Reader',
    permissions: ['platform:read'],
    resources: ['compute', 'storage', 'network', 'security']
  },
  {
    jobFunction: 'Security Analyst',
    permissions: ['security:read', 'logs:read', 'monitor:read'],
    resources: ['security-groups', 'logs', 'alerts']
  },
  {
    jobFunction: 'System Administrator',
    permissions: ['system:read', 'system:create', 'system:update', 'system:delete'],
    resources: ['servers', 'applications', 'databases']
  }
];

// Extended job function definitions with descriptions and actions
const jobFunctionDefinitions: JobFunctionDefinition[] = [
  {
    id: 'jf1',
    title: 'Cloud Account Owner',
    description: 'This role is the main point of contact with the CSP provider, owns the relationship with the vendor, and has full access over the cloud environment.',
    actions: ['Full Access']
  },
  {
    id: 'jf2',
    title: 'Cloud IAM Administrator',
    description: 'Full control over user accounts, roles and permissions in the cloud CPE environment. The cloud IAM administrator follows the user access management approval process in accordance with the tenant\'s regulatory and compliance requirements.',
    actions: [
      'Create, Read, Update, and Delete IAM users',
      'Create, Read, Update, Delete and Assign IAM roles',
      'Update permissions assigned to users (via roles or policies)',
      'Update federated identities', 
      'Read access and permissions',
      'Read audit access log'
    ]
  },
  {
    id: 'jf3',
    title: 'Cloud IAM Reader',
    description: 'Ability to view users, groups and associated roles and permissions within the cloud computing environment, without the ability to perform account management functions.',
    actions: [
      'Read IAM users',
      'Read IAM roles and policies'
    ]
  },
  {
    id: 'jf4',
    title: 'Cloud Platform Tenant Administrator',
    description: 'CSP level administrator who creates the tenant, Resource Group and folders containing resource groups (environment owner)',
    actions: ['Create, Read, Update and Delete folders']
  },
  {
    id: 'jf5',
    title: 'Cloud Platform Administrator',
    description: 'Oversees all aspects of the cloud system and its infrastructure from software to data storage to networking and security.',
    actions: [
      'Create, Read, Update, and Delete Projects',
      'Create, Read, Update, and Delete Compute, EC2',
      'Create, Read, Update, and Delete Storage (S3, buckets)',
      'Create, Read, Update, and Delete Network (VPC, Route53, Subnets, Security groups, etc.)',
      'Create, Read, Update, and Delete Containers',
      'Create, Read, Update, and Delete Databases (SQL server, RDS, BigQuery, CloudSQL, DynamoDB, etc.)'
    ]
  },
  {
    id: 'jf6',
    title: 'Cloud Platform Contributor',
    description: 'Contributes to the platform development and its tooling including platform portal, security tools, development tools, deployment tools, Ci/CD pipeline tools, observability and metrics',
    actions: [
      'Read and Update Compute, EC2 at the folder level',
      'Read and Update Storage (S3, buckets) at the folder level',
      'Read and Update Network at the folder level',
      'Read and Update Containers at the folder level',
      'Read and Update Databases at the folder level'
    ]
  },
  {
    id: 'jf7',
    title: 'Cloud Platform Reader',
    description: 'Responsible for ensuring that the cloud environment is properly monitored and that any potential issues or incidents are detected and addressed in a timely manner.',
    actions: [
      'Read cloud resources at the folder level',
      'Read audit access log',
      'Read Logs from all projects',
      'Create, Read, Update, and Delete Alerts'
    ]
  },
  {
    id: 'jf8',
    title: 'Cloud Project Administrator',
    description: 'A Cloud Platform administrator with full privileges within their own project, to create resources, assign project members, roles and permissions, and deploy services',
    actions: [
      'Create, Read, Update and Delete Users in the project',
      'Create, Read, Update and Delete cloud resources within a project'
    ]
  },
  {
    id: 'jf9',
    title: 'Cloud Platform Security Administrator',
    description: 'The primary guardian of data and systems within the cloud infrastructure, focusing on the operational aspects of maintaining cloud security and the day-to-day management, monitoring and compliance enforcement',
    actions: [
      'Create, Read, Update, and Delete cloud resources',
      'Create, Read, Update, and Delete IAM users',
      'Create, Read, Update, Delete and assign IAM roles',
      'Read and Update permissions assigned to users',
      'Read audit access log'
    ]
  },
  {
    id: 'jf10',
    title: 'Cloud Platform Security Reader',
    description: 'Focuses on detection, analysis and response to security threats such as unauthorized access, cyber attacks, and vulnerabilities across the platform infrastructure',
    actions: [
      'Read IAM users, roles, and permissions',
      'Read audit access log',
      'Read Logs from all projects',
      'Read, Update Security ticketing and Alert management'
    ]
  },
  // Adding new job functions from the requirements
  {
    id: 'jf11',
    title: 'Cloud Project Contributor',
    description: 'A Cloud Platform contributor with limited privileges within their own project, to create resources and deploy services',
    actions: [
      'Create, Read, Update and Delete the following cloud resources within a project:',
      'Compute, EC2',
      'Storage (S3, buckets)',
      'Network (VPC, Route53, Subnets, Security groups, etc.)',
      'Containers',
      'Databases (SQL server, RDS, BigQuery, CloudSQL, DynamoDB, etc.)'
    ]
  },
  {
    id: 'jf12',
    title: 'Cloud Project Reader',
    description: 'A Cloud Poject reader with limited privileges within their own project, to read logs',
    actions: [
      'Read audit access log within the project',
      'Read Logs from a specific project',
      'Create, Read, Update, and Delete Alerts for the project'
    ]
  },
  {
    id: 'jf13',
    title: 'Cloud Platform Security Contributor',
    description: 'Responsible for securing the cloud computing environment by designing, implementing, and optimizing security solutions across the platform in accordance with the relevant security regulations and industry standards',
    actions: [
      'Read and Update cloud resources',
      'Read IAM users, IAM roles, access and permissions assigned to IAM users',
      'Read audit access log',
      'Create, Read, Update Security ticketing and Alert management'
    ]
  },
  {
    id: 'jf14',
    title: 'Cloud Platform FinOps Administrator',
    description: 'Manages the financial aspects of cloud platform usage within the organization including tracking cloud resource costs, forecasting usage, optimizing expenses, and ensuring the organization stays within budget. Implements cost saving strategies, automates workflows and analyzes spending',
    actions: [
      'Read and export billing details',
      'Purchase and manage/read reservations and savings plan on all resources'
    ]
  },
  {
    id: 'jf15',
    title: 'Cloud Platform Site Reliability Engineer',
    description: 'An SRE Engineer\'s main responsibility is the availability and performance of the production systems. SREs need access to monitoring and alerting tools and incident management',
    actions: [
      'Read and Update cloud resources within a project',
      'Read audit access log',
      'Read Logs from all projects',
      'Create, Update, Read and Delete Alerts'
    ]
  },
  {
    id: 'jf16',
    title: 'Cloud SovOp Region Manager',
    description: 'A Sovereign region manager has the sole responsibility to approve change management into a "Sovereign" production environment across an entire region. This role does not require an IAM account or direct access to the cloud environment. This user is cleared through the region governance requirements as detailed in the Role Management for MSI Sovereign Regions.',
    actions: [
      'Approves code changes and deployment to the Sovereign environment for their region'
    ]
  },
  {
    id: 'jf17',
    title: 'Cloud Region SovOp',
    description: 'A Sovereign operator is a DevOps or DevSecOps engineer who owns the reliability of a service in a particular sovereign environment across the region, as well as onboards other users.',
    actions: [
      'Read and Update cloud resources within a project',
      'Read audit access log',
      'Read Logs from all projects',
      'Create, Update, Read and Delete Alerts'
    ]
  },
  {
    id: 'jf18',
    title: 'Cloud Value Stream SovOp Engineer',
    description: 'A Sovereign operator is a DevOps or DevSecOps engineer who owns the reliability of a service for their team\'s particular technology within the context of their project(s) in a specific sovereign environment.',
    actions: [
      'Read and Update cloud resources within a project',
      'Read audit access log',
      'Read Logs from their project',
      'Create, Update, Read and Delete Alerts for their project'
    ]
  }
];

export const useJobFunctionMapping = () => {
  const { users, roles, permissions } = useIAMStore();
  const [regulatoryEnvironments] = useState([
    { id: 'env1', name: 'Federal', description: 'U.S. Federal Government', complianceFrameworks: ['FedRAMP', 'FISMA'], riskLevel: 'High' },
    { id: 'env2', name: 'CJI', description: 'Criminal Justice Information', complianceFrameworks: ['CJIS'], riskLevel: 'Critical' },
    { id: 'env3', name: 'Commercial', description: 'Commercial Cloud', complianceFrameworks: ['SOC2', 'ISO27001'], riskLevel: 'Medium' },
    { id: 'env4', name: 'CCCS', description: 'Canadian Centre for Cyber Security', complianceFrameworks: ['CCCS Cloud Security'], riskLevel: 'High' },
  ]);

  const getPermissionsForJobFunction = (jobFunction: JobFunction): string[] => {
    const mapping = jobFunctionMappings.find(m => m.jobFunction === jobFunction);
    return mapping ? mapping.permissions : [];
  };

  const getResourcesForJobFunction = (jobFunction: JobFunction): string[] => {
    const mapping = jobFunctionMappings.find(m => m.jobFunction === jobFunction);
    return mapping ? mapping.resources : [];
  };

  const getEnvironmentsForJobFunction = (jobFunction: JobFunction): string[] => {
    // In the updated version, all job functions can be used in all environments
    return regulatoryEnvironments.map(env => env.name);
  };

  const getJobFunctionDefinition = (jobFunction: string): JobFunctionDefinition | undefined => {
    return jobFunctionDefinitions.find(jf => jf.title === jobFunction);
  };

  const getJobFunctionPermissions = (jobFunction: string) => {
    const definition = getJobFunctionDefinition(jobFunction);
    if (!definition) return null;
    
    const mapping = jobFunctionMappings.find(m => m.jobFunction === jobFunction as JobFunction);
    
    return {
      id: definition.id,
      title: definition.title,
      description: definition.description,
      actions: definition.actions,
      permissions: mapping ? mapping.permissions : [],
      resources: mapping ? mapping.resources : []
    };
  };

  const detectPermissionGaps = (userId: string): PermissionGap[] => {
    const user = users.find(u => u.id === userId);
    if (!user || !user.jobFunction) return [];

    const expectedPermissions = getPermissionsForJobFunction(user.jobFunction as JobFunction);
    const userRoles = roles.filter(role => user.roleIds.includes(role.id));
    
    const userPermissionIds = new Set<string>();
    userRoles.forEach(role => {
      role.permissions.forEach(permission => {
        userPermissionIds.add(permission.id);
      });
    });

    const permissionGaps: PermissionGap[] = [];
    
    // Check for missing permissions
    const expectedPermissionObjects = permissions.filter(p => 
      expectedPermissions.some(expected => 
        p.resource + ':' + p.action === expected
      )
    );
    
    expectedPermissionObjects.forEach(permission => {
      if (!userPermissionIds.has(permission.id)) {
        permissionGaps.push({
          id: `gap-${userId}-${permission.id}`,
          userId,
          permissionId: permission.id,
          gapType: 'missing_permission',
          description: `Missing permission: ${permission.name} (${permission.resource}:${permission.action})`,
          severity: 'medium'
        });
      }
    });
    
    // Check for excess permissions
    userRoles.forEach(role => {
      role.permissions.forEach(permission => {
        const permString = `${permission.resource}:${permission.action}`;
        if (!expectedPermissions.includes(permString)) {
          permissionGaps.push({
            id: `gap-${userId}-${permission.id}-excess`,
            userId,
            permissionId: permission.id,
            roleId: role.id,
            gapType: 'excessive_permission',
            description: `Excess permission from role ${role.name}: ${permission.name} (${permString})`,
            severity: 'high'
          });
        }
      });
    });

    return permissionGaps;
  };

  return {
    jobFunctionMappings,
    jobFunctionDefinitions,
    regulatoryEnvironments,
    getPermissionsForJobFunction,
    getResourcesForJobFunction,
    getEnvironmentsForJobFunction,
    getJobFunctionDefinition,
    getJobFunctionPermissions,
    detectPermissionGaps
  };
};
