
export interface RegulatoryEnvironment {
  id: string;
  name: string;
  description: string;
  complianceFrameworks: string[];
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
}
