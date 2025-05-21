
import React, { useState } from 'react';
import { useIAM } from '../contexts/IAMContext';
import { AuditLogsTable } from '../components/audit/AuditLogsTable';
import { AuditLogFilters } from '../components/audit/AuditLogFilters';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download } from 'lucide-react';
import { toast } from 'sonner';

const AuditLogs: React.FC = () => {
  const { auditLogs } = useIAM();
  const [filteredLogs, setFilteredLogs] = useState(auditLogs);
  const [selectedTime, setSelectedTime] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  
  const handleDownload = () => {
    // Create CSV content
    const headers = ['Timestamp', 'Event Type', 'User ID', 'Details', 'IP Address'];
    const csvRows = [headers];
    
    // Add data rows
    filteredLogs.forEach(log => {
      const row = [
        new Date(log.timestamp).toLocaleString(),
        log.eventType,
        log.userId,
        log.details,
        log.ipAddress
      ];
      csvRows.push(row);
    });
    
    // Convert to CSV string
    const csvContent = csvRows.map(row => row.join(',')).join('\n');
    
    // Create Blob and download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `audit-logs-${new Date().toISOString().split('T')[0]}.csv`);
    
    // Append to body, click and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success("Audit logs downloaded successfully");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Audit Logs</h2>
          <p className="text-muted-foreground">
            View system activity and compliance events
          </p>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-1" 
          onClick={handleDownload}
        >
          <Download className="h-4 w-4" />
          <span>Download Logs</span>
        </Button>
      </div>
      
      <AuditLogFilters
        selectedTime={selectedTime}
        setSelectedTime={setSelectedTime}
        selectedType={selectedType}
        setSelectedType={setSelectedType}
        setFilteredLogs={setFilteredLogs}
        allLogs={auditLogs}
      />
      
      <Card>
        <CardHeader>
          <CardTitle>Activity Logs</CardTitle>
        </CardHeader>
        <CardContent>
          <AuditLogsTable logs={filteredLogs} />
        </CardContent>
      </Card>
    </div>
  );
};

export default AuditLogs;
