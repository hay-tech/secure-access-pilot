
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface AccessReviewPieChartProps {
  data: {
    name: string;
    value: number;
  }[];
}

const COLORS = ['#4ade80', '#f87171'];

const AccessReviewPieChart: React.FC<AccessReviewPieChartProps> = ({ data }) => {
  const totalReviews = data.reduce((sum, item) => sum + item.value, 0);
  const completedReviews = data.find(item => item.name === 'Completed')?.value || 0;
  const remainingReviews = data.find(item => item.name === 'Remaining')?.value || 0;
  const completionPercentage = totalReviews > 0 ? Math.round((completedReviews / totalReviews) * 100) : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Access Review Progress</CardTitle>
        <CardDescription>Status of current access review cycle</CardDescription>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="h-[240px] flex flex-col items-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} reviews`, 'Count']} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 grid grid-cols-2 gap-4 text-center w-full">
            <div className="flex flex-col">
              <span className="text-xl font-bold text-green-500">{completedReviews}</span>
              <span className="text-sm text-muted-foreground">Completed</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-red-400">{remainingReviews}</span>
              <span className="text-sm text-muted-foreground">Remaining</span>
            </div>
            <div className="col-span-2 pt-2">
              <span className="text-xl font-bold">{completionPercentage}%</span>
              <span className="text-sm text-muted-foreground ml-2">Overall Completion</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AccessReviewPieChart;
