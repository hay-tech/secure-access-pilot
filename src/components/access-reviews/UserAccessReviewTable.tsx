
import React, { useState, useEffect } from 'react';
import { Table, TableHeader, TableRow, TableHead, TableBody } from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { User, PermissionGap, RegulatoryEnvironment } from "@/types/iam";
import { Shield, Filter } from "lucide-react";
import UserAccessReviewRow from './UserAccessReviewRow';
import UserAccessReviewEmptyState from './UserAccessReviewEmptyState';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface UserAccessReviewTableProps {
  regulatoryEnvironment: RegulatoryEnvironment;
  userGaps: Array<{ user: User; gaps: PermissionGap[] }>;
  onApproveGap: (userId: string, gapIndex: number, approved: boolean, justification?: string) => Promise<void>;
  onCompleteReview: (userId: string, decision: 'maintain' | 'revoke' | 'modify', comments?: string) => Promise<void>;
}

// Mock managers for the filtering functionality
const managers = [
  { id: 'manager1', name: 'John Manager' },
  { id: 'manager2', name: 'Sarah Manager' },
  { id: 'manager3', name: 'Mark Director' }
];

const UserAccessReviewTable: React.FC<UserAccessReviewTableProps> = ({
  regulatoryEnvironment,
  userGaps,
  onApproveGap,
  onCompleteReview
}) => {
  const [selectedManager, setSelectedManager] = useState<string>('all');
  const [filteredUsers, setFilteredUsers] = useState(userGaps);
  
  // Filter users when manager selection changes
  useEffect(() => {
    if (selectedManager === 'all') {
      setFilteredUsers(userGaps);
    } else {
      const filtered = userGaps.filter(({ user }) => {
        // In a real app, you would have user.manager field to filter by
        // For demo purposes, we'll just filter randomly
        return user.manager === selectedManager;
      });
      setFilteredUsers(filtered);
    }
  }, [selectedManager, userGaps]);
  
  // Function to get manager name by ID
  const getManagerName = (managerId?: string) => {
    if (!managerId) return 'No Manager';
    const manager = managers.find(m => m.id === managerId);
    return manager ? manager.name : 'Unknown Manager';
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            {regulatoryEnvironment.name} Environment Access Reviews
          </CardTitle>
          
          <div className="flex items-center gap-2">
            <Select value={selectedManager} onValueChange={setSelectedManager}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by Manager" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Managers</SelectItem>
                {managers.map(manager => (
                  <SelectItem key={manager.id} value={manager.id}>
                    {manager.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Environment</TableHead>
              <TableHead>Employee Name</TableHead>
              <TableHead>Job Function</TableHead>
              <TableHead>Group(s)</TableHead>
              <TableHead>Manager</TableHead>
              <TableHead>Access Type</TableHead>
              <TableHead>Justification</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map(({ user, gaps }) => (
              <TableRow key={user.id}>
                <TableCell>{regulatoryEnvironment.name}</TableCell>
                <TableCell className="font-medium">
                  {user.firstName} {user.lastName}
                </TableCell>
                <TableCell>
                  {user.jobFunction || 
                   (user.jobFunctions && user.jobFunctions.length > 0 
                    ? user.jobFunctions.join(", ") 
                    : "No job function")}
                </TableCell>
                <TableCell>
                  {user.department || "N/A"}
                </TableCell>
                <TableCell>
                  {getManagerName(user.manager)}
                </TableCell>
                <TableCell>
                  <Badge variant="outline">Permanent</Badge>
                </TableCell>
                <TableCell>
                  <div className="max-w-xs">
                    <Input 
                      defaultValue="No change"
                      className="text-sm h-8"
                    />
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-green-50 text-green-700 hover:bg-green-100 hover:text-green-800 border-green-200"
                    >
                      <Check className="h-4 w-4 mr-1" /> Certify
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-red-50 text-red-700 hover:bg-red-100 hover:text-red-800 border-red-200"
                    >
                      <X className="h-4 w-4 mr-1" /> Revoke Access
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            
            {filteredUsers.length === 0 && <UserAccessReviewEmptyState />}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default UserAccessReviewTable;
