
import { toast } from "sonner";
import { useToast as useToastOriginal } from "@/hooks/use-toast";

export { toast };
export const useToast = useToastOriginal;
