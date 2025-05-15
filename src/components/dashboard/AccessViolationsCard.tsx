
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface ViolationData {
  type: string;
  count: number;
  description: string;
}

interface AccessViolationsCardProps {
  data: ViolationData[];
}

const AccessViolationsCard: React.FC<AccessViolationsCardProps> = ({ data }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Access Violations by Type</CardTitle>
        <CardDescription>Distribution of potential policy violations</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 20, right: 30, left: 100, bottom: 20 }}
            >
              <XAxis type="number" />
              <YAxis type="category" dataKey="type" width={80} />
              <Tooltip 
                formatter={(value, name, props) => [
                  value, 
                  props.payload.description
                ]} 
              />
              <Bar dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default AccessViolationsCard;
