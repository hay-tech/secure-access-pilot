
import React from 'react';
import { Info } from 'lucide-react';

interface ApprovalChainPreviewProps {
  approvalChain: any[];
  securityClassification?: string;
}

export const ApprovalChainPreview: React.FC<ApprovalChainPreviewProps> = ({ 
  approvalChain, 
  securityClassification 
}) => {
  // Get approval chain based on security classification if provided
  const getSecurityClassificationApprovalChain = () => {
    if (!securityClassification) {
      return approvalChain;
    }
    
    // Base approval chain always includes an Engineering Manager
    const baseApprovalChain = [
      { 
        id: 'manager-1', 
        name: 'Engineering Manager', 
        title: 'Your Manager', 
        type: 'manager',
        reason: 'Required for all access requests'
      }
    ];
    
    // Add appropriate approval board based on security classification
    switch (securityClassification) {
      case 'fedramp-high':
      case 'cccs':
        return [
          ...baseApprovalChain,
          {
            id: 'sovereign-board',
            name: 'Sovereign Approval Board',
            title: 'FedRAMP/CCCS Access Review',
            type: 'sovereign-ops',
            reason: 'Required for sovereign environment access',
            link: 'https://dev.azure.com/msi-cie/CIE%20Partners/_wiki/wikis/CIE-Partners.wiki/10168/Requesting-Access-to-Sovereign-Environments-(CCCS-FedRAMP)'
          }
        ];
      case 'cjis':
        return [
          {
            id: 'manager-1',
            name: 'Engineering Manager',
            title: 'Your Manager',
            type: 'manager',
            reason: 'Required for all access requests'
          },
          {
            id: 'resource-owner',
            name: 'Resource Owner Group',
            title: 'Resource Owner Group',
            type: 'resource-owner',
            reason: 'Resource owner approval required for CJIS environment'
          },
          {
            id: 'cjis-screening',
            name: 'Data Privacy CJIS Screening Team',
            title: 'Data Privacy CJIS Screening Team',
            type: 'cjis-screening',
            reason: 'CJIS screening and compliance approval required'
          }
        ];
      case 'nist-800-53-moderate':
        return [
          {
            id: 'manager-1',
            name: 'Engineering Manager',
            title: 'Requestor\'s Manager',
            type: 'manager',
            reason: 'Required for all access requests'
          },
          {
            id: 'nist-resource-owner',
            name: 'NIST Resource Owner',
            title: 'Resource Owner',
            type: 'resource-owner',
            reason: 'Resource owner approval required for NIST environment'
          }
        ];
      default:
        return approvalChain;
    }
  };
  
  const displayApprovalChain = securityClassification 
    ? getSecurityClassificationApprovalChain() 
    : approvalChain;

  return (
    <div>
      <h3 className="text-sm font-medium mb-2 flex items-center">
        Approval Chain Preview
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="h-4 w-4 ml-1 text-gray-400">
          <circle cx="12" cy="12" r="10" />
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
          <path d="M12 17h.01" />
        </svg>
      </h3>
      <p className="text-sm text-gray-500 mb-3">
        Based on your selected resources, security classification, and resource hierarchy level, this is the approval chain your request will follow.
      </p>
      <div className="bg-gray-50 p-4 rounded-md">
        {displayApprovalChain.length > 0 ? (
          <ol className="relative border-l border-gray-300">
            {displayApprovalChain.map((approver, index) => (
              <li key={approver.id} className="mb-6 ml-6 last:mb-0">
                <div className="absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full bg-iam-primary text-white">
                  {index + 1}
                </div>
                <div className="flex flex-col">
                  <h4 className="flex items-center font-medium">{approver.name}</h4>
                  <p className="text-sm text-gray-500">{approver.title}</p>
                  <p className="text-xs text-gray-500 italic">{approver.reason}</p>
                  {approver.link && (
                    <a 
                      href={approver.link} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="text-xs text-blue-600 hover:underline mt-1"
                    >
                      View approval process
                    </a>
                  )}
                </div>
              </li>
            ))}
          </ol>
        ) : (
          <p className="text-center text-gray-500 py-2">No approvals needed</p>
        )}
      </div>
      
      {/* Special notes based on security classification */}
      {securityClassification === 'fedramp-high' && (
        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-md text-blue-800 flex items-center">
          <Info className="h-5 w-5 mr-2" />
          <span>This request requires sovereign environment approvals including US citizenship verification.</span>
        </div>
      )}
      
      {securityClassification === 'cccs' && (
        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-md text-blue-800 flex items-center">
          <Info className="h-5 w-5 mr-2" />
          <span>This request requires sovereign environment approvals including Five Eyes citizenship verification.</span>
        </div>
      )}
      
      {securityClassification === 'cjis' && (
        <div className="mt-3 p-3 bg-purple-50 border border-purple-200 rounded-md text-purple-800 flex items-center">
          <Info className="h-5 w-5 mr-2" />
          <span>CJIS access requires Manager, Resource Owner Group, and Data Privacy CJIS Screening Team approvals before access is granted.</span>
        </div>
      )}
      
      {securityClassification === 'nist-800-53-moderate' && (
        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-md text-blue-800 flex items-center">
          <Info className="h-5 w-5 mr-2" />
          <span>NIST access requires Manager and Resource Owner approvals before access is granted.</span>
        </div>
      )}
      
      {displayApprovalChain.some(approver => approver.type === 'sovereign-ops') && (
        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-md text-blue-800 flex items-center">
          <Info className="h-5 w-5 mr-2" />
          <span>This request will be routed to the Sovereign Operations team for special handling according to compliance requirements.</span>
        </div>
      )}
    </div>
  );
};
