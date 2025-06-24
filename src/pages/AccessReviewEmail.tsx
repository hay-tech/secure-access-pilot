
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Mail, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";

const AccessReviewEmail: React.FC = () => {
  const [selectedAction, setSelectedAction] = useState<string | null>(null);

  // Example data matching the uploaded image
  const reviewData = {
    reviewName: "email-test-7",
    reviewType: "adhoc",
    probableEndDate: "4/25/2025",
    description: "email-test-7"
  };

  const userAccounts = [
    {
      name: "RITESH TIWARI - BGX467",
      application: "CPE_PORTAL",
      environment: "Commercial Dev",
      role: "Admin",
      permissions: "Admin"
    },
    {
      name: "SARAH JOHNSON - ABY123",
      application: "CPE_PORTAL",
      environment: "FedRAMP High",
      role: "Contributor",
      permissions: "Editor"
    },
    {
      name: "MIKE CHEN - CDZ890",
      application: "CPE_PORTAL",
      environment: "CCCS",
      role: "Reader",
      permissions: "Viewer"
    }
  ];

  const handleAction = (action: string) => {
    setSelectedAction(action);
    const actionMessages = {
      'approve-all': 'Approved access for all listed users',
      'reject-all': 'Rejected access for all listed users',
      'partial': 'Partial approval/revocation selected - review individual users'
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
          <CardTitle className="text-lg">User Access Review Notification</CardTitle>
          <p className="text-sm text-muted-foreground">
            This email is auto-generated for User Access Reviews and is not a phishing training exercise.
          </p>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="space-y-4">
            <p className="text-sm">
              Your response is required to complete the email-test-7 User Access Review for the CPE account(s) and associated privileges listed below.
            </p>
            
            <div className="space-y-2">
              <p className="font-semibold text-sm">The goals of the User Access Review are to:</p>
              <ol className="list-decimal list-inside text-sm space-y-1 ml-4">
                <li>Identify and remove unnecessary accounts to prevent unauthorized access</li>
                <li>Ensure all individuals and service accounts are authenticated, authorized, and audited</li>
              </ol>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="font-semibold">Review Name:</span> {reviewData.reviewName}
              </div>
              <div>
                <span className="font-semibold">Review Type:</span> {reviewData.reviewType}
              </div>
              <div>
                <span className="font-semibold">Probable End Date:</span> {reviewData.probableEndDate}
              </div>
              <div>
                <span className="font-semibold">Description:</span> {reviewData.description}
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <p>Your response may include the following actions:</p>
              <ul className="space-y-1 ml-4">
                <li><strong>"Approve All":</strong> Click on this button, if the roles and privileges of all the listed users have not changed.</li>
                <li><strong>"Reject All":</strong> Click on this button, to remove access for all the listed users and their privileges.</li>
                <li><strong>"Partial Approve/Revoke":</strong> If one or more of the listed privileges has been revoked or changed, please select this option to change the user account(s) and process the changes requested.</li>
              </ul>
              <p className="text-xs text-muted-foreground">
                Your response is required by the end of the day, 4/25/2025.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Below is the list of account(s) in the respective application and environment to review:</h3>
            
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Application</TableHead>
                  <TableHead>Environment</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Permissions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {userAccounts.map((account, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{account.application}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {account.environment}
                      </Badge>
                    </TableCell>
                    <TableCell>{account.role}</TableCell>
                    <TableCell>{account.permissions}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="space-y-2">
              <p className="font-semibold text-sm">User Details:</p>
              {userAccounts.map((account, index) => (
                <div key={index} className="text-sm text-muted-foreground">
                  {account.name}
                </div>
              ))}
            </div>
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

          {selectedAction && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
              <p className="text-sm text-green-800">
                Action selected: {selectedAction.replace('-', ' ').toUpperCase()}
              </p>
            </div>
          )}

          <div className="text-xs text-muted-foreground pt-4 border-t space-y-2">
            <p><strong>Instructions for review:</strong></p>
            <p>If the responsibilities of one or more of your employees have changed, then please review the Role Definition & Business Justification criteria for each role when replying to this request.</p>
            <p className="italic">This email is generated by the User Access functionality of the CPE Portal. If you need more information, please forward this email to cpecomp@motorolasolutions.com and include your question.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccessReviewEmail;
