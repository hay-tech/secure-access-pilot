
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AuditLogsTable } from '@/components/audit/AuditLogsTable';
import { AuditLogFilters } from '@/components/audit/AuditLogFilters';
import { useIAM } from '@/contexts/IAMContext';
import { AuditLog } from '@/types/iam';

const AuditLogs: React.FC = () => {
  const { auditLogs, users } = useIAM();
  const [filteredLogs, setFilteredLogs] = useState<AuditLog[]>(auditLogs);
  
  const handleFilterChange = (filtered: AuditLog[]) => {
    setFilteredLogs(filtered);
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
        <CardHeader>
          <CardTitle>Activity Logs</CardTitle>
          <CardDescription>
            Track all system events and user activities
          </CardDescription>
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
