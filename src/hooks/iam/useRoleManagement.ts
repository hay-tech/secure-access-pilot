
import { Role } from '../../types/iam';
import { toast } from 'sonner';
import { useIAMStore } from './useIAMStore';

export const useRoleManagement = () => {
  const { roles, setRoles, users, auditLogs, setAuditLogs } = useIAMStore();
  
  const logActivity = async (eventType: string, userId: string, details: string) => {
    const newLog = {
      id: `log${auditLogs.length + 1}`,
      eventType,
      userId,
      details,
      ipAddress: '127.0.0.1',
      timestamp: new Date().toISOString(),
    };
    setAuditLogs(prev => [newLog, ...prev]);
    return newLog;
  };

  const createRole = async (role: Omit<Role, 'id' | 'createdAt' | 'updatedAt'>): Promise<Role> => {
    const now = new Date().toISOString();
    const newRole: Role = {
      ...role,
      id: `role${roles.length + 1}`,
      createdAt: now,
      updatedAt: now,
    };
    setRoles(prev => [...prev, newRole]);
    
    await logActivity('role_change', 'system', `New role created: ${newRole.name}`);
    
    toast.success(`Role ${newRole.name} created successfully`);
    return newRole;
  };

  const updateRole = async (id: string, updates: Partial<Role>): Promise<Role | null> => {
    const roleIndex = roles.findIndex(r => r.id === id);
    if (roleIndex === -1) {
      toast.error(`Role with ID ${id} not found`);
      return null;
    }

    const updatedRole = { 
      ...roles[roleIndex], 
      ...updates, 
      updatedAt: new Date().toISOString() 
    };
    
    const newRoles = [...roles];
    newRoles[roleIndex] = updatedRole;
    setRoles(newRoles);
    
    await logActivity('role_change', 'system', `Role updated: ${updatedRole.name}`);
    
    toast.success(`Role ${updatedRole.name} updated successfully`);
    return updatedRole;
  };

  const deleteRole = async (id: string): Promise<boolean> => {
    const roleIndex = roles.findIndex(r => r.id === id);
    if (roleIndex === -1) {
      toast.error(`Role with ID ${id} not found`);
      return false;
    }

    const deletedRole = roles[roleIndex];
    
    // Check if any users have this role
    const usersWithRole = users.filter(u => u.roleIds.includes(id));
    if (usersWithRole.length > 0) {
      toast.error(`Cannot delete role: ${usersWithRole.length} users are assigned to this role`);
      return false;
    }
    
    setRoles(prev => prev.filter(r => r.id !== id));
    
    await logActivity('role_change', 'system', `Role deleted: ${deletedRole.name}`);
    
    toast.success(`Role ${deletedRole.name} deleted successfully`);
    return true;
  };

  const getRoleById = (id: string): Role | undefined => {
    return roles.find(r => r.id === id);
  };

  return {
    roles,
    createRole,
    updateRole,
    deleteRole,
    getRoleById
  };
};
