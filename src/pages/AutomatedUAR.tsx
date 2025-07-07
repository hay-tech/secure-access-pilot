
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bot, Database, Shield, AlertTriangle, CheckCircle, FileText, Bell, Users, Zap } from "lucide-react";

const AutomatedUAR: React.FC = () => {
  const processSteps = [
    {
      id: 1,
      title: "Scan Users & Privileges",
      description: "Automation Bot pulls actual privileges from Environment",
      icon: Bot,
      color: "bg-blue-100 text-blue-800 border-blue-300"
    },
    {
      id: 2,
      title: "Compare with Access Control DB",
      description: "Bot fetches expected user access and compares actual vs expected",
      icon: Database,
      color: "bg-purple-100 text-purple-800 border-purple-300"
    },
    {
      id: 3,
      title: "Mismatch Detection",
      description: "System determines if there are any access mismatches",
      icon: Shield,
      color: "bg-orange-100 text-orange-800 border-orange-300"
    },
    {
      id: 4,
      title: "Freeze Access (If Mismatch)",
      description: "Disable user access and send alerts to compliance & admin",
      icon: AlertTriangle,
      color: "bg-red-100 text-red-800 border-red-300"
    },
    {
      id: 5,
      title: "Log Match (If No Mismatch)",
      description: "Record successful review in reporting module",
      icon: CheckCircle,
      color: "bg-green-100 text-green-800 border-green-300"
    },
    {
      id: 6,
      title: "Generate Compliance Report",
      description: "Prepare and send final summary report to compliance team",
      icon: FileText,
      color: "bg-indigo-100 text-indigo-800 border-indigo-300"
    }
  ];

  const reportItems = [
    { icon: Users, label: "Users Scanned", status: "success" },
    { icon: AlertTriangle, label: "Mismatches", status: "warning" },
    { icon: Shield, label: "Access Frozen", status: "error" },
    { icon: Bell, label: "Alerts Sent", status: "info" },
    { icon: CheckCircle, label: "Compliance Status", status: "success" }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600';
      case 'warning': return 'text-orange-600';
      case 'error': return 'text-red-600';
      case 'info': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center gap-2">
        <Bot className="h-6 w-6 text-primary" />
        <h1 className="text-3xl font-bold tracking-tight">Automated User Access Review (UAR) Process</h1>
      </div>

      <Card>
        <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Zap className="h-5 w-5" />
            UAR Automation Flow
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Automated process for continuous user access verification and compliance monitoring
          </p>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {processSteps.map((step, index) => (
              <div key={step.id} className="relative">
                <Card className={`border-2 ${step.color.includes('border') ? '' : 'border-gray-200'} hover:shadow-md transition-shadow`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${step.color}`}>
                        <step.icon className="h-5 w-5" />
                      </div>
                      <Badge variant="outline" className="text-xs">
                        Step {step.id}
                      </Badge>
                    </div>
                    <CardTitle className="text-base">{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </CardContent>
                </Card>
                
                {index < processSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-8 transform -translate-y-1/2 text-gray-400">
                    →
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* System Components */}
      <Card>
        <CardHeader className="bg-gray-50 border-b">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Database className="h-5 w-5" />
            System Components
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <Bot className="h-5 w-5 text-blue-600" />
              <div>
                <p className="font-medium text-sm">Automation Bot</p>
                <p className="text-xs text-muted-foreground">Process Controller</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
              <Shield className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-medium text-sm">Environment</p>
                <p className="text-xs text-muted-foreground">Access Source</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
              <Database className="h-5 w-5 text-purple-600" />
              <div>
                <p className="font-medium text-sm">Access Control DB</p>
                <p className="text-xs text-muted-foreground">Reference Data</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
              <Bell className="h-5 w-5 text-orange-600" />
              <div>
                <p className="font-medium text-sm">Notification Service</p>
                <p className="text-xs text-muted-foreground">Alert System</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Compliance Report Details */}
      <Card>
        <CardHeader className="bg-indigo-50 border-b">
          <CardTitle className="flex items-center gap-2 text-lg text-indigo-800">
            <FileText className="h-5 w-5" />
            Compliance Report Includes
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            {reportItems.map((item, index) => (
              <div key={index} className="flex flex-col items-center gap-2 p-4 bg-white border rounded-lg hover:shadow-sm transition-shadow">
                <item.icon className={`h-6 w-6 ${getStatusColor(item.status)}`} />
                <p className="text-sm font-medium text-center">{item.label}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-sm mb-2">Report Summary</h3>
            <p className="text-sm text-muted-foreground">
              The automated UAR process generates comprehensive compliance reports that include user scan results, 
              identified mismatches, access control actions taken, alert notifications sent, and overall compliance status. 
              These reports are automatically delivered to the compliance team for review and audit trail purposes.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AutomatedUAR;
