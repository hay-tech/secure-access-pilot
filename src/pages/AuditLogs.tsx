
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AuditLogsTable } from '@/components/audit/AuditLogsTable';
import { AuditLogFilters } from '@/components/audit/AuditLogFilters';
import { useIAM } from '@/contexts/IAMContext';
import { AuditLog } from '@/types/iam';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { useActivityLogging } from '@/hooks/iam/useActivityLogging';

const AuditLogs: React.FC = () => {
  const { auditLogs, users } = useIAM();
  const [filteredLogs, setFilteredLogs] = useState<AuditLog[]>(auditLogs);
  const { downloadLogs } = useActivityLogging();
  
  const handleFilterChange = (filtered: AuditLog[]) => {
    setFilteredLogs(filtered);
  };

  const handleDownload = () => {
    downloadLogs(filteredLogs);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Audit Logs</h2>
          <p className="text-muted-foreground">
            View system activity and user actions
          </p>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Activity Logs</CardTitle>
            <CardDescription>
              Track all system events and user activities
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <Download className="mr-2 h-4 w-4" />
            Download Logs
          </Button>
        </CardHeader>
        <CardContent>
          <AuditLogFilters 
            logs={auditLogs} 
            users={users}
            onFilterChange={handleFilterChange} 
          />
          <AuditLogsTable logs={filteredLogs} users={users} />
        </CardContent>
      </Card>
    </div>
  );
};

export default AuditLogs;
