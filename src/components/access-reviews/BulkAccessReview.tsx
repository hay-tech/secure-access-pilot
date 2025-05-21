
import React, { useState } from 'react';
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

interface BulkAccessReviewProps {
  onClose: () => void;
}

interface User {
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
  
  // Mock list of users for bulk review
  const mockUsers: User[] = [
    {
      id: 'user1',
      name: 'John Smith',
      email: 'john.smith@example.com',
      department: 'CPE DLT',
      currentRole: 'Cloud Platform Contributor',
      action: 'change-role'
    },
    {
      id: 'user2',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@example.com',
      department: 'CPE FinOps',
      currentRole: 'Cloud Platform FinOps Administrator',
      action: 'certify-as-is'
    },
    {
      id: 'user3',
      name: 'Michael Brown',
      email: 'michael.brown@example.com',
      department: 'Product',
      currentRole: 'Cloud Platform Reader',
      action: 'revoke-access'
    },
    {
      id: 'user4',
      name: 'Emily Davis',
      email: 'emily.davis@example.com',
      department: 'CPE Security & Compliance',
      currentRole: 'Cloud Platform Security Administrator',
      action: 'certify-as-is'
    },
    {
      id: 'user5',
      name: 'David Wilson',
      email: 'david.wilson@example.com',
      department: 'IT',
      currentRole: 'Cloud IAM Reader',
      action: 'certify-as-is'
    },
    {
      id: 'user6',
      name: 'Jennifer Taylor',
      email: 'jennifer.taylor@example.com',
      department: 'CPE Infrastructure',
      currentRole: 'Cloud Platform Administrator',
      action: 'certify-as-is'
    },
  ];

  // Filter users based on search query
  const filteredUsers = mockUsers.filter(user => 
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
  const handleActionChange = (userId: string, action: User['action']) => {
    // In a real app, we would update the user's action in state
    console.log(`Changed action for user ${userId} to ${action}`);
  };

  // Handle role change
  const handleRoleChange = (userId: string, role: string) => {
    // In a real app, we would update the user's new role in state
    console.log(`Changed role for user ${userId} to ${role}`);
  };

  // Handle bulk save
  const handleSave = () => {
    toast.success(`Access review completed for ${selectedUsers.length} users`);
    onClose();
  };

  // Get the new role value for a user
  const getNewRole = (user: User) => {
    if (user.action === 'change-role') {
      return user.newRole || 'Cloud Platform Administrator';
    }
    if (user.action === 'revoke-access') {
      return 'N/A';
    }
    return 'No change';
  };
  
  const availableRoles = [
    'Cloud Platform Administrator',
    'Cloud Platform Contributor',
    'Cloud Platform Reader',
    'Cloud Platform Security Administrator',
    'Cloud Platform Security Contributor',
    'Cloud Platform Security Reader',
    'Cloud Platform FinOps Administrator',
  ];

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
            {filteredUsers.map(user => (
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
                    defaultValue={user.action} 
                    onValueChange={(value) => handleActionChange(user.id, value as User['action'])}
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
                  {user.action === 'change-role' ? (
                    <Select 
                      defaultValue={user.newRole || availableRoles[0]} 
                      onValueChange={(value) => handleRoleChange(user.id, value)}
                    >
                      <SelectTrigger className="w-[200px]">
                        <SelectValue />
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
            ))}
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
