
import { UseFormReturn } from 'react-hook-form';
import { AccessRequestFormValues } from '../schemas/accessRequestSchema';

export const useFormStepNavigation = (
  form: UseFormReturn<AccessRequestFormValues>,
  formStep: number,
  setFormStep: (step: number) => void,
  isFormValid: boolean
) => {
  const nextStep = () => {
    form.trigger(['jobFunction', 'resources']);
    if (isFormValid) {
      setFormStep(2);
    }
  };
  
  const prevStep = () => {
    setFormStep(1);
  };

  return { nextStep, prevStep };
};
