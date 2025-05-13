
import React from 'react';
import { Info } from 'lucide-react';

interface ApprovalChainPreviewProps {
  approvalChain: any[];
}

export const ApprovalChainPreview: React.FC<ApprovalChainPreviewProps> = ({ approvalChain }) => {
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
        Based on your selected resources, compliance framework, and resource hierarchy level, this is the approval chain your request will follow.
      </p>
      <div className="bg-gray-50 p-4 rounded-md">
        {approvalChain.length > 0 ? (
          <ol className="relative border-l border-gray-300">
            {approvalChain.map((approver, index) => (
              <li key={approver.id} className="mb-6 ml-6 last:mb-0">
                <div className="absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full bg-iam-primary text-white">
                  {index + 1}
                </div>
                <div className="flex flex-col">
                  <h4 className="flex items-center font-medium">{approver.name}</h4>
                  <p className="text-sm text-gray-500">{approver.title}</p>
                  <p className="text-xs text-gray-500 italic">{approver.reason}</p>
                </div>
              </li>
            ))}
          </ol>
        ) : (
          <p className="text-center text-gray-500 py-2">No approvals needed</p>
        )}
      </div>
      
      {/* Special note for sovereign environments */}
      {approvalChain.some(approver => approver.type === 'sovereign-ops') && (
        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-md text-blue-800 flex items-center">
          <Info className="h-5 w-5 mr-2" />
          <span>This request will be routed to the Sovereign Operations team for special handling according to compliance requirements.</span>
        </div>
      )}
    </div>
  );
};
