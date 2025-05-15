
import React from 'react';
import AccessComplianceChart from './charts/AccessComplianceChart';
import ReviewStatusChart from './charts/ReviewStatusChart';

// Generate mock data for charts
const accessComplianceData = [
  { name: 'Federal', compliant: 89, noncompliant: 11 },
  { name: 'CJIS', compliant: 95, noncompliant: 5 },
  { name: 'CCCS', compliant: 92, noncompliant: 8 },
  { name: 'Commercial (US)', compliant: 87, noncompliant: 13 },
  { name: 'Commercial (UK)', compliant: 91, noncompliant: 9 },
  { name: 'Commercial (AU)', compliant: 94, noncompliant: 6 },
];

// Review status data by manager
const reviewStatusByManagerData = [
  { name: 'John Smith', completed: 12, pending: 3, inProgress: 2 },
  { name: 'Sarah Johnson', completed: 8, pending: 5, inProgress: 1 },
  { name: 'Michael Chen', completed: 15, pending: 0, inProgress: 0 },
  { name: 'Anita Patel', completed: 6, pending: 8, inProgress: 4 },
  { name: 'David Wilson', completed: 10, pending: 2, inProgress: 1 },
];

const AccessReviewCharts: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <AccessComplianceChart data={accessComplianceData} />
      <ReviewStatusChart data={reviewStatusByManagerData} />
    </div>
  );
};

export default AccessReviewCharts;
