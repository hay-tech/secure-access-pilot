
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

  // Function to download audit logs as CSV
  const downloadLogs = (logs: AuditLog[]) => {
    // Create CSV content
    const headers = ["ID", "Event Type", "User ID", "Details", "IP Address", "Timestamp"];
    const rows = logs.map(log => [
      log.id,
      log.eventType,
      log.userId,
      log.details,
      log.ipAddress || '',
      log.timestamp
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `audit-logs-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return {
    auditLogs,
    logActivity,
    downloadLogs
  };
};
