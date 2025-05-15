
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface AccessComplianceData {
  name: string;
  compliant: number;
  noncompliant: number;
}

interface AccessComplianceChartProps {
  data: AccessComplianceData[];
}

const AccessComplianceChart: React.FC<AccessComplianceChartProps> = ({ data }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Access Compliance Overview</CardTitle>
        <CardDescription>
          Compliance status across environments
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="compliant" name="Compliant %" stackId="a" fill="#4ade80" />
              <Bar dataKey="noncompliant" name="Non-compliant %" stackId="a" fill="#f87171" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default AccessComplianceChart;
