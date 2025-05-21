
import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Check, X } from "lucide-react";
import { toast } from "sonner";
import { useAccessReviewManagement } from '@/hooks/iam/useAccessReviewManagement';
import { useJobFunctionMapping } from '@/hooks/iam/useJobFunctionMapping';
import { User } from '@/types/iam';

interface BulkAccessReviewProps {
  onClose: () => void;
}

interface UserReviewData {
  id: string;
  name: string;
  email: string;
  department: string;
  currentRole: string;
  newRole?: string;
  action: 'certify-as-is' | 'change-role' | 'revoke-access';
}

const BulkAccessReview: React.FC<BulkAccessReviewProps> = ({ onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectAll, setSelectAll] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [userActions, setUserActions] = useState<Record<string, UserReviewData['action']>>({});
  const [userRoles, setUserRoles] = useState<Record<string, string>>({});
  
  const { accessReviews } = useAccessReviewManagement();
  const { jobFunctionDefinitions } = useJobFunctionMapping();

  // Get users that need reviews from active reviews
  const pendingReviews = accessReviews.filter(review => 
    review.status === 'pending' || review.status === 'overdue'
  );
  
  // Create user review data from pending reviews
  const usersReviewData: UserReviewData[] = pendingReviews.map((review) => {
    const userId = review.subjectId;
    return {
      id: userId,
      name: `User ${review.subjectId.slice(-4)}`, // Mock name based on ID
      email: `user${review.subjectId.slice(-4)}@example.com`, // Mock email
      department: review.regulatoryEnvironment || 'CPE',
      currentRole: review.roleId || 'Cloud Platform Reader',
      action: userActions[userId] || 'certify-as-is', // Use stored action or default
      newRole: userRoles[userId] || undefined
    };
  });
  
  // Filter users based on search query
  const filteredUsers = usersReviewData.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.currentRole.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle select all checkbox
  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    if (checked) {
      setSelectedUsers(filteredUsers.map(user => user.id));
    } else {
      setSelectedUsers([]);
    }
  };

  // Handle individual user selection
  const handleSelectUser = (userId: string, checked: boolean) => {
    if (checked) {
      setSelectedUsers(prev => [...prev, userId]);
    } else {
      setSelectedUsers(prev => prev.filter(id => id !== userId));
      setSelectAll(false);
    }
  };

  // Handle user action change
  const handleActionChange = (userId: string, action: UserReviewData['action']) => {
    setUserActions(prev => ({
      ...prev,
      [userId]: action
    }));
  };

  // Handle role change
  const handleRoleChange = (userId: string, role: string) => {
    setUserRoles(prev => ({
      ...prev,
      [userId]: role
    }));
  };

  // Handle bulk save
  const handleSave = () => {
    toast.success(`Access review completed for ${selectedUsers.length} users`);
    onClose();
  };

  // Get the new role value for a user
  const getNewRole = (user: UserReviewData) => {
    const action = userActions[user.id] || user.action;
    
    if (action === 'change-role') {
      return userRoles[user.id] || 'No change';
    }
    if (action === 'revoke-access') {
      return 'N/A';
    }
    return 'No change';
  };
  
  // Available job functions for role selection
  const availableRoles = jobFunctionDefinitions.map(jf => jf.title);

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Review and certify access for multiple users at once
      </p>
      
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Search users..." 
          className="pl-8" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40px]">
                <Checkbox 
                  checked={selectAll && filteredUsers.length > 0} 
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Current Role</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>New Role</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map(user => {
              const userAction = userActions[user.id] || 'certify-as-is';
              
              return (
                <TableRow key={user.id}>
                  <TableCell>
                    <Checkbox 
                      checked={selectedUsers.includes(user.id)}
                      onCheckedChange={(checked) => handleSelectUser(user.id, !!checked)}
                    />
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-xs text-muted-foreground">{user.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>{user.department}</TableCell>
                  <TableCell>{user.currentRole}</TableCell>
                  <TableCell>
                    <Select 
                      value={userAction}
                      onValueChange={(value) => handleActionChange(user.id, value as UserReviewData['action'])}
                    >
                      <SelectTrigger className="w-[140px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="certify-as-is">Certify as-is</SelectItem>
                        <SelectItem value="change-role">Change role</SelectItem>
                        <SelectItem value="revoke-access">Revoke access</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    {userAction === 'change-role' ? (
                      <Select 
                        value={userRoles[user.id] || "No change"} 
                        onValueChange={(value) => handleRoleChange(user.id, value)}
                      >
                        <SelectTrigger className="w-[200px]">
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableRoles.map(role => (
                            <SelectItem key={role} value={role}>{role}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <span className="text-muted-foreground">{getNewRole(user)}</span>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button 
          onClick={handleSave}
          disabled={selectedUsers.length === 0}
        >
          Submit Review ({selectedUsers.length} users)
        </Button>
      </div>
    </div>
  );
};

export default BulkAccessReview;
