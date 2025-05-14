
import { Permission } from '../../types/iam';
import { useIAMStore } from './useIAMStore';

export const useUserPermissions = () => {
  const { users, roles } = useIAMStore();

  const getUserRoles = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (!user) return [];
    
    return roles.filter(role => user.roleIds.includes(role.id));
  };

  const getUserPermissions = (userId: string): Permission[] => {
    const userRoles = getUserRoles(userId);
    const permissionSet = new Set<string>();
    const userPermissions: Permission[] = [];
    
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

  return {
    getUserRoles,
    getUserPermissions,
  };
};
