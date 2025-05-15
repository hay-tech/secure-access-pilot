
import { AccessReview } from '../types/iam';

// Enhanced Access Reviews with status and due dates
export const accessReviews: AccessReview[] = [
  {
    id: 'review1',
    reviewerId: 'user2',
    subjectId: 'user3',
    roleId: 'role3',
    decision: 'maintain',
    comments: 'Role is appropriate for current responsibilities',
    createdAt: '2023-05-01T10:00:00Z',
    updatedAt: '2023-05-01T11:30:00Z',
    status: 'completed'
  },
  {
    id: 'review2',
    reviewerId: 'user2',
    subjectId: 'user4',
    roleId: 'role3',
    decision: 'maintain',
    comments: 'Role is appropriate for current responsibilities',
    createdAt: '2023-05-01T10:30:00Z',
    updatedAt: '2023-05-01T12:15:00Z',
    status: 'completed'
  },
  {
    id: 'review3',
    reviewerId: 'user6',
    subjectId: 'user5',
    permissionId: 'perm9',
    decision: 'revoke',
    comments: 'No longer required for current responsibilities',
    createdAt: '2023-05-02T11:15:00Z',
    updatedAt: '2023-05-02T14:45:00Z',
    status: 'completed'
  },
  {
    id: 'review4',
    reviewerId: 'user2',
    subjectId: 'user3',
    permissionId: 'perm8',
    decision: 'maintain',
    createdAt: '2023-05-10T09:00:00Z',
    updatedAt: '2023-05-10T09:00:00Z',
    dueDate: '2023-05-15T09:00:00Z',
    status: 'pending',
    daysOverdue: 5
  },
  {
    id: 'review5',
    reviewerId: 'user6',
    subjectId: 'user4',
    roleId: 'role4',
    decision: 'maintain',
    createdAt: '2023-05-11T15:00:00Z',
    updatedAt: '2023-05-11T15:00:00Z',
    dueDate: '2023-05-18T15:00:00Z',
    status: 'pending',
    daysOverdue: 2
  },
  {
    id: 'review6',
    reviewerId: 'user1',
    subjectId: 'user5',
    permissionId: 'perm6',
    decision: 'revoke',
    createdAt: '2023-05-09T11:30:00Z',
    updatedAt: '2023-05-09T11:30:00Z',
    dueDate: '2023-05-12T11:30:00Z',
    status: 'overdue',
    daysOverdue: 8,
    violationType: 'Excessive'
  },
];
