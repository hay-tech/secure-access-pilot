
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Download, FileSpreadsheet, Filter } from 'lucide-react';
import { useIAM } from '@/contexts/IAMContext';
import { useJobFunctionMapping } from '@/hooks/iam/useJobFunctionMapping';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

const Reports: React.FC = () => {
  const { users, accessReviews } = useIAM();
  const { jobFunctionDefinitions } = useJobFunctionMapping();
  const [currentTab, setCurrentTab] = useState('federal');
  const [filterJobFunction, setFilterJobFunction] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  // List of compliance environments
  const complianceEnvironments = [
    { id: 'federal', name: 'Federal' },
    { id: 'cjis', name: 'CJIS' },
    { id: 'cccs', name: 'CCCS' },
    { id: 'commercial-us', name: 'Commercial (US)' },
    { id: 'commercial-uk', name: 'Commercial (UK)' },
    { id: 'commercial-au', name: 'Commercial (AU)' },
  ];
  
  // Filter users based on compliance environment and job function
  const filteredUsers = users.filter(user => {
    // In a real app, we would filter by compliance environment 
    // For now, we'll show all users on all tabs
    
    // Filter by job function if set
    if (filterJobFunction && (!user.jobFunction || !user.jobFunction.includes(filterJobFunction))) {
      return false;
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
      const email = user.email.toLowerCase();
      
      return fullName.includes(query) || email.includes(query);
    }
    
    return true;
  });
  
  // Get the job function name by ID
  const getJobFunctionName = (id: string) => {
    const jobFunction = jobFunctionDefinitions.find(jf => jf.id === id);
    return jobFunction ? jobFunction.title : 'Unknown';
  };
  
  // Generate random review status for demo
  const getReviewStatus = (userId: string) => {
    const statuses = ['Completed', 'Pending', 'Overdue'];
    // Use userId to get consistent but seemingly random status
    const statusIndex = userId.charCodeAt(0) % statuses.length;
    return statuses[statusIndex];
  };
  
  // Generate color for status badge
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Overdue':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const handleExport = () => {
    toast.success(`Report for ${complianceEnvironments.find(e => e.id === currentTab)?.name} exported successfully`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Reports</h2>
          <p className="text-muted-foreground">
            View and download access review and compliance reports
          </p>
        </div>
      </div>

      <Tabs defaultValue="federal" value={currentTab} onValueChange={setCurrentTab}>
        <TabsList className="grid grid-cols-6 mb-4">
          {complianceEnvironments.map(env => (
            <TabsTrigger key={env.id} value={env.id}>{env.name}</TabsTrigger>
          ))}
        </TabsList>
        
        {complianceEnvironments.map(env => (
          <TabsContent key={env.id} value={env.id}>
            <Card>
              <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle>User Access Report - {env.name}</CardTitle>
                  <CardDescription>
                    Users and their job functions for {env.name} environment
                  </CardDescription>
                </div>
                <Button 
                  className="mt-4 sm:mt-0" 
                  onClick={handleExport}
                  variant="outline"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Export Report
                </Button>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="flex-grow">
                    <Label htmlFor="search">Search Users</Label>
                    <Input
                      id="search"
                      placeholder="Search by name or email..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <div className="w-full sm:w-72">
                    <Label htmlFor="job-function">Filter by Job Function</Label>
                    <Select
                      value={filterJobFunction}
                      onValueChange={setFilterJobFunction}
                    >
                      <SelectTrigger id="job-function">
                        <SelectValue placeholder="All Job Functions" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Job Functions</SelectItem>
                        {jobFunctionDefinitions.map(jf => (
                          <SelectItem key={jf.id} value={jf.id}>{jf.title}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <ScrollArea className="h-[500px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Job Functions</TableHead>
                        <TableHead>Last Review Date</TableHead>
                        <TableHead>Review Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map((user) => {
                        const reviewStatus = getReviewStatus(user.id);
                        const statusColor = getStatusColor(reviewStatus);
                        const userReview = accessReviews.find(r => r.subjectId === user.id);
                        const lastReviewDate = userReview && userReview.updatedAt
                          ? new Date(userReview.updatedAt).toLocaleDateString()
                          : 'Not reviewed';
                          
                        return (
                          <TableRow key={user.id}>
                            <TableCell>
                              <div className="font-medium">{user.firstName} {user.lastName}</div>
                              <div className="text-sm text-muted-foreground">{user.email}</div>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-wrap gap-1">
                                {user.jobFunctions && user.jobFunctions.length > 0 ? (
                                  user.jobFunctions.map(jfId => (
                                    <Badge key={jfId} variant="outline" className="bg-blue-50">
                                      {getJobFunctionName(jfId)}
                                    </Badge>
                                  ))
                                ) : (
                                  user.jobFunction ? (
                                    <Badge variant="outline" className="bg-blue-50">
                                      {getJobFunctionName(user.jobFunction)}
                                    </Badge>
                                  ) : (
                                    <span className="text-muted-foreground">No job functions</span>
                                  )
                                )}
                              </div>
                            </TableCell>
                            <TableCell>{lastReviewDate}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className={statusColor}>
                                {reviewStatus}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                      
                      {filteredUsers.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={4} className="h-24 text-center">
                            No users found matching your criteria.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default Reports;
