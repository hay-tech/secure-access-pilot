
import React from 'react';
import { Card } from "@/components/ui/card";
import { Shield } from "lucide-react";

const EmptyJobFunctionState: React.FC = () => {
  return (
    <Card className="h-full flex flex-col justify-center items-center p-6">
      <div className="text-center space-y-2">
        <Shield className="h-12 w-12 text-muted-foreground mx-auto" />
        <h3 className="text-lg font-medium">No Job Function Selected</h3>
        <p className="text-muted-foreground">
          Select a job function from the table to see detailed information.
        </p>
      </div>
    </Card>
  );
};

export default EmptyJobFunctionState;
