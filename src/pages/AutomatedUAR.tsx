
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bot, Database, Shield, AlertTriangle, CheckCircle, FileText, Bell, Users, Zap, Cloud, Server, Lock, Eye, ArrowRight, ArrowDown } from "lucide-react";

const AutomatedUAR: React.FC = () => {
  const keyComponents = [
    {
      id: 1,
      title: "🤖 Automation Bot",
      subtitle: "UAR Scanner",
      description: "Core automation system that orchestrates the entire UAR process",
      icon: Bot,
      color: "bg-blue-50 border-blue-200"
    },
    {
      id: 2,
      title: "📘 Access Control DB",
      subtitle: "Reference Database",
      description: "Repository of expected user access permissions and entitlements",
      icon: Database,
      color: "bg-purple-50 border-purple-200"
    },
    {
      id: 3,
      title: "🌐 Environment Systems",
      subtitle: "Cloud, DBs, Applications",
      description: "Production systems where actual user permissions are scanned",
      icon: Cloud,
      color: "bg-green-50 border-green-200"
    },
    {
      id: 4,
      title: "🛡️ Compliance System",
      subtitle: "Governance Framework",
      description: "System that enforces security policies and compliance rules",
      icon: Shield,
      color: "bg-orange-50 border-orange-200"
    },
    {
      id: 5,
      title: "📢 Notification Service",
      subtitle: "Alert System",
      description: "Service that sends real-time alerts to stakeholders",
      icon: Bell,
      color: "bg-red-50 border-red-200"
    },
    {
      id: 6,
      title: "📊 Reporting Module",
      subtitle: "Analytics & Reports",
      description: "Generates comprehensive compliance and audit reports",
      icon: FileText,
      color: "bg-indigo-50 border-indigo-200"
    }
  ];

  const flowBlocks = [
    {
      id: 1,
      phase: "🔍 Scan Phase",
      title: "Scan Users & Permissions",
      description: "Automation Bot scans all environment systems for actual user privileges",
      status: "normal",
      tags: ["#AccessReview", "#UserScan"],
      icon: Eye,
      color: "border-green-300 bg-green-50"
    },
    {
      id: 2,
      phase: "📘 Validation Phase", 
      title: "Compare with Access Control DB",
      description: "Bot fetches expected permissions and performs comparison analysis",
      status: "normal",
      tags: ["#SecurityCompliance", "#DataValidation"],
      icon: Database,
      color: "border-blue-300 bg-blue-50"
    },
    {
      id: 3,
      phase: "⚠️ Response Phase",
      title: "Mismatch? ➝ Freeze Access + Send Alert",
      description: "Decision point: If mismatch detected, freeze access and trigger alerts",
      status: "warning",
      tags: ["#AutoFreeze", "#AlertSent"],
      icon: AlertTriangle,
      color: "border-orange-300 bg-orange-50"
    },
    {
      id: 4,
      phase: "📄 Reporting Phase",
      title: "Generate Report",
      description: "Create comprehensive compliance report with all scan results",
      status: "normal",
      tags: ["#ReportGenerated", "#ComplianceReport"],
      icon: FileText,
      color: "border-purple-300 bg-purple-50"
    },
    {
      id: 5,
      phase: "📄 Reporting Phase",
      title: "Send Report to Compliance",
      description: "Deliver final audit report to compliance team for review",
      status: "success",
      tags: ["#AuditComplete", "#ComplianceDelivery"],
      icon: CheckCircle,
      color: "border-green-300 bg-green-50"
    }
  ];

  const personas = [
    {
      role: "🧑‍💻 Admin / Project Owner",
      description: "Receives alerts and manages access control responses",
      icon: Users,
      color: "text-blue-600"
    },
    {
      role: "🕵️ Compliance Officer",
      description: "Reviews reports and ensures regulatory compliance",
      icon: Shield,
      color: "text-purple-600"
    },
    {
      role: "🤖 Automation System",
      description: "Executes the UAR process without human intervention",
      icon: Bot,
      color: "text-green-600"
    }
  ];

  const getArrowColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-500';
      case 'warning': return 'text-orange-500';
      case 'error': return 'text-red-500';
      default: return 'text-blue-500';
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center gap-2">
        <Bot className="h-6 w-6 text-primary" />
        <h1 className="text-3xl font-bold tracking-tight">📦 Automated User Access Review (UAR) Process</h1>
      </div>

      {/* Key Components Section */}
      <Card>
        <CardHeader className="bg-gradient-to-r from-grey-50 to-purple-50 border-b">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Zap className="h-5 w-5" />
            1. Key Components (Nodes) - Systems & Services
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Core systems and services that power the automated UAR process
          </p>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {keyComponents.map((component) => (
              <Card key={component.id} className={`${component.color} hover:shadow-md transition-shadow`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <component.icon className="h-6 w-6" />
                    <div>
                      <h3 className="font-semibold text-sm">{component.title}</h3>
                      <p className="text-xs text-muted-foreground">{component.subtitle}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-xs text-muted-foreground">{component.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Flow Blocks Section */}
      <Card>
        <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50 border-b">
          <CardTitle className="flex items-center gap-2 text-lg">
            <ArrowRight className="h-5 w-5" />
            2. UAR Automation Flow - Process Blocks
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Sequential steps and conditional branches with visual flow indicators
          </p>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-6">
            {flowBlocks.map((block, index) => (
              <div key={block.id} className="relative">
                <Card className={`border-2 ${block.color} hover:shadow-md transition-shadow`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <block.icon className="h-5 w-5" />
                        <div>
                          <Badge variant="outline" className="text-xs mb-1">
                            {block.phase}
                          </Badge>
                          <h3 className="font-semibold text-base">{block.title}</h3>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        {block.tags.map((tag, tagIndex) => (
                          <Badge key={tagIndex} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground">{block.description}</p>
                  </CardContent>
                </Card>
                
                {index < flowBlocks.length - 1 && (
                  <div className="flex justify-center my-4">
                    <ArrowDown className={`h-6 w-6 ${getArrowColor(flowBlocks[index + 1].status)}`} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Personas Section */}
      <Card>
        <CardHeader className="bg-gradient-to-r from-orange-50 to-pink-50 border-b">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Users className="h-5 w-5" />
            3. Personas & Roles
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Key stakeholders involved in the UAR process
          </p>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid gap-4 md:grid-cols-3">
            {personas.map((persona, index) => (
              <div key={index} className="flex items-center gap-3 p-4 bg-white border rounded-lg hover:shadow-sm transition-shadow">
                <persona.icon className={`h-6 w-6 ${persona.color}`} />
                <div>
                  <p className="font-medium text-sm">{persona.role}</p>
                  <p className="text-xs text-muted-foreground">{persona.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Flow Legend */}
      <Card>
        <CardHeader className="bg-gray-50 border-b">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Lock className="h-5 w-5" />
            4. Flow Connectors & Legend
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
              <ArrowRight className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-medium text-sm text-green-800">✅ Normal Flow</p>
                <p className="text-xs text-green-600">Sequential process steps</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
              <ArrowRight className="h-5 w-5 text-orange-600" />
              <div>
                <p className="font-medium text-sm text-orange-800">⚠️ Warning Flow</p>
                <p className="text-xs text-orange-600">Mismatch detection path</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <ArrowRight className="h-5 w-5 text-blue-600" />
              <div>
                <p className="font-medium text-sm text-blue-800">🔁 Data Flow</p>
                <p className="text-xs text-blue-600">System handoffs</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AutomatedUAR;
