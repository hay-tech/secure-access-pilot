
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import ErrorBoundary from './ErrorBoundary';

interface AtsCardProps {
  data: Array<{ month: string; visits: number }>;
  title?: string;
  description?: string;
}

const AtsCard: React.FC<AtsCardProps> = ({ 
  data, 
  title = "Application to Site Traffic", 
  description = "Monthly application traffic metrics" 
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="h-80">
        <ErrorBoundary>
          <AspectRatio ratio={16/9} className="bg-transparent">
            <ChartContainer 
              config={{
                visits: { label: "Visits", color: "#3b82f6" }  // Blue color
              }}
              className="h-full w-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 30 }}>
                  <XAxis 
                    dataKey="month" 
                    tick={{ fontSize: 12 }} 
                    axisLine={{ stroke: '#e5e7eb' }}
                    tickLine={false}
                  />
                  <YAxis 
                    axisLine={{ stroke: '#e5e7eb' }} 
                    tickLine={false}
                    width={40}
                  />
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <ChartTooltipContent
                            active={active}
                            payload={payload}
                            label={payload[0].payload.month}
                          />
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar 
                    dataKey="visits" 
                    fill="var(--color-visits, #3b82f6)" 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </AspectRatio>
        </ErrorBoundary>
      </CardContent>
    </Card>
  );
};

export default AtsCard;
