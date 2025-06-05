
import { useAuth } from '../contexts/AuthContext';
import { useIAM } from '../contexts/IAMContext';
import { AccessRequestFormValues } from '../schemas/accessRequestSchema';
import { prepareRequestData } from '../utils/requestDataUtils';

export const useAccessRequestSubmission = (
  onSuccess: () => void,
  selectedClusters: string[]
) => {
  const { currentUser } = useAuth();
  const { createAccessRequest } = useIAM();

  const submitRequest = async (data: AccessRequestFormValues) => {
    if (!currentUser) return;
    
    try {
      const requestData = prepareRequestData(data, currentUser.id, selectedClusters);
      await createAccessRequest(requestData);
      onSuccess();
    } catch (error) {
      console.error("Failed to submit access request:", error);
    }
  };

  return { submitRequest };
};
