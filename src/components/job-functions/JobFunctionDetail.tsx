
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ShieldCheck, Info, AlertTriangle } from "lucide-react";
import { JobFunctionDefinition } from '@/types/iam';

interface JobFunctionDetailProps {
  jobFunction: JobFunctionDefinition;
}

const JobFunctionDetail: React.FC<JobFunctionDetailProps> = ({ jobFunction }) => {
  if (!jobFunction) return null;

  // Debug logging
  console.log('JobFunctionDetail - jobFunction:', jobFunction);
  console.log('JobFunctionDetail - permissions:', jobFunction.permissions);

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <ShieldCheck className="h-6 w-6 text-primary" />
              {jobFunction.title}
            </CardTitle>
            <p className="text-muted-foreground mt-1">{jobFunction.description}</p>
          </div>
          {jobFunction.environmentRestrictions?.length ? (
            <div className="flex gap-1">
              {jobFunction.environmentRestrictions.map((env) => (
                <Badge key={env} variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                  {env}
                </Badge>
              ))}
            </div>
          ) : (
            <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
              All Environments
            </Badge>
          )}
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="pt-4 space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
            <Info className="h-5 w-5 text-muted-foreground" />
            Required Actions
          </h3>
          <ul className="list-disc pl-5 space-y-2 text-sm">
            {jobFunction.actions.map((action, idx) => (
              <li key={idx} className="text-gray-700">{action}</li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-muted-foreground" />
            GCP Permissions
          </h3>
          {jobFunction.permissions && jobFunction.permissions.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {jobFunction.permissions.map((permission) => (
                <Badge key={permission} variant="secondary" className="bg-blue-50 text-blue-700">
                  {permission}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No permissions defined for this job function.</p>
          )}
        </div>

        {jobFunction.recommendedResources && (
          <div>
            <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-muted-foreground" />
              Recommended Resources
            </h3>
            <div className="flex flex-wrap gap-2">
              {jobFunction.recommendedResources.map((resource) => (
                <Badge key={resource} variant="outline" className="bg-gray-50">
                  {resource}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default JobFunctionDetail;
