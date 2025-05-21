
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useIAM } from '../contexts/IAMContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { AccessRequestForm } from '@/components/access-requests/AccessRequestForm';
import { AccessRequestsTable } from '@/components/access-requests/AccessRequestsTable';
import { toast } from 'sonner';

const AccessRequests: React.FC = () => {
  const { currentUser } = useAuth();
  const { accessRequests } = useIAM();
  const [dialogOpen, setDialogOpen] = useState(false);
  
  if (!currentUser) return null;
  
  const myRequests = accessRequests.filter(req => req.userId === currentUser.id);
  const pendingRequests = myRequests.filter(req => req.status === 'pending');
  const approvedRequests = myRequests.filter(req => req.status === 'approved');
  const rejectedRequests = myRequests.filter(req => req.status === 'rejected');

  const handleRequestSuccess = () => {
    setDialogOpen(false);
    toast.success("Access request submitted successfully");
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
            <Button className="bg-[#0EA5E9] hover:bg-[#0EA5E9]/80">
              <Plus className="mr-2 h-4 w-4" /> New Request
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[700px]">
            <DialogHeader>
              <DialogTitle>Request Access</DialogTitle>
              <DialogDescription>
                Complete this form to request access to cloud resources and environments.
              </DialogDescription>
            </DialogHeader>
            
            <AccessRequestForm 
              onSuccess={handleRequestSuccess} 
              onCancel={() => setDialogOpen(false)} 
            />
          </DialogContent>
        </Dialog>
      </div>
      
      <Tabs defaultValue="my-requests" className="bg-[#F6F6F7]">
        <TabsList className="bg-[#1A1F2C]/10">
          <TabsTrigger value="my-requests" className="data-[state=active]:bg-[#0EA5E9] data-[state=active]:text-white">My Requests</TabsTrigger>
          <TabsTrigger value="approved" className="data-[state=active]:bg-[#0EA5E9] data-[state=active]:text-white">Approved</TabsTrigger>
          <TabsTrigger value="pending" className="data-[state=active]:bg-[#0EA5E9] data-[state=active]:text-white">Pending</TabsTrigger>
          <TabsTrigger value="rejected" className="data-[state=active]:bg-[#0EA5E9] data-[state=active]:text-white">Rejected</TabsTrigger>
        </TabsList>
        
        <TabsContent value="my-requests">
          <Card>
            <CardHeader>
              <CardTitle>All My Requests</CardTitle>
              <CardDescription>View all your access requests</CardDescription>
            </CardHeader>
            <CardContent>
              <AccessRequestsTable requests={myRequests} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="approved">
          <Card>
            <CardHeader>
              <CardTitle>Approved Requests</CardTitle>
              <CardDescription>View your approved access requests</CardDescription>
            </CardHeader>
            <CardContent>
              <AccessRequestsTable requests={approvedRequests} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending">
          <Card>
            <CardHeader>
              <CardTitle>Pending Requests</CardTitle>
              <CardDescription>View your pending access requests</CardDescription>
            </CardHeader>
            <CardContent>
              <AccessRequestsTable requests={pendingRequests} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rejected">
          <Card>
            <CardHeader>
              <CardTitle>Rejected Requests</CardTitle>
              <CardDescription>View your rejected access requests</CardDescription>
            </CardHeader>
            <CardContent>
              <AccessRequestsTable requests={rejectedRequests} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AccessRequests;
