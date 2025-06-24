
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Mail, CheckCircle, XCircle, AlertCircle, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Link } from "react-router-dom";
import BulkAccessReview from '@/components/access-reviews/BulkAccessReview';

const AccessReviewEmail: React.FC = () => {
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [bulkReviewOpen, setBulkReviewOpen] = useState(false);

  // Example data matching the uploaded image
  const reviewData = {
    reviewName: "UAR-July 2025",
    reviewType: "Monthly",
    probableEndDate: "7/25/2025",
    description: "Sovereign Environments"
  };

  const userAccounts = [
    {
      name: "Ritesh Desai RTP254",
      resource: "Azure",
      environment: "FedRAMP High",
      role: "Cloud Platform Contributor"
    },
    {
      name: "SARAH JOHNSON - ABY123",
      resource: "GCP",
      environment: "FedRAMP High",
      role: "Cloud Platform Security Administrator"
    },
    {
      name: "MIKE CHEN - CDZ890",
      resource: "AWS",
      environment: "CCCS",
      role: "Cloud Project Reader"
    }
  ];

  const handleAction = (action: string) => {
    setSelectedAction(action);
    if (action === 'partial') {
      setBulkReviewOpen(true);
      return;
    }
    const actionMessages = {
      'approve-all': 'Approved access for all listed users',
      'reject-all': 'Rejected access for all listed users'
    };
    toast.success(actionMessages[action as keyof typeof actionMessages]);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-2">
        <Mail className="h-6 w-6 text-primary" />
        <h2 className="text-3xl font-bold tracking-tight">Manager Access Review Email</h2>
      </div>

      <Card>
        <CardHeader className="bg-blue-50 border-b">
          <CardTitle className="text-lg">ACTION REQUIRED BY 7/25/2025 - User Access Review</CardTitle>
          <p className="text-sm text-muted-foreground">
            This email is auto-generated for User Access Reviews and is not a phishing training exercise.
          </p>
        </CardHeader>
        <CardContent className="p-6 space-y-6">

          <div className="space-y-4">
            <h3 className="font-semibold">Below is the list of account(s) in the respective resource and environment to review:</h3>
            
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Resource</TableHead>
                  <TableHead>Environment</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {userAccounts.map((account, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{account.name}</TableCell>
                    <TableCell>{account.role}</TableCell>
                    <TableCell className="font-medium">{account.resource}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {account.environment}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex flex-wrap gap-3 pt-4 border-t">
            <Button 
              onClick={() => handleAction('approve-all')}
              className="bg-green-600 hover:bg-green-700"
              disabled={selectedAction === 'approve-all'}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Approve All
            </Button>
            
            <Button 
              onClick={() => handleAction('reject-all')}
              variant="destructive"
              disabled={selectedAction === 'reject-all'}
            >
              <XCircle className="h-4 w-4 mr-2" />
              Reject All
            </Button>
            
            <Button 
              onClick={() => handleAction('partial')}
              variant="outline"
              className="border-blue-500 text-blue-600 hover:bg-blue-50"
              disabled={selectedAction === 'partial'}
            >
              <AlertCircle className="h-4 w-4 mr-2" />
              Partial Approve/Revoke
            </Button>
          </div>

          {selectedAction && selectedAction !== 'partial' && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
              <p className="text-sm text-green-800">
                Action selected: {selectedAction.replace('-', ' ').toUpperCase()}
              </p>
            </div>
          )}

          <div className="space-y-4 pt-4 border-t">             
            <div className="space-y-2 text-sm">
              <ul className="space-y-1 ml-4">
                <li><strong>"Approve All":</strong> If the roles of all the listed users have not changed.</li>
                <li><strong>"Reject All":</strong> To remove access for all the listed users.</li>
                <li><strong>"Partial Approve/Revoke":</strong> Select this option to identify the user account(s) to be removed.</li>
              </ul>
              <p className="mt-2">
                <strong>Submit your response by 7/25/2025.</strong>
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="font-semibold">Review Name:</span> {reviewData.reviewName}
              </div>
              <div>
                <span className="font-semibold">Review Type:</span> {reviewData.reviewType}
              </div>
              <div>
                <span className="font-semibold">End Date:</span> {reviewData.probableEndDate}
              </div>
              <div>
                <span className="font-semibold">Description:</span> {reviewData.description}
              </div>
            </div>
          </div>

          <div className="text-xs text-muted-foreground pt-4 border-t space-y-2">
            <p><strong>For more information:</strong> Please visit the <Link to="/job-functions" className="text-blue-600 hover:text-blue-800 underline">User Access Review Wiki</Link> New WIKI.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Access Review Dialog */}
      <Dialog open={bulkReviewOpen} onOpenChange={setBulkReviewOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Bulk Access Review</DialogTitle>
          </DialogHeader>
          <BulkAccessReview onClose={() => setBulkReviewOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AccessReviewEmail;
