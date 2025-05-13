
import { User } from '../../types/iam';
import { toast } from 'sonner';
import { useIAMStore } from './useIAMStore';

export const useUserManagement = () => {
  const { users, setUsers, setAuditLogs, auditLogs } = useIAMStore();

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

  const createUser = async (user: Omit<User, 'id' | 'createdAt'>): Promise<User> => {
    const newUser: User = {
      ...user,
      id: `user${users.length + 1}`,
      createdAt: new Date().toISOString(),
    };
    setUsers(prev => [...prev, newUser]);
    
    await logActivity('login', newUser.id, `New user created: ${newUser.firstName} ${newUser.lastName}`);
    
    toast.success(`User ${newUser.firstName} ${newUser.lastName} created successfully`);
    return newUser;
  };

  const updateUser = async (id: string, updates: Partial<User>): Promise<User | null> => {
    const userIndex = users.findIndex(u => u.id === id);
    if (userIndex === -1) {
      toast.error(`User with ID ${id} not found`);
      return null;
    }

    const updatedUser = { ...users[userIndex], ...updates };
    const newUsers = [...users];
    newUsers[userIndex] = updatedUser;
    setUsers(newUsers);
    
    await logActivity('role_change', id, `User updated: ${updatedUser.firstName} ${updatedUser.lastName}`);
    
    toast.success(`User ${updatedUser.firstName} ${updatedUser.lastName} updated successfully`);
    return updatedUser;
  };

  const deleteUser = async (id: string): Promise<boolean> => {
    const userIndex = users.findIndex(u => u.id === id);
    if (userIndex === -1) {
      toast.error(`User with ID ${id} not found`);
      return false;
    }

    const deletedUser = users[userIndex];
    setUsers(prev => prev.filter(u => u.id !== id));
    
    await logActivity('role_change', 'system', `User deleted: ${deletedUser.firstName} ${deletedUser.lastName}`);
    
    toast.success(`User ${deletedUser.firstName} ${deletedUser.lastName} deleted successfully`);
    return true;
  };

  const getUserById = (id: string): User | undefined => {
    return users.find(u => u.id === id);
  };

  return {
    users,
    createUser,
    updateUser,
    deleteUser,
    getUserById
  };
};
