
import { AuditLog } from '../../types/iam';
import { useIAMStore } from './useIAMStore';

export const useActivityLogging = () => {
  const { auditLogs, setAuditLogs } = useIAMStore();

  const logActivity = async (
    eventType: AuditLog['eventType'], 
    userId: string, 
    details: string
  ): Promise<AuditLog> => {
    const newLog: AuditLog = {
      id: `log${auditLogs.length + 1}`,
      eventType,
      userId,
      details,
      ipAddress: '127.0.0.1', // In a real app, this would be the actual IP
      timestamp: new Date().toISOString(),
    };
    setAuditLogs(prev => [newLog, ...prev]);
    return newLog;
  };

  return {
    auditLogs,
    logActivity
  };
};
