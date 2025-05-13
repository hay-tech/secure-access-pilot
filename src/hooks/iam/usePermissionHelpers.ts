
import { Role } from '../../types/iam';
import { useIAMStore } from './useIAMStore';

export const usePermissionHelpers = () => {
  const { users, roles, permissions } = useIAMStore();

  const getUserRoles = (userId: string): Role[] => {
    const user = users.find(u => u.id === userId);
    if (!user) return [];
    
    return roles.filter(role => user.roleIds.includes(role.id));
  };

  const getUserPermissions = (userId: string) => {
    const userRoles = getUserRoles(userId);
    const permissionSet = new Set<string>();
    const userPermissions = [];
    
    userRoles.forEach(role => {
      role.permissions.forEach(permission => {
        if (!permissionSet.has(permission.id)) {
          permissionSet.add(permission.id);
          userPermissions.push(permission);
        }
      });
    });
    
    return userPermissions;
  };

  const hasPermission = (userId: string, resource: string, action: string) => {
    const userPermissions = getUserPermissions(userId);
    return userPermissions.some(p => p.resource === resource && p.action === action);
  };

  return {
    permissions,
    getUserRoles,
    getUserPermissions,
    hasPermission
  };
};
