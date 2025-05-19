
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useIAM } from '../contexts/IAMContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';
import { Plus, MoreHorizontal, Edit, Trash2 } from 'lucide-react';

const Users: React.FC = () => {
  const { currentUser } = useAuth();
  const { users, roles, createUser, updateUser, deleteUser, getUserRoles, hasPermission } = useIAM();
  
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    department: '',
    manager: '',
    roleIds: [] as string[],
    jobFunction: '',
    jobFunctions: [] as string[],
  });
  
  if (!currentUser) return null;
  
  const canManageUsers = hasPermission(currentUser.id, 'users', 'update');
  const canDeleteUsers = hasPermission(currentUser.id, 'users', 'delete');
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleRoleChange = (roleId: string) => {
    setFormData((prev) => {
      const roleIds = [...prev.roleIds];
      if (roleIds.includes(roleId)) {
        return { ...prev, roleIds: roleIds.filter(id => id !== roleId) };
      } else {
        return { ...prev, roleIds: [...roleIds, roleId] };
      }
    });
  };

  const handleJobFunctionChange = (jobFunction: string) => {
    setFormData((prev) => {
      const jobFunctions = [...prev.jobFunctions];
      if (jobFunctions.includes(jobFunction)) {
        return { ...prev, jobFunctions: jobFunctions.filter(jf => jf !== jobFunction) };
      } else {
        return { ...prev, jobFunctions: [...jobFunctions, jobFunction] };
      }
    });
  };
  
  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      department: '',
      manager: '',
      roleIds: [],
      jobFunction: '',
      jobFunctions: [],
    });
  };
  
  const handleCreateUser = async () => {
    await createUser(formData);
    resetForm();
    setIsCreateDialogOpen(false);
  };
  
  const handleEditUser = async () => {
    if (!selectedUserId) return;
    
    await updateUser(selectedUserId, formData);
    resetForm();
    setIsEditDialogOpen(false);
    setSelectedUserId(null);
  };
  
  const handleDeleteUser = async () => {
    if (!selectedUserId) return;
    
    await deleteUser(selectedUserId);
    setIsDeleteDialogOpen(false);
    setSelectedUserId(null);
  };
  
  const openEditDialog = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;
    
    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      department: user.department,
      manager: user.manager || '',
      roleIds: user.roleIds,
      jobFunction: user.jobFunction || '',
      jobFunctions: user.jobFunctions || [],
    });
    
    setSelectedUserId(userId);
    setIsEditDialogOpen(true);
  };
  
  const openDeleteDialog = (userId: string) => {
    setSelectedUserId(userId);
    setIsDeleteDialogOpen(true);
  };
  
  const getUserJobFunctions = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (!user) return [];
    
    if (user.jobFunctions && user.jobFunctions.length > 0) {
      return user.jobFunctions;
    } else if (user.jobFunction) {
      return [user.jobFunction];
    }
    return [];
  };

  // List of available job functions
  const availableJobFunctions = [
    'Cloud Account Owner',
    'Cloud IAM Administrator',
    'Cloud Platform Administrator',
    'Cloud Platform Contributor',
    'Cloud Platform Security Administrator',
    'Cloud Platform Site Reliability Engineer',
    'Security Analyst',
    'System Administrator'
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Users</h1>
          <p className="text-muted-foreground">Manage user accounts and access</p>
        </div>
        
        {canManageUsers && (
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-iam-primary hover:bg-iam-primary-light">
                <Plus className="mr-2 h-4 w-4" /> New User
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Create New User</DialogTitle>
                <DialogDescription>
                  Add a new user to the system and assign their job functions.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Input
                    id="department"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="manager">Manager</Label>
                  <Select
                    value={formData.manager}
                    onValueChange={(value) => handleSelectChange('manager', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select manager" />
                    </SelectTrigger>
                    <SelectContent>
                      {users.map(user => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.firstName} {user.lastName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Job Functions</Label>
                  <div className="border rounded-md p-3 space-y-2">
                    {availableJobFunctions.map(jobFunction => (
                      <div key={jobFunction} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`job-function-${jobFunction}`}
                          checked={formData.jobFunctions.includes(jobFunction)}
                          onChange={() => handleJobFunctionChange(jobFunction)}
                          className="h-4 w-4 rounded border-gray-300 text-iam-primary focus:ring-iam-primary"
                        />
                        <label htmlFor={`job-function-${jobFunction}`} className="text-sm">
                          {jobFunction}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    resetForm();
                    setIsCreateDialogOpen(false);
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  type="button" 
                  onClick={handleCreateUser}
                  className="bg-iam-primary hover:bg-iam-primary-light"
                  disabled={!formData.firstName || !formData.lastName || !formData.email || !formData.department}
                >
                  Create User
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>Manage all users in the system</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Job Function</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Last Login</TableHead>
                {canManageUsers && <TableHead>Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">
                    {user.firstName} {user.lastName}
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.department}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap">
                      {getUserJobFunctions(user.id).map(jobFunction => (
                        <Badge key={jobFunction} variant="outline" className="mr-1 mb-1">
                          {jobFunction}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    {formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })}
                  </TableCell>
                  <TableCell>
                    {user.lastLogin ? 
                      formatDistanceToNow(new Date(user.lastLogin), { addSuffix: true }) : 
                      'Never'}
                  </TableCell>
                  {canManageUsers && (
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => openEditDialog(user.id)}>
                            <Edit className="mr-2 h-4 w-4" />
                            <span>Edit</span>
                          </DropdownMenuItem>
                          {canDeleteUsers && (
                            <DropdownMenuItem 
                              onClick={() => openDeleteDialog(user.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              <span>Delete</span>
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user information and job function assignments.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="manager">Manager</Label>
              <Select
                value={formData.manager}
                onValueChange={(value) => handleSelectChange('manager', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select manager" />
                </SelectTrigger>
                <SelectContent>
                  {users.map(user => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.firstName} {user.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Job Functions</Label>
              <div className="border rounded-md p-3 space-y-2">
                {availableJobFunctions.map(jobFunction => (
                  <div key={jobFunction} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`edit-job-function-${jobFunction}`}
                      checked={formData.jobFunctions.includes(jobFunction)}
                      onChange={() => handleJobFunctionChange(jobFunction)}
                      className="h-4 w-4 rounded border-gray-300 text-iam-primary focus:ring-iam-primary"
                    />
                    <label htmlFor={`edit-job-function-${jobFunction}`} className="text-sm">
                      {jobFunction}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => {
                resetForm();
                setIsEditDialogOpen(false);
                setSelectedUserId(null);
              }}
            >
              Cancel
            </Button>
            <Button 
              type="button" 
              onClick={handleEditUser}
              className="bg-iam-primary hover:bg-iam-primary-light"
              disabled={!formData.firstName || !formData.lastName || !formData.email || !formData.department}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete User Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this user? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => {
                setIsDeleteDialogOpen(false);
                setSelectedUserId(null);
              }}
            >
              Cancel
            </Button>
            <Button 
              type="button" 
              onClick={handleDeleteUser}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Users;
