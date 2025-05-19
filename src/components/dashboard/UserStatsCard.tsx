
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Users, ListCheck, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface UserStatsCardProps {
  title: string;
  value: number | string;
  description: string;
  icon: 'roles' | 'permissions' | 'pendingRequests' | 'approvals';
  linkTo?: string;
}

const UserStatsCard: React.FC<UserStatsCardProps> = ({ title, value, description, icon, linkTo }) => {
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

  const CardWrapper = ({ children }: { children: React.ReactNode }) => {
    if (linkTo) {
      return (
        <Link to={linkTo} className="block transition-all hover:scale-105">
          {children}
        </Link>
      );
    }
    return <>{children}</>;
  };

  return (
    <CardWrapper>
      <Card className={linkTo ? "cursor-pointer hover:shadow-md" : ""}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          {getIcon()}
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{value}</div>
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        </CardContent>
      </Card>
    </CardWrapper>
  );
};

export default UserStatsCard;
