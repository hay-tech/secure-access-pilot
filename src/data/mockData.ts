
// Main export file for all mock data
import { permissions } from './mockPermissions';
import { roles } from './mockRoles';
import { users } from './mockUsers';
import { accessRequests } from './mockAccessRequests';
import { auditLogs } from './mockAuditLogs';
import { accessReviews } from './mockAccessReviews';
import { accessViolations } from './mockAccessViolations';
import { 
  complianceEnvironments,
  environmentTypes,
  resourceHierarchyLevels,
  targetResources
} from './mockAccessRequestData';
import { jobFunctionDefinitions } from './mockJobFunctions';
import { approvers, approvalMatrix } from './mockApprovers';

// Re-export all mock data
export {
  permissions,
  roles,
  users,
  accessRequests,
  auditLogs,
  accessReviews,
  accessViolations,
  complianceEnvironments,
  environmentTypes,
  resourceHierarchyLevels,
  targetResources,
  jobFunctionDefinitions,
  approvers,
  approvalMatrix
};
