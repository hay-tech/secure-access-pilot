
import { useState } from 'react';
import { JobFunction, JobFunctionPermissionMapping, PermissionGap } from '../../types/iam';
import { useIAMStore } from './useIAMStore';

const jobFunctionMappings: JobFunctionPermissionMapping[] = [
  {
    jobFunction: 'Cloud IAM Administrator',
    permissions: ['iam:read', 'iam:create', 'iam:update', 'iam:delete'],
    resources: ['users', 'roles', 'policies'],
    environmentRestrictions: ['Commercial']
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
    resources: ['servers', 'applications', 'databases'],
    environmentRestrictions: ['Commercial', 'Federal']
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
    const mapping = jobFunctionMappings.find(m => m.jobFunction === jobFunction);
    return mapping?.environmentRestrictions || regulatoryEnvironments.map(env => env.name);
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
          userId,
          permissionId: permission.id,
          gapType: 'missing',
          description: `Missing permission: ${permission.name} (${permission.resource}:${permission.action})`,
          severity: 'Medium'
        });
      }
    });
    
    // Check for excess permissions
    userRoles.forEach(role => {
      role.permissions.forEach(permission => {
        const permString = `${permission.resource}:${permission.action}`;
        if (!expectedPermissions.includes(permString)) {
          permissionGaps.push({
            userId,
            permissionId: permission.id,
            roleId: role.id,
            gapType: 'excess',
            description: `Excess permission from role ${role.name}: ${permission.name} (${permString})`,
            severity: 'High'
          });
        }
      });
    });

    return permissionGaps;
  };

  return {
    jobFunctionMappings,
    regulatoryEnvironments,
    getPermissionsForJobFunction,
    getResourcesForJobFunction,
    getEnvironmentsForJobFunction,
    detectPermissionGaps
  };
};
