
import React, { useState } from 'react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { User, PermissionGap, RegulatoryEnvironment } from "@/types/iam";
import { Textarea } from "@/components/ui/textarea";
import { Shield, ShieldCheck, ShieldX, Check, X } from "lucide-react";

interface UserAccessReviewTableProps {
  regulatoryEnvironment: RegulatoryEnvironment;
  userGaps: Array<{ user: User; gaps: PermissionGap[] }>;
  onApproveGap: (userId: string, gapIndex: number, approved: boolean, justification?: string) => Promise<void>;
  onCompleteReview: (userId: string, decision: 'maintain' | 'revoke' | 'modify', comments?: string) => Promise<void>;
}

const UserAccessReviewTable: React.FC<UserAccessReviewTableProps> = ({
  regulatoryEnvironment,
  userGaps,
  onApproveGap,
  onCompleteReview
}) => {
  const [justifications, setJustifications] = useState<Record<string, string>>({});
  const [expandedUser, setExpandedUser] = useState<string | null>(null);
  
  const handleJustificationChange = (userId: string, gapIndex: number, value: string) => {
    const key = `${userId}-${gapIndex}`;
    setJustifications(prev => ({ ...prev, [key]: value }));
  };
  
  const handleToggleExpand = (userId: string) => {
    setExpandedUser(expandedUser === userId ? null : userId);
  };
  
  const getJustification = (userId: string, gapIndex: number) => {
    const key = `${userId}-${gapIndex}`;
    return justifications[key] || '';
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-primary" />
          {regulatoryEnvironment.name} Environment Access Reviews
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee Name</TableHead>
              <TableHead>Job Function</TableHead>
              <TableHead>Groups</TableHead>
              <TableHead>Permission Gaps</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {userGaps.map(({ user, gaps }) => (
              <React.Fragment key={user.id}>
                <TableRow className="cursor-pointer hover:bg-muted/50" onClick={() => handleToggleExpand(user.id)}>
                  <TableCell>
                    {user.firstName} {user.lastName}
                  </TableCell>
                  <TableCell>{user.jobFunction || 'Not assigned'}</TableCell>
                  <TableCell>
                    {/* Display user groups/roles would go here */}
                    {user.roleIds.length} roles assigned
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <span className="font-medium">{gaps.length}</span>
                      <span className="text-muted-foreground">issues found</span>
                      {gaps.some(g => g.severity === 'Critical' || g.severity === 'High') && (
                        <span className="ml-2 rounded-full bg-destructive px-1.5 py-0.5 text-xs text-destructive-foreground">
                          High Risk
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          onCompleteReview(user.id, 'maintain', 'Job function still valid');
                        }}
                      >
                        <Check className="mr-1 h-4 w-4" />
                        Approve All
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          onCompleteReview(user.id, 'revoke', 'Job function no longer valid');
                        }}
                      >
                        <X className="mr-1 h-4 w-4" />
                        Reject All
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
                
                {expandedUser === user.id && (
                  <TableRow>
                    <TableCell colSpan={5} className="p-0">
                      <div className="bg-muted/30 p-4">
                        <h4 className="font-medium mb-2">Permission Gaps Details</h4>
                        
                        {gaps.map((gap, index) => (
                          <div key={index} className="mb-6 bg-background rounded-md p-4 shadow-sm">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center space-x-2">
                                {gap.gapType === 'excess' ? (
                                  <ShieldX className="h-5 w-5 text-destructive" />
                                ) : (
                                  <ShieldCheck className="h-5 w-5 text-warning" />
                                )}
                                <span className={`text-sm font-medium ${gap.gapType === 'excess' ? 'text-destructive' : 'text-warning'}`}>
                                  {gap.gapType === 'excess' ? 'Excess Permission' : 'Missing Permission'}
                                </span>
                                <span className={`ml-2 rounded-full px-2 py-1 text-xs ${
                                  gap.severity === 'Critical' ? 'bg-destructive text-destructive-foreground' :
                                  gap.severity === 'High' ? 'bg-destructive/80 text-destructive-foreground' :
                                  gap.severity === 'Medium' ? 'bg-amber-500 text-white' :
                                  'bg-amber-200 text-amber-800'
                                }`}>
                                  {gap.severity}
                                </span>
                              </div>
                              
                              {gap.approved === undefined && (
                                <div className="flex space-x-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => onApproveGap(
                                      user.id, 
                                      index, 
                                      true, 
                                      getJustification(user.id, index)
                                    )}
                                  >
                                    <Check className="mr-1 h-4 w-4" />
                                    Approve
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => onApproveGap(
                                      user.id, 
                                      index, 
                                      false,
                                      getJustification(user.id, index)
                                    )}
                                  >
                                    <X className="mr-1 h-4 w-4" />
                                    Reject
                                  </Button>
                                </div>
                              )}
                              
                              {gap.approved !== undefined && (
                                <div className={`flex items-center px-3 py-1 rounded-full text-sm ${
                                  gap.approved ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                }`}>
                                  {gap.approved ? (
                                    <>
                                      <Check className="mr-1 h-4 w-4" />
                                      Approved
                                    </>
                                  ) : (
                                    <>
                                      <X className="mr-1 h-4 w-4" />
                                      Rejected
                                    </>
                                  )}
                                </div>
                              )}
                            </div>
                            
                            <p className="text-sm mb-3">{gap.description}</p>
                            
                            {gap.approved === undefined && (
                              <div className="mt-2">
                                <Textarea 
                                  placeholder="Enter justification for your decision..."
                                  value={getJustification(user.id, index)}
                                  onChange={(e) => handleJustificationChange(user.id, index, e.target.value)}
                                  className="h-20"
                                />
                              </div>
                            )}
                            
                            {gap.justification && (
                              <div className="mt-2 text-sm">
                                <span className="font-medium">Justification:</span> {gap.justification}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            ))}
            
            {userGaps.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No permission gaps found for this environment.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default UserAccessReviewTable;
