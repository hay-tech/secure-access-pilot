
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useIAM } from '../contexts/IAMContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Shield, Users, ListCheck, AlertTriangle, FileText, X, AlertCircle, Clock } from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend 
} from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const Dashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const { 
    accessRequests, 
    accessReviews, 
    users, 
    roles,
    getUserRoles, 
    getUserPermissions,
    hasPermission
  } = useIAM();

  if (!currentUser) return null;

  const userRoles = getUserRoles(currentUser.id);
  const userPermissions = getUserPermissions(currentUser.id);
  
  const pendingRequests = accessRequests.filter(r => r.status === 'pending');
  const myPendingApprovals = pendingRequests.filter(r => 
    (r.managerApproval?.approverId === currentUser.id && r.managerApproval?.status === 'pending') ||
    (r.securityApproval?.approverId === currentUser.id && r.securityApproval?.status === 'pending')
  );
  
  const canViewSystemStats = hasPermission(currentUser.id, 'reports', 'read');
  
  // Chart data for access request status
  const statusData = [
    { name: 'Approved', value: accessRequests.filter(r => r.status === 'approved').length },
    { name: 'Pending', value: accessRequests.filter(r => r.status === 'pending').length },
    { name: 'Rejected', value: accessRequests.filter(r => r.status === 'rejected').length },
  ];
  
  // Chart data for role distribution
  const roleDistribution = roles.map(role => ({
    name: role.name,
    users: users.filter(user => user.roleIds.includes(role.id)).length,
  }));

  // New data for access review insights
  const pendingReviews = accessReviews.filter(r => r.status === 'pending' || r.status === 'overdue');
  const overdueReviews = pendingReviews.filter(r => r.daysOverdue && r.daysOverdue > 0);
  
  // Mock data for access matching insights
  const accessMatchData = [
    { name: 'Matched Access', value: 85 },
    { name: 'Unmatched Access', value: 15 }
  ];

  // Mock data for violations by type
  const violationsData = [
    { type: 'SoD', count: 12, description: 'Segregation of Duties' },
    { type: 'Excessive', count: 18, description: 'Excessive Permissions' },
    { type: 'Dormant', count: 7, description: 'Unused Access (90+ days)' },
    { type: 'Critical', count: 5, description: 'Critical System Exceptions' },
    { type: 'Mismatch', count: 10, description: 'Role-Permission Mismatch' }
  ];

  // Mock data for pending reviews table
  const pendingReviewsData = [
    { id: 'rev1', resource: 'Production Database', role: 'Database Administrator', daysOverdue: 5 },
    { id: 'rev2', resource: 'Financial Reports', role: 'Business Analyst', daysOverdue: 3 },
    { id: 'rev3', resource: 'Source Code Repository', role: 'Software Engineer', daysOverdue: 7 },
    { id: 'rev4', resource: 'Customer Data', role: 'Data Analyst', daysOverdue: 2 },
    { id: 'rev5', resource: 'Network Configuration', role: 'Network Administrator', daysOverdue: 9 }
  ];

  const COLORS = ['#10b981', '#f59e0b', '#ef4444']; // green, amber, red
  const ACCESS_COLORS = ['#3b82f6', '#4ade80']; // blue, green

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, {currentUser.firstName}!</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Your Roles</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userRoles.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {userRoles.map(r => r.name).join(', ')}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Permissions</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userPermissions.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Across {new Set(userPermissions.map(p => p.resource)).size} resources
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
            <ListCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingRequests.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              System-wide pending access requests
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Your Approvals</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{myPendingApprovals.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Access requests waiting for your approval
            </p>
          </CardContent>
        </Card>
      </div>

      {canViewSystemStats && (
        <>
          {/* Access Review Insights Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Access Compliance Overview</CardTitle>
                <CardDescription>Actual vs. approved access across the organization</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <div className="flex flex-col h-full">
                  <div className="flex-1">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={accessMatchData}
                          cx="50%"
                          cy="50%"
                          innerRadius={70}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                          label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {accessMatchData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={ACCESS_COLORS[index % ACCESS_COLORS.length]} />
                          ))}
                        </Pie>
                        <Legend />
                        <Tooltip formatter={(value) => `${value}%`} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm text-center">
                      <span className="font-medium text-blue-600">85%</span> of user access matches approved roles
                    </p>
                    <p className="text-sm text-center text-muted-foreground">
                      {violationsData.reduce((acc, curr) => acc + curr.count, 0)} total violations found
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Access Violations by Type</CardTitle>
                <CardDescription>Distribution of potential policy violations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={violationsData}
                      layout="vertical"
                      margin={{ top: 20, right: 30, left: 100, bottom: 20 }}
                    >
                      <XAxis type="number" />
                      <YAxis type="category" dataKey="type" width={80} />
                      <Tooltip 
                        formatter={(value, name, props) => [
                          value, 
                          props.payload.description
                        ]} 
                      />
                      <Bar dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle>Role to User Mapping</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </div>
                <CardDescription>Number of users assigned to each role</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Role Name</TableHead>
                      <TableHead className="text-right">Users</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {roleDistribution.sort((a, b) => b.users - a.users).map((role) => (
                      <TableRow key={role.name}>
                        <TableCell>{role.name}</TableCell>
                        <TableCell className="text-right">{role.users}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle>Pending Access Reviews</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </div>
                <CardDescription>Reviews requiring attention</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Resource</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead className="text-right">Days Overdue</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingReviewsData.map((review) => (
                      <TableRow key={review.id}>
                        <TableCell>{review.resource}</TableCell>
                        <TableCell>{review.role}</TableCell>
                        <TableCell className="text-right">
                          <span className={`font-medium ${review.daysOverdue > 5 ? 'text-red-500' : 'text-amber-500'}`}>
                            {review.daysOverdue}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Access Review Progress</CardTitle>
              <CardDescription>Status of current access review cycle</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Manager Reviews</span>
                    <span className="text-sm text-muted-foreground">75%</span>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Compliance Reviews</span>
                    <span className="text-sm text-muted-foreground">45%</span>
                  </div>
                  <Progress value={45} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Overall Completion</span>
                    <span className="text-sm text-muted-foreground">60%</span>
                  </div>
                  <Progress value={60} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default Dashboard;
