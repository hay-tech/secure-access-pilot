
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Book, Target, Info, CheckCircle, XCircle, AlertCircle, HelpCircle, Lightbulb } from "lucide-react";

const AccessReviewWiki: React.FC = () => {
  const exampleUsers = [
    {
      user: "John Doe-JDP254",
      role: "Cloud Platform Contributor",
      resource: "Azure",
      environment: "FedRAMP High",
      isPrivileged: true
    },
    {
      user: "Jane Smith - JSZ890",
      role: "Cloud Project Reader",
      resource: "AWS",
      environment: "CCCS",
      isPrivileged: false
    }
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center gap-2">
        <Book className="h-6 w-6 text-primary" />
        <h1 className="text-3xl font-bold tracking-tight">User Access Review — Wiki & Instructions</h1>
      </div>

      {/* Purpose Section */}
      <Card>
        <CardHeader className="bg-red-50 border-b">
          <CardTitle className="flex items-center gap-2 text-lg text-red-800">
            <Target className="h-5 w-5" />
            Purpose
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <p className="mb-4 font-medium">User Access Reviews are conducted regularly to meet security and compliance requirements, including:</p>
          <ul className="space-y-2 text-sm">
            <li>• Preventing unauthorized access</li>
            <li>• Ensuring least privilege and separation of duties</li>
            <li>• Supporting audit readiness for frameworks such as NIST 800-53 (especially controls AC-2, AC-6, AC-5, and AC-17)</li>
          </ul>
        </CardContent>
      </Card>

      {/* Background Section */}
      <Card>
        <CardHeader className="bg-blue-50 border-b">
          <CardTitle className="flex items-center gap-2 text-lg text-blue-800">
            <Info className="h-5 w-5" />
            Background – Why User Access Reviews Matter
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <p className="mb-4 font-medium">User Access Reviews (UARs) are a security best practice and compliance requirement under:</p>
          <ul className="space-y-2 text-sm mb-4">
            <li>• NIST SP 800-53 Rev. 5</li>
            <li>• AC-2 (Account Management) – Review user accounts periodically</li>
            <li>• AC-5 (Separation of Duties) – Ensure users don't have conflicting roles</li>
            <li>• AC-6 (Least Privilege) – Confirm users only have access necessary for their role</li>
            <li>• AC-17 (Remote Access) – Review access for telework or VPN users</li>
          </ul>
          <p className="mb-4 font-medium">These reviews help the organization:</p>
          <ul className="space-y-2 text-sm">
            <li>• Remove unused, outdated, or excessive privileges</li>
            <li>• Prevent insider threats and accidental misuse</li>
            <li>• Ensure accountability for role-based access control</li>
          </ul>
        </CardContent>
      </Card>

      {/* Review Frequency Section */}
      <Card>
        <CardHeader className="bg-purple-50 border-b">
          <CardTitle className="flex items-center gap-2 text-lg text-purple-800">
            <AlertCircle className="h-5 w-5" />
            Review Frequency
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <p className="text-sm mb-2">
            <strong>Monthly, Quarterly, Annually, or Ad Hoc</strong> (as specified in the review email), depending on the Environment's regulatory and security requirements.
          </p>
          <p className="text-sm">
            <strong>Review Due Date</strong> is always <span className="underline">indicated clearly</span> in the notification (e.g., April 25, 2025).
          </p>
        </CardContent>
      </Card>

      {/* Reviewer Responsibilities Section */}
      <Card>
        <CardHeader className="bg-green-50 border-b">
          <CardTitle className="flex items-center gap-2 text-lg text-green-800">
            <CheckCircle className="h-5 w-5" />
            Reviewer Responsibilities
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <p className="mb-4 font-medium">If you are a manager or designated reviewer, you must:</p>
          <ol className="space-y-2 text-sm mb-4 list-decimal list-inside">
            <li>Validate the user's current role and responsibilities</li>
            <li>Review the access listed (Application, Role, Environment, Permissions)</li>
            <li>Take one of the following actions:</li>
          </ol>
          
          <div className="grid gap-4 mt-4">
            <div className="flex items-start gap-3 p-3 bg-green-100 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <p className="font-medium text-green-800">Approve All</p>
                <p className="text-sm text-green-700">Access is still valid and appropriate</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 bg-red-100 rounded-lg">
              <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
              <div>
                <p className="font-medium text-red-800">Reject All</p>
                <p className="text-sm text-red-700">User no longer requires access</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 bg-orange-100 rounded-lg">
              <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5" />
              <div>
                <p className="font-medium text-orange-800">Partial Approve/Revoke</p>
                <p className="text-sm text-orange-700">Some access needs to be revoked or modified</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Example Entry Section */}
      <Card>
        <CardHeader className="bg-gray-50 border-b">
          <CardTitle className="flex items-center gap-2 text-lg text-gray-800">
            <Info className="h-5 w-5" />
            Example Entry in Review Email
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
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
              {exampleUsers.map((user, index) => (
                <TableRow key={index}>
                  <TableCell className={user.isPrivileged ? "font-bold" : "font-medium"}>
                    {user.user}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className={user.isPrivileged ? "font-bold" : ""}>
                        {user.role}
                      </span>
                      {user.isPrivileged && (
                        <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300 text-xs">
                          Privileged
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className={user.isPrivileged ? "font-bold" : "font-medium"}>
                    {user.resource}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {user.environment}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <ul className="space-y-2 text-sm list-decimal list-inside">
            <li>A <stron>privileged account</stron> is a powerful account designed for users who need to manage, maintain, and secure a system, granting them the necessary control to execute actions that could significantly impact the system's security and operation.</li>
          </ul>
          </CardContent>
      </Card>

      {/* What to Do Section */}
      <Card>
        <CardHeader className="bg-blue-50 border-b">
          <CardTitle className="flex items-center gap-2 text-lg text-blue-800">
            <CheckCircle className="h-5 w-5" />
            What to Do
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <ol className="space-y-2 text-sm list-decimal list-inside">
            <li>Open the review email</li>
            <li>Review the user(s) listed</li>
            <li>Click the appropriate action button (Approve All / Reject All / Partial Approve/Revoke)</li>
            <li>If unsure, refer to the Role Definition & Business Justification or contact the access compliance team at ciecompl@motorolasolutions.com</li>
          </ol>
        </CardContent>
      </Card>

      {/* Tips Section */}
      <Card>
        <CardHeader className="bg-pink-50 border-b">
          <CardTitle className="flex items-center gap-2 text-lg text-pink-800">
            <Lightbulb className="h-5 w-5" />
            Tips for Effective Review
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <ul className="space-y-2 text-sm">
            <li>• Don't assume access is valid "just in case"</li>
            <li>• Ask: Does the user need this level of access today in their current role?</li>
            <li>• Coordinate with HR or the user's team if unsure</li>
          </ul>
        </CardContent>
      </Card>

      {/* Questions Section */}
      <Card>
        <CardHeader className="bg-indigo-50 border-b">
          <CardTitle className="flex items-center gap-2 text-lg text-indigo-800">
            <HelpCircle className="h-5 w-5" />
            Questions?
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <p className="text-sm">
            Send questions or clarifications to: <strong>ciecompl@motorolasolutions.com</strong>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccessReviewWiki;
