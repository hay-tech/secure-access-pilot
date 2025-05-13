
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useIAM } from '../contexts/IAMContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
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
} from '@/components/ui/dialog';
import { formatDistanceToNow } from 'date-fns';
import { Check, X } from 'lucide-react';

const Approvals: React.FC = () => {
  const { currentUser } = useAuth();
  const { accessRequests, approveAccessRequest, users } = useIAM();
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);
  const [dialogType, setDialogType] = useState<'approve' | 'reject' | null>(null);
  const [comments, setComments] = useState('');
  
  if (!currentUser) return null;
  
  // Get requests that need the current user's approval
  const pendingApprovals = accessRequests.filter(req => 
    (req.managerApproval?.approverId === currentUser.id && req.managerApproval?.status === 'pending') ||
    (req.securityApproval?.approverId === currentUser.id && req.securityApproval?.status === 'pending')
  );
  
  // Get requests that have been approved or rejected by the current user
  const completedApprovals = accessRequests.filter(req => 
    (req.managerApproval?.approverId === currentUser.id && req.managerApproval?.status !== 'pending') ||
    (req.securityApproval?.approverId === currentUser.id && req.securityApproval?.status !== 'pending')
  );
  
  const handleAction = async (approved: boolean) => {
    if (!selectedRequest) return;
    
    const request = accessRequests.find(r => r.id === selectedRequest);
    if (!request) return;
    
    const approverType = request.managerApproval?.approverId === currentUser.id ? 'manager' : 'security';
    
    await approveAccessRequest(
      selectedRequest,
      currentUser.id,
      approverType,
      approved,
      comments
    );
    
    setSelectedRequest(null);
    setDialogType(null);
    setComments('');
  };
  
  const openDialog = (requestId: string, type: 'approve' | 'reject') => {
    setSelectedRequest(requestId);
    setDialogType(type);
    setComments('');
  };
  
  const closeDialog = () => {
    setSelectedRequest(null);
    setDialogType(null);
    setComments('');
  };
  
  const getUserName = (userId: string) => {
    const user = users.find(u => u.id === userId);
    return user ? `${user.firstName} ${user.lastName}` : 'Unknown User';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Approvals</h1>
        <p className="text-muted-foreground">Manage access requests that need your approval</p>
      </div>
      
      <Tabs defaultValue="pending">
        <TabsList>
          <TabsTrigger value="pending">Pending Approvals</TabsTrigger>
          <TabsTrigger value="completed">Completed Approvals</TabsTrigger>
        </TabsList>
        
        <TabsContent value="pending">
          <Card>
            <CardHeader>
              <CardTitle>Pending Approvals</CardTitle>
              <CardDescription>Access requests awaiting your approval</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Requestor</TableHead>
                    <TableHead>Resource</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Requested</TableHead>
                    <TableHead>Justification</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingApprovals.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                        No pending approvals found
                      </TableCell>
                    </TableRow>
                  ) : (
                    pendingApprovals.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell className="font-medium">
                          {getUserName(request.userId)}
                        </TableCell>
                        <TableCell>{request.resourceName}</TableCell>
                        <TableCell>
                          {request.requestType.charAt(0).toUpperCase() + request.requestType.slice(1)}
                        </TableCell>
                        <TableCell>
                          {formatDistanceToNow(new Date(request.createdAt), { addSuffix: true })}
                        </TableCell>
                        <TableCell>
                          <div className="max-w-sm truncate" title={request.justification}>
                            {request.justification}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="bg-green-50 text-green-700 hover:bg-green-100 hover:text-green-800 border-green-200"
                              onClick={() => openDialog(request.id, 'approve')}
                            >
                              <Check className="h-4 w-4 mr-1" /> Approve
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="bg-red-50 text-red-700 hover:bg-red-100 hover:text-red-800 border-red-200"
                              onClick={() => openDialog(request.id, 'reject')}
                            >
                              <X className="h-4 w-4 mr-1" /> Reject
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="completed">
          <Card>
            <CardHeader>
              <CardTitle>Completed Approvals</CardTitle>
              <CardDescription>Access requests you've already reviewed</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Requestor</TableHead>
                    <TableHead>Resource</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Decision</TableHead>
                    <TableHead>Decision Date</TableHead>
                    <TableHead>Comments</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {completedApprovals.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                        No completed approvals found
                      </TableCell>
                    </TableRow>
                  ) : (
                    completedApprovals.map((request) => {
                      const isManager = request.managerApproval?.approverId === currentUser.id;
                      const approval = isManager ? request.managerApproval : request.securityApproval;
                      
                      return (
                        <TableRow key={request.id}>
                          <TableCell className="font-medium">
                            {getUserName(request.userId)}
                          </TableCell>
                          <TableCell>{request.resourceName}</TableCell>
                          <TableCell>
                            {request.requestType.charAt(0).toUpperCase() + request.requestType.slice(1)}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={approval?.status === 'approved' ? 
                                'bg-green-100 text-green-800' : 
                                'bg-red-100 text-red-800'}
                            >
                              {approval?.status === 'approved' ? 'Approved' : 'Rejected'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {approval?.timestamp ? 
                              formatDistanceToNow(new Date(approval.timestamp), { addSuffix: true }) : 
                              'N/A'}
                          </TableCell>
                          <TableCell>
                            <div className="max-w-sm truncate" title={approval?.comments}>
                              {approval?.comments || 'No comments'}
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Approval Dialog */}
      <Dialog open={dialogType === 'approve'} onOpenChange={() => dialogType === 'approve' && closeDialog()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Access Request</DialogTitle>
            <DialogDescription>
              You are about to approve this access request. Please provide any comments or conditions.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Textarea
              placeholder="Optional comments or conditions for approval"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              rows={3}
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={closeDialog}
            >
              Cancel
            </Button>
            <Button 
              onClick={() => handleAction(true)}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Approve Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Rejection Dialog */}
      <Dialog open={dialogType === 'reject'} onOpenChange={() => dialogType === 'reject' && closeDialog()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Access Request</DialogTitle>
            <DialogDescription>
              You are about to reject this access request. Please provide a reason for rejection.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Textarea
              placeholder="Reason for rejection (required)"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              rows={3}
              required
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={closeDialog}
            >
              Cancel
            </Button>
            <Button 
              onClick={() => handleAction(false)}
              disabled={!comments.trim()}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Reject Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Approvals;
