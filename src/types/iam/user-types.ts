
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  roleIds: string[];
  department: string;
  manager?: string;
  createdAt: string;
  lastLogin?: string;
  jobFunction?: string;
  jobFunctions?: string[];
  accessLevel?: string;
  csp?: string;
  cspSubtype?: string;
  securityLevel?: string;
}
