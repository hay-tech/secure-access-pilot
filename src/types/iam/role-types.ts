
export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  createdAt: string;
  updatedAt: string;
  category?: 'IT' | 'Business' | 'Security' | 'Management';
}

export interface Permission {
  id: string;
  name: string;
  resource: string;
  action: 'create' | 'read' | 'update' | 'delete' | 'approve';
  description: string;
  category?: 'Data' | 'System' | 'Function' | 'Security';
  level?: 'Reader' | 'Contributor' | 'Admin' | 'Basic' | 'Elevated';
}
