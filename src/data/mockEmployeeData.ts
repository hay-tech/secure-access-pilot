
// Mock employee data that would come from HR
export const employeesFromHR = [
  {
    id: 'emp1',
    firstName: 'John',
    lastName: 'Wilson',
    email: 'john.wilson@company.com',
    department: 'Engineering',
    startDate: '2025-05-15',
    employeeId: 'E12345',
    status: 'Pending Onboarding'
  },
  {
    id: 'emp2',
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@company.com',
    department: 'Product',
    startDate: '2025-05-18',
    employeeId: 'E12346',
    status: 'Pending Onboarding'
  },
  {
    id: 'emp3',
    firstName: 'Michael',
    lastName: 'Chang',
    email: 'michael.chang@company.com',
    department: 'Security',
    startDate: '2025-05-20',
    employeeId: 'E12347',
    status: 'Pending Onboarding'
  },
  {
    id: 'emp4',
    firstName: 'Emma',
    lastName: 'Garcia',
    email: 'emma.garcia@company.com',
    department: 'Data Science',
    startDate: '2025-05-22',
    employeeId: 'E12348',
    status: 'Pending Onboarding'
  },
  {
    id: 'emp5',
    firstName: 'David',
    lastName: 'Singh',
    email: 'david.singh@company.com',
    department: 'DevOps',
    startDate: '2025-05-25',
    employeeId: 'E12349',
    status: 'Pending Onboarding'
  },
  {
    id: 'emp6',
    firstName: 'Priya',
    lastName: 'Patel',
    email: 'priya.patel@company.com',
    department: 'Infrastructure',
    startDate: '2025-05-28',
    employeeId: 'E12350',
    status: 'Pending Onboarding'
  },
  {
    id: 'emp7',
    firstName: 'James',
    lastName: 'Williams',
    email: 'james.williams@company.com',
    department: 'Platform',
    startDate: '2025-06-01',
    employeeId: 'E12351',
    status: 'Pending Onboarding'
  },
  {
    id: 'emp8',
    firstName: 'Olivia',
    lastName: 'Martinez',
    email: 'olivia.martinez@company.com',
    department: 'Engineering',
    startDate: '2025-06-05',
    employeeId: 'E12352',
    status: 'Pending Onboarding'
  }
];

// Mock direct reports for the current manager
export const mockDirectReports = [
  {
    id: 'dr1',
    firstName: 'Alex',
    lastName: 'Rivera',
    email: 'alex.rivera@company.com',
    department: 'Engineering',
    jobFunction: 'Cloud Platform Administrator',
    employeeId: 'E22001',
    startDate: '2025-04-01'
  },
  {
    id: 'dr2',
    firstName: 'Taylor',
    lastName: 'Kim',
    email: 'taylor.kim@company.com',
    department: 'Engineering',
    jobFunction: '',
    employeeId: 'E22002',
    startDate: '2025-04-05'
  },
  {
    id: 'dr3',
    firstName: 'Jordan',
    lastName: 'Patel',
    email: 'jordan.patel@company.com',
    department: 'Security',
    employeeId: 'E22003',
    startDate: '2025-04-10'
  },
  {
    id: 'dr4',
    firstName: 'Morgan',
    lastName: 'Lee',
    email: 'morgan.lee@company.com',
    department: 'DevOps',
    jobFunction: 'Cloud Platform Site Reliability Engineer',
    employeeId: 'E22004',
    startDate: '2025-04-15'
  },
  {
    id: 'dr5',
    firstName: 'Casey',
    lastName: 'Zhang',
    email: 'casey.zhang@company.com',
    department: 'Engineering',
    jobFunctions: ['Cloud Platform Reader', 'Cloud Project Contributor'],
    employeeId: 'E22005',
    startDate: '2025-04-20'
  }
];
