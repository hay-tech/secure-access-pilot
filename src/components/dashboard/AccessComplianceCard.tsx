
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface AccessComplianceCardProps {
  data: Array<{ name: string; value: number }>;
  colors: string[];
}

const AccessComplianceCard: React.FC<AccessComplianceCardProps> = ({ data, colors }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Access Compliance Overview</CardTitle>
        <CardDescription>Actual vs. approved access across the organization</CardDescription>
      </CardHeader>
      <CardContent className="h-80">
        <div className="flex flex-col h-full">
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip formatter={(value) => `${value}%`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4">
            <p className="text-sm text-center">
              <span className="font-medium text-blue-600">85%</span> of user access matches approved roles
            </p>
            <p className="text-sm text-center text-muted-foreground">
              {data.reduce((acc, curr) => acc + curr.value, 0)} total violations found
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AccessComplianceCard;
