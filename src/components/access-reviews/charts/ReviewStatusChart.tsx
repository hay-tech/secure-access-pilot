
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface ReviewStatusData {
  name: string;
  completed: number;
  pending: number;
  inProgress: number;
}

interface ReviewStatusChartProps {
  data: ReviewStatusData[];
}

const ReviewStatusChart: React.FC<ReviewStatusChartProps> = ({ data }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Access Reviews Status by Manager</CardTitle>
        <CardDescription>
          Completed vs. Pending vs. In-Progress reviews
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
              <Bar dataKey="completed" name="Completed" fill="#4ade80" />
              <Bar dataKey="pending" name="Pending" fill="#fbbf24" />
              <Bar dataKey="inProgress" name="In-Progress" fill="#60a5fa" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReviewStatusChart;
