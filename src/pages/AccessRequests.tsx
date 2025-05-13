
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useIAM } from '../contexts/IAMContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { Plus } from 'lucide-react';

const AccessRequests: React.FC = () => {
  const { currentUser } = useAuth();
  const { accessRequests, roles, createAccessRequest } = useIAM();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [requestType, setRequestType] = useState<'role' | 'permission' | 'system'>('role');
  const [resourceId, setResourceId] = useState('');
  const [justification, setJustification] = useState('');
  
  if (!currentUser) return null;
  
  const myRequests = accessRequests.filter(req => req.userId === currentUser.id);
  
  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    canceled: 'bg-gray-100 text-gray-800',
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!resourceId || !justification) return;
    
    // Find the resource name based on resourceId and type
    let resourceName = '';
    if (requestType === 'role') {
      const role = roles.find(r => r.id === resourceId);
      resourceName = role ? role.name : '';
    } else if (requestType === 'permission') {
      resourceName = 'Permission'; // You'd need to implement a proper lookup
    } else {
      resourceName = 'System'; // You'd need to implement a proper lookup
    }
    
    await createAccessRequest({
      userId: currentUser.id,
      resourceId,
      resourceName,
      requestType,
      justification,
    });
    
    // Reset form and close dialog
    setResourceId('');
    setJustification('');
    setDialogOpen(false);
  };
  
  const renderStatusBadge = (status: string) => {
    const color = statusColors[status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800';
    return (
      <Badge variant="outline" className={color}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Access Requests</h1>
          <p className="text-muted-foreground">Request new access or view your requests</p>
        </div>
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-iam-primary hover:bg-iam-primary-light">
              <Plus className="mr-2 h-4 w-4" /> New Request
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Request Access</DialogTitle>
              <DialogDescription>
                Fill out this form to request new access to roles, permissions, or systems.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="request-type" className="text-right">
                    Request Type
                  </Label>
                  <Select 
                    value={requestType} 
                    onValueChange={(value) => setRequestType(value as any)}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select request type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="role">Role</SelectItem>
                      <SelectItem value="permission">Permission</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="resource" className="text-right">
                    {requestType === 'role' ? 'Role' : 
                     requestType === 'permission' ? 'Permission' : 'System'}
                  </Label>
                  {requestType === 'role' ? (
                    <Select 
                      value={resourceId} 
                      onValueChange={setResourceId}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder={`Select ${requestType}`} />
                      </SelectTrigger>
                      <SelectContent>
                        {roles.map(role => (
                          <SelectItem key={role.id} value={role.id}>
                            {role.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input
                      id="resource"
                      value={resourceId}
                      onChange={(e) => setResourceId(e.target.value)}
                      className="col-span-3"
                      placeholder={`Enter ${requestType} name`}
                    />
                  )}
                </div>
                
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="justification" className="text-right pt-2">
                    Justification
                  </Label>
                  <Textarea
                    id="justification"
                    value={justification}
                    onChange={(e) => setJustification(e.target.value)}
                    className="col-span-3"
                    placeholder="Explain why you need this access"
                    rows={4}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-iam-primary hover:bg-iam-primary-light">Submit Request</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      <Tabs defaultValue="my-requests">
        <TabsList>
          <TabsTrigger value="my-requests">My Requests</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>
        
        <TabsContent value="my-requests">
          <Card>
            <CardHeader>
              <CardTitle>All My Requests</CardTitle>
              <CardDescription>View all your access requests</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Resource</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Requested</TableHead>
                    <TableHead>Manager Approval</TableHead>
                    <TableHead>Security Approval</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {myRequests.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                        No requests found
                      </TableCell>
                    </TableRow>
                  ) : (
                    myRequests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell className="font-medium">{request.resourceName}</TableCell>
                        <TableCell>
                          {request.requestType.charAt(0).toUpperCase() + request.requestType.slice(1)}
                        </TableCell>
                        <TableCell>{renderStatusBadge(request.status)}</TableCell>
                        <TableCell>
                          {formatDistanceToNow(new Date(request.createdAt), { addSuffix: true })}
                        </TableCell>
                        <TableCell>
                          {request.managerApproval ? (
                            <Badge variant="outline" className={statusColors[request.managerApproval.status as keyof typeof statusColors]}>
                              {request.managerApproval.status.charAt(0).toUpperCase() + request.managerApproval.status.slice(1)}
                            </Badge>
                          ) : (
                            <Badge variant="outline">N/A</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {request.securityApproval ? (
                            <Badge variant="outline" className={statusColors[request.securityApproval.status as keyof typeof statusColors]}>
                              {request.securityApproval.status.charAt(0).toUpperCase() + request.securityApproval.status.slice(1)}
                            </Badge>
                          ) : (
                            <Badge variant="outline">N/A</Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="approved">
          <Card>
            <CardHeader>
              <CardTitle>Approved Requests</CardTitle>
              <CardDescription>Access requests that have been approved</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Resource</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Requested</TableHead>
                    <TableHead>Approved Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {myRequests.filter(r => r.status === 'approved').length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                        No approved requests found
                      </TableCell>
                    </TableRow>
                  ) : (
                    myRequests
                      .filter(r => r.status === 'approved')
                      .map((request) => (
                        <TableRow key={request.id}>
                          <TableCell className="font-medium">{request.resourceName}</TableCell>
                          <TableCell>
                            {request.requestType.charAt(0).toUpperCase() + request.requestType.slice(1)}
                          </TableCell>
                          <TableCell>
                            {formatDistanceToNow(new Date(request.createdAt), { addSuffix: true })}
                          </TableCell>
                          <TableCell>
                            {request.updatedAt ? 
                              formatDistanceToNow(new Date(request.updatedAt), { addSuffix: true }) : 
                              'N/A'}
                          </TableCell>
                        </TableRow>
                      ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="pending">
          <Card>
            <CardHeader>
              <CardTitle>Pending Requests</CardTitle>
              <CardDescription>Access requests awaiting approval</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Resource</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Requested</TableHead>
                    <TableHead>Manager Approval</TableHead>
                    <TableHead>Security Approval</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {myRequests.filter(r => r.status === 'pending').length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                        No pending requests found
                      </TableCell>
                    </TableRow>
                  ) : (
                    myRequests
                      .filter(r => r.status === 'pending')
                      .map((request) => (
                        <TableRow key={request.id}>
                          <TableCell className="font-medium">{request.resourceName}</TableCell>
                          <TableCell>
                            {request.requestType.charAt(0).toUpperCase() + request.requestType.slice(1)}
                          </TableCell>
                          <TableCell>
                            {formatDistanceToNow(new Date(request.createdAt), { addSuffix: true })}
                          </TableCell>
                          <TableCell>
                            {request.managerApproval ? (
                              <Badge variant="outline" className={statusColors[request.managerApproval.status as keyof typeof statusColors]}>
                                {request.managerApproval.status.charAt(0).toUpperCase() + request.managerApproval.status.slice(1)}
                              </Badge>
                            ) : (
                              <Badge variant="outline">N/A</Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            {request.securityApproval ? (
                              <Badge variant="outline" className={statusColors[request.securityApproval.status as keyof typeof statusColors]}>
                                {request.securityApproval.status.charAt(0).toUpperCase() + request.securityApproval.status.slice(1)}
                              </Badge>
                            ) : (
                              <Badge variant="outline">N/A</Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="rejected">
          <Card>
            <CardHeader>
              <CardTitle>Rejected Requests</CardTitle>
              <CardDescription>Access requests that have been rejected</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Resource</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Requested</TableHead>
                    <TableHead>Rejected By</TableHead>
                    <TableHead>Rejection Reason</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {myRequests.filter(r => r.status === 'rejected').length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                        No rejected requests found
                      </TableCell>
                    </TableRow>
                  ) : (
                    myRequests
                      .filter(r => r.status === 'rejected')
                      .map((request) => (
                        <TableRow key={request.id}>
                          <TableCell className="font-medium">{request.resourceName}</TableCell>
                          <TableCell>
                            {request.requestType.charAt(0).toUpperCase() + request.requestType.slice(1)}
                          </TableCell>
                          <TableCell>
                            {formatDistanceToNow(new Date(request.createdAt), { addSuffix: true })}
                          </TableCell>
                          <TableCell>
                            {request.managerApproval?.status === 'rejected' ? 'Manager' : 
                             request.securityApproval?.status === 'rejected' ? 'Security' : 'Unknown'}
                          </TableCell>
                          <TableCell>
                            {request.managerApproval?.status === 'rejected' ? request.managerApproval.comments : 
                             request.securityApproval?.status === 'rejected' ? request.securityApproval.comments : 'N/A'}
                          </TableCell>
                        </TableRow>
                      ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AccessRequests;
