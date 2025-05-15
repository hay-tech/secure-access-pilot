
import { toast as sonnerToast } from "sonner";
import { useToast as useToastOriginal } from "@/hooks/use-toast";

// Create a wrapper for sonner toast that matches the shadcn toast API
export const toast = (options: { description?: string; variant?: "default" | "destructive" }) => {
  if (options.variant === "destructive") {
    return sonnerToast.error(options.description);
  }
  return sonnerToast(options.description);
};

// Export the original useToast hook
export { useToastOriginal as useToast };
