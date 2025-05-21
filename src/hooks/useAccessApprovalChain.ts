
import { useEffect } from 'react';
import { getApprovalChain, calculateRiskScore } from '../utils/accessRequestUtils';

export const useAccessApprovalChain = (
  watchedResources: string[],
  watchedJobFunction: string,
  setApprovalChain: (chain: any[]) => void,
  setRiskScore: (score: { score: number; level: string }) => void
) => {
  // Update approval chain when resources or job function changes
  useEffect(() => {
    if (watchedResources.length > 0) {
      setApprovalChain(getApprovalChain(watchedResources, watchedJobFunction));
      setRiskScore(calculateRiskScore(watchedResources));
    } else {
      setApprovalChain([]);
      setRiskScore({ score: 0, level: 'Low' });
    }
  }, [watchedResources, watchedJobFunction, setApprovalChain, setRiskScore]);
};
