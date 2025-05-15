
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Users, ListCheck, AlertTriangle } from 'lucide-react';

interface UserStatsCardProps {
  title: string;
  value: number | string;
  description: string;
  icon: 'roles' | 'permissions' | 'pendingRequests' | 'approvals';
}

const UserStatsCard: React.FC<UserStatsCardProps> = ({ title, value, description, icon }) => {
  const getIcon = () => {
    switch (icon) {
      case 'roles':
        return <Shield className="h-4 w-4 text-muted-foreground" />;
      case 'permissions':
        return <Users className="h-4 w-4 text-muted-foreground" />;
      case 'pendingRequests':
        return <ListCheck className="h-4 w-4 text-muted-foreground" />;
      case 'approvals':
        return <AlertTriangle className="h-4 w-4 text-muted-foreground" />;
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {getIcon()}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </CardContent>
    </Card>
  );
};

export default UserStatsCard;
